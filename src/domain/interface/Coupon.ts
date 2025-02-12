import { Coupons } from "../entities/Coupons";

export interface CouponInterface {
  create(coupon: Coupons): Promise<Coupons>;
  updateCoupon(id: string, coupon: Partial<Coupons>): Promise<Coupons | null>;
  getAllCoupons(): Promise<Coupons[]>;
  toggleCoupon(id: string): Promise<Coupons | null>;
  isCouponNameExists(code: string): Promise<Boolean>;
}
