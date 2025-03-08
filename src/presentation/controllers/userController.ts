import { Request, Response } from "express";
import { Person } from "../../domain/entities/User";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import {
  getProfileUsecase,
  getTutorUsecasae,
  GoogleAuth,
  LoginUser,
  setRole,
} from "../../application/usecases/loginUser";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import UserS from "../../infrastructure/database/userSchema";
import bcrypt from "bcryptjs";
import { IUsedBy } from "../../infrastructure/database/CouponSchema";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { GenerateOtp } from "../../application/usecases/generateOtp";
import { sendOtpEmail } from "../../application/services/OtpService";
import { FileUploadService } from "../../application/services/filesUpload";
import { CouponRepository } from "../../infrastructure/repositories/CouponRepository";
import { AwsConfig } from "../../config/awsConfig";
import { getUrl } from "../../utils/getUrl";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Password Does not match",
        false
      );
    }
    const user = new Person(name, email, password, role);

    const messageRole = (Whichrole: string | undefined): string => {
      if (Whichrole === "student") {
        return "Student created successfully and verify your account";
      } else if (Whichrole === "tutor") {
        return "Tutor created successfully and verify your account";
      } else {
        return "User Created Successfully..";
      }
    };
    await user.hashPassword();
    const userRepository = new UserRepository();
    const createUserUseCase = new CreateUser(userRepository);
    await createUserUseCase.execute(user);
    sendResponseJson(res, HttpStatus.CREATED, messageRole(role), true);
  } catch (error: any) {
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(email, password, "check");

    const userRepository = new UserRepository();
    const loginUserUseCase = new LoginUser(userRepository);

    const { user, accessToken, refreshToken } = await loginUserUseCase.execute(
      email,
      password
    );
    console.log(accessToken, "starting time accesstoken");

    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/refresh",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    sendResponseJson(res, HttpStatus.OK, "Login successful", true, {
      jwt_token: accessToken,
      role: user.role,
      user,
    });
  } catch (error: any) {
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.query.email as string;
    console.log(email, "checking");
    const userRepository = new UserRepository();
    const aws = new FileUploadService();
    const getProfileUsecas = new getProfileUsecase(userRepository, aws);
    const user = await getProfileUsecas.execute(email);

    sendResponseJson(
      res,
      HttpStatus.OK,
      "User data fetches successfully",
      true,
      user
    );
  } catch (error: any) {
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};
export const generateOtpHandlerF = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("generate otp handler called");

  const otpRepository = new OtpRepositoryImpl();
  const generateOtpUseCase = new GenerateOtp(otpRepository);

  try {
    const { email } = req.body;
    const user = await UserS.findOne({ email });
    if (!user) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "No user found with this email address",
        false
      );
      return;
    }
    if (!email) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Email address is required",
        false
      );
      return;
    }

    const otp = await generateOtpUseCase.execute(email);
    await sendOtpEmail(email, otp);
    sendResponseJson(res, HttpStatus.OK, "OTP generated successfully.", true);
  } catch (error: any) {
    console.error("Error generating OTP", error);
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};
export const newPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, confirm } = req.body;

    if (password !== confirm) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Password Does not match",
        false
      );
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findByEmail(email);
    console.log(user);

    if (user) {
      user.password = password;
      await user.hashPassword();
      if (user._id) {
        await userRepository.update(user._id, user);
      } else {
        throw new Error("User ID is undefined");
      }
    } else {
      throw new Error("User not found");
    }

    sendResponseJson(res, HttpStatus.OK, "Password updated successfully", true);
  } catch (error: any) {
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("authToken");
  res.setHeader("Authorization", "");
  console.log("Logout successful all the datas are cleared");
  sendResponseJson(res, HttpStatus.OK, "Logout successful", true);
};

