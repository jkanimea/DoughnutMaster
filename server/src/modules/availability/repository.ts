import { BaseRepository } from '../../core/base/BaseRepository';
import prisma from '../../database/prisma';
import type { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto';

export interface ProductAvailability {
  id: string;
  date: string;
  category: 'donuts' | 'pastries' | 'buns';
  isAvailable: boolean;
}

export class AvailabilityRepository extends BaseRepository<ProductAvailability, CreateAvailabilityDto, UpdateAvailabilityDto> {
  constructor() {
    super('productAvailability');
  }

  async findByDate(date: string): Promise<ProductAvailability[]> {
    const results = await (prisma.productAvailability as any).findMany({
      where: { date },
    });
    return results.map((item: any) => this.mapToEntity(item));
  }

  async upsert(data: CreateAvailabilityDto): Promise<ProductAvailability> {
    const result = await (prisma.productAvailability as any).upsert({
      where: {
        date_category: {
          date: data.date,
          category: data.category,
        },
      },
      update: { isAvailable: data.isAvailable },
      create: data,
    });
    return this.mapToEntity(result);
  }

  async deleteByDateAndCategory(date: string, category: 'donuts' | 'pastries' | 'buns'): Promise<void> {
    await (prisma.productAvailability as any).deleteMany({
      where: { date, category },
    });
  }
}

export const availabilityRepository = new AvailabilityRepository();
