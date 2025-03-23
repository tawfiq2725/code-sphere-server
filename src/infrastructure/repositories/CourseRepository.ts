import { CourseInterface } from "../../domain/interface/Course";
import { Course } from "../../domain/entities/Course";
import CourseS from "../database/courseSchema";
import Order, { IorderDes } from "../database/orderSchema";
import { Review } from "../../domain/entities/Order";
import Rating from "../database/reviewSchema";
export class CourseRepositoryImpl implements CourseInterface {
  public async create(course: Course): Promise<any> {
    try {
      return await CourseS.create(course);
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating course");
    }
  }
  public async findCourseById(id: string): Promise<Course | null> {
    try {
      return await CourseS.findById(id);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async findCourseByGenerateId(
    generateId: string
  ): Promise<Course | null> {
    try {
      return await CourseS.findOne({ courseId: generateId });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async findCourseByName(name: string): Promise<Course | null> {
    try {
      return await CourseS.findOne({ name });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async getAllCourses(): Promise<Course[]> {
    try {
      return await CourseS.find({ isVisible: true, courseStatus: "approved" });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async getAllCoursesAdmin(): Promise<Course[]> {
    try {
      return await CourseS.find();
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async getAllCoursesId(id: string): Promise<Course[]> {
    try {
      return await CourseS.find({ tutorId: id });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async updateCourse(
    id: string,
    course: Partial<Course>
  ): Promise<Course | null> {
    try {
      return await CourseS.findOneAndUpdate({ courseId: id }, course, {
        new: true,
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async deleteCourse(id: string): Promise<Course | null> {
    try {
      return await CourseS.findOneAndDelete({ courseId: id });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async listOrUnlistCourse(id: string): Promise<any | null> {
    try {
      const course = await CourseS.findById(id);
      if (course) {
        course.isVisible = !course.isVisible;
        return await course.save();
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async findLatestCourse(): Promise<any> {
    try {
      return await CourseS.findOne().sort({ createdAt: -1 });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async findCouresByCategoryId(categoryId: string): Promise<Course[]> {
    try {
      return await CourseS.find({ categoryName: categoryId });
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async updateCourseReview(courseId: string): Promise<Course | null> {
    try {
      const aggregatedReview = await Rating.aggregate([
        {
          $match: {
            courseId: courseId,
            rating: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: "$courseId",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);

      let course: Course | null;

      if (aggregatedReview.length > 0) {
        const { averageRating, reviewCount } = aggregatedReview[0];
        course = await CourseS.findOneAndUpdate(
          { courseId },
          { averageRating, reviewCount },
          { new: true }
        );
      } else {
        course = await CourseS.findOneAndUpdate(
          { courseId },
          { averageRating: 0, reviewCount: 0 },
          { new: true }
        );
      }
      return course;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async getReviewById(
    id: string,
    courseId: string
  ): Promise<Review | null> {
    try {
      const order = await Rating.findOne({ userId: id, courseId });
      if (order) return order.toObject() as Review;
      return null;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async addReview(data: Partial<Review>): Promise<Review> {
    try {
      const review = await Rating.create(data);
      return review.toObject() as Review;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async getReviewByCourseId(courseId: string): Promise<IorderDes[]> {
    try {
      const order = await Rating.find({ courseId });
      if (!order) {
        throw new Error("Review not found");
      }
      let orderReviews = order.map((_) => ({
        description: _.description || "",
      }));
      return orderReviews;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
