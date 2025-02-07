import express from "express";
import {
  createOrder,
  getOrderByUserId,
  verifyOrder,
} from "../../presentation/controllers/orderCtrl";
import { authenticate } from "../../presentation/middleware/auth";

const router = express.Router();

router.post("/create-order", authenticate, createOrder);
router.post("/verify-order", authenticate, verifyOrder);
router.get("/get-user-orders/:userId", authenticate, getOrderByUserId);
router.get("/get-all-orders", authenticate, verifyOrder);
export default router;
