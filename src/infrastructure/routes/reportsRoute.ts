import express from "express";
import {
  adminDashboards,
  getCourseEnrollments,
  getReportsMembershipb,
  getReportsMembersOrders,
  getReportsOrders,
  getRevenueData,
  getToptutors,
} from "../../presentation/controllers/reportCtrl";
import { verifyToken } from "../../presentation/middleware/auth";

const router = express.Router();
router.use(verifyToken(["admin", "tutor"]));
router.get("/get-reports/orders", getReportsOrders);
router.get("/get-reports/member/orders", getReportsMembersOrders);
router.get("/admin/dashboard", adminDashboards);
router.get("/revenue", getRevenueData);
router.get("/enrollments", getCourseEnrollments);
router.get("/get-toptutors", getToptutors);
router.get("/get-reports/membership", getReportsMembershipb);

export default router;
