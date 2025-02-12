import {
  createCouponUsecase,
  updateCouponUsecase,
  getAllCouponsUsecase,
  toggleCouponUsecase,
} from "../../application/usecases/Coupons";
import { Request, Response } from "express";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { CouponRepository } from "../../infrastructure/repositories/CouponRepository";
import { format } from "date-fns";

export const createCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { couponName, couponCode, couponDiscount, expireAt } = req.body;
    const expirationDate = new Date(expireAt);

    const newData = {
      couponName,
      couponCode,
      couponDiscount,
      startDate: new Date(),
      expireAt: expirationDate,
      couponStatus: true,
    };

    const couponRepo = new CouponRepository();
    const couponUseCase = new createCouponUsecase(couponRepo);
    const coupon = await couponUseCase.execute(newData);

    const formattedCoupon = {
      ...coupon,
      startDate: format(new Date(coupon.startDate), "dd-MM-yyyy"),
      expireAt: format(new Date(coupon.expireAt), "dd-MM-yyyy"),
    };

    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Coupon Created",
      true,
      formattedCoupon
    );
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Internal Server Error",
      false,
      error
    );
  }
};

export const updateCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const coupon = req.body;
    const couponRepo = new CouponRepository();
    const couponUseCase = new updateCouponUsecase(couponRepo);
    const updatedCoupon = await couponUseCase.execute(id, coupon);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Coupon Updated",
      true,
      updatedCoupon
    );
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Internal Server Error",
      false,
      error
    );
  }
};

export const getAllCoupons = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const couponRepo = new CouponRepository();
    const couponUseCase = new getAllCouponsUsecase(couponRepo);
    const coupons = await couponUseCase.execute();
    return sendResponseJson(res, HttpStatus.OK, "Coupons", true, coupons);
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Internal Server Error",
      false,
      error
    );
  }
};

export const toggleCoupon = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const couponRepo = new CouponRepository();
    const couponUseCase = new toggleCouponUsecase(couponRepo);
    const coupon = await couponUseCase.execute(id);
    return sendResponseJson(res, HttpStatus.OK, "Coupon Toggled", true, coupon);
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Internal Server Error",
      false,
      error
    );
  }
};
