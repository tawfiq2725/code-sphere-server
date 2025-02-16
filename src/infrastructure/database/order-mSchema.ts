import { ObjectId, model, Schema, Document, Types } from "mongoose";
export interface IMembershipOrder extends Document {
  membershipOrderId: string;
  membershipId: ObjectId;
  userId?: ObjectId;
  categoryId?: ObjectId;
  totalAmount: number;
  orderStatus?: "pending" | "success" | "failed";
  paymentStatus?: "pending" | "success" | "failed";
  membershipStatus?: "active" | "inactive";
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
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
      type: Types.ObjectId,
      required: true,
      ref: "Category",
    },
    totalAmount: {
      type: Number,
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
    membershipStatus: {
      type: String,
      enum: ["active", "inactive"],
      required: false,
    },
    membershipStartDate: {
      type: Date,
      required: false,
    },
    membershipEndDate: {
      type: Date,
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
  },
  { timestamps: true }
);

const MembershipOrder = model<IMembershipOrder>(
  "MembershipOrder",
  MembershipOrderSchema
);
export default MembershipOrder;
