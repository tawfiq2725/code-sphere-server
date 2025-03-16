import express from "express";
import { verifyToken } from "../../presentation/middleware/auth";
import { reportCtrlDI } from "../../presentation/container/report";
const router = express.Router();
router.use(verifyToken(["admin", "tutor"]));
router.get(
  "/get-reports/orders",
  reportCtrlDI.getReportsOrders.bind(reportCtrlDI)
);
router.get(
  "/get-reports/member/orders",
  reportCtrlDI.getReportsMembersOrders.bind(reportCtrlDI)
);
router.get("/admin/dashboard", reportCtrlDI.adminDashboards.bind(reportCtrlDI));
router.get("/revenue", reportCtrlDI.getRevenueData.bind(reportCtrlDI));
router.get(
  "/enrollments",
  reportCtrlDI.getCourseEnrollments.bind(reportCtrlDI)
);
router.get("/get-toptutors", reportCtrlDI.getToptutors.bind(reportCtrlDI));

export default router;
