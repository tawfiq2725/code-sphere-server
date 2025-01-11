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
