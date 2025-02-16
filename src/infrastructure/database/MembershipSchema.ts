import { Schema, Document, Types, ObjectId, model } from "mongoose";
interface MembershipInterface extends Document {
  membershipId: string;
  membershipName: string;
  membershipDescription: string[];
  price: number;
  label: string;
  status: boolean;
  duration: number;
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
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Memebership = model<MembershipInterface>("Membership", MembershipSchema);
export default Memebership;
