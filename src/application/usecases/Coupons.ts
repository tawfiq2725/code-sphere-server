import { Coupons } from "../../domain/entities/Coupons";
import { CouponInterface } from "../../domain/interface/Coupon";

export class createCouponUsecase {
  constructor(private couponInterface: CouponInterface) {}

  public async execute(coupon: Coupons): Promise<Coupons> {
    const { couponCode, couponDiscount, startDate, expireAt } = coupon;

    let existingCoupon = await this.couponInterface.isCouponNameExists(
      couponCode
    );
    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }
    if (startDate && expireAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(startDate);
      const end = new Date(expireAt);

      if (start.getTime() < today.getTime()) {
        throw new Error("Start date cannot be in the past");
      }

      if (end.getTime() < start.getTime()) {
        throw new Error("Expiry date must be after start date");
      }

      if (end.getTime() < today.getTime()) {
        throw new Error("Expiry date cannot be in the past");
      }
    }

    if (couponDiscount < 0 || couponDiscount > 100) {
      throw new Error("Discount must be between 0 and 100");
    }

    return await this.couponInterface.create(coupon);
  }
}

export class updateCouponUsecase {
  constructor(private couponInterface: CouponInterface) {}

  public async execute(
    id: string,
    coupon: Partial<Coupons>
  ): Promise<Coupons | null> {
    if (!id) {
      throw new Error("Missing id");
    }
    return await this.couponInterface.updateCoupon(id, coupon);
  }
}

export class getAllCouponsUsecase {
  constructor(private couponInterface: CouponInterface) {}

  public async execute(): Promise<Coupons[]> {
    return await this.couponInterface.getAllCoupons();
  }
}

export class toggleCouponUsecase {
  constructor(private couponInterface: CouponInterface) {}

  public async execute(id: string): Promise<Coupons | null> {
    if (!id) {
      throw new Error("Missing id");
    }
    return await this.couponInterface.toggleCoupon(id);
  }
}
