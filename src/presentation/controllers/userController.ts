import { Request, Response } from "express";
import { Person } from "../../domain/entities/User";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LoginUser } from "../../application/usecases/loginUser";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

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
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    console.log(token);
    sendResponseJson(res, HttpStatus.OK, "Login successful", true, {
      jwt_token: token,
      role: user.role,
    });
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.UNAUTHORIZED, error.message, false);
  }
};
