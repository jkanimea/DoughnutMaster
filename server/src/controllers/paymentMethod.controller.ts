import type { Request, Response } from 'express';
import { paymentMethodService } from '../services';
import { z } from 'zod';

const createPaymentMethodSchema = z.object({
  brand: z.string(),
  last4: z.string().length(4),
  expMonth: z.number().min(1).max(12),
  expYear: z.number().min(2024),
  isDefault: z.boolean().optional(),
});

export class PaymentMethodController {
  async getByUser(req: Request, res: Response) {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const methods = await paymentMethodService.getPaymentMethodsByUserId(req.session.userId);
      res.json(methods);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async create(req: Request, res: Response) {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const data = createPaymentMethodSchema.parse(req.body);
      const method = await paymentMethodService.createPaymentMethod({
        ...data,
        userId: req.session.userId,
      });
      res.json(method);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  async delete(req: Request, res: Response) {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const { id } = req.params;
      await paymentMethodService.deletePaymentMethod(id);
      res.json({ message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export const paymentMethodController = new PaymentMethodController();
