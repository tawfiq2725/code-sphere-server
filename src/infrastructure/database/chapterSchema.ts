import { Schema, model } from "mongoose";

interface IChapter extends Document {
  courseId: string;
  chapterName: string;
  chapterDescription: string;
  video: string;
  status: boolean;
}

const chapterSchema = new Schema<IChapter>(
  {
    courseId: {
      type: String,
      required: true,
    },
    chapterName: {
      type: String,
      required: true,
    },
    chapterDescription: {
      type: String,
      required: true,
    },

    video: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Chapter = model<IChapter>("Chapter", chapterSchema);

export default Chapter;
