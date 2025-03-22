import { Schema, Document, model } from "mongoose";

interface IOrder extends Document {
  orderId: string;
  userId: string;
  courseId: string;
  totalAmount: string;
  orderStatus?: "pending" | "success" | "failed";
  paymentStatus?: "pending" | "success" | "failed";
  isApplied?: boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  couponCode?: string;
  couponDiscount?: string;
  createdAt?: Date;
}

export interface IorderDes {
  description: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: false,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      required: false,
      default: "pending",
    },

    isApplied: {
      type: Boolean,
      default: false,
      required: false,
    },
    razorpayOrderId: {
      type: String,
      required: false,
    },
    razorpayPaymentId: {
      type: String,
      required: false,
    },
    razorpaySignature: {
      type: String,
      required: false,
    },
    couponCode: {
      type: String,
      required: false,
    },
    couponDiscount: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>("Order", OrderSchema);
export default Order;
