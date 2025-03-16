import { OtpRepository } from "../../domain/interface/Otp";
import { UserInterface } from "../../domain/interface/User";
export class VerifyOtp {
  constructor(
    private otpRepository: OtpRepository,
    private userRepo: UserInterface
  ) {}

  public async execute(email: string, otp: string): Promise<boolean> {
    try {
      const record = await this.otpRepository.findByEmail(email);
      if (!record || record.otp !== otp || record.expiresAt < new Date()) {
        return false;
      }
      await this.otpRepository.deleteByEmail(email);

      let user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      let userId = user?._id;
      if (!userId) {
        throw new Error("Not found");
      }
      user.isVerified = true;
      await this.userRepo.update(userId, user);
      return true;
    } catch (err: any) {
      return false;
    }
  }
}
