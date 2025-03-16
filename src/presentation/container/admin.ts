import { GetAllCourse } from "../../application/usecases/Course";
import {
  GetAllTutor,
  GetAllTutorApplication,
  GetAllUsers,
} from "../../application/usecases/userLists";
import { CourseRepositoryImpl } from "../../infrastructure/repositories/CourseRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { AdminCtrl } from "../controllers/getAllusers";

const userRepository = new UserRepository();
const courseRepository = new CourseRepositoryImpl();
const getAlltutorUsecase = new GetAllTutor(userRepository);
const getAlltutorApplication = new GetAllTutorApplication(userRepository);
const getAllUsers = new GetAllUsers(userRepository);
const courseUsecase = new GetAllCourse(courseRepository);

export const adminCtrlDI = new AdminCtrl(
  getAlltutorUsecase,
  getAlltutorApplication,
  getAllUsers,
  courseUsecase
);
