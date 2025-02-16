import { Types } from "mongoose";

export class Membership {
  constructor(
    public membershipId: string,
    public membershipName: string,
    public membershipDescription: string[],
    public price: number,
    public label: string,
    public status: boolean,
    public duration: number
  ) {}
}
