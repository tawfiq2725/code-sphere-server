import { Request, Response } from "express";
import { Person } from "../../domain/entities/User";
import { CreateUser } from "../../application/usecases/CreateUser";
import {
  getProfileUsecase,
  getTutorUsecasae,
  GoogleAuth,
  LoginUser,
  PasswordUsecase,
  RecentMessageStudents,
  setRole,
} from "../../application/usecases/loginUser";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { getUrl } from "../../utils/getUrl";
import { createCouponUsecase } from "../../application/usecases/Coupons";

export class UserController {
  constructor(
    private createUsecase: CreateUser,
    private loginUsecase: LoginUser,
    private profileUsecase: getProfileUsecase,
    private passwordUsecase: PasswordUsecase,
    private googleAuthUsecase: GoogleAuth,
    private setRoleUsecase: setRole,
    private couponUsecase: createCouponUsecase,
    private tutorUsecase: getTutorUsecasae,
    private message: RecentMessageStudents
  ) {}

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
      const user = new Person(name, email, password, role);
      await user.hashPassword();
      const response = this.createUsecase.execute(user);
      const messageRole = (Whichrole: string | undefined): string => {
        if (Whichrole === "student") {
          return "Student created successfully and verify your account";
        } else if (Whichrole === "tutor") {
          return "Tutor created successfully and verify your account";
        } else {
          return "User Created Successfully..";
        }
      };
      sendResponseJson(
        res,
        HttpStatus.CREATED,
        messageRole(role),
        true,
        response
      );
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }

  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await this.loginUsecase.execute(email, password);
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
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const email = req.query.email as string;
      const user = await this.profileUsecase.execute(email);
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
  }

  public async generateOtpHandlerF(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Email address is required",
          false
        );
        return;
      }
      await this.passwordUsecase.executeOtp(email);
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
  }

  public async newPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, confirm } = req.body;
      let user = await this.passwordUsecase.executeNewPassword(
        email,
        password,
        confirm
      );
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Password updated successfully",
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
  }
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      // Clear the authentication cookie
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendResponseJson(res, HttpStatus.OK, "Logout successful", true);
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }

  public async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      const { user, isNewUser, accessToken, refreshToken } =
        await this.googleAuthUsecase.execute(idToken);
      if (!isNewUser) {
        res.setHeader("Authorization", `Bearer ${accessToken}`);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/refresh",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          secure: process.env.NODE_ENV === "production",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });
        sendResponseJson(res, HttpStatus.OK, "Google login Successfull", true, {
          isNewUser,
          userId: user._id,
          email: user.email,
          role: user.role,
          jwt_token: accessToken,
          user,
        });
      } else {
        sendResponseJson(
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
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }
  public async roleSelection(req: Request, res: Response): Promise<void> {
    const { role, userId } = req.body;
    if (!role || !userId) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Role and User ID are required",
        false
      );
      return;
    }

    try {
      const { user, accessToken, refreshToken } =
        await this.setRoleUsecase.execute(userId, role);
      res.setHeader("Authorization", `Bearer ${accessToken}`);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/refresh",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });

      sendResponseJson(res, HttpStatus.OK, "Role set successfully", true, {
        jwt_token: accessToken,
        role: user.role,
        email: user.email,
        user,
        userId: user._id,
      });
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.loginUsecase.executeGetuser(id);
      if (user?.profile) {
        user.profile = await getUrl(user.profile);
      }
      sendResponseJson(res, HttpStatus.OK, "User found", true, user);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }
  public async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { oldPassword, newPassword, userId } = req.body;
      const user = await this.passwordUsecase.exechangePassword(
        oldPassword,
        newPassword,
        userId
      );
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Password changed successfully",
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
  }
  public async updateUserProfileImage(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.body;
      if (!req.file) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Profile Image required",
          false
        );
        return;
      }
      const profileImage: Express.Multer.File = req.file;
      const user = await this.profileUsecase.exeUpdateProfile(
        userId,
        profileImage
      );
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Profile image updated successfully",
        true,
        user
      );
    } catch (e: any) {
      sendResponseJson(res, HttpStatus.INTERNAL_SERVER_ERROR, e.message, false);
    }
  }
  public async verifyCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { couponCode, userId } = req.body;
      const coupon = await this.couponUsecase.exeVerify(couponCode, userId);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Coupon applied successfully",
        true,
        coupon
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getTutor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tutors = await this.tutorUsecase.execute(id);
      sendResponseJson(res, HttpStatus.OK, "Tutors fetched", true, tutors);
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getRecentChats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = await this.message.execute(id);
      sendResponseJson(res, HttpStatus.OK, "Recent Messages", true, message);
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }
  public async getRecentChatsTutor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const message = await this.message.executeTutor(id);
      sendResponseJson(res, HttpStatus.OK, "Recent Messages", true, message);
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }
}
