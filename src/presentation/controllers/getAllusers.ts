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
import { CourseRepositoryImpl } from "../../infrastructure/repositories/CourseRepository";

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
    console.log("Approving tutor and sending email", userEmail);

    const updatedUser = await userRepository.update(tutorId, {
      isTutor: true,
      tutorStatus: "approved",
    });

    console.log("Tutor approved in DB, now sending email...");

    // Send email with correct isTutor value
    await sendEmail(userEmail, true);

    console.log("Approval email sent successfully");

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
    await sendEmail(userEmail, false);
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

export const GetallCoursesAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("entering the get all courses admin controller");
    const CourseRepository = new CourseRepositoryImpl();
    console.log("course repository created");
    const courses = await CourseRepository.getAllCoursesAdmin();
    console.log("courses fetched", courses);
    console.log("sending response");
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Courses fetched",
      true,
      courses
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Server error",
      false
    );
  }
};

export const ListCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const courseRepo = new CourseRepositoryImpl();
    const existingCourse = await courseRepo.findCourseByGenerateId(id);

    if (!existingCourse) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Course not found",
        false
      );
    }

    const updatedCourse = {
      isVisible: true,
      courseStatus: "approved" as "approved",
    };

    const course = await courseRepo.updateCourse(id, updatedCourse);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Course listed successfully",
      true,
      course
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Server error",
      false
    );
  }
};
export const UnlistCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const courseRepo = new CourseRepositoryImpl();
    const existingCourse = await courseRepo.findCourseByGenerateId(id);

    if (!existingCourse) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Course not found",
        false
      );
    }

    const updatedCourse = {
      isVisible: false,
      courseStatus: "rejected" as "rejected",
    };

    const course = await courseRepo.updateCourse(id, updatedCourse);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Course listed successfully",
      true,
      course
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Server error",
      false
    );
  }
};
