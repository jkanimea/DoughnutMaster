import { pgTable, text, integer, timestamp, boolean, json, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['customer', 'admin'] }).notNull().default('customer'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Products Table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(), // Store as cents
  image: text('image').notNull(),
  category: text('category', { enum: ['donuts', 'pastries', 'buns'] }).notNull(),
  unit: text('unit').notNull(),
  isActive: boolean('is_active').notNull().default(true)
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Availability Settings Table  
export const productAvailability = pgTable('product_availability', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD format
  category: text('category', { enum: ['donuts', 'pastries', 'buns'] }).notNull(),
  isAvailable: boolean('is_available').notNull().default(true)
});

export const insertProductAvailabilitySchema = createInsertSchema(productAvailability).omit({ id: true });
export type InsertProductAvailability = z.infer<typeof insertProductAvailabilitySchema>;
export type ProductAvailability = typeof productAvailability.$inferSelect;

// Orders Table
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  items: json('items').notNull().$type<Array<{ productId: string; quantity: number; price: number; name: string }>>(),
  total: integer('total').notNull(), // Store as cents
  status: text('status', { enum: ['pending', 'processing', 'delivered', 'cancelled'] }).notNull().default('pending'),
  paymentMethod: text('payment_method', { enum: ['card', 'bank', 'credit'] }).notNull(),
  deliveryDate: text('delivery_date').notNull(), // YYYY-MM-DD format
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Saved Payment Methods Table
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  brand: text('brand').notNull(), // visa, mastercard, etc
  last4: text('last4').notNull(),
  expMonth: integer('exp_month').notNull(),
  expYear: integer('exp_year').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({ id: true, createdAt: true });
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
