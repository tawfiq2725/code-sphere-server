import { Request, Response } from "express";
import { FileUploadService } from "../../application/services/filesUpload";
import { CourseRepositoryImpl } from "../../infrastructure/repositories/CourseRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import {
  DeleteCourse,
  ToggleCourseVisibility,
  CreateCourse,
} from "../../application/usecases/Course";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const CourseCreate = async (
  req: MulterRequest,
  res: Response
): Promise<any> => {
  console.log("entering the course create controller");
  try {
    const {
      courseName,
      categoryName,
      courseDescription,
      info,
      price,
      prerequisites,
      tutorId,
    } = req.body;
    const repository = new CourseRepositoryImpl();
    const existingCourse = await repository.findCourseByName(courseName);
    if (existingCourse) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Course with this name already exists",
        false
      );
    }
    if (!req.file) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Thumbnail file is required",
        false
      );
    }
    const thumbnail: Express.Multer.File = req.file;

    // inga courseId generate panndra
    function generateCourseId() {
      const prefix = "CS";
      const randomPart = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit random number
      return `${prefix}${randomPart}`;
    }

    const courseId = generateCourseId();

    // inga thumbnail file ah string convert panndra
    const thumbnailUrl =
      (await new FileUploadService().uploadCourseThumbnail(
        courseId,
        thumbnail
      )) || "";

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid price value. It must be a number.",
        false
      );
    }
    const courseData = {
      courseId,
      courseName,
      courseDescription,
      info,
      price: numericPrice,
      prerequisites,
      thumbnail: thumbnailUrl,
      isVisible: true,
      tutorId,
      courseStatus: "pending" as "pending",
      categoryName,
    };
    console.log("course data seted", courseData);
    // inga courseData ah repository ku send panndra
    const CourseRepository = new CourseRepositoryImpl();
    const newCourse = new CreateCourse(CourseRepository);

    await newCourse.execute(courseData);
    return sendResponseJson(
      res,
      HttpStatus.CREATED,
      "Course created successfully",
      true
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

export const GetallCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const CourseRepository = new CourseRepositoryImpl();
    const courses = await CourseRepository.getAllCoursesId(id);
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

export const GetallCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const CourseRepository = new CourseRepositoryImpl();
    const courses = await CourseRepository.getAllCourses();
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

export const GetcourseByGenerateId = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const repository = new CourseRepositoryImpl();
    const course = await repository.findCourseByGenerateId(courseId);
    if (!course) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Course not found",
        false
      );
    }
    return sendResponseJson(res, HttpStatus.OK, "Course fetched", true, course);
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Server error",
      false
    );
  }
};

export const EditCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params;

    const updates = req.body;
    const file = req.file;

    if (file) {
      const thumbnailUrl = await new FileUploadService().uploadCourseThumbnail(
        courseId,
        file
      );
      updates.thumbnail = thumbnailUrl;
    }

    const repository = new CourseRepositoryImpl();

    const existingCourse = await repository.findCourseByGenerateId(courseId);

    if (!existingCourse) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Course not found",
        false
      );
    }

    if (updates.price && isNaN(parseFloat(updates.price))) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid price value. It must be a number.",
        false
      );
    }

    const updated = await repository.updateCourse(courseId, updates);

    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Course updated successfully",
      true,
      updated
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Inga thaa problem",
      false
    );
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { courseId } = req.params;
    const repository = new CourseRepositoryImpl();

    const deleteCourseUseCase = new DeleteCourse(repository);
    await deleteCourseUseCase.execute(courseId);

    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Course deleted successfully",
      true
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

// intha controller admin kaaga irukku

export const toggleVisiblity = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const repository = new CourseRepositoryImpl();

    const toggleVisibilityUseCase = new ToggleCourseVisibility(repository);
    const updatedCourse = await toggleVisibilityUseCase.execute(id);

    const message = updatedCourse.isVisible
      ? "Course is now listed"
      : "Course is now unlisted";

    return sendResponseJson(res, HttpStatus.OK, message, true, updatedCourse);
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Server error",
      false
    );
  }
};
