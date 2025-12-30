import prisma from '../database/prisma';
import type { Order, CreateOrderInput, OrderItem } from '../models';

export class OrderRepository {
  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return null;
    return {
      ...order,
      items: order.items as OrderItem[],
    };
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({ where: { userId } });
    return orders.map(order => ({
      ...order,
      items: order.items as OrderItem[],
    }));
  }

  async create(data: CreateOrderInput): Promise<Order> {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        items: data.items as any,
        total: data.total,
        status: data.status || 'pending',
        paymentMethod: data.paymentMethod,
        deliveryDate: data.deliveryDate,
      },
    });
    return {
      ...order,
      items: order.items as OrderItem[],
    };
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return {
      ...order,
      items: order.items as OrderItem[],
    };
  }
}

export const orderRepository = new OrderRepository();
