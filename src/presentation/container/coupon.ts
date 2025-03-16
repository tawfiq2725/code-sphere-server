import { CouponRepository } from "../../infrastructure/repositories/CouponRepository";
import { createCouponUsecase } from "../../application/usecases/Coupons";
import { updateCouponUsecase } from "../../application/usecases/Coupons";
import { toggleCouponUsecase } from "../../application/usecases/Coupons";
import { deleteCouponUsecase } from "../../application/usecases/Coupons";
import { getAllCouponsUsecase } from "../../application/usecases/Coupons";
import { CouponCtrl } from "../controllers/couponCtrl";

const couponRepo = new CouponRepository();
const create = new createCouponUsecase(couponRepo);
const update = new updateCouponUsecase(couponRepo);
const toggle = new toggleCouponUsecase(couponRepo);
const deltee = new deleteCouponUsecase(couponRepo);
const getall = new getAllCouponsUsecase(couponRepo);

export const couponCtrlDI = new CouponCtrl(
  create,
  update,
  getall,
  toggle,
  deltee
);
