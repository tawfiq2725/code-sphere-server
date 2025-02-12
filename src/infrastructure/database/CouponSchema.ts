import { Schema, model } from "mongoose";

export interface Iuser {
  _id: string;
  count: number;
}

export interface ICoupon extends Document {
  couponName: string;
  couponCode: string;
  couponDiscount: number;
  startDate: Date;
  expireAt: Date;
  couponStatus: boolean;
  usedBy?: Iuser;
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
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const CouponS = model<ICoupon>("Coupon", couponSchema);
export default CouponS;
