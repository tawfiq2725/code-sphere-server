import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  student_name: string;
  email: string;
  password: string;
  role: "student";
  isAdmin: boolean;
  isVerified: boolean;
  googleId?: string;
}

const UserSchema: Schema = new Schema(
  {
    student_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
      enum: ["student"],
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>("User", UserSchema);
