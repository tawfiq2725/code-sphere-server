import { CategoryInterface } from "../../domain/interface/Category";
import { Category } from "../../domain/entities/Category";
import CategoryS from "../database/categorySchema";
export class CategoryRepository implements CategoryInterface {
  public async create(category: Category): Promise<Category> {
    return await CategoryS.create(category);
  }
  public async checkDuplicateCategory(
    categoryName: string
  ): Promise<Category | null> {
    return await CategoryS.findOne({ categoryName });
  }
  public async getAllCategory(): Promise<any> {
    return await CategoryS.find();
  }
  public async updateCategory(id: string, categoryName: any): Promise<any> {
    return await CategoryS.findByIdAndUpdate(
      id,
      { categoryName },
      {
        new: true,
      }
    );
  }

  public async toggleVisibility(id: string): Promise<any> {
    const category = await CategoryS.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    return await CategoryS.findByIdAndUpdate(
      id,
      { $set: { status: !category.status } },
      { new: true }
    );
  }
  public async getCategory(id: string): Promise<any> {
    return await CategoryS.findById(id);
  }
}
