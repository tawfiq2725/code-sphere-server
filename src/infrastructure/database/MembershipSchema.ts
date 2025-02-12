import { Schema, Document, Types, ObjectId, model } from "mongoose";
interface MembershipInterface extends Document {
  membershipId: string;
  membershipName: string;
  membershipDescription: string[];
  price: number;
  label: string;
  status: boolean;
  userId?: ObjectId;
  categoryId?: ObjectId;
  membershipStatus?: "active" | "inactive";
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  transactionId?: string;
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
      type: [String],
      required: true,
    },

    price: {
      type: Number,
      required: false,
    },
    label: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    userId: {
      type: Types.ObjectId,
      required: false,
      ref: "User",
    },
    categoryId: {
      type: Types.ObjectId,
      required: false,
      ref: "Category",
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
    transactionId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Memebership = model<MembershipInterface>("Membership", MembershipSchema);

export default Memebership;
