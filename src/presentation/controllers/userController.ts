import { Request, Response } from "express";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUser(userRepository);

export const createUser = async (req: Request, res: Response) => {
  try {
    const { student_name, email, password, confirmPassword, role } = req.body;
    if (password !== confirmPassword) {
      res.status(401).json({
        message: "Not match",
        success: true,
      });
    }
    const user = await createUserUseCase.execute({
      student_name,
      email,
      password,
      role,
      isVerified: false,
      isAdmin: false,
    });

    res
      .status(201)
      .json({ success: true, message: "User created successfully", user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ success: false, message: errorMessage });
  }
};
