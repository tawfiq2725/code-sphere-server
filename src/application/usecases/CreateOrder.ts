import { Order } from "../../domain/entities/Order";
import { OrderInterface } from "../../domain/interface/Order";

export class createOrderuseCase {
  constructor(private orderRepository: OrderInterface) {}

  public async execute(orderData: Omit<Order, "id">): Promise<Order> {
    console.log("starting ---------------9");
    const { userId } = orderData;
    console.log("starting ---------------10");
    console.log(userId);

    console.log("starting ---------------11");

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
    console.log("starting ---------------12");
    await this.orderRepository.create(newOrder);
    console.log("starting ---------------13");

    return newOrder;
  }
}

export class verifyOrderuseCase {
  constructor(private orderRepository: OrderInterface) {}

  public async execute(orderData: Partial<Order>): Promise<any> {
    console.log("starting ---------------9");
    const { orderId } = orderData;
    console.log("starting ---------------10");
    if (!orderId) {
      throw new Error("Invalid Request");
    }
    console.log("starting ---------------11");
    const existingOrder = await this.orderRepository.findOrderById(orderId);
    if (!existingOrder) {
      throw new Error("Order not found");
    }
    console.log("starting ---------------12");

    const updatedOrder = await this.orderRepository.updateOrder(
      orderId,
      orderData
    );
    console.log("starting ---------------13");
    return updatedOrder;
  }
}

export class getOrderByIduseCase {
  constructor(private orderRepository: OrderInterface) {}

  public async execute(userId: string): Promise<Order[] | null> {
    console.log("starting ---------------9");
    console.log(userId);
    console.log("starting ---------------10");
    const existingOrder = await this.orderRepository.getOrderByUserId(userId);
    console.log("starting ---------------11");
    return existingOrder;
  }
}
