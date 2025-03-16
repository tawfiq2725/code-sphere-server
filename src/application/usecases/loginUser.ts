import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";
import bcrypt from "bcryptjs";
import { admin } from "../../firebase";

import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../../utils/tokenUtility";
import { FileUploadService } from "../services/filesUpload";
import { Course } from "../../domain/entities/Course";
import { getUrl } from "../../utils/getUrl";
import { GenerateOtp } from "./generateOtp";
import { sendOtpEmail } from "../services/OtpService";
import { ReportInterface } from "../../domain/interface/Report";

export class LoginUser {
  constructor(private userRepository: UserInterface) {}

  public async execute(
    email: string,
    password: string
  ): Promise<{ user: Person; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isBlocked = user.isBlocked;
    if (isBlocked) {
      throw new Error("User is blocked");
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const payload: TokenPayload = {
      id: user._id || "",
      email: user.email,
      role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    if (user.profile) {
      const fileName = user.profile.split("/").pop()!;
      const folder = user.profile.substring(
        0,
        user.profile.lastIndexOf("/") + 1
      );
      const aws = new FileUploadService();
      const presignedUrl = await aws.getPresignedUrl(fileName, folder);
      user.profile = presignedUrl;
    }
    return { user, accessToken, refreshToken };
  }

  public async executeGetuser(id: string): Promise<Person> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class GoogleAuth {
  constructor(private userRepository: UserInterface) {}

  public async execute(idToken: string): Promise<{
    user: Person;
    isNewUser: boolean;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { email, name, uid, picture } = decodedToken;
      if (!email || !name || !uid) {
        throw new Error("Invalid Google Token");
      }

      let userData: {
        name: string;
        email: string | undefined;
        googleId: string;
        isVerified: boolean;
        profile?: string;
      } = {
        email,
        name,
        googleId: uid,
        isVerified: true,
      };
      if (picture) {
        userData.profile = picture;
      }

      const res = await this.userRepository.googleAuthLogin(userData);

      const payload: TokenPayload = {
        id: res.user._id || "",
        email: res.user.email,
        role: res.user.role,
      };
      if (!res.isNewUser) {
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        const profile = String(res.user.profile);
        if (profile.startsWith("user") || profile.startsWith("tutor")) {
          res.user.profile = await getUrl(profile);
        }
        return {
          user: res.user,
          isNewUser: res.isNewUser,
          accessToken,
          refreshToken,
        };
      } else {
        return { user: res.user, isNewUser: res.isNewUser };
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw new Error("Google Auth Error");
    }
  }
}

export class setRole {
  constructor(private userRepository: UserInterface) {}
  public async execute(
    userId: string,
    role: string
  ): Promise<{ user: Person; accessToken: string; refreshToken: string }> {
    const userData = await this.userRepository.setRole(userId, role);
    if (!userData) {
      throw new Error("User not found");
    }
    const payload: TokenPayload = {
      id: userData._id || "",
      email: userData.email,
      role: userData.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user: userData, accessToken, refreshToken };
  }
}

export class getTutorUsecasae {
  constructor(private userRepository: UserInterface) {}

  public async execute(id: string): Promise<Person[]> {
    const tutors = await this.userRepository.getTutors(id);
    for (let tutor of tutors) {
      if (tutor.profile) {
        const fileName = tutor.profile.split("/").pop()!;
        const folder = tutor.profile.substring(
          0,
          tutor.profile.lastIndexOf("/") + 1
        );
        const aws = new FileUploadService();
        const presignedUrl = await aws.getPresignedUrl(fileName, folder);
        tutor.profile = presignedUrl;
      }
    }
    return tutors;
  }
}

export class getStudentsUsecase {
  constructor(
    private userRepository: UserInterface,
    private reportRepo: ReportInterface
  ) {}

  public async execute(id: string): Promise<Person[]> {
    const students = await this.userRepository.getUsers(id);
    for (let student of students) {
      if (student.profile) {
        const fileName = student.profile.split("/").pop()!;
        const folder = student.profile.substring(
          0,
          student.profile.lastIndexOf("/") + 1
        );
        const aws = new FileUploadService();
        const presignedUrl = await aws.getPresignedUrl(fileName, folder);
        student.profile = presignedUrl;
      }
    }

    return students;
  }

  public async exeGetDashboard(id: string): Promise<any> {
    try {
      if (!id) {
        throw new Error("Id is Important");
      }
      return await this.reportRepo.getTutorDashboard(id);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
export class getmyCoursesUsecase {
  constructor(private userRepository: UserInterface) {}

  public async execute(id: string): Promise<Course[]> {
    const courses = await this.userRepository.myCourses(id);
    if (!courses) return [];
    for (let course of courses) {
      if (course.thumbnail) {
        course.thumbnail = await getUrl(course.thumbnail);
      }
    }

    return courses;
  }
}

export class getProfileUsecase {
  constructor(
    private userRepository: UserInterface,
    private awsgetFile: FileUploadService
  ) {}
  public async execute(email: string): Promise<Person> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.profile) {
      const fileName = user.profile.split("/").pop()!;
      const folder = user.profile.substring(
        0,
        user.profile.lastIndexOf("/") + 1
      );

      const presignedUrl = await this.awsgetFile.getPresignedUrl(
        fileName,
        folder
      );
      user.profile = presignedUrl;
    }

    if (user.certificates) {
      user.certificates = await Promise.all(
        user.certificates.map((certificate) => getUrl(certificate))
      );
    }
    return user;
  }
  public async exeUpdateProfile(
    userId: string,
    profileImage: Express.Multer.File
  ): Promise<Person> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const imageKey = await this.awsgetFile.uploadUserProfileImage(
        userId,
        profileImage
      );
      user.profile = imageKey;
      await this.userRepository.update(userId, user);

      if (user.profile) {
        user.profile = await getUrl(user.profile);
      }
      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class PasswordUsecase {
  constructor(
    private userRepository: UserInterface,
    private otpUse: GenerateOtp
  ) {}
  public async executeNewPassword(
    email: string,
    password: string,
    confirm: string
  ): Promise<Person> {
    if (password !== confirm) {
      throw new Error("Password Not Matched");
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User Not Found");
    }
    user.password = password;
    await user.hashPassword();
    if (user._id) await this.userRepository.update(user._id, user);
    return user;
  }
  public async executeOtp(email: string): Promise<void> {
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User Not Found");
    }
    let otp = await this.otpUse.execute(email);
    await sendOtpEmail(email, otp);
  }
  public async exechangePassword(
    oldPassword: string,
    newPassword: string,
    userId: string
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error("Old password does not match");
      }
      user.password = newPassword;
      await user.hashPassword();
      await this.userRepository.update(userId, user);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
