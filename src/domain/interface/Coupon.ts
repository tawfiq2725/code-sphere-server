import { IUsedBy } from "../../infrastructure/database/CouponSchema";
import { Coupons } from "../entities/Coupons";

export interface CouponInterface {
  create(coupon: Coupons): Promise<Coupons>;
  updateCoupon(id: string, coupon: Partial<Coupons>): Promise<Coupons | null>;
  getAllCoupons(): Promise<Coupons[]>;
  toggleCoupon(id: string): Promise<Coupons | null>;
  findCouponByCouponCode(couponCode: string): Promise<Coupons | null>;
  applyCouponUsage(id: string, usage: IUsedBy): Promise<Coupons | null>;
  isCouponNameExists(code: string): Promise<Boolean>;
  deleteCoupon(id: string): Promise<any>;
  checkAlreayused(couponCode: string, userId: string): Promise<boolean>;
}
