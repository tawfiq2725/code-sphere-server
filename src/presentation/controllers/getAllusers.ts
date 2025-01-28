import { Request, Response } from "express";
import {
  GetAllTutor,
  GetAllTutorApplication,
  GetAllUsers,
} from "../../application/usecases/userLists";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { sendEmail } from "../../application/services/applicationStatus";

export const getAllUsersList = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const getAllUsers = new GetAllUsers(userRepository);

    const users = await getAllUsers.execute();
    sendResponseJson(
      res,
      HttpStatus.OK,
      "All users fetched successfully",
      true,
      users
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getAllTutorList = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const getAllTutor = new GetAllTutor(userRepository);

    const users = await getAllTutor.execute();
    sendResponseJson(
      res,
      HttpStatus.OK,
      "All Tutors fetched successfully",
      true,
      users
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
export const getAllTutorListApplication = async (
  req: Request,
  res: Response
) => {
  try {
    const userRepository = new UserRepository();
    const getAllTutor = new GetAllTutorApplication(userRepository);

    const users = await getAllTutor.execute();
    sendResponseJson(
      res,
      HttpStatus.OK,
      "All Tutors fetched successfully",
      true,
      users
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const BlockUser = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const user = await userRepository.BlockUser(req.params.id);
    sendResponseJson(
      res,
      HttpStatus.OK,
      "User Blocked Successfully",
      true,
      user
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const UnblockUser = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const user = await userRepository.UnblockUser(req.params.id);
    sendResponseJson(
      res,
      HttpStatus.OK,
      "User Unblocked Successfully",
      true,
      user
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const approveTutor = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const userRepository = new UserRepository();
    const user = await userRepository.findById(tutorId);
    if (!user) {
      throw new Error("Tutor not found");
    }
    if (user.isTutor) {
      throw new Error("Tutor is already approved");
    }
    const userEmail = user?.email;
    console.log("checkingggg and email will send", userEmail);
    const updatedUser = await userRepository.update(tutorId, {
      isTutor: true,
      tutorStatus: "approved",
    });
    console.log("checkingggg and email will send");
    await sendEmail(userEmail, user.isTutor);
    console.log("checkingggg and email sent");

    sendResponseJson(
      res,
      HttpStatus.OK,
      "Tutor Approved Successfully",
      true,
      updatedUser
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const disapproveTutor = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const userRepository = new UserRepository();
    const user = await userRepository.findById(tutorId);
    if (!user) {
      throw new Error("Tutor not found");
    }
    if (!user.isTutor) {
      throw new Error("Tutor is already disapproved");
    }
    const userEmail = user?.email;
    const updatedUser = await userRepository.update(tutorId, {
      isTutor: false,
      tutorStatus: "rejected",
    });
    console.log("checkingggg and email will send");
    await sendEmail(userEmail, user.isTutor);
    console.log("checkingggg and email sent");
    sendResponseJson(
      res,
      HttpStatus.OK,
      "Tutor Disapproved Successfully",
      true,
      updatedUser
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
