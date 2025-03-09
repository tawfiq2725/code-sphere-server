import { Order } from "../../domain/entities/Order";
import { OrderInterface } from "../../domain/interface/Order";
import OrderS from "../database/orderSchema";
export class OrderRepository implements OrderInterface {
  public async create(order: Order): Promise<Order> {
    try {
      const orderDetails = (await OrderS.create(order)) as Order;
      console.log("creating order", order);
      console.log("creating order successfully", orderDetails);
      return orderDetails;
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating order");
    }
  }
  public async getOrderByUserId(userId: string): Promise<Order[] | null> {
    try {
      console.log("finding order by user id", userId);
      const orders = await OrderS.find({ userId });
      if (!orders.length) {
        return null;
      }
      return orders;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async findOrderById(id: string): Promise<Order | null> {
    try {
      console.log("finding order by id", id);
      return await OrderS.findOne({ orderId: id });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async updateOrder(
    id: string,
    order: Partial<Order>
  ): Promise<Order | null> {
    try {
      console.log("updating order", id);
      return await OrderS.findOneAndUpdate({ orderId: id }, order, {
        new: true,
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async getAllOrders(): Promise<Order[]> {
    try {
      return await OrderS.find({ paymentStatus: "success" });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
