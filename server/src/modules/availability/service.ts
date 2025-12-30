import { BaseService } from '../../core/base/BaseService';
import { AvailabilityRepository, type ProductAvailability, availabilityRepository } from './repository';
import type { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto';

export class AvailabilityService extends BaseService<ProductAvailability, CreateAvailabilityDto, UpdateAvailabilityDto> {
  constructor(private readonly availRepo: AvailabilityRepository = availabilityRepository) {
    super(availRepo);
  }

  async findByDate(date: string): Promise<ProductAvailability[]> {
    return this.availRepo.findByDate(date);
  }

  async setAvailability(data: CreateAvailabilityDto): Promise<ProductAvailability> {
    return this.availRepo.upsert(data);
  }

  async deleteByDateAndCategory(date: string, category: 'donuts' | 'pastries' | 'buns'): Promise<void> {
    return this.availRepo.deleteByDateAndCategory(date, category);
  }
}

export const availabilityService = new AvailabilityService();
