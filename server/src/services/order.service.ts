import { orderRepository } from '../repositories';
import type { Order, CreateOrderInput } from '../models';

export class OrderService {
  async getOrderById(id: string): Promise<Order | null> {
    return orderRepository.findById(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return orderRepository.findByUserId(userId);
  }

  async createOrder(data: CreateOrderInput): Promise<Order> {
    return orderRepository.create(data);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    return orderRepository.updateStatus(id, status);
  }
}

export const orderService = new OrderService();
