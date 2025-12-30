import type { Request, Response } from 'express';
import { BaseController } from '../../core/base/BaseController';
import { OrderService, type Order, orderService } from './service';
import { createOrderSchema, updateOrderSchema, type CreateOrderDto, type UpdateOrderDto } from './dto';

interface CreateOrderWithUser extends CreateOrderDto {
  userId: string;
}

export class OrderController extends BaseController<Order, CreateOrderWithUser, UpdateOrderDto> {
  protected get createSchema() {
    return createOrderSchema as any;
  }

  protected get updateSchema() {
    return updateOrderSchema;
  }

  constructor(private readonly orderSvc: OrderService = orderService) {
    super(orderSvc);
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!req.session.userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    try {
      const validatedData = this.createSchema.parse(req.body);
      const order = await this.orderSvc.create({
        ...validatedData,
        userId: req.session.userId,
      });
      res.status(201).json(order);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async findByUser(req: Request, res: Response): Promise<void> {
    if (!req.session.userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    try {
      const orders = await this.orderSvc.findByUserId(req.session.userId);
      res.json(orders);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    if (req.session.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderSvc.updateStatus(id, status);

      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      res.json(order);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}

export const orderController = new OrderController();
