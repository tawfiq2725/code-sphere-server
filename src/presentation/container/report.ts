import {
  DashboardUseCase,
  EnrollCourseUseCase,
  membershipReportUsecase,
  ReportsUseCase,
  RevenueUseCase,
  topTutorsUsecase,
} from "../../application/usecases/Reports";
import { ReportsRepository } from "../../infrastructure/repositories/ReportsRepository";
import { ReportController } from "../controllers/reportCtrl";

const ReportRepo = new ReportsRepository();
const reportUsecase = new ReportsUseCase(ReportRepo);
const dashboardUsecase = new DashboardUseCase(ReportRepo);
const enrollUsecase = new EnrollCourseUseCase(ReportRepo);
const memberhsipUsecase = new membershipReportUsecase(ReportRepo);
const revenueUsecase = new RevenueUseCase(ReportRepo);
const topTutorUsecase = new topTutorsUsecase(ReportRepo);

export const reportCtrlDI = new ReportController(
  reportUsecase,
  dashboardUsecase,
  enrollUsecase,
  memberhsipUsecase,
  revenueUsecase,
  topTutorUsecase
);
