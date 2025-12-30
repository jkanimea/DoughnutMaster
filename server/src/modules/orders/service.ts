import { BaseService } from '../../core/base/BaseService';
import { OrderRepository, type Order, orderRepository } from './repository';
import type { CreateOrderDto, UpdateOrderDto } from './dto';

interface CreateOrderWithUser extends CreateOrderDto {
  userId: string;
}

export class OrderService extends BaseService<Order, CreateOrderWithUser, UpdateOrderDto> {
  constructor(private readonly orderRepo: OrderRepository = orderRepository) {
    super(orderRepo);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId);
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    return this.orderRepo.findByDateRange(startDate, endDate);
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    return this.orderRepo.updateStatus(id, status);
  }

  async calculateTotal(items: { price: number; quantity: number }[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

export const orderService = new OrderService();
