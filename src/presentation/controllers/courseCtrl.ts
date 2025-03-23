import { Request, Response } from "express";
import { FileUploadService } from "../../application/services/filesUpload";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import {
  DeleteCourse,
  ToggleCourseVisibility,
  CreateCourse,
  addReviewOrder,
  GetReview,
} from "../../application/usecases/Course";
import { getUrl } from "../../utils/getUrl";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class CourseCtrl {
  constructor(
    private deleteCourse: DeleteCourse,
    private toggleCourse: ToggleCourseVisibility,
    private createCourse: CreateCourse,
    private fileUplaod: FileUploadService,
    private addorEditReview: addReviewOrder,
    private getReview: GetReview
  ) {}

  public async CourseCreate(req: MulterRequest, res: Response): Promise<void> {
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

      if (!req.file) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Thumbnail file is required",
          false
        );
        return;
      }
      const thumbnail: Express.Multer.File = req.file;
      function generateCourseId() {
        const prefix = "CS";
        const randomPart = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}${randomPart}`;
      }

      const courseId = generateCourseId();
      const thumbnailUrl =
        (await this.fileUplaod.uploadCourseThumbnail(courseId, thumbnail)) ||
        "";
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid price value. It must be a number.",
          false
        );
        return;
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
        categoryName,
      };
      console.log(courseData);
      const createdCourse = await this.createCourse.execute(courseData);

      sendResponseJson(
        res,
        HttpStatus.CREATED,
        "Course created successfully",
        true,
        createdCourse
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }
  public async GetallCourses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const courses = await this.createCourse.execGetAll(id);
      sendResponseJson(res, HttpStatus.OK, "Courses fetched", true, courses);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Server error",
        false
      );
    }
  }
  public async GetallCourse(req: Request, res: Response): Promise<any> {
    try {
      const courses = await this.createCourse.execGetC();
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
  }

  public async GetcourseByGenerateId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await this.createCourse.execGetById(courseId);
      if (!course) {
        sendResponseJson(res, HttpStatus.NOT_FOUND, "Course not found", false);
        return;
      }

      sendResponseJson(res, HttpStatus.OK, "Course fetched", true, course);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Server error",
        false
      );
    }
  }
  public async EditCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const updates = req.body;
      const file = req.file;
      const updated = await this.createCourse.execUpdate(
        updates,
        file ?? "",
        courseId
      );
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Course updated successfully",
        true,
        updated
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Inga thaa problem",
        false
      );
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      await this.deleteCourse.execute(courseId);

      sendResponseJson(res, HttpStatus.OK, "Course deleted successfully", true);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Server error",
        false
      );
    }
  }
  public async toggleVisiblity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedCourse = await this.toggleCourse.execute(id);
      const message = updatedCourse.isVisible
        ? "Course is now listed"
        : "Course is now unlisted";

      sendResponseJson(res, HttpStatus.OK, message, true, updatedCourse);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Server error",
        false
      );
    }
  }
  public async addOrderReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { rating, description, userId } = req.body;
    console.log(id, rating, description);
    try {
      const data = {
        rating,
        description,
        hasReview: true,
        courseId: id,
        userId,
      };
      console.log(data);
      const result = await this.addorEditReview.execute(data);
      if (!result) {
        return;
      }
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Review added successfully",
        true,
        result
      );
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }
  public async getReviewById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const review = await this.getReview.execute(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Review Fetches Perfectly",
        true,
        review
      );
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }
  public async getReviewByCourseId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const review = await this.getReview.executeDescription(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Review Fetches Perfectly",
        true,
        review
      );
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }
}
