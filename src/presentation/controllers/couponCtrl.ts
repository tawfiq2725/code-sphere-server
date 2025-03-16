import {
  createCouponUsecase,
  updateCouponUsecase,
  getAllCouponsUsecase,
  toggleCouponUsecase,
  deleteCouponUsecase,
} from "../../application/usecases/Coupons";
import { Request, Response } from "express";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { CouponRepository } from "../../infrastructure/repositories/CouponRepository";
import { format } from "date-fns";

export class CouponCtrl {
  constructor(
    private create: createCouponUsecase,
    private update: updateCouponUsecase,
    private getall: getAllCouponsUsecase,
    private toggle: toggleCouponUsecase,
    private deltee: deleteCouponUsecase
  ) {}

  public async createCoupon(req: Request, res: Response): Promise<void> {
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

      const coupon = await this.create.execute(newData);

      const formattedCoupon = {
        ...coupon,
        startDate: format(new Date(coupon.startDate), "dd-MM-yyyy"),
        expireAt: format(new Date(coupon.expireAt), "dd-MM-yyyy"),
      };

      sendResponseJson(
        res,
        HttpStatus.OK,
        "Coupon Created",
        true,
        formattedCoupon
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        error.message,
        false,
        error
      );
    }
  }

  public async updateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const coupon = req.body;

      const updatedCoupon = await this.update.execute(id, coupon);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Coupon Updated",
        true,
        updatedCoupon
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        error.message,
        false,
        error
      );
    }
  }

  public async getAllCoupons(req: Request, res: Response): Promise<void> {
    try {
      const coupons = await this.getall.execute();
      sendResponseJson(res, HttpStatus.OK, "Coupons", true, coupons);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        error.message,
        false,
        error
      );
    }
  }

  public async toggleCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const coupon = await this.toggle.execute(id);
      sendResponseJson(res, HttpStatus.OK, "Coupon Toggled", true, coupon);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        error.message,
        false,
        error
      );
    }
  }

  public async deleteCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const coupon = await this.deltee.execute(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Coupon Deleted Successfully",
        true,
        coupon
      );
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }
}
