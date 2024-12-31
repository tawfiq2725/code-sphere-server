import { Request, Response } from "express";
import { GenerateOtp } from "../../application/usecases/generateOtp";
import { VerifyOtp } from "../../application/usecases/verifyOtp";
import { OtpRepositoryImpl } from "../../infrastructure/repositories/OtpRepository";
import { sendOtpEmail } from "../../application/services/OtpService";
import userSchema from "../../infrastructure/database/userSchema";

export const generateOtpHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send({ message: "User email not found." });
    return;
  }

  const otpRepository = new OtpRepositoryImpl();
  const generateOtpUseCase = new GenerateOtp(otpRepository);

  try {
    const otp = await generateOtpUseCase.execute(email);
    await sendOtpEmail(email, otp);
    res.status(200).send({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error generating OTP", error);
    res
      .status(500)
      .send({ message: "Error generating OTP, please try again later." });
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
    res.status(400).send({ message: "Email and OTP are required." });
    return;
  }

  const otpRepository = new OtpRepositoryImpl();
  const verifyOtpUseCase = new VerifyOtp(otpRepository);

  try {
    const isValid = await verifyOtpUseCase.execute(email, otp);

    if (isValid) {
      res.status(200).send({ message: "OTP verified successfully." });
    } else {
      res.status(400).send({ message: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.error("Error verifying OTP", error);
    res
      .status(500)
      .send({ message: "Error verifying OTP, please try again later." });
  }
};
