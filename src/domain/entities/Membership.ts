import { Types } from "mongoose";

export class Membership {
  constructor(
    public membershipId: string,
    public membershipName: string,
    public membershipDescription: string[],
    public price: number,
    public label: string,
    public status: boolean,
    public userId?: Types.ObjectId | string,
    public categoryId?: Types.ObjectId | string,
    public membershipStatus?: "active" | "inactive",
    public membershipStartDate?: Date,
    public membershipEndDate?: Date,
    public transactionId?: string
  ) {}
}
