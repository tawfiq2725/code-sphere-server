import { Order } from "../../domain/entities/Order";
import { OrderInterface } from "../../domain/interface/Order";

export class createOrderuseCase {
  constructor(private orderRepository: OrderInterface) {}

  public async execute(orderData: Omit<Order, "id">): Promise<Order> {
    try {
      const { courseId } = orderData;

      let checkCourse = await this.orderRepository.checkCourse(courseId);
      if (!checkCourse) {
        throw new Error("The course is currently unlisted check back later");
      }
      const newOrder = new Order(
        orderData.orderId,
        orderData.userId,
        orderData.courseId,
        orderData.totalAmount,
        orderData.orderStatus,
        orderData.paymentStatus,
        orderData.isApplied,
        orderData.razorpayOrderId,
        orderData.razorpayPaymentId,
        orderData.razorpaySignature,
        orderData.couponCode,
        orderData.couponDiscount
      );
      await this.orderRepository.create(newOrder);

      return newOrder;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class verifyOrderuseCase {
  constructor(private orderRepository: OrderInterface) {}

  public async execute(orderData: Partial<Order>): Promise<any> {
    try {
      const { orderId } = orderData;

      if (!orderId) {
        throw new Error("Invalid Request");
      }

      const existingOrder = await this.orderRepository.findOrderById(orderId);
      if (!existingOrder) {
        throw new Error("Order not found");
      }

      const updatedOrder = await this.orderRepository.updateOrder(
        orderId,
        orderData
      );

      return updatedOrder;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class getOrderByIduseCase {
  constructor(private orderRepository: OrderInterface) {}

  public async execute(
    userId: string
  ): Promise<{ orders: any[]; membershipOrders: any[] } | null> {
    try {
      const existingOrder = await this.orderRepository.getOrderByUserId(userId);

      return existingOrder;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execGetall(): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.getAllOrders();
      return orders;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execGetByOrderId(id: string): Promise<Order | null> {
    try {
      const order = await this.orderRepository.findOrderById(id);
      return order;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
