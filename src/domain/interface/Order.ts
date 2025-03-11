import { Order } from "../entities/Order";

export interface OrderInterface {
  create(order: Order): Promise<Order>;
  findOrderById(id: string): Promise<Order | null>;
  getAllOrders(): Promise<Order[]>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order | null>;
  checkCourse(id: string): Promise<boolean>;
  getOrderByUserId(
    id: string
  ): Promise<{ orders: any[]; membershipOrders: any[] } | null>;
}
