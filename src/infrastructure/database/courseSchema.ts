import { Schema, model, Document, ObjectId } from "mongoose";

export interface ICourse extends Document {
  courseId: string;
  courseName: string;
  courseDescription: string;
  info: string;
  price: number;
  prerequisites: string;
  thumbnail: string;
  isVisible: boolean;
  tutorId: string;
  courseStatus: "pending" | "approved" | "rejected";
  categoryName: string;
  sellingPrice?: number;
}

const courseSchema = new Schema<ICourse>(
  {
    courseId: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    info: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    prerequisites: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    tutorId: {
      type: String,
      required: true,
    },
    courseStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    categoryName: {
      type: String,
      required: false,
    },
    sellingPrice: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>("Course", courseSchema);

export default Course;
