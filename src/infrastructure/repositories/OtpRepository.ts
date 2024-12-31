import { OtpRepository } from "../../domain/interface/Otp";
import { OtpModel } from "../database/otpSchema";

export class OtpRepositoryImpl implements OtpRepository {
  async create(otp: {
    email: string;
    otp: string;
    expiresAt: Date;
  }): Promise<void> {
    await OtpModel.create(otp);
  }

  async findByEmail(email: string): Promise<any | null> {
    return OtpModel.findOne({ email });
  }

  async deleteByEmail(email: string): Promise<void> {
    await OtpModel.deleteOne({ email });
  }
}
