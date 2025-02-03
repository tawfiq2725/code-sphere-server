import { Category } from "../entities/Category";

export interface CategoryInterface {
  create(category: Category): Promise<Category>;
  checkDuplicateCategory(categoryName: string): Promise<Category | null>;
  getAllCategory(id: string): Promise<any>;
  updateCategory(id: string, categoryName: any): Promise<any>;
}
