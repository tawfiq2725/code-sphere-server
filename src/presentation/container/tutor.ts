import { FileUploadService } from "../../application/services/filesUpload";
import { UpdateProfileService } from "../../application/services/updateProfile";
import {
  getmyCoursesUsecase,
  getStudentsUsecase,
} from "../../application/usecases/loginUser";
import { approveCertificateUsecase } from "../../application/usecases/userLists";
import { ReportsRepository } from "../../infrastructure/repositories/ReportsRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { TutorController } from "../controllers/tutorCtrl";

const userRepository = new UserRepository();
const reportRepository = new ReportsRepository();
const tutorUploadservice = new UpdateProfileService();
const fileUplaod = new FileUploadService();
const approveCertificates = new approveCertificateUsecase(
  userRepository,
  fileUplaod
);
const Students = new getStudentsUsecase(userRepository, reportRepository);
const Course = new getmyCoursesUsecase(userRepository);
export const tutorControllerDI = new TutorController(
  tutorUploadservice,
  approveCertificates,
  Students,
  Course
);
