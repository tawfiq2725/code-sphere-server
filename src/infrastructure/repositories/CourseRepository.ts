import { CourseInterface } from "../../domain/interface/Course";
import { Course } from "../../domain/entities/Course";
import CourseS from "../database/courseSchema";
export class CourseRepositoryImpl implements CourseInterface {
  public async create(course: Course): Promise<any> {
    try {
      console.log("creating course", course);
      console.log("creating course", course);
      return await CourseS.create(course);
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating course");
    }
  }
  public async findCourseById(id: string): Promise<Course | null> {
    try {
      console.log("finding course by id", id);
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
      console.log("finding course by generate id", generateId);
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
      console.log("updating course", id);
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
}
