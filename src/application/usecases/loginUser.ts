import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";

import { admin } from "../../firebase";

import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../../utils/tokenUtility";
import { AwsConfig } from "../../config/awsConfig";
import { FileUploadService } from "../services/filesUpload";
import { Course } from "../../domain/entities/Course";
import { getUrl } from "../../utils/getUrl";

export class LoginUser {
  constructor(private userRepository: UserInterface) {}

  public async execute(
    email: string,
    password: string
  ): Promise<{ user: Person; accessToken: string; refreshToken: string }> {
    console.log("email", email);
    console.log("password", password);
    const user = await this.userRepository.findByEmail(email);
    console.log("user", user);
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
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("user profile ", user.profile);
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

      const { user, isNewUser } = await this.userRepository.googleAuthLogin(
        userData
      );
      const payload: TokenPayload = {
        id: user._id || "",
        email: user.email,
        role: user.role,
      };
      if (!isNewUser) {
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        return { user, isNewUser, accessToken, refreshToken };
      } else {
        console.log("User created successfully. Proceeding to role selection.");
        return { user, isNewUser };
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
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

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
  constructor(private userRepository: UserInterface) {}

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
}
export class getmyCoursesUsecase {
  constructor(private userRepository: UserInterface) {}

  public async execute(id: string): Promise<Course[]> {
    const courses = await this.userRepository.myCourses(id);
    if (!courses) return [];
    for (let course of courses) {
      if (course.thumbnail) {
        const fileName = course.thumbnail.split("/").pop()!;
        const folder = course.thumbnail.substring(
          0,
          course.thumbnail.lastIndexOf("/") + 1
        );
        const aws = new FileUploadService();
        const presignedUrl = await aws.getPresignedUrl(fileName, folder);
        course.thumbnail = presignedUrl;
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
      console.log(fileName);
      console.log(folder);
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
    console.log("user profile", user.profile);
    return user;
  }
}
