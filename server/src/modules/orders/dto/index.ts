import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  name: z.string(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  total: z.number().positive(),
  paymentMethod: z.string(),
  deliveryDate: z.string(),
});

export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'delivered', 'cancelled']).optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
