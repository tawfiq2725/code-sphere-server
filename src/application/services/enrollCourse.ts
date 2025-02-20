import User from "../../infrastructure/database/userSchema";
import Membership from "../../infrastructure/database/MembershipSchema";
import Course from "../../infrastructure/database/courseSchema";
import Chapter from "../../infrastructure/database/chapterSchema";

export const enrollUserInCourse = async (
  userId: string,
  courseId: string
): Promise<void> => {
  try {
    const countChapters = await Chapter.countDocuments({ courseId });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          courseProgress: {
            courseId,
            progress: 0,
            completedChapters: [],
            totalChapters: countChapters,
          },
        },
      },
      { new: true }
    );
    console.log("User enrolled in course successfully", updatedUser);
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    throw error;
  }
};

export const enrollMembership = async (
  userId: string,
  membershipId: string,
  categoryId: string
): Promise<void> => {
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new Error("Membership plan not found");
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + membership.duration);
    const courses = await Course.find({ categoryName: categoryId });
    const membershipCourses = courses.map((course) => ({
      courseId: course.courseId.toString(),
      progress: 0,
      completedChapters: [],
    }));

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          membership: {
            categoryId,
            startDate,
            endDate,
            status: "active",
          },
        },
        $addToSet: {
          courseProgress: { $each: membershipCourses },
        },
      },
      { new: true }
    );

    console.log("User membership enrollment successful");
  } catch (error) {
    console.error("Error enrolling user in membership:", error);
    throw error;
  }
};
