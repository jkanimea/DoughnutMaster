import prisma from '../database/prisma';
import type { ProductAvailability, SetAvailabilityInput } from '../models';

export class AvailabilityRepository {
  async findByDate(date: string): Promise<ProductAvailability[]> {
    const availabilities = await prisma.productAvailability.findMany({
      where: { date },
    });
    return availabilities;
  }

  async upsert(data: SetAvailabilityInput): Promise<ProductAvailability> {
    const availability = await prisma.productAvailability.upsert({
      where: {
        date_category: {
          date: data.date,
          category: data.category,
        },
      },
      update: { isAvailable: data.isAvailable },
      create: {
        date: data.date,
        category: data.category,
        isAvailable: data.isAvailable,
      },
    });
    return availability;
  }

  async delete(date: string, category: 'donuts' | 'pastries' | 'buns'): Promise<void> {
    await prisma.productAvailability.deleteMany({
      where: { date, category },
    });
  }
}

export const availabilityRepository = new AvailabilityRepository();
