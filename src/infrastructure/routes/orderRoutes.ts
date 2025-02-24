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

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-order", verifyOrder);
router.get("/get-user-orders/:userId", getOrderByUserId);
router.get("/get-all-orders", getAllOrders);
router.get("/get-all-orders/:id", getOrderById);

router.post("/membership/create-order", createMembershipOrder);
router.post("/membership/verify-order", verifyMembershipOrder);
export default router;
