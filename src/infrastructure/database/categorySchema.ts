import { Schema, model } from "mongoose";

interface ICategory extends Document {
  categoryName: string;
  status: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    categoryName: {
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

const Category = model<ICategory>("Category", categorySchema);

export default Category;
