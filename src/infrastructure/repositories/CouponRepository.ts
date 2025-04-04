import CouponS from "../database/CouponSchema";
import { Coupons } from "../../domain/entities/Coupons";
import { ICoupon, IUsedBy } from "../database/CouponSchema";
import Order from "../database/orderSchema";

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
    try {
      const coupon = await CouponS.findOne({ couponCode });
      return this.convertToCoupons(coupon?.toObject() || null);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async applyCouponUsage(
    couponId: string,
    usageData: IUsedBy
  ): Promise<Coupons | null> {
    try {
      const updated = await CouponS.findByIdAndUpdate(
        couponId,
        { $push: { usedBy: usageData } },
        { new: true }
      );
      return this.convertToCoupons(updated?.toObject() || null);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async isCouponNameExists(couponCode: string): Promise<boolean> {
    try {
      const coupon = await CouponS.findOne({ couponCode });
      return !!coupon;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async deleteCoupon(id: string): Promise<Coupons | null> {
    try {
      const deleted = await CouponS.findByIdAndDelete(id);
      return this.convertToCoupons(deleted?.toObject() || null);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async checkAlreayused(
    userId: string,
    couponId: string
  ): Promise<boolean> {
    try {
      const find = await Order.findOne({ userId, couponCode: couponId });
      return !!find;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  }
}
