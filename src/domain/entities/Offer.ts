import { Types } from "mongoose";

// src/entities/offer.ts
export class Offer {
  constructor(
    public offerName: string,
    public discount: number,
    public categoryId: string,
    public startsFrom: Date,
    public endsFrom: Date,
    public status: boolean
  ) {}
}
