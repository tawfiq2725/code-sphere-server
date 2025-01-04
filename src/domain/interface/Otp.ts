import { OtpEntity } from "../entities/Otp";

export interface OtpRepository {
  create(otp: OtpEntity): Promise<void>;
  findByEmail(email: string): Promise<OtpEntity | null>;
  deleteByEmail(email: string): Promise<void>;
}
