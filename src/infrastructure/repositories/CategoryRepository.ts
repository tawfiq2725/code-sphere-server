import { CategoryInterface } from "../../domain/interface/Category";
import { Category } from "../../domain/entities/Category";
import CategoryS from "../database/categorySchema";
export class CategoryRepository implements CategoryInterface {
  public async create(category: Category): Promise<Category> {
    try {
      return await CategoryS.create(category);
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async checkDuplicateCategory(
    categoryName: string
  ): Promise<Category | null> {
    try {
      return await CategoryS.findOne({ categoryName });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async getAllCategory(): Promise<any> {
    try {
      return await CategoryS.find();
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async updateCategory(id: string, updates: any): Promise<any> {
    try {
      return await CategoryS.findByIdAndUpdate(id, updates, {
        new: true,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }

  public async toggleVisibility(id: string): Promise<any> {
    try {
      const category = await CategoryS.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }

      return await CategoryS.findByIdAndUpdate(
        id,
        { $set: { status: !category.status } },
        { new: true }
      );
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async getCategory(id: string): Promise<any> {
    try {
      return await CategoryS.findById(id);
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
}
