import { UserInterface } from "../../domain/interface/User";
import Chapter from "../../infrastructure/database/chapterSchema";
import User from "../../infrastructure/database/userSchema"; // Import User model
export class CourseProgress {
  constructor(private userRepository: UserInterface) {}

  public async execute(courseData: any): Promise<any> {
    const { userId, chapterId, courseId } = courseData;
    console.log("starting.....1");
    try {
      const user = await this.userRepository.findById(userId);
      console.log("starting.....2");
      if (!user) {
        throw new Error("User not found");
      }

      const totalChapters = await Chapter.countDocuments({ courseId });
      console.log("starting.....3");
      console.log("totalChapters", totalChapters);
      let progressEntry = user.courseProgress?.find(
        (entry) => entry.courseId === courseId
      );
      console.log("starting.....4");
      console.log("progressEntry", progressEntry);
      if (progressEntry) {
        if (progressEntry.completedChapters.includes(chapterId)) {
          return { message: "Chapter already completed" };
        }

        progressEntry.completedChapters.push(chapterId);

        progressEntry.progress =
          (progressEntry.completedChapters.length / totalChapters) * 100;
      } else {
        progressEntry = {
          courseId,
          completedChapters: [chapterId],
          progress: (1 / totalChapters) * 100,
        };
        user.courseProgress?.push(progressEntry);
      }

      await User.findByIdAndUpdate(userId, user);

      return { message: "Course progress updated successfully" };
    } catch (error: any) {
      console.error(error);
      throw new Error("Failed to update course progress");
    }
  }
}
