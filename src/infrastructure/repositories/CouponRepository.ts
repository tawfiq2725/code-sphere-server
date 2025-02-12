import CouponS from "../database/CouponSchema";
import { Coupons } from "../../domain/entities/Coupons";
import { CouponInterface } from "../../domain/interface/Coupon";

export class CouponRepository implements CouponInterface {
  public async create(coupon: Coupons): Promise<Coupons> {
    console.log("creating coupon", coupon);
    const couponDetails = (await CouponS.create(coupon)) as Coupons;
    console.log("creating coupon successfully", couponDetails);
    return couponDetails;
  }

  public async updateCoupon(
    id: string,
    coupon: Partial<Coupons>
  ): Promise<Coupons | null> {
    return await CouponS.findOneAndUpdate({ _id: id }, coupon, {
      new: true,
    });
  }

  public async getAllCoupons(): Promise<Coupons[]> {
    return await CouponS.find();
  }

  public async toggleCoupon(id: string): Promise<Coupons | null> {
    const coupon = await CouponS.findById(id);
    if (!coupon) {
      return null;
    }
    coupon.couponStatus = !coupon.couponStatus;
    await coupon.save();
    return coupon.toObject() as Coupons;
  }

  public async isCouponNameExists(code: string): Promise<boolean> {
    return (await CouponS.exists({ couponCode: code })) !== null;
  }
}
