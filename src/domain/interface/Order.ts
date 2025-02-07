import { Order } from "../entities/Order";

export interface OrderInterface {
  create(order: Order): Promise<Order>;
  findOrderById(id: string): Promise<Order | null>;
  getAllOrders(): Promise<Order[]>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order | null>;
  getOrderByUserId(id: string): Promise<Order[] | null>;
}
