export class Coupons {
  constructor(
    public couponName: string,
    public couponCode: string,
    public couponDiscount: number,
    public startDate: Date,
    public expireAt: Date,
    public couponStatus: boolean,
    public usedBy?: string
  ) {}
}
