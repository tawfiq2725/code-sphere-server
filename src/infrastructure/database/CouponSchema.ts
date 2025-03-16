import { Schema, model, Types } from "mongoose";

export interface IUsedBy {
  userId: string;
  count: number;
}

export interface ICoupon {
  couponName: string;
  couponCode: string;
  couponDiscount: number;
  startDate: Date;
  expireAt: Date;
  couponStatus: boolean;
  _id?: string;
  usedBy?: IUsedBy[];
}
const couponSchema = new Schema<ICoupon>(
  {
    couponName: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    couponDiscount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    couponStatus: {
      type: Boolean,
      default: false,
    },
    usedBy: [
      {
        count: { type: Number, default: 1 },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const CouponS = model<ICoupon>("Coupon", couponSchema);
export default CouponS;
