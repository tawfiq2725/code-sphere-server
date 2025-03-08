import { Schema, Document, model } from "mongoose";

export interface MembershipInterface extends Document {
  membershipId: string;
  membershipName: string;
  membershipDescription: string;
  membershipPlan: "Basic" | "Standard" | "Premium";
  price: number;
  label: string;
  status: boolean;
}

const MembershipSchema = new Schema<MembershipInterface>(
  {
    membershipId: {
      type: String,
      required: true,
    },
    membershipName: {
      type: String,
      required: true,
    },
    membershipDescription: {
      type: String,
      required: true,
    },
    membershipPlan: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      required: true,
    },
    price: {
      type: Number,
    },
    label: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Membership = model<MembershipInterface>("Membership", MembershipSchema);
export default Membership;
