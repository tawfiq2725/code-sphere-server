import { OtpRepository } from "../../domain/interface/Otp";
import { OtpModel } from "../database/otpSchema";

export class OtpRepositoryImpl implements OtpRepository {
  async create(otp: {
    email: string;
    otp: string;
    expiresAt: Date;
  }): Promise<void> {
    try {
      await OtpModel.create(otp);
    } catch (err) {
      console.log(err);
    }
  }

  async findByEmail(email: string): Promise<any | null> {
    try {
      return OtpModel.findOne({ email });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async deleteByEmail(email: string): Promise<void> {
    try {
      await OtpModel.deleteOne({ email });
    } catch (err) {
      console.log(err);
    }
  }
}
