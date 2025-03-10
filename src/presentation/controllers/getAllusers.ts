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
import { updateUsersWithNewCourse } from "../../application/services/enrollCourse";
import { getUrl } from "../../utils/getUrl";

export const getAllUsersList = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const getAllUsers = new GetAllUsers(userRepository);
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const users = await getAllUsers.execute({ page, limit, search, category });
    console.log(users.data);
    console.log("users pre", users);
    console.log("users final", users);
    for (let user of users.data) {
      if (user.profile) {
        user.profile = await getUrl(user.profile);
      }
    }
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
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const users = await getAllTutor.execute({ page, limit, search, category });
    for (let user of users.data) {
      if (user.profile) {
        user.profile = await getUrl(user.profile);
      }
    }
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
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const userRepository = new UserRepository();
    const getAllTutor = new GetAllTutorApplication(userRepository);

    const users = await getAllTutor.execute({ page, limit, search, category });
    for (let user of users.data) {
      if (user.profile) {
        user.profile = await getUrl(user.profile);
      }
    }
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
    if (updatedUser?.profile) {
      updatedUser.profile = await getUrl(updatedUser.profile);
    }
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

    const userEmail = user?.email;
    const updatedUser = await userRepository.update(tutorId, {
      isTutor: false,
      tutorStatus: "rejected",
    });
    console.log("checkingggg and email will send");
    await sendEmail(userEmail, false);
    if (updatedUser?.profile) {
      updatedUser.profile = await getUrl(updatedUser.profile);
    }
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
    const CourseRepository = new CourseRepositoryImpl();
    const courses = await CourseRepository.getAllCoursesAdmin();
    for (let course of courses) {
      course.thumbnail = await getUrl(course.thumbnail);
    }
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

export const toggleCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

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
      isVisible,
    };

    const course = await courseRepo.updateCourse(id, updatedCourse);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      `Course ${isVisible ? "listed" : "unlisted"} successfully`,
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

export const approveOrRejectCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { courseStatus, percentage } = req.body;

    const courseRepo = new CourseRepositoryImpl();
    const existingCourse = await courseRepo.findCourseByGenerateId(courseId);
    if (!existingCourse) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Course not found",
        false
      );
    }

    // Handle approved courses
    if (courseStatus === "approved") {
      // Validate percentage only for approved courses
      if (percentage < 0 || percentage > 100) {
        return sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid percentage",
          false
        );
      }
      // Calculate the selling price based on the provided percentage
      let sellingPrice = existingCourse.price / (1 - percentage / 100);
      let wholeSellingPrice = Math.round(sellingPrice / 10) * 10;

      const updatedCourse = {
        isVisible: true,
        courseStatus,
        sellingPrice: wholeSellingPrice,
      };

      const course = await courseRepo.updateCourse(courseId, updatedCourse);
      const check = await updateUsersWithNewCourse(existingCourse);
      console.log("check", check);
      return sendResponseJson(
        res,
        HttpStatus.OK,
        `Course ${courseStatus} successfully`,
        true,
        course
      );
    }
    // Handle rejected courses
    else if (courseStatus === "rejected") {
      const updatedCourse = {
        courseStatus, // You can add other fields if needed (e.g., isVisible: false)
      };
      const course = await courseRepo.updateCourse(courseId, updatedCourse);
      return sendResponseJson(
        res,
        HttpStatus.OK,
        `Course ${courseStatus} successfully`,
        true,
        course
      );
    }
    // Invalid courseStatus provided
    else {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid course status",
        false
      );
    }
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Server error",
      false
    );
  }
};
