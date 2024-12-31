import { OtpRepository } from "../../domain/interface/Otp";

export class VerifyOtp {
  constructor(private otpRepository: OtpRepository) {}

  async execute(email: string, otp: string): Promise<boolean> {
    const record = await this.otpRepository.findByEmail(email);
    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      return false;
    }
    await this.otpRepository.deleteByEmail(email);
    return true;
  }
}
