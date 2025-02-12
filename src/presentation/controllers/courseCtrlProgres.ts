import { Request, Response } from "express";
import { CourseProgress } from "../../application/usecases/CourseProgres";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

export const updateCourseProgress = async (req: Request, res: Response) => {
  const { userId, chapterId, courseId } = req.body;

  try {
    const courseData = { userId, chapterId, courseId };
    const userRepo = new UserRepository();
    const courseUsecase = new CourseProgress(userRepo);

    const result = await courseUsecase.execute(courseData);

    return sendResponseJson(res, HttpStatus.OK, result.message, true);
  } catch (error: any) {
    console.error(error);
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update course progress",
      false
    );
  }
};
