import { z } from 'zod';

export const createAvailabilitySchema = z.object({
  date: z.string(),
  category: z.enum(['donuts', 'pastries', 'buns']),
  isAvailable: z.boolean(),
});

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean().optional(),
});

export type CreateAvailabilityDto = z.infer<typeof createAvailabilitySchema>;
export type UpdateAvailabilityDto = z.infer<typeof updateAvailabilitySchema>;
