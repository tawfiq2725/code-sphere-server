import { Types } from "mongoose";
export class MembershipOrder {
  constructor(
    public membershipOrderId: string,
    public membershipId: Types.ObjectId,
    public userId: Types.ObjectId,
    public categoryId: Types.ObjectId,
    public totalAmount: number,
    public orderStatus?: "pending" | "success" | "failed",
    public paymentStatus?: "pending" | "success" | "failed",
    public membershipStatus?: "active" | "inactive",
    public membershipStartDate?: Date,
    public membershipEndDate?: Date,
    public razorpayOrderId?: string,
    public razorpayPaymentId?: string,
    public razorpaySignature?: string
  ) {}
}
