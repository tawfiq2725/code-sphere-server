import { MembershipOrder } from "../entities/Membership-Order";
export interface MembershipOrderInterface {
  create(membershipOrder: MembershipOrder): Promise<MembershipOrder>;
  findMembershipOrderById(id: string): Promise<MembershipOrder | null>;
  getAllMembershipOrders(): Promise<MembershipOrder[]>;
  updateMembershipOrder(
    id: string,
    membershipOrder: Partial<MembershipOrder>
  ): Promise<MembershipOrder | null>;
  getMembershipOrderByUserId(id: string): Promise<MembershipOrder[] | null>;
}
