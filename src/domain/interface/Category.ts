import { Category } from "../entities/Category";

export interface CategoryInterface {
  create(category: Category): Promise<Category>;
  checkDuplicateCategory(categoryName: string): Promise<boolean>;
  countCategoryByName(categoryName: string): Promise<number>;
  getAllCategory(): Promise<Category[]>;
  getRemainingCategories(userId: string): Promise<Category[]>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category>;
  toggleVisibility(id: string): Promise<Category>;
  getCategory(id: string): Promise<Category>;
}
