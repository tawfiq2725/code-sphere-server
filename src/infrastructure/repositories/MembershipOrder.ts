import { MembershipOrder } from "../../domain/entities/Membership-Order";
import { MembershipOrderInterface } from "../../domain/interface/MembershipOrder";
import MembershipOrderS from "../database/order-mSchema";

export class MembershipOrderRepository implements MembershipOrderInterface {
  async create(membershipOrder: MembershipOrder): Promise<MembershipOrder> {
    try {
      const membershipOrderDetails = (await MembershipOrderS.create(
        membershipOrder
      )) as unknown as MembershipOrder;
      return membershipOrderDetails;
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating membership order");
    }
  }
  async findMembershipOrderById(id: string): Promise<MembershipOrder | null> {
    try {
      const membershipOrder = await MembershipOrderS.findOne({
        membershipOrderId: id,
      })
        .populate("membershipId", "membershipName")
        .populate({
          path: "userId",
          select: "name email profile",
          model: "User",
        })
        .populate("categoryId", "categoryName");
      return membershipOrder
        ? (membershipOrder.toObject() as unknown as MembershipOrder)
        : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getAllMembershipOrders(): Promise<MembershipOrder[]> {
    try {
      return await MembershipOrderS.find({ orderStatus: "success" });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  async updateMembershipOrder(
    id: string,
    membershipOrder: Partial<MembershipOrder>
  ): Promise<MembershipOrder | null> {
    try {
      return await MembershipOrderS.findOneAndUpdate(
        { membershipOrderId: id },
        membershipOrder,
        {
          new: true,
        }
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async getMembershipOrderByUserId(
    id: string
  ): Promise<MembershipOrder[] | null> {
    try {
      const membershipOrders = await MembershipOrderS.find({
        userId: id,
      }).populate("membershipId", "membershipName");
      if (!membershipOrders.length) {
        return [];
      }
      return membershipOrders.map(
        (order) => order.toObject() as unknown as MembershipOrder
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
