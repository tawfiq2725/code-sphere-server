import mongoose, { Schema, Document } from "mongoose";

export interface CourseProgress {
  courseId: string;
  progress: number;
  completedChapters: string[];
  totalChapters: number;
}

export interface MembershipInfo {
  categoryId: string[];
  plan: "Basic" | "Standard" | "Premium";
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
  reason?: string;
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
    },
    isTutor: {
      type: Boolean,
      default: false,
    },
    qualification: {
      type: String,
    },
    experience: {
      type: Number,
    },
    subjects: {
      type: [String],
    },
    certificates: {
      type: [String],
    },
    tutorStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    profile: {
      type: String,
    },
    bio: {
      type: String,
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
      categoryId: {
        type: [String],
      },
      plan: {
        type: String,
        enum: ["Basic", "Standard", "Premium"],
      },
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
          certificateUrl: { type: String },
          issuedDate: { type: Date },
          approvedBy: { type: String },
        },
      ],
      default: [],
    },
    reason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>("User", UserSchema);
