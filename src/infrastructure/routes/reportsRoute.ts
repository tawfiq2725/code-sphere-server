import express from "express";
import {
  adminDashboards,
  getCourseEnrollments,
  getReportsMembershipb,
  getReportsOrders,
  getRevenueData,
  getToptutors,
} from "../../presentation/controllers/reportCtrl";
import { authenticate } from "../../presentation/middleware/auth";

const router = express.Router();

router.get("/get-reports/orders", getReportsOrders);
router.get("/admin/dashboard", authenticate, adminDashboards);
router.get("/revenue", getRevenueData);
router.get("/enrollments", getCourseEnrollments);
router.get("/get-toptutors", getToptutors);
router.get("/get-reports/membership", getReportsMembershipb);

export default router;
