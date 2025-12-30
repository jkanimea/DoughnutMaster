import type { Request, Response } from 'express';
import { BaseController } from '../../core/base/BaseController';
import { PaymentMethodService, type PaymentMethod, paymentMethodService } from './service';
import { createPaymentMethodSchema, updatePaymentMethodSchema, type CreatePaymentMethodDto, type UpdatePaymentMethodDto } from './dto';

interface CreatePaymentMethodWithUser extends CreatePaymentMethodDto {
  userId: string;
}

export class PaymentMethodController extends BaseController<PaymentMethod, CreatePaymentMethodWithUser, UpdatePaymentMethodDto> {
  protected get createSchema() {
    return createPaymentMethodSchema as any;
  }

  protected get updateSchema() {
    return updatePaymentMethodSchema;
  }

  constructor(private readonly pmSvc: PaymentMethodService = paymentMethodService) {
    super(pmSvc);
  }

  async getByUser(req: Request, res: Response): Promise<void> {
    if (!req.session.userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    try {
      const methods = await this.pmSvc.findByUserId(req.session.userId);
      res.json(methods);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!req.session.userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    try {
      const validatedData = this.createSchema.parse(req.body);
      const method = await this.pmSvc.create({
        ...validatedData,
        userId: req.session.userId,
      });
      res.status(201).json(method);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!req.session.userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    await super.delete(req, res);
  }
}

export const paymentMethodController = new PaymentMethodController();
