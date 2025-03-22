import { CourseRepositoryImpl } from "../../infrastructure/repositories/CourseRepository";
import { FileUploadService } from "../../application/services/filesUpload";
import {
  addReviewOrder,
  CreateCourse,
  GetReview,
} from "../../application/usecases/Course";
import { ToggleCourseVisibility } from "../../application/usecases/Course";
import { DeleteCourse } from "../../application/usecases/Course";
import { CourseCtrl } from "../controllers/courseCtrl";

const courseRepo = new CourseRepositoryImpl();
const fileUplaod = new FileUploadService();
const createCourse = new CreateCourse(courseRepo, fileUplaod);
const toggleCourse = new ToggleCourseVisibility(courseRepo);
const delteCourese = new DeleteCourse(courseRepo);
const addOrEdituseCase = new addReviewOrder(courseRepo);
const getReview = new GetReview(courseRepo);

export const courseCtrlDI = new CourseCtrl(
  delteCourese,
  toggleCourse,
  createCourse,
  fileUplaod,
  addOrEdituseCase,
  getReview
);
