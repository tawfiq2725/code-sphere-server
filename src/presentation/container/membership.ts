import { MembershipOrderRepository } from "../../infrastructure/repositories/MembershipOrder";
import { MembershipRepository } from "../../infrastructure/repositories/MembershipRepository";
import { CreateMembership } from "../../application/usecases/Membership";
import { updateMembershipUsecase } from "../../application/usecases/Membership";
import { MembershipOrderUsecase } from "../../application/usecases/MembershipUsecase";
import { CourseRepositoryImpl } from "../../infrastructure/repositories/CourseRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { MembershipCtrl } from "../controllers/membershipCtrl";

const membershipRepo = new MembershipRepository();
const membershipOrderRepo = new MembershipOrderRepository();
const courseRepo = new CourseRepositoryImpl();
const userRepo = new UserRepository();
const createUsecase = new CreateMembership(membershipRepo);
const updateUsecase = new updateMembershipUsecase(membershipRepo);
const membershipOrder = new MembershipOrderUsecase(
  membershipOrderRepo,
  courseRepo,
  userRepo
);

export const membershiCtrlDI = new MembershipCtrl(
  createUsecase,
  updateUsecase,
  membershipOrder
);
