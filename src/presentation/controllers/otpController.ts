import { Request, Response } from "express";
import { GenerateOtp } from "../../application/usecases/generateOtp";
import { VerifyOtp } from "../../application/usecases/verifyOtp";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { sendOtpEmail } from "../../application/services/OtpService";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

export const generateOtpHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, "Email is required.", false);
    return;
  }

  const otpRepository = new OtpRepositoryImpl();
  const generateOtpUseCase = new GenerateOtp(otpRepository);

  try {
    const otp = await generateOtpUseCase.execute(email);
    await sendOtpEmail(email, otp);
    sendResponseJson(res, HttpStatus.OK, "OTP generated successfully.", true);
  } catch (error: any) {
    console.error("Error generating OTP", error);
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

// resend otp controller ithu

export const resendOtpHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, "Email is required", false);
    return;
  }

  const otpRepository = new OtpRepositoryImpl();
  const generateOtpUseCase = new GenerateOtp(otpRepository);

  try {
    const otp = await generateOtpUseCase.execute(email);
    await sendOtpEmail(email, otp);
    sendResponseJson(res, HttpStatus.OK, "OTP Resend successfully", true);
  } catch (error: any) {
    console.error("Error generating OTP", error);
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const verifyOtpHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp } = req.body;
  console.log("email", email);
  console.log("otp", otp);
  if (!email || !otp) {
    sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Email and OTP are required.",
      false
    );

    return;
  }

  const otpRepository = new OtpRepositoryImpl();
  const verifyOtpUseCase = new VerifyOtp(otpRepository);

  try {
    const isValid = await verifyOtpUseCase.execute(email, otp);

    if (isValid) {
      sendResponseJson(res, HttpStatus.OK, "OTP verified successfully.", true);
    } else {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid or expired OTP.",
        false
      );
    }
  } catch (error: any) {
    console.error("Error verifying OTP", error);
    sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};
