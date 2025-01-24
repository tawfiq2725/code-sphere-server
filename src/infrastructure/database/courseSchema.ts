import { Schema, model, Document, ObjectId } from "mongoose";

interface ICourse extends Document {
  courseId: string;
  courseName: string;
  courseDescription: string;
  price: number;
  prerequisites: string;
  thumbnail: string;
  isVisible: boolean;
  tutorId: string;
  courseStatus: "pending" | "approved" | "rejected";
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
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>("Course", courseSchema);

export default Course;
