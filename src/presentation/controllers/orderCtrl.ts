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
import { MembershipOrderRepository } from "../../infrastructure/repositories/MembershipOrder";
import { MembershipRepository } from "../../infrastructure/repositories/MembershipRepository";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    console.log(req.body, "check roshan data");
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
      paymentStatus: "pending" as "pending",
      orderStatus: "pending" as "pending",
      isApplied,
      couponCode,
      couponDiscount,
    };
    const orderRepo = new OrderRepository();

    const orderUsecase = new createOrderuseCase(orderRepo);
    await orderUsecase.execute(orderData);
    console.log("finshed");
    const order = await razorPayInstance.orders.create(options);
    return sendResponseJson(res, HttpStatus.OK, "Order Initiated", true, {
      order,
      orderId: generateOrderId,
    });
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Order Failed",
      false,
      error
    );
  }
};
export const verifyOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("starting ---------------1");
    const { data: razorpayData, orderId, courseDetails: details } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      razorpayData;
    const { courseId, userId } = details;
    console.log(courseId, userId);
    console.log("starting ---------------2");
    console.log(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    );
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid Request",
        false,
        null
      );
    }
    console.log("starting ---------------3");

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
    console.log("starting ---------------4");
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");
    console.log("starting ---------------5");
    if (generated_signature === razorpay_signature) {
      console.log("starting ---------------6");
      const orderData = {
        orderId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "success" as "success",
        orderStatus: "success" as "success",
      };
      console.log("starting ---------------7");
      const orderRepo = new OrderRepository();
      const verifyOrderUsecase = new verifyOrderuseCase(orderRepo);
      await verifyOrderUsecase.execute(orderData);
      console.log("starting -------------- done ");
      await enrollUserInCourse(userId, courseId);
      return sendResponseJson(
        res,
        HttpStatus.OK,
        "Payment Success Your Successfully Purchased the Course",
        true,
        orderId
      );
    } else {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Payment Failed",
        false,
        null
      );
    }
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

export const getOrderByUserId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params;
    const orderRepo = new OrderRepository();
    const orderUseCase = new getOrderByIduseCase(orderRepo);
    const orders = await orderUseCase.execute(userId);
    return sendResponseJson(res, HttpStatus.OK, "Orders", true, orders);
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

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const orderRepo = new OrderRepository();
    const orders = await orderRepo.getAllOrders();
    return sendResponseJson(res, HttpStatus.OK, "Orders", true, orders);
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

export const createMembershipOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { amount, currency, userId, membershipId, categoryId } = req.body;
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
      totalAmount: amount,
      paymentStatus: "pending" as "pending",
      orderStatus: "pending" as "pending",
    };
    const orderRepo = new MembershipOrderRepository();

    const orderUsecase = new MembershipOrderUsecase(orderRepo);
    await orderUsecase.execute(orderData);
    console.log("finshed");
    const order = await razorPayInstance.orders.create(options);
    return sendResponseJson(res, HttpStatus.OK, "Order Initiated", true, {
      order,
      orderId: orderData.membershipOrderId,
    });
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Order Failed",
      false,
      error
    );
  }
};

export const verifyMembershipOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { data: razorpayData, orderId, courseDetails: details } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      razorpayData;
    console.log(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    );
    const { membershipId, userId, categoryId } = details;
    console.log(membershipId, userId, categoryId, "whole data");
    const repo = new MembershipRepository();
    const membership = await repo.findMembershipByIdV2(membershipId);
    console.log(membership, "membership details----------------------");
    const timeline = membership?.duration || 0;
    console.log(timeline, "membership timeline durations");
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + timeline);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid Request",
        false,
        null
      );
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
        membershipStartDate: startDate,
        membershipEndDate: endDate,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      };
      const orderRepo = new MembershipOrderRepository();
      const verifyOrderUsecase = new verifyOrderMembershipUsecase(orderRepo);
      await verifyOrderUsecase.execute(orderData);
      await enrollMembership(userId, membershipId, categoryId);
      return sendResponseJson(
        res,
        HttpStatus.OK,
        "Payment Success Your Successfully Purchased the Membership",
        true,
        orderId
      );
    } else {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Payment Failed",
        false,
        null
      );
    }
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

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderRepo = new OrderRepository();
    const { id } = req.params;
    const order = await orderRepo.findOrderById(id);
    if (!order) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Order not found",
        false
      );
    }
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Order retrieved successfully",
      true,
      order
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
