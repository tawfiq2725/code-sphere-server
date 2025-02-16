import { Coupons } from "../../domain/entities/Coupons";
import { CouponInterface } from "../../domain/interface/Coupon";

export class createCouponUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(coupon: Coupons): Promise<Coupons> {
    const { couponCode } = coupon;

    let existingCoupon = await this.couponRepository.isCouponNameExists(
      couponCode
    );
    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    return await this.couponRepository.create(coupon);
  }
}

export class updateCouponUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(
    id: string,
    coupon: Partial<Coupons>
  ): Promise<Coupons | null> {
    if (!id) {
      throw new Error("Missing id");
    }
    return await this.couponRepository.updateCoupon(id, coupon);
  }
}

export class getAllCouponsUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(): Promise<Coupons[]> {
    return await this.couponRepository.getAllCoupons();
  }
}

export class toggleCouponUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(id: string): Promise<Coupons | null> {
    if (!id) {
      throw new Error("Missing id");
    }
    return await this.couponRepository.toggleCoupon(id);
  }
}

export class updateCouponUsedByusecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(
    id: string,
    coupon: Partial<Coupons>
  ): Promise<Coupons | null> {
    if (!id) {
      throw new Error("Missing id");
    }
    return await this.couponRepository.updateCoupon(id, coupon);
  }
}
