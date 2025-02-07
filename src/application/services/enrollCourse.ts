import User from "../../infrastructure/database/userSchema";

export const enrollUserInCourse = async (
  userId: string,
  courseId: string
): Promise<void> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          courseProgress: {
            courseId,
            progress: 0,
            completedChapters: [],
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
