import { IorderDes } from "../../infrastructure/database/orderSchema";
import { Course } from "../entities/Course";
import { Review } from "../entities/Order";

export interface CourseInterface {
  create(course: Course): Promise<Course>;
  findCourseById(id: string): Promise<Course | null>;
  getAllCourses(): Promise<Course[]>;
  updateCourse(id: string, course: Partial<Course>): Promise<Course | null>;
  deleteCourse(id: string): Promise<Course | null>;
  listOrUnlistCourse(id: string): Promise<Course | null>;
  findCourseByName(courseName: string): Promise<Course | null>;
  findCourseByGenerateId(generateId: string): Promise<Course | null>;
  getAllCoursesAdmin(): Promise<Course[]>;
  findCouresByCategoryId(id: string): Promise<Course[]>;
  getAllCoursesId(id: string): Promise<Course[]>;
  updateCourseReview(id: string): Promise<Course | null>;
  getReviewById(id: string, courseId: string): Promise<Review | null>;
  getReviewByCourseId(id: string): Promise<IorderDes[]>;
  addReview(data: Partial<Review>): Promise<Review>;
}
