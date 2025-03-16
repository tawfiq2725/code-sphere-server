import { Request, Response } from "express";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { CategoryUsecase } from "../../application/usecases/Category";
interface Category {
  categoryName: string;
  description: string;
  status: boolean;
}

export class CategoryCtrl {
  constructor(private categoryUsecase: CategoryUsecase) {}
  public async addCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, description } = req.body;
      const category: Category = {
        categoryName,
        description,
        status: true,
      };
      await this.categoryUsecase.execAdd(category);
      sendResponseJson(
        res,
        HttpStatus.CREATED,
        "Category added successfully",
        true
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getAllCategory(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryUsecase.execAll();
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Categories fetched",
        true,
        categories
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getAllCategoryCheck(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categories = await this.categoryUsecase.execAllCheck(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Categories fetched",
        true,
        categories
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryUsecase.execGetById(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Category fetched",
        true,
        category.categoryName
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const updates = req.body;
      const { id } = req.params;
      await this.categoryUsecase.execUpdate(id, updates);
      sendResponseJson(res, HttpStatus.OK, "Category updated", true);
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async toggleVisiblityCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryUsecase.execToggle(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Category visibility updated",
        true,
        category
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
}
