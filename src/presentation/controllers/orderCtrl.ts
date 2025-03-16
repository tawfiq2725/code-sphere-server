import { Request, Response } from "express";
import { razorPayInstance } from "../../config/paymentInstance";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import crypto from "crypto";
import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import {
  createOrderuseCase,
  getOrderByIduseCase,
  verifyOrderuseCase,
} from "../../application/usecases/CreateOrder";
import {
  enrollMembership,
  enrollUserInCourse,
} from "../../application/services/enrollCourse";
import {
  MembershipOrderUsecase,
  verifyOrderMembershipUsecase,
} from "../../application/usecases/MembershipUsecase";

export class OrderCtrl {
  constructor(
    private createOrderuse: createOrderuseCase,
    private verifyOrderuse: verifyOrderuseCase,
    private getOrderuse: getOrderByIduseCase,
    private membershipCreateUsecase: MembershipOrderUsecase,
    private verifyMembershipUsecase: verifyOrderMembershipUsecase
  ) {}

  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const {
        amount,
        currency,
        userId,
        courseId,
        isApplied,
        couponCode,
        couponDiscount,
      } = req.body;
      const options = {
        amount: amount * 100,
        currency: currency,
        receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
        payment_capture: 1,
      };
      const generateOrderId = `ORDER${Date.now()
        .toString()
        .slice(-5)}${Math.floor(Math.random() * 10)}`;

      const orderData = {
        orderId: generateOrderId,
        userId,
        courseId,
        totalAmount: amount,
        currency,
        paymentStatus: "failed" as "failed",
        orderStatus: "failed" as "failed",
        isApplied,
        couponCode,
        couponDiscount,
      };
      await this.createOrderuse.execute(orderData);
      const order = await razorPayInstance.orders.create(options);
      sendResponseJson(res, HttpStatus.OK, "Order Initiated", true, {
        order,
        orderId: generateOrderId,
      });
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
  public async verifyOrder(req: Request, res: Response): Promise<void> {
    try {
      const { data: razorpayData, orderId, courseDetails: details } = req.body;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        razorpayData;
      const { courseId, userId } = details;
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !orderId
      ) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid Request",
          false,
          null
        );
        return;
      }
      const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
      const hmac = crypto.createHmac("sha256", key_secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest("hex");
      if (generated_signature === razorpay_signature) {
        const orderData = {
          orderId,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: "success" as "success",
          orderStatus: "success" as "success",
        };

        await this.verifyOrderuse.execute(orderData);
        await enrollUserInCourse(userId, courseId);
        sendResponseJson(
          res,
          HttpStatus.OK,
          "Payment Success Your Successfully Purchased the Course",
          true,
          orderId
        );
      } else {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Payment Failed",
          false,
          null
        );
      }
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
  public async getOrderByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const orders = await this.getOrderuse.execute(userId);
      sendResponseJson(res, HttpStatus.OK, "Orders", true, orders);
    } catch (error) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Internal Server Error",
        false,
        error
      );
    }
  }
  public async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.getOrderuse.execGetall();
      sendResponseJson(res, HttpStatus.OK, "Orders", true, orders);
    } catch (error) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Internal Server Error",
        false,
        error
      );
    }
  }
  public async createMembershipOrder(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const {
        amount,
        currency,
        userId,
        membershipId,
        categoryId,
        membershipPlan,
      } = req.body;

      const options = {
        amount: amount * 100,
        currency: currency,
        receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
        payment_capture: 1,
      };

      const generateOrderId = `MEMBER${Date.now()
        .toString()
        .slice(-5)}${Math.floor(Math.random() * 10)}`;

      const orderData = {
        membershipOrderId: generateOrderId,
        membershipId,
        userId,
        categoryId,
        membershipPlan,
        totalAmount: amount,
        paymentStatus: "pending" as "pending",
        orderStatus: "pending" as "pending",
      };
      await this.membershipCreateUsecase.execute(orderData);
      const order = await razorPayInstance.orders.create(options);
      sendResponseJson(res, HttpStatus.OK, "Order Initiated", true, {
        order,
        orderId: orderData.membershipOrderId,
      });
    } catch (error) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Order Failed",
        false,
        error
      );
    }
  }
  public async verifyMembershipOrder(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { data: razorpayData, orderId, courseDetails: details } = req.body;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        razorpayData;
      const { membershipId, userId, categoryId } = details;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid Request",
          false,
          null
        );
        return;
      }
      const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
      const hmac = crypto.createHmac("sha256", key_secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest("hex");
      if (generated_signature === razorpay_signature) {
        const orderData = {
          membershipOrderId: orderId,
          paymentStatus: "success" as "success",
          orderStatus: "success" as "success",
          membershipStatus: "active" as "active",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        };
        await this.verifyMembershipUsecase.execute(orderData);
        await enrollMembership(userId, membershipId, categoryId);
        sendResponseJson(
          res,
          HttpStatus.OK,
          "Payment Success Your Successfully Purchased the Membership",
          true,
          orderId
        );
      } else {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Payment Failed",
          false,
          null
        );
      }
    } catch (error) {
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Internal Server Error",
        false,
        error
      );
    }
  }
  public async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderRepo = new OrderRepository();
      const { id } = req.params;
      const order = await orderRepo.findOrderById(id);
      if (!order) {
        sendResponseJson(res, HttpStatus.NOT_FOUND, "Order not found", false);
        return;
      }
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Order retrieved successfully",
        true,
        order
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
}
