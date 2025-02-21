import mongoose, { Schema, Document } from "mongoose";

export interface CourseProgress {
  courseId: string;
  progress: number;
  completedChapters: string[];
  totalChapters: number;
}

export interface MembershipInfo {
  categoryId: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "inactive";
}

export interface UserCertificate {
  courseId: string;
  status: "approved" | "unavailable";
  certificateUrl?: string;
  issuedDate?: Date;
  approvedBy?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role?: "student" | "tutor" | "admin";
  _id: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  googleId?: string;
  isTutor: boolean;
  qualification?: string;
  experience?: number;
  subjects?: string[];
  certificates?: string[];
  tutorStatus?: "pending" | "approved" | "rejected";
  profile?: string;
  bio?: string;
  courseProgress?: CourseProgress[];
  membership?: MembershipInfo;
  CourseCertificate?: UserCertificate[];
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
    tutorStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    courseProgress: {
      type: [
        {
          courseId: { type: String, required: true },
          progress: { type: Number, required: true },
          completedChapters: { type: [String], default: [] },
          totalChapters: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    membership: {
      categoryId: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      status: { type: String, enum: ["active", "expired", "inactive"] },
    },
    CourseCertificate: {
      type: [
        {
          courseId: { type: String, required: true },
          status: {
            type: String,
            enum: ["approved", "unavailable"],
            default: "unavailable",
          },
          certificateUrl: { type: String, required: false },
          issuedDate: { type: Date, required: false },
          approvedBy: { type: String, required: false },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>("User", UserSchema);
