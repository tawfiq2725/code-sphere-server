import { Request, Response } from "express";
import { Person } from "../../domain/entities/User";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LoginUser } from "../../application/usecases/loginUser";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { GenerateOtp } from "../../application/usecases/generateOtp";
import { sendOtpEmail } from "../../application/services/OtpService";

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
import User from "../../infrastructure/database/userSchema"; // Adjust the import as per your structure
import { configJwt } from "../../config/ConfigSetup";

export const roleSelection = async (req: Request, res: Response) => {
  const { role, email } = req.body;

  if (!role || !email) {
    return res.status(400).json({
      success: false,
      message: "Role and email are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    // Create a new JWT token with the updated role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      configJwt.jwtSecret!,
      { expiresIn: "1h" }
    );

    sendResponseJson(res, HttpStatus.OK, "Role set successfully", true, {
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while setting the role",
    });
  }
};