export const googleAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    const { idToken } = req.body;
    console.log("Received ID Token:", idToken);
    const userRepo = new UserRepository();
    const googleAuthUsecase = new GoogleAuth(userRepo);
    const { user, isNewUser, accessToken, refreshToken } =
      await googleAuthUsecase.execute(idToken);
    if (!isNewUser) {
      console.log("User:", user);
      res.setHeader("Authorization", `Bearer ${accessToken}`);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/refresh",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
      return sendResponseJson(
        res,
        HttpStatus.OK,
        "User created successfully",
        true,
        {
          isNewUser,
          userId: user._id,
          email: user.email,
          role: user.role,
          jwt_token: accessToken,
          user,
        }
      );
    } else {
      return sendResponseJson(
        res,
        HttpStatus.OK,
        "User created successfully. Proceeding to role selection.",
        true,
        {
          isNewUser,
          userId: user._id,
          email: user.email,
        }
      );
    }
  } catch (error: any) {
    console.error(error);
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const roleSelection = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { role, userId } = req.body;
  if (!role || !userId) {
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Role and User ID are required",
      false
    );
  }

  try {
    const userRepository = new UserRepository();
    const setRoleuseCase = new setRole(userRepository);
    const { user, accessToken, refreshToken } = await setRoleuseCase.execute(
      userId,
      role
    );
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/refresh",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    return sendResponseJson(res, HttpStatus.OK, "Role set successfully", true, {
      jwt_token: accessToken,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while setting the role",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("find user by id called");
  try {
    const { id } = req.params;
    console.log(id);
    const repositories = new UserRepository();
    const user = await repositories.findById(id);
    if (user?.profile) {
      user.profile = await getUrl(user.profile);
    }
    console.log(user);
    console.log("user found");
    if (!user) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "User not found",
        false
      );
    }
    console.log(user);
    return sendResponseJson(res, HttpStatus.OK, "User found", true, user);
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { oldPassword, newPassword, userId } = req.body;
    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);
    if (!user) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "User not found",
        false
      );
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Old password does not match",
        false
      );
    }
    user.password = newPassword;
    await user.hashPassword();
    await userRepository.update(userId, user);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Password changed successfully",
      true
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const updateUserProfileImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const uploadservice = new FileUploadService();
    const { userId } = req.body;
    const profileImage = req.file;
    const userRepository = new UserRepository();
    console.log("working...1");
    const user = await userRepository.findById(userId);
    console.log("working...2");
    if (!user) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "User not found",
        false
      );
    }
    console.log("working...3");
    if (!profileImage) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Profile image is required",
        false
      );
    }
    console.log("working...4");
    const imageKey = await uploadservice.uploadUserProfileImage(
      userId,
      profileImage
    );
    console.log("working...5");
    user.profile = imageKey;
    await userRepository.update(userId, user);

    if (user.profile) {
      user.profile = await getUrl(user.profile);
    }

    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Profile image updated successfully",
      true,
      user
    );
  } catch (e: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      e.message,
      false
    );
  }
};

export const verifyCoupon = async (req: Request, res: Response) => {
  try {
    const { couponCode, userId } = req.body;
    console.log(couponCode, userId);
    const couponRepo = new CouponRepository();
    console.log("starting----------------1");
    let coupon = await couponRepo.findCouponByCouponCode(couponCode);
    console.log("starting----------------2");

    if (!coupon) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Coupon not found",
        false
      );
    }
    console.log("starting----------------3");

    const alreadyUsed = coupon?.usedBy?.find(
      (usage) => usage.userId === userId
    );
    console.log("starting----------------4");

    if (alreadyUsed) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Coupon already used",
        false
      );
    }
    console.log("starting----------------5");

    const usageData: IUsedBy = { count: 1, userId };
    console.log("starting----------------6");
    if (coupon && coupon._id) {
      coupon = await couponRepo.applyCouponUsage(coupon._id, usageData);
    } else {
      throw new Error("Coupon ID is undefined");
    }
    console.log("starting----------------7");

    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Coupon applied successfully",
      true,
      coupon
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepo = new UserRepository();
    const tutorUsecase = new getTutorUsecasae(userRepo);
    const tutors = await tutorUsecase.execute(id);

    return sendResponseJson(res, HttpStatus.OK, "Tutors fetched", true, tutors);
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
