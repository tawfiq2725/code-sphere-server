import { OtpRepository } from "../../domain/interface/Otp";
import { generateOtPO } from "../../utils/generateOtp";

export class GenerateOtp {
  constructor(private otpRepository: OtpRepository) {}

  async execute(email: string): Promise<string> {
    try {
      const otp = generateOtPO().toString();
      await this.otpRepository.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });
      return otp;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
