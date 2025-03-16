import { Category } from "../../domain/entities/Category";
import { CategoryInterface } from "../../domain/interface/Category";

export class CategoryUsecase {
  constructor(private categoryRepo: CategoryInterface) {}
  public async execAdd(category: Category): Promise<Category> {
    try {
      let check = await this.categoryRepo.checkDuplicateCategory(
        category.categoryName
      );
      if (check) {
        throw new Error("Category Alreay Exists");
      }
      const res = await this.categoryRepo.create(category);
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execAll(): Promise<Category[]> {
    try {
      const res = await this.categoryRepo.getAllCategory();
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execAllCheck(userId: string): Promise<Category[]> {
    try {
      const res = await this.categoryRepo.getRemainingCategories(userId);
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execGetById(id: string): Promise<Category> {
    try {
      const res = await this.categoryRepo.getCategory(id);
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execUpdate(
    id: string,
    category: Partial<Category>
  ): Promise<Category> {
    const res = await this.categoryRepo.updateCategory(id, category);
    return res;
  }

  public async execToggle(id: string): Promise<Category> {
    try {
      const res = await this.categoryRepo.toggleVisibility(id);
      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
