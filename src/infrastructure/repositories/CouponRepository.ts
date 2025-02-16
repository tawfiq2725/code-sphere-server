import { Model } from "mongoose";
import CouponS from "../database/CouponSchema";
import { Coupons } from "../../domain/entities/Coupons";
import { ICoupon, IUsedBy } from "../database/CouponSchema";

export class CouponRepository {
  private convertToCoupons(coupon: ICoupon | null): Coupons | null {
    if (!coupon) return null;
    return new Coupons(
      coupon.couponName,
      coupon.couponCode,
      coupon.couponDiscount,
      coupon.startDate,
      coupon.expireAt,
      coupon.couponStatus,
      coupon._id,
      coupon.usedBy
    );
  }

  public async create(coupon: Omit<Coupons, "_id">): Promise<Coupons> {
    const couponDoc = await CouponS.create(coupon);
    return this.convertToCoupons(couponDoc.toObject())!;
  }

  public async updateCoupon(
    id: string,
    coupon: Partial<Coupons>
  ): Promise<Coupons | null> {
    const updated = await CouponS.findOneAndUpdate({ _id: id }, coupon, {
      new: true,
    });
    return this.convertToCoupons(updated?.toObject() || null);
  }

  public async getAllCoupons(): Promise<Coupons[]> {
    const coupons = await CouponS.find();
    return coupons.map((coupon) => this.convertToCoupons(coupon.toObject())!);
  }

  public async toggleCoupon(id: string): Promise<Coupons | null> {
    const coupon = await CouponS.findById(id);
    if (!coupon) return null;

    coupon.couponStatus = !coupon.couponStatus;
    await coupon.save();
    return this.convertToCoupons(coupon.toObject());
  }

  public async findCouponByCouponCode(
    couponCode: string
  ): Promise<Coupons | null> {
    const coupon = await CouponS.findOne({ couponCode });
    return this.convertToCoupons(coupon?.toObject() || null);
  }

  public async applyCouponUsage(
    couponId: string,
    usageData: IUsedBy
  ): Promise<Coupons | null> {
    const updated = await CouponS.findByIdAndUpdate(
      couponId,
      { $push: { usedBy: usageData } },
      { new: true }
    );
    return this.convertToCoupons(updated?.toObject() || null);
  }

  public async isCouponNameExists(couponCode: string): Promise<boolean> {
    const coupon = await CouponS.findOne({ couponCode });
    return !!coupon;
  }
}
