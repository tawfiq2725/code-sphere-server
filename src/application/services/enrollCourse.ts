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
  categoryId: string | string[]
): Promise<void> => {
  try {
    // Retrieve the membership plan
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new Error("Membership plan not found");
    }

    // Ensure we work with an array of category IDs
    const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];

    // Find all courses in the given categories using the $in operator
    const courses = await Course.find({ categoryName: { $in: categoryIds } });

    // Build course progress array for all courses in these categories
    const membershipCourses = [];
    for (const course of courses) {
      const courseId = course.courseId;
      const countChapters = await Chapter.countDocuments({ courseId });
      membershipCourses.push({
        courseId,
        progress: 0,
        completedChapters: [],
        totalChapters: countChapters,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Merge the new category IDs with any existing ones (avoid duplicates)
    let updatedCategories: string[] = [];
    const newCategories = categoryIds;
    if (user.membership && user.membership.categoryId) {
      const existingCategories = Array.isArray(user.membership.categoryId)
        ? user.membership.categoryId
        : [user.membership.categoryId];
      updatedCategories = Array.from(
        new Set([...existingCategories, ...newCategories])
      );
    } else {
      updatedCategories = newCategories;
    }

    // Update the user membership and add new course progress entries
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          membership: {
            categoryId: updatedCategories,
            plan: membership.membershipPlan,
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

/**
 * Updates users with a new course.
 * - Only users on a "Standard" or "Premium" plan will be updated.
 * - The new course is added only if its category (newCourse.categoryName)
 *   is already part of the user's membership.categoryId.
 * - Users on the "Basic" plan do not get future courses automatically.
 */
export const updateUsersWithNewCourse = async (
  newCourse: any
): Promise<void> => {
  try {
    // Count the chapters in the new course
    const countChapters = await Chapter.countDocuments({
      courseId: newCourse.courseId,
    });

    // Update only users with Standard or Premium memberships
    // whose membership category list includes the new course's category.
    await User.updateMany(
      {
        "membership.plan": { $in: ["Standard", "Premium"] },
        "membership.categoryId": newCourse.categoryName,
      },
      {
        $addToSet: {
          courseProgress: {
            courseId: newCourse.courseId,
            progress: 0,
            completedChapters: [],
            totalChapters: countChapters,
          },
        },
      }
    );

    console.log("Users with matching membership updated with the new course");
  } catch (error) {
    console.error("Error updating users with new course:", error);
    throw error;
  }
};
