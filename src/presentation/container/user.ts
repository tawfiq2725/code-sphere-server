import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { CreateUser } from "../../application/usecases/CreateUser";
import { UserController } from "../controllers/userController";
import {
  getProfileUsecase,
  getTutorUsecasae,
  GoogleAuth,
  LoginUser,
  PasswordUsecase,
  RecentMessageStudents,
  setRole,
} from "../../application/usecases/loginUser";
import { FileUploadService } from "../../application/services/filesUpload";
import { GenerateOtp } from "../../application/usecases/generateOtp";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { createCouponUsecase } from "../../application/usecases/Coupons";
import { CouponRepository } from "../../infrastructure/repositories/CouponRepository";

const userRepository = new UserRepository();
const otpRepository = new OtpRepositoryImpl();
const couponRepository = new CouponRepository();
const createUserUseCase = new CreateUser(userRepository);
const loginUseCase = new LoginUser(userRepository);
const fileUplaod = new FileUploadService();
const generateOtp = new GenerateOtp(otpRepository);
const passwordUsecase = new PasswordUsecase(userRepository, generateOtp);
const ProfileUsecase = new getProfileUsecase(userRepository, fileUplaod);
const googleAuthUsecase = new GoogleAuth(userRepository);
const setRoleUsecase = new setRole(userRepository);
const couponUsecase = new createCouponUsecase(couponRepository);
const tutorUsecase = new getTutorUsecasae(userRepository);
const messageUsecase = new RecentMessageStudents(userRepository);
export const userControllerDI = new UserController(
  createUserUseCase,
  loginUseCase,
  ProfileUsecase,
  passwordUsecase,
  googleAuthUsecase,
  setRoleUsecase,
  couponUsecase,
  tutorUsecase,
  messageUsecase
);
