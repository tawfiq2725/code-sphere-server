import { CourseInterface } from "../../domain/interface/Course";
import { Course } from "../../domain/entities/Course";
import CourseS from "../database/courseSchema";
export class CourseRepositoryImpl implements CourseInterface {
  public async create(course: Course): Promise<any> {
    console.log("creating course", course);
    console.log("creating course", course);
    return await CourseS.create(course);
  }
  public async findCourseById(id: string): Promise<Course | null> {
    console.log("finding course by id", id);
    return await CourseS.findById(id);
  }
  public async findCourseByGenerateId(
    generateId: string
  ): Promise<Course | null> {
    console.log("finding course by generate id", generateId);
    return await CourseS.findOne({ courseId: generateId });
  }
  public async findCourseByName(name: string): Promise<Course | null> {
    return await CourseS.findOne({ name });
  }
  public async getAllCourses(): Promise<Course[]> {
    return await CourseS.find({ isVisible: true, courseStatus: "approved" });
  }
  public async getAllCoursesAdmin(): Promise<Course[]> {
    return await CourseS.find();
  }
  public async getAllCoursesId(id: string): Promise<Course[]> {
    return await CourseS.find({ tutorId: id });
  }
  public async updateCourse(
    id: string,
    course: Partial<Course>
  ): Promise<Course | null> {
    console.log("updating course", id);
    return await CourseS.findOneAndUpdate({ courseId: id }, course, {
      new: true,
    });
  }
  public async deleteCourse(id: string): Promise<Course | null> {
    return await CourseS.findOneAndDelete({ courseId: id });
  }
  public async listOrUnlistCourse(id: string): Promise<any | null> {
    const course = await CourseS.findById(id);
    if (course) {
      course.isVisible = !course.isVisible;
      return await course.save();
    }
    return null;
  }
  public async findLatestCourse(): Promise<any> {
    return await CourseS.findOne().sort({ createdAt: -1 });
  }
  public async findCouresByCategoryId(categoryId: string): Promise<Course[]> {
    return await CourseS.find({ categoryName: categoryId });
  }
}
