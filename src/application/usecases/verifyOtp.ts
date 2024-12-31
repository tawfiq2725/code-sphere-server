import { OtpRepository } from "../../domain/interface/Otp";
import User from "../../infrastructure/database/userSchema";
export class VerifyOtp {
  constructor(private otpRepository: OtpRepository) {}

  async execute(email: string, otp: string): Promise<boolean> {
    const record = await this.otpRepository.findByEmail(email);
    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      return false;
    }
    await this.otpRepository.deleteByEmail(email);
    // verify the user fields
    let foundUser = await User.find({ email: email });
    foundUser[0].isVerified = true;
    await foundUser[0].save();
    return true;
  }
}
