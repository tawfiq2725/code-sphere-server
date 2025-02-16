import { MembershipOrder } from "../../domain/entities/Membership-Order";
import { MembershipOrderInterface } from "../../domain/interface/MembershipOrder";
export class MembershipOrderUsecase {
  constructor(private membershipOrderRepository: MembershipOrderInterface) {}

  public async execute(
    orderData: Omit<MembershipOrder, "id">
  ): Promise<MembershipOrder> {
    const { userId } = orderData;
    console.log(userId);
    const newOrder = new MembershipOrder(
      orderData.membershipOrderId,
      orderData.membershipId,
      orderData.userId,
      orderData.categoryId,
      orderData.totalAmount,
      orderData.orderStatus,
      orderData.paymentStatus
    );
    await this.membershipOrderRepository.create(newOrder);
    return newOrder;
  }
}

export class verifyOrderMembershipUsecase {
  constructor(private membershipOrderRepository: MembershipOrderInterface) {}

  public async execute(orderData: Partial<MembershipOrder>): Promise<any> {
    const { membershipOrderId } = orderData;
    if (!membershipOrderId) {
      throw new Error("Invalid Request");
    }
    const existingOrder =
      await this.membershipOrderRepository.findMembershipOrderById(
        membershipOrderId
      );
    if (!existingOrder) {
      throw new Error("Order not found");
    }
    const updatedOrder =
      await this.membershipOrderRepository.updateMembershipOrder(
        membershipOrderId,
        orderData
      );
    return updatedOrder;
  }
}
