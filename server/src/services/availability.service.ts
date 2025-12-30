import { availabilityRepository } from '../repositories';
import type { ProductAvailability, SetAvailabilityInput } from '../models';

export class AvailabilityService {
  async getAvailabilityByDate(date: string): Promise<ProductAvailability[]> {
    return availabilityRepository.findByDate(date);
  }

  async setAvailability(data: SetAvailabilityInput): Promise<ProductAvailability> {
    return availabilityRepository.upsert(data);
  }

  async deleteAvailability(date: string, category: 'donuts' | 'pastries' | 'buns'): Promise<void> {
    return availabilityRepository.delete(date, category);
  }
}

export const availabilityService = new AvailabilityService();
