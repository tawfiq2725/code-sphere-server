import { Schema, model, Document, ObjectId } from "mongoose";
export interface IReveiew extends Document {
  rating: number;
  description: string;
  hasReview: boolean;
  courseId: string;
  userId: string;
}
const ratingSchema = new Schema<IReveiew>(
  {
    rating: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    hasReview: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Rating = model<IReveiew>("Rating", ratingSchema);

export default Rating;
