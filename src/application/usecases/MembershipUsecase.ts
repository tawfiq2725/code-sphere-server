import { Course } from "../../domain/entities/Course";
import { MembershipOrder } from "../../domain/entities/Membership-Order";
import { CourseInterface } from "../../domain/interface/Course";
import { MembershipOrderInterface } from "../../domain/interface/MembershipOrder";
import { UserInterface } from "../../domain/interface/User";
import { getUrl } from "../../utils/getUrl";
export class MembershipOrderUsecase {
  constructor(
    private membershipOrderRepository: MembershipOrderInterface,
    private courseRepo: CourseInterface,
    private userRepo: UserInterface
  ) {}

  public async execute(
    orderData: Omit<MembershipOrder, "id">
  ): Promise<MembershipOrder> {
    const newOrder = new MembershipOrder(
      orderData.membershipOrderId,
      orderData.membershipId,
      orderData.userId,
      orderData.categoryId,
      orderData.membershipPlan,
      orderData.totalAmount,
      orderData.orderStatus,
      orderData.paymentStatus
    );
    await this.membershipOrderRepository.create(newOrder);
    return newOrder;
  }

  public async execByUserId(id: string): Promise<MembershipOrder[] | null> {
    try {
      const membership =
        await this.membershipOrderRepository.getMembershipOrderByUserId(id);
      return membership;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execByCategoryId(id: string): Promise<Course[]> {
    try {
      const course = await this.courseRepo.findCouresByCategoryId(id);
      return course;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execGetAll(): Promise<MembershipOrder[]> {
    try {
      const membershipOrders =
        await this.membershipOrderRepository.getAllMembershipOrders();
      return membershipOrders;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execById(id: string): Promise<MembershipOrder | null> {
    try {
      const membershipOrder =
        await this.membershipOrderRepository.findMembershipOrderById(id);
      let profileUrl = await getUrl((membershipOrder?.userId as any).profile);
      (membershipOrder?.userId as any).profile = profileUrl;
      return membershipOrder;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execGetCertificate(id: string): Promise<any> {
    try {
      const certificates = await this.userRepo.getCertificatesByStudent(id);
      for (let certificate of certificates) {
        certificate.certificateUrl = await getUrl(certificate.certificateUrl);
      }
      return certificates;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class verifyOrderMembershipUsecase {
  constructor(private membershipOrderRepository: MembershipOrderInterface) {}

  public async execute(orderData: Partial<MembershipOrder>): Promise<any> {
    try {
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
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
