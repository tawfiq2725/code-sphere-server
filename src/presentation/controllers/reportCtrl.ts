import { Request, Response } from "express";
import {
  DashboardUseCase,
  EnrollCourseUseCase,
  membershipReportUsecase,
  ReportsUseCase,
  RevenueUseCase,
  topTutorsUsecase,
} from "../../application/usecases/Reports";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

export class ReportController {
  constructor(
    private reportUsecase: ReportsUseCase,
    private dashboardUsecase: DashboardUseCase,
    private enrollUsecase: EnrollCourseUseCase,
    private memberhsipUsecase: membershipReportUsecase,
    private revenueUsecase: RevenueUseCase,
    private toptutorUsecase: topTutorsUsecase
  ) {}
  public async getReportsOrders(req: Request, res: Response): Promise<void> {
    try {
      let { startDate, endDate } = req.query;

      if (Array.isArray(startDate)) startDate = startDate[0];
      if (Array.isArray(endDate)) endDate = endDate[0];

      if (typeof startDate !== "string" || typeof endDate !== "string") {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid date format",
          false
        );
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid date provided",
          false
        );
        return;
      }
      const orders = await this.reportUsecase.execute(start, end);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Reports fetched successfully",
        true,
        orders
      );
    } catch (err: any) {
      console.log(err);
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An error occurred",
        false
      );
    }
  }
  public async getReportsMembersOrders(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      let { startDate, endDate } = req.query;

      if (Array.isArray(startDate)) startDate = startDate[0];
      if (Array.isArray(endDate)) endDate = endDate[0];

      if (typeof startDate !== "string" || typeof endDate !== "string") {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid date format",
          false
        );
        return;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Invalid date provided",
          false
        );
        return;
      }

      const orders = await this.memberhsipUsecase.execute(start, end);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Reports fetched successfully",
        true,
        orders
      );
    } catch (err: any) {
      console.log(err);
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An error occurred",
        false
      );
    }
  }
  public async getRevenueData(req: Request, res: Response): Promise<void> {
    try {
      const { filter } = req.query;

      if (!filter) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Filter is required",
          false
        );
        return;
      }

      const revenue = await this.revenueUsecase.execute(filter);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Revenue fetched successfully",
        true,
        revenue
      );
    } catch (err) {
      console.log(err);
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An error occurred",
        false
      );
    }
  }
  public async getCourseEnrollments(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const enrollments = await this.enrollUsecase.execute();
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Reports fetched successfully",
        true,
        enrollments
      );
    } catch (error) {
      console.error("Error fetching course enrollments:", error);
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An error occurred",
        false
      );
    }
  }

  public async getToptutors(req: Request, res: Response): Promise<void> {
    try {
      const tutors = await this.toptutorUsecase.execute();
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Reports fetched successfully",
        true,
        tutors
      );
    } catch (error: any) {
      console.error("Error fetching top tutors:", error);
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An error occurred",
        false
      );
    }
  }

  public async adminDashboards(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.dashboardUsecase.execute();
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Reports fetched successfully",
        true,
        orders
      );
    } catch (err) {
      console.log(err);
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "An error occurred",
        false
      );
    }
  }
}
