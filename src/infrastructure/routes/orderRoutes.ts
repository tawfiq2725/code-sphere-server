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
import { authenticate } from "../../presentation/middleware/auth";

const router = express.Router();

router.post("/create-order", authenticate, createOrder);
router.post("/verify-order", authenticate, verifyOrder);
router.get("/get-user-orders/:userId", authenticate, getOrderByUserId);
router.get("/get-all-orders", getAllOrders);
router.get("/get-all-orders/:id", getOrderById);

router.post("/membership/create-order", authenticate, createMembershipOrder);
router.post("/membership/verify-order", authenticate, verifyMembershipOrder);
export default router;
