import mongoose, { Schema, Document } from "mongoose";
export interface OtpDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  { timestamps: true }
);
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const OtpModel = mongoose.model<OtpDocument>("Otp", OtpSchema);
