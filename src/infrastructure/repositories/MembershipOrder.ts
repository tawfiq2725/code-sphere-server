import { MembershipOrder } from "../../domain/entities/Membership-Order";
import { MembershipOrderInterface } from "../../domain/interface/MembershipOrder";
import MembershipOrderS from "../database/order-mSchema";

export class MembershipOrderRepository implements MembershipOrderInterface {
  async create(membershipOrder: MembershipOrder): Promise<MembershipOrder> {
    const membershipOrderDetails = (await MembershipOrderS.create(
      membershipOrder
    )) as unknown as MembershipOrder;
    return membershipOrderDetails;
  }
  async findMembershipOrderById(id: string): Promise<MembershipOrder | null> {
    const membershipOrder = await MembershipOrderS.findOne({
      membershipOrderId: id,
    })
      .populate("membershipId", "membershipName")
      .populate("userId", "name email")
      .populate("categoryId", "categoryName");
    return membershipOrder
      ? (membershipOrder.toObject() as unknown as MembershipOrder)
      : null;
  }

  async getAllMembershipOrders(): Promise<MembershipOrder[]> {
    return await MembershipOrderS.find({ orderStatus: "success" });
  }
  async updateMembershipOrder(
    id: string,
    membershipOrder: Partial<MembershipOrder>
  ): Promise<MembershipOrder | null> {
    return await MembershipOrderS.findOneAndUpdate(
      { membershipOrderId: id },
      membershipOrder,
      {
        new: true,
      }
    );
  }
  async getMembershipOrderByUserId(
    id: string
  ): Promise<MembershipOrder[] | null> {
    const membershipOrders = await MembershipOrderS.find({
      userId: id,
    }).populate("membershipId", "membershipName");
    if (!membershipOrders.length) {
      return null;
    }
    return membershipOrders.map(
      (order) => order.toObject() as unknown as MembershipOrder
    );
  }
}
