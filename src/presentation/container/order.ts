import { MembershipOrderRepository } from "../../infrastructure/repositories/MembershipOrder";
import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
import { createOrderuseCase } from "../../application/usecases/CreateOrder";
import { verifyOrderuseCase } from "../../application/usecases/CreateOrder";
import { getOrderByIduseCase } from "../../application/usecases/CreateOrder";
import { MembershipOrderUsecase } from "../../application/usecases/MembershipUsecase";
import { verifyOrderMembershipUsecase } from "../../application/usecases/MembershipUsecase";
import { CourseRepositoryImpl } from "../../infrastructure/repositories/CourseRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { OrderCtrl } from "../controllers/orderCtrl";

const orderRepo = new OrderRepository();
const courseRepo = new CourseRepositoryImpl();
const userRepo = new UserRepository();
const membershipOrderRepo = new MembershipOrderRepository();
const createOrderuse = new createOrderuseCase(orderRepo);
const verifyOrderuse = new verifyOrderuseCase(orderRepo);
const getOrderuse = new getOrderByIduseCase(orderRepo);
const membershipUse = new MembershipOrderUsecase(
  membershipOrderRepo,
  courseRepo,
  userRepo
);
const verifyOrderMemberhsipuse = new verifyOrderMembershipUsecase(
  membershipOrderRepo
);

export const OrderCtrlDI = new OrderCtrl(
  createOrderuse,
  verifyOrderuse,
  getOrderuse,
  membershipUse,
  verifyOrderMemberhsipuse
);
