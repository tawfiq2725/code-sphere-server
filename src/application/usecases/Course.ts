import { CourseInterface } from "../../domain/interface/Course";
import { Course } from "../../domain/entities/Course";

export class CreateCourse {
  constructor(private courseRepository: CourseInterface) {}
  public async execute(courseData: Omit<Course, "id">): Promise<Course> {
    console.log("Creating course.......1");

    console.log("Creating course.......3");

    const newCourse = new Course(
      courseData.courseId,
      courseData.courseName,
      courseData.courseDescription,
      courseData.info,
      courseData.price,
      courseData.prerequisites,
      courseData.thumbnail,
      courseData.isVisible,
      courseData.tutorId,
      courseData.courseStatus,
      courseData.categoryName
    );
    console.log("Creating course.......4");
    return this.courseRepository.create(newCourse);
  }
}

// Delete Course
export class DeleteCourse {
  constructor(private courseRepository: CourseInterface) {}
  public async execute(courseId: string): Promise<void> {
    const course = await this.courseRepository.findCourseByGenerateId(courseId);
    console.log("course", course);
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
    console.log("course", course);
    if (!course) {
      throw new Error("Course not found");
    }
    course.isVisible = !course.isVisible; // Toggle the visibility
    return this.courseRepository.updateCourse(courseId, course);
  }
}
