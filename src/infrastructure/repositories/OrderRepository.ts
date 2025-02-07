import { Order } from "../../domain/entities/Order";
import { OrderInterface } from "../../domain/interface/Order";
import OrderS from "../database/orderSchema";
export class OrderRepository implements OrderInterface {
  public async create(order: Order): Promise<Order> {
    const orderDetails = (await OrderS.create(order)) as Order;
    console.log("creating order", order);
    console.log("creating order successfully", orderDetails);
    return orderDetails;
  }
  public async getOrderByUserId(userId: string): Promise<Order[] | null> {
    console.log("finding order by user id", userId);
    const orders = await OrderS.find({ userId });
    if (!orders.length) {
      return null;
    }
    return orders;
  }
  public async findOrderById(id: string): Promise<Order | null> {
    console.log("finding order by id", id);
    return await OrderS.findOne({ orderId: id });
  }

  public async updateOrder(
    id: string,
    order: Partial<Order>
  ): Promise<Order | null> {
    console.log("updating order", id);
    return await OrderS.findOneAndUpdate({ orderId: id }, order, {
      new: true,
    });
  }
  public async getAllOrders(): Promise<Order[]> {
    return await OrderS.find({ paymentStatus: "success" });
  }
}
