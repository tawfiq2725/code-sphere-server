import express from "express";
import {
  createMembershipOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  verifyMembershipOrder,
  verifyOrder,
} from "../../presentation/controllers/orderCtrl";
import { verifyToken } from "../../presentation/middleware/auth";

const router = express.Router();
router.use(verifyToken(["student", "admin"]));
router.post("/create-order", createOrder);
router.post("/verify-order", verifyOrder);
router.post("/membership/create-order", createMembershipOrder);
router.post("/membership/verify-order", verifyMembershipOrder);
router.get("/get-user-orders/:userId", getOrderByUserId);
router.get("/get-all-orders", getAllOrders);
router.get("/get-all-orders/:id", getOrderById);
export default router;
