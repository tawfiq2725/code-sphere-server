import { Request, Response } from "express";
import { Person } from "../../domain/entities/User";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LoginUser } from "../../application/usecases/loginUser";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { admin } from "../../firebase";
import UserS from "../../infrastructure/database/userSchema";

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

    const userRepository = new UserRepository();
    const loginUserUseCase = new LoginUser(userRepository);

    const { user, token } = await loginUserUseCase.execute(email, password);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    res.setHeader("Authorization", `Bearer ${token}`);

    console.log(token);
    sendResponseJson(res, HttpStatus.OK, "Login successful", true, {
      jwt_token: token,
      role: user.role,
    });
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.UNAUTHORIZED, error.message, false);
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
    const user = await userRepository.findByEmail(email);
    console.log(user, "checkingggggggggggggggggggggggggg");
    if (!user) {
      sendResponseJson(res, HttpStatus.NOT_FOUND, "User not found", false);
      return;
    }
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

import jwt from "jsonwebtoken";
import User from "../../infrastructure/database/userSchema";
import { configJwt } from "../../config/ConfigSetup";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { GenerateOtp } from "../../application/usecases/generateOtp";
import { sendOtpEmail } from "../../application/services/OtpService";

export const googleAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    const { idToken } = req.body;
    console.log("Received ID Token:", idToken);

    // Verify ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded Token:", decodedToken);

    const { email, name, uid, picture } = decodedToken;

    // Check if the user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new user
    if (!user) {
      const userData: {
        name: string;
        email: string | undefined;
        googleId: string;
        isVerified: boolean;
        profile?: string;
      } = {
        name,
        email,
        googleId: uid,
        isVerified: true,
      };

      // Add profile picture if it exists
      if (picture) {
        userData.profile = picture;
      }

      user = new User(userData);
      await user.save();

      console.log("User created successfully. Proceeding to role selection.");

      // Respond with role selection for new user
      return sendResponseJson(
        res,
        HttpStatus.OK,
        "User created successfully",
        true,
        {
          message: "User registered. Please select a role.",
          newUser: true,
          userId: user._id,
          email: user.email,
        }
      );
    }

    // User exists; proceed with login
    const jwt_secret: any = process.env.JWT_SECRET;

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, jwt_secret, {
      expiresIn: "1d",
    });

    // Set cookies
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    });

    console.log("Cookies set successfully.");
    res.setHeader("Authorization", `Bearer ${token}`);
    console.log("------------------- email", user.email);
    // Respond with login success
    return sendResponseJson(res, HttpStatus.OK, "Login successful", true, {
      newUser: false,
      jwt_token: token,
      role: user.role,
      email: user.email,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Authentication failed" });
  }
};

export const roleSelection = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { role, userId } = req.body;
  if (!role || !userId) {
    return res.status(400).json({
      success: false,
      message: "Role and email are required",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      configJwt.jwtSecret!,
      { expiresIn: "1h" }
    );
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    console.log("cookies also set simultaneously");
    res.setHeader("Authorization", `Bearer ${token}`);

    sendResponseJson(res, HttpStatus.OK, "Role set successfully", true, {
      jwt_token: token,
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
