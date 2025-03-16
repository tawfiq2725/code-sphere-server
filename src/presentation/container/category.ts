import { CategoryRepository } from "../../infrastructure/repositories/CategoryRepository";
import { CategoryUsecase } from "../../application/usecases/Category";
import { CategoryCtrl } from "../controllers/categoryCtrl";

const categoryRepo = new CategoryRepository();
const categoryUsecase = new CategoryUsecase(categoryRepo);

export const categoryCtrlDI = new CategoryCtrl(categoryUsecase);
