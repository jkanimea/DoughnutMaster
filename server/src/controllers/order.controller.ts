import type { Request, Response } from 'express';
import { orderService } from '../services';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    name: z.string(),
  })),
  total: z.number().positive(),
  paymentMethod: z.string(),
  deliveryDate: z.string(),
});

export class OrderController {
  async getByUser(req: Request, res: Response) {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const orders = await orderService.getOrdersByUserId(req.session.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async create(req: Request, res: Response) {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const data = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder({
        ...data,
        userId: req.session.userId,
      });
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const order = await orderService.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export const orderController = new OrderController();
