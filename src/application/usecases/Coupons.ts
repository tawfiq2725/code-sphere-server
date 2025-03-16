import { Coupons } from "../../domain/entities/Coupons";
import { CouponInterface } from "../../domain/interface/Coupon";
import { IUsedBy } from "../../infrastructure/database/CouponSchema";

export class createCouponUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(coupon: Coupons): Promise<Coupons> {
    try {
      const { couponCode } = coupon;

      let existingCoupon = await this.couponRepository.isCouponNameExists(
        couponCode
      );
      if (existingCoupon) {
        throw new Error("Coupon code already exists");
      }

      return await this.couponRepository.create(coupon);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async exeVerify(couponCode: string, userId: string): Promise<Coupons> {
    try {
      if (!couponCode || !userId) {
        throw new Error("All fields are requried");
      }
      let coupon = await this.couponRepository.findCouponByCouponCode(
        couponCode
      );
      if (!coupon) {
        throw new Error("Coupon not found");
      }
      const couponCheck = await this.couponRepository.checkAlreayused(
        userId,
        couponCode
      );
      if (couponCheck) {
        throw new Error("Coupon Already Used");
      }
      const usageData: IUsedBy = { count: 1, userId };
      if (coupon && coupon._id) {
        const updatedCoupon = await this.couponRepository.applyCouponUsage(
          coupon._id,
          usageData
        );
        if (!updatedCoupon) {
          throw new Error("Failed to apply coupon usage");
        }
        coupon = updatedCoupon;
      }
      return coupon;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class updateCouponUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(
    id: string,
    coupon: Partial<Coupons>
  ): Promise<Coupons | null> {
    try {
      if (!id) {
        throw new Error("Missing id");
      }
      return await this.couponRepository.updateCoupon(id, coupon);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class getAllCouponsUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(): Promise<Coupons[]> {
    try {
      return await this.couponRepository.getAllCoupons();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class toggleCouponUsecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(id: string): Promise<Coupons | null> {
    try {
      if (!id) {
        throw new Error("Missing id");
      }
      return await this.couponRepository.toggleCoupon(id);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class updateCouponUsedByusecase {
  constructor(private couponRepository: CouponInterface) {}

  public async execute(
    id: string,
    coupon: Partial<Coupons>
  ): Promise<Coupons | null> {
    try {
      if (!id) {
        throw new Error("Missing id");
      }
      return await this.couponRepository.updateCoupon(id, coupon);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class deleteCouponUsecase {
  constructor(private couponRepository: CouponInterface) {}
  public async execute(id: string): Promise<Coupons> {
    try {
      if (!id) {
        throw new Error("Missing id");
      }
      return await this.couponRepository.deleteCoupon(id);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
