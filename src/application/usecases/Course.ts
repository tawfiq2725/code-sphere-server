import { CourseInterface } from "../../domain/interface/Course";
import { Course } from "../../domain/entities/Course";
import { getUrl } from "../../utils/getUrl";
import { updateUsersWithNewCourse } from "../services/enrollCourse";
import { FileUploadService } from "../services/filesUpload";
import { IorderDes } from "../../infrastructure/database/orderSchema";
import { Review } from "../../domain/entities/Order";
import { OrderInterface } from "../../domain/interface/Order";

export class CreateCourse {
  constructor(
    private courseRepository: CourseInterface,
    private fileUpload: FileUploadService
  ) {}
  public async execute(course: Partial<Course>): Promise<Course> {
    try {
      if (!course.courseName) {
        throw new Error("Course name is needed");
      }
      const existingCourse = await this.courseRepository.findCourseByName(
        course.courseName
      );
      if (existingCourse) {
        throw new Error("Course Name Already Exists");
      }
      const newCourse = new Course(
        course?.courseId ?? "",
        course.courseName,
        course.courseDescription ?? "",
        course.info ?? "",
        course.price ?? 5000,
        course.prerequisites ?? "",
        course.thumbnail ?? "",
        course.isVisible ?? false,
        course.tutorId ?? "",
        course.courseStatus ?? "pending",
        course.categoryName ?? ""
      );
      return this.courseRepository.create(newCourse);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execGetAll(id: string): Promise<Course[]> {
    try {
      const res = await this.courseRepository.getAllCoursesId(id);
      for (let course of res) {
        course.thumbnail = await getUrl(course.thumbnail);
      }
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async execGetC(): Promise<Course[]> {
    try {
      const res = await this.courseRepository.getAllCourses();
      for (let course of res) {
        course.thumbnail = await getUrl(course.thumbnail);
      }
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async execGetById(id: string): Promise<Course> {
    try {
      const res = await this.courseRepository.findCourseByGenerateId(id);
      if (!res) {
        throw new Error("Course not found");
      }
      if (res.thumbnail) res.thumbnail = await getUrl(res.thumbnail);
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execUpdate(
    updates: Partial<Course>,
    file: Express.Multer.File | "",
    courseId: string
  ): Promise<Course> {
    try {
      if (file) {
        const thumbnailUrl = await this.fileUpload.uploadCourseThumbnail(
          courseId,
          file
        );
        updates.thumbnail = thumbnailUrl;
      }
      const existingCourse = await this.courseRepository.findCourseByGenerateId(
        courseId
      );

      if (!existingCourse) {
        throw new Error("Already exist");
      }

      if (updates.price && isNaN(parseFloat(String(updates.price)))) {
        throw new Error("Invalid price value. It must be a number.");
      }

      const updated = await this.courseRepository.updateCourse(
        courseId,
        updates
      );
      if (!updated) {
        throw new Error("Something went wrong");
      }
      if (updated?.thumbnail) {
        updated.thumbnail = await getUrl(updated.thumbnail);
      }
      return updated;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

// Delete Course
export class DeleteCourse {
  constructor(private courseRepository: CourseInterface) {}
  public async execute(courseId: string): Promise<void> {
    const course = await this.courseRepository.findCourseByGenerateId(courseId);

    if (!course) {
      throw new Error("Course not found");
    }
    await this.courseRepository.deleteCourse(courseId);
  }
}

// Toggle Course Visibility
export class ToggleCourseVisibility {
  constructor(private courseRepository: CourseInterface) {}
  public async execute(courseId: string): Promise<any> {
    const course = await this.courseRepository.findCourseById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }
    course.isVisible = !course.isVisible; // Toggle the visibility
    return this.courseRepository.updateCourse(courseId, course);
  }
}

export class GetAllCourse {
  constructor(private courseRepo: CourseInterface) {}
  public async execute(): Promise<Course[]> {
    try {
      let courses = await this.courseRepo.getAllCoursesAdmin();
      for (let course of courses) {
        course.thumbnail = await getUrl(course.thumbnail);
      }
      return courses;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async execToggleCourse(
    id: string,
    isVisible: boolean
  ): Promise<Course> {
    try {
      const existingCourse = await this.courseRepo.findCourseByGenerateId(id);
      if (!existingCourse) {
        throw new Error("course not found");
      }

      const updatedCourse = {
        isVisible,
      };

      const course = await this.courseRepo.updateCourse(id, updatedCourse);
      if (!course) {
        throw new Error("Something went wrong ");
      }
      return course;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execApproveOrReject(
    courseId: string,
    courseStatus: "pending" | "approved" | "rejected",
    percentage: number
  ): Promise<Course> {
    try {
      const existingCourse = await this.courseRepo.findCourseByGenerateId(
        courseId
      );
      if (!existingCourse) {
        throw new Error("Course Not Available");
      }

      if (courseStatus === "approved") {
        if (percentage < 0 || percentage > 100) {
          throw new Error("Invalid Percentage");
        }
        let sellingPrice = existingCourse.price / (1 - percentage / 100);
        let wholeSellingPrice = Math.round(sellingPrice / 10) * 10;

        const updatedCourse = {
          isVisible: true,
          courseStatus,
          sellingPrice: wholeSellingPrice,
        };

        const course = await this.courseRepo.updateCourse(
          courseId,
          updatedCourse
        );
        if (!course) {
          throw new Error("Course Not Available");
        }
        await updateUsersWithNewCourse(existingCourse);
        return course;
      } else if (courseStatus === "rejected") {
        const updatedCourse = {
          courseStatus,
        };
        const course = await this.courseRepo.updateCourse(
          courseId,
          updatedCourse
        );
        if (!course) {
          throw new Error("Course Not Available");
        }
        return course;
      } else {
        throw new Error("Invalid Course status");
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
export class addReviewOrder {
  constructor(private courseRepo: CourseInterface) {}
  public async execute(data: Partial<Review>): Promise<Review | null> {
    try {
      const res = await this.courseRepo.addReview(data);
      if (res?.courseId)
        await this.courseRepo.updateCourseReview(res?.courseId);
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
export class GetReview {
  constructor(private courseRepo: CourseInterface) {}
  public async execute(id: string): Promise<Review | null> {
    try {
      const review = await this.courseRepo.getReviewById(id);
      return review;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async executeDescription(id: string): Promise<IorderDes[]> {
    try {
      const review = await this.courseRepo.getReviewByCourseId(id);
      return review;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
