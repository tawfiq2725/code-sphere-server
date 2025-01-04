export interface Otp {
  email: string;
  otp: string;
  expiresAt: Date;
}

export class OtpEntity {
  constructor(
    public email: string,
    public otp: string,
    public expiresAt: Date
  ) {}
}
