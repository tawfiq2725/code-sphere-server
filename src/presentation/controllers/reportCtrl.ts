import { Request, Response } from "express";
import {
  DashboardUseCase,
  EnrollCourseUseCase,
  ReportsUseCase,
  RevenueUseCase,
  topTutorsUsecase,
} from "../../application/usecases/Reports";
import { ReportsRepository } from "../../infrastructure/repositories/ReportsRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

export const getReportsOrders = async (req: Request, res: Response) => {
  try {
    let { startDate, endDate } = req.query;

    // If startDate or endDate is an array, pick the first element
    if (Array.isArray(startDate)) startDate = startDate[0];
    if (Array.isArray(endDate)) endDate = endDate[0];

    if (typeof startDate !== "string" || typeof endDate !== "string") {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid date format",
        false
      );
    }

    // Validate the dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Invalid date provided",
        false
      );
    }
    const orderRepo = new ReportsRepository();
    const orderUsecase = new ReportsUseCase(orderRepo);
    const orders = await orderUsecase.execute(start, end);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Reports fetched successfully",
      true,
      orders
    );
  } catch (err: any) {
    console.log(err);
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred",
      false
    );
  }
};

export const getRevenueData = async (req: Request, res: Response) => {
  try {
    const { filter } = req.query;

    if (!filter) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Filter is required",
        false
      );
    }

    const orderRepo = new ReportsRepository();
    const orderUsecase = new RevenueUseCase(orderRepo);
    const revenue = await orderUsecase.execute(filter);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Revenue fetched successfully",
      true,
      revenue
    );
  } catch (err) {
    console.log(err);
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred",
      false
    );
  }
};

export const getCourseEnrollments = async (req: Request, res: Response) => {
  try {
    const orderRepo = new ReportsRepository();
    const orderUsecase = new EnrollCourseUseCase(orderRepo);
    const enrollments = await orderUsecase.execute();
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Reports fetched successfully",
      true,
      enrollments
    );
  } catch (error) {
    console.error("Error fetching course enrollments:", error);
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred",
      false
    );
  }
};

export const getToptutors = async (req: Request, res: Response) => {
  try {
    const orderRepo = new ReportsRepository();
    const orderUsecase = new topTutorsUsecase(orderRepo);
    const tutors = await orderUsecase.execute();
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Reports fetched successfully",
      true,
      tutors
    );
  } catch (error: any) {
    console.error("Error fetching top tutors:", error);
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred",
      false
    );
  }
};
export const getReportsMembershipb = async (req: Request, res: Response) => {};
export const getOverallReports = async (req: Request, res: Response) => {};
export const adminDashboards = async (req: Request, res: Response) => {
  try {
    const orderRepo = new ReportsRepository();
    const orderUsecase = new DashboardUseCase(orderRepo);
    const orders = await orderUsecase.execute();
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Reports fetched successfully",
      true,
      orders
    );
  } catch (err) {
    console.log(err);
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred",
      false
    );
  }
};
export const tutorDashboards = async (req: Request, res: Response) => {};
export const topCourses = async (req: Request, res: Response) => {};
export const topTutors = async (req: Request, res: Response) => {};
