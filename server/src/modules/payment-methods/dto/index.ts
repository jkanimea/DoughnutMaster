import { z } from 'zod';

export const createPaymentMethodSchema = z.object({
  brand: z.string(),
  last4: z.string().length(4),
  expMonth: z.number().min(1).max(12),
  expYear: z.number().min(2024),
  isDefault: z.boolean().optional().default(false),
});

export const updatePaymentMethodSchema = z.object({
  isDefault: z.boolean().optional(),
});

export type CreatePaymentMethodDto = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodDto = z.infer<typeof updatePaymentMethodSchema>;
