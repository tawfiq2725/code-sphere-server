import { Schema, model, Document } from "mongoose";

export interface IOffer extends Document {
  offerName: string;
  discount: number;
  categoryId: string;
  startsFrom: Date;
  endsFrom: Date;
  status: boolean;
}

const OfferSchema = new Schema(
  {
    offerName: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    startsFrom: {
      type: Date,
      required: true,
    },
    endsFrom: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OfferModel = model<IOffer>("Offer", OfferSchema);
export default OfferModel;
