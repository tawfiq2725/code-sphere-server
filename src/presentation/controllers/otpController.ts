import { Request, Response } from "express";
import { GenerateOtp } from "../../application/usecases/generateOtp";
import { VerifyOtp } from "../../application/usecases/verifyOtp";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { sendOtpEmail } from "../../application/services/OtpService";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

export class OtpController {
  constructor(private generateOtp: GenerateOtp, private verifyOtp: VerifyOtp) {}
  public async generateOtpHandler(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Give the correct email Address",
        false
      );
      return;
    }
    try {
      const otp = await this.generateOtp.execute(email);
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
  }
  public async resendOtpHandler(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, "Email is required", false);
      return;
    }
    try {
      const otp = await this.generateOtp.execute(email);
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
  }
  public async verifyOtpHandler(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    if (!email || !otp) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Email and OTP are required.",
        false
      );

      return;
    }
    try {
      const isValid = await this.verifyOtp.execute(email, otp);

      if (isValid) {
        sendResponseJson(
          res,
          HttpStatus.OK,
          "OTP verified successfully.",
          true
        );
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
  }
}
