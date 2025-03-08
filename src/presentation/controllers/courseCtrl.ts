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
import { updateUsersWithNewCourse } from "../../application/services/enrollCourse";
import { getUrl } from "../../utils/getUrl";

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
      categoryName, // note: this is being used as categoryId
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

    // Generate a unique courseId
    function generateCourseId() {
      const prefix = "CS";
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      return `${prefix}${randomPart}`;
    }

    const courseId = generateCourseId();

    // Upload thumbnail and convert file to string
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
      isVisible: false,
      tutorId,
      courseStatus: "pending" as "pending",
      categoryName, // used as the categoryId
    };

    console.log("course data set", courseData);
    const CourseRepository = new CourseRepositoryImpl();
    const newCourseUseCase = new CreateCourse(CourseRepository);

    // Capture the newly created course from the use case
    const createdCourse = await newCourseUseCase.execute(courseData);

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

export const GetallCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const CourseRepository = new CourseRepositoryImpl();
    const courses = await CourseRepository.getAllCourses();
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
    if (course.thumbnail) {
      course.thumbnail = await getUrl(course.thumbnail);
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
    if (updated?.thumbnail) {
      updated.thumbnail = await getUrl(updated.thumbnail);
    }
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
