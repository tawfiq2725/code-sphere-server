import { Otp } from "../entities/Otp";

export interface OtpRepository {
  create(otp: Otp): Promise<void>;
  findByEmail(email: string): Promise<Otp | null>;
  deleteByEmail(email: string): Promise<void>;
}
