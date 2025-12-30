import { BaseRepository } from '../../core/base/BaseRepository';
import prisma from '../../database/prisma';
import type { CreateOrderDto, UpdateOrderDto, OrderItem } from './dto';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryDate: string;
  createdAt: Date;
}

interface CreateOrderWithUser extends CreateOrderDto {
  userId: string;
}

export class OrderRepository extends BaseRepository<Order, CreateOrderWithUser, UpdateOrderDto> {
  constructor() {
    super('order');
  }

  protected mapToEntity(data: any): Order {
    return {
      ...data,
      items: data.items as OrderItem[],
    };
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const results = await (prisma.order as any).findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return results.map((item: any) => this.mapToEntity(item));
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    const results = await (prisma.order as any).findMany({
      where: {
        deliveryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return results.map((item: any) => this.mapToEntity(item));
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const result = await (prisma.order as any).update({
        where: { id },
        data: { status },
      });
      return this.mapToEntity(result);
    } catch (error: any) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }
}

export const orderRepository = new OrderRepository();
