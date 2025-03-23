import User, { UserDocument } from "../../infrastructure/database/userSchema";
import Membership from "../../infrastructure/database/MembershipSchema";
import Course from "../../infrastructure/database/courseSchema";
import Chapter from "../../infrastructure/database/chapterSchema";
import { getUrl } from "../../utils/getUrl";

export const enrollUserInCourse = async (
  userId: string,
  courseId: string
): Promise<UserDocument | null> => {
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
    if (!updatedUser) {
      return null;
    }
    if (updatedUser.profile) {
      updatedUser.profile = await getUrl(updatedUser.profile);
    }
    return updatedUser;
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    throw error;
  }
};

export const enrollMembership = async (
  userId: string,
  membershipId: string,
  categoryId: string | string[]
): Promise<UserDocument | null> => {
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new Error("Membership plan not found");
    }

    const categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];
    const courses = await Course.find({ categoryName: { $in: categoryIds } });

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const existingCourseIds = user.courseProgress
      ? user.courseProgress.map((course) => course.courseId)
      : [];

    const membershipCourses = [];
    for (const course of courses) {
      const courseId = course.courseId;
      if (!existingCourseIds.includes(courseId)) {
        const countChapters = await Chapter.countDocuments({ courseId });
        membershipCourses.push({
          courseId,
          progress: 0,
          completedChapters: [],
          totalChapters: countChapters,
        });
      }
    }

    // Update categories
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

    const updateOperation: any = {
      $set: {
        membership: {
          categoryId: updatedCategories,
          plan: membership.membershipPlan,
        },
      },
    };

    if (membershipCourses.length > 0) {
      updateOperation.$addToSet = {
        courseProgress: { $each: membershipCourses },
      };
    }

    const userDoc = await User.findByIdAndUpdate(userId, updateOperation, {
      new: true,
    });
    return userDoc;
  } catch (error) {
    console.error("Error enrolling user in membership:", error);
    throw error;
  }
};
export const updateUsersWithNewCourse = async (
  newCourse: any
): Promise<void> => {
  try {
    const countChapters = await Chapter.countDocuments({
      courseId: newCourse.courseId,
    });

    const usersToUpdate = await User.find({
      "membership.plan": { $in: ["Standard", "Premium"] },
      "membership.categoryId": newCourse.categoryName,
      "courseProgress.courseId": { $ne: newCourse.courseId },
    });

    if (usersToUpdate.length > 0) {
      await User.updateMany(
        {
          _id: { $in: usersToUpdate.map((user) => user._id) },
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
    }
  } catch (error) {
    console.error("Error updating users with new course:", error);
    throw error;
  }
};
