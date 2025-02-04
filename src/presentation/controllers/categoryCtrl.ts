import { Request, response, Response } from "express";
import { CategoryRepository } from "../../infrastructure/repositories/CategoryRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
interface Category {
  categoryName: string;
  description: string;
  status: boolean;
}

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName, description } = req.body;
    const repository = new CategoryRepository();
    let check = await repository.checkDuplicateCategory(categoryName);
    if (check) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Category already exists",
        false
      );
    }
    const category: Category = {
      categoryName,
      description,
      status: true,
    };
    await repository.create(category);
    sendResponseJson(
      res,
      HttpStatus.CREATED,
      "Category added successfully",
      true
    );
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const repository = new CategoryRepository();
    const categories = await repository.getAllCategory();
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
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repository = new CategoryRepository();
    const category = await repository.getCategory(id);
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
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const { id } = req.params;
    const repository = new CategoryRepository();
    console.log("updates", updates);

    await repository.updateCategory(id, updates);
    sendResponseJson(res, HttpStatus.OK, "Category updated", true);
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const toggleVisiblityCategory = async (req: Request, res: Response) => {
  try {
    console.log("Starting........................1");
    const { id } = req.params;
    console.log("id", id);
    const repository = new CategoryRepository();
    const category = await repository.toggleVisibility(id);
    console.log("category", category);
    console.log("category.status", category.status);
    console.log("almost done here itself");
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
};
