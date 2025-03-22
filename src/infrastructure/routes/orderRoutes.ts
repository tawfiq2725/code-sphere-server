import express from "express";
import { verifyToken } from "../../presentation/middleware/auth";
import { OrderCtrlDI } from "../../presentation/container/order";

const router = express.Router();

router.use(verifyToken(["student", "admin"]));
router.post("/create-order", OrderCtrlDI.createOrder.bind(OrderCtrlDI));
router.post("/verify-order", OrderCtrlDI.verifyOrder.bind(OrderCtrlDI));
router.post(
  "/membership/create-order",
  OrderCtrlDI.createMembershipOrder.bind(OrderCtrlDI)
);
router.post(
  "/membership/verify-order",
  OrderCtrlDI.verifyMembershipOrder.bind(OrderCtrlDI)
);
router.get(
  "/get-user-orders/:userId",
  OrderCtrlDI.getOrderByUserId.bind(OrderCtrlDI)
);
router.get("/get-all-orders", OrderCtrlDI.getAllOrders.bind(OrderCtrlDI));
router.get("/get-all-orders/:id", OrderCtrlDI.getOrderById.bind(OrderCtrlDI));

export default router;
