import { CategoryInterface } from "../../domain/interface/Category";
import { Category } from "../../domain/entities/Category";
import CategoryS from "../database/categorySchema";
import userSchema from "../database/userSchema";
import Course, { ICourse } from "../database/courseSchema";
export class CategoryRepository implements CategoryInterface {
  public async create(category: Category): Promise<Category> {
    try {
      return await CategoryS.create(category);
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async checkDuplicateCategory(categoryName: string): Promise<boolean> {
    try {
      const existingCategory = await CategoryS.findOne({ categoryName });
      return !!existingCategory;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async getAllCategory(): Promise<Category[]> {
    try {
      return await CategoryS.find();
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async getRemainingCategories(userId: string): Promise<Category[]> {
    try {
      const user = await userSchema.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Determine membership plan type
      const membershipPlan = user.membership?.plan;
      let remainingCategories: Category[] = [];

      if (membershipPlan === "Basic") {
        // For a Basic plan, consider all categories but filter out those where the user
        // has enrolled in (or completed) all courses in that category.
        const allCategories = await CategoryS.find({});

        // Loop through each category
        for (const category of allCategories) {
          // Fetch courses for the current category
          const courses = (await Course.find({
            categoryName: category._id,
          }).exec()) as ICourse[];
          const courseIds = courses.map((course: ICourse) =>
            course.courseId.toString()
          );

          // Get course IDs from user's course progress
          const enrolledCourseIds =
            user.courseProgress?.map((cp) => cp.courseId) || [];
          const hasEnrolledAllCourses =
            courseIds.length > 0 &&
            courseIds.every((id) => enrolledCourseIds.includes(id));
          if (!hasEnrolledAllCourses) {
            remainingCategories.push(category);
          }
        }
      } else {
        const enrolledCategoryIds = user.membership?.categoryId || [];
        remainingCategories = await CategoryS.find({
          _id: { $nin: enrolledCategoryIds },
        });
      }

      return remainingCategories;
    } catch (err) {
      console.error(err);
      throw new Error("Something went wrong");
    }
  }

  public async updateCategory(
    id: string,
    updates: Partial<Category>
  ): Promise<any> {
    try {
      return await CategoryS.findByIdAndUpdate(id, updates, {
        new: true,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }

  public async toggleVisibility(id: string): Promise<Category> {
    try {
      const category = await CategoryS.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }

      const updatedCategory = await CategoryS.findByIdAndUpdate(
        id,
        { $set: { status: !category.status } },
        { new: true }
      );
      if (!updatedCategory) {
        throw new Error("Failed to update category");
      }
      return updatedCategory;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async getCategory(id: string): Promise<Category> {
    try {
      let category = await CategoryS.findById(id);
      if (!category) {
        throw new Error("Category Not found");
      }
      return category;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
}
