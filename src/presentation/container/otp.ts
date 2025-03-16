import { GenerateOtp } from "../../application/usecases/generateOtp";
import { VerifyOtp } from "../../application/usecases/verifyOtp";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { OtpController } from "../controllers/otpController";

const userRepository = new UserRepository();
const otpRepository = new OtpRepositoryImpl();
const generateOtp = new GenerateOtp(otpRepository);
const verifyOtp = new VerifyOtp(otpRepository, userRepository);
export const otpControllerDI = new OtpController(generateOtp, verifyOtp);
