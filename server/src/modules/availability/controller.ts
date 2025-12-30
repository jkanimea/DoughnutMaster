import type { Request, Response } from 'express';
import { BaseController } from '../../core/base/BaseController';
import { AvailabilityService, type ProductAvailability, availabilityService } from './service';
import { createAvailabilitySchema, updateAvailabilitySchema, type CreateAvailabilityDto, type UpdateAvailabilityDto } from './dto';

export class AvailabilityController extends BaseController<ProductAvailability, CreateAvailabilityDto, UpdateAvailabilityDto> {
  protected get createSchema() {
    return createAvailabilitySchema;
  }

  protected get updateSchema() {
    return updateAvailabilitySchema;
  }

  constructor(private readonly availSvc: AvailabilityService = availabilityService) {
    super(availSvc);
  }

  async getByDate(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.params;
      const availability = await this.availSvc.findByDate(date);
      res.json(availability);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async set(req: Request, res: Response): Promise<void> {
    if (req.session.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    try {
      const data = this.createSchema.parse(req.body);
      const availability = await this.availSvc.setAvailability(data);
      res.json(availability);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteByDateAndCategory(req: Request, res: Response): Promise<void> {
    if (req.session.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    try {
      const { date, category } = req.params;
      await this.availSvc.deleteByDateAndCategory(date, category as any);
      res.json({ message: 'Deleted' });
    } catch (error) {
      this.handleError(error, res);
    }
  }
}

export const availabilityController = new AvailabilityController();
