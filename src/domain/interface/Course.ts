import { Course } from "../entities/Course";

export interface CourseInterface {
  create(course: Course): Promise<Course>;
  findCourseById(id: string): Promise<Course | null>;
  getAllCourses(): Promise<Course[]>;
  updateCourse(id: string, course: Course): Promise<Course | null>;
  deleteCourse(id: string): Promise<Course | null>;
  listOrUnlistCourse(id: string): Promise<Course | null>;
  findCourseByName(courseName: string): Promise<Course | null>;
  findCourseByGenerateId(generateId: string): Promise<Course | null>;
}
