import { Order } from "../../domain/entities/Order";
import { OrderInterface } from "../../domain/interface/Order";
import Course from "../database/courseSchema";
import MembershipOrder from "../database/order-mSchema";
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
  public async getOrderByUserId(
    userId: string
  ): Promise<{ orders: any[]; membershipOrders: any[] } | null> {
    try {
      console.log("Finding orders by user ID", userId);

      // Fetch orders from both collections
      const orders = await OrderS.find({ userId });
      const membershipOrders = await MembershipOrder.find({ userId });

      // If both are empty, return null
      if (!orders.length && !membershipOrders.length) {
        return null;
      }

      // Return both orders and membership orders
      return { orders, membershipOrders };
    } catch (err) {
      console.error("Error fetching orders:", err);
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

  public async checkCourse(id: string): Promise<boolean> {
    try {
      console.log(id, "1");
      let course = await Course.findOne({ courseId: id });
      console.log(course, "2");
      let check = course?.isVisible;
      console.log(check, "3");
      if (!check) {
        return false;
      }
      return check;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
