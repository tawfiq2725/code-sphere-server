import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role?: "student" | "tutor" | "admin";
  _id: string;
  isAdmin: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  googleId?: string;
  isTutor: boolean;
  qualification?: string;
  experience?: number;
  subjects?: string[];
  certificates?: string[];
  profile?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: {
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
      required: false,
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "tutor", "admin"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    isTutor: {
      type: Boolean,
      default: false,
    },
    qualification: {
      type: String,
      required: false,
    },
    experience: {
      type: Number,
      required: false,
    },
    subjects: {
      type: [String],
      required: false,
    },
    certificates: {
      type: [String],
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>("User", UserSchema);
