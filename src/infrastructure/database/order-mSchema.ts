import { ObjectId, model, Schema, Document, Types } from "mongoose";

export interface IMembershipOrder extends Document {
  membershipOrderId: string;
  membershipId: ObjectId;
  userId?: ObjectId;
  categoryId?: ObjectId[];
  membershipPlan: "Basic" | "Standard" | "Premium";
  totalAmount: number;
  orderStatus?: "pending" | "success" | "failed";
  paymentStatus?: "pending" | "success" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt?: string;
}

const MembershipOrderSchema = new Schema<IMembershipOrder>(
  {
    membershipOrderId: {
      type: String,
      required: true,
    },
    membershipId: {
      type: Types.ObjectId,
      required: true,
      ref: "Membership",
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    categoryId: {
      type: [Types.ObjectId],
      required: true,
      ref: "Category",
    },
    membershipPlan: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true }
);

const MembershipOrder = model<IMembershipOrder>(
  "MembershipOrder",
  MembershipOrderSchema
);
export default MembershipOrder;
