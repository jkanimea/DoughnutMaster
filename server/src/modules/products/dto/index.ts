import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string(),
  category: z.enum(['donuts', 'pastries', 'buns']),
  unit: z.string().min(1),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  image: z.string().optional(),
  category: z.enum(['donuts', 'pastries', 'buns']).optional(),
  unit: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
