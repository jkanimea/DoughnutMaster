import type { Request, Response } from 'express';
import { availabilityService } from '../services';
import { z } from 'zod';

const setAvailabilitySchema = z.object({
  date: z.string(),
  category: z.enum(['donuts', 'pastries', 'buns']),
  isAvailable: z.boolean(),
});

export class AvailabilityController {
  async getByDate(req: Request, res: Response) {
    try {
      const { date } = req.params;
      const availability = await availabilityService.getAvailabilityByDate(date);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async set(req: Request, res: Response) {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const data = setAvailabilitySchema.parse(req.body);
      const availability = await availabilityService.setAvailability(data);
      res.json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }

  async delete(req: Request, res: Response) {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const { date, category } = req.params;
      await availabilityService.deleteAvailability(date, category as any);
      res.json({ message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export const availabilityController = new AvailabilityController();
