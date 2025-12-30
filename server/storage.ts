import {
  users,
  products,
  orders,
  productAvailability,
  paymentMethods,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type ProductAvailability,
  type InsertProductAvailability,
  type PaymentMethod,
  type InsertPaymentMethod
} from '@shared/schema';
import { db } from './db';
import { eq, and } from 'drizzle-orm';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Order methods
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: Order['status']): Promise<Order | undefined>;
  
  // Product Availability methods
  getAvailabilityByDate(date: string): Promise<ProductAvailability[]>;
  setAvailability(availability: InsertProductAvailability): Promise<ProductAvailability>;
  deleteAvailability(date: string, category: string): Promise<void>;
  
  // Payment Methods
  getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  deletePaymentMethod(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values({
      ...insertOrder,
      items: insertOrder.items as any // Cast to match Drizzle's JSON type expectation
    }).returning();
    return order;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Product Availability methods
  async getAvailabilityByDate(date: string): Promise<ProductAvailability[]> {
    return await db.select().from(productAvailability).where(eq(productAvailability.date, date));
  }

  async setAvailability(insertAvailability: InsertProductAvailability): Promise<ProductAvailability> {
    // First try to find existing record
    const existing = await db
      .select()
      .from(productAvailability)
      .where(
        and(
          eq(productAvailability.date, insertAvailability.date),
          eq(productAvailability.category, insertAvailability.category) as any
        )
      );

    const [existingRecord] = existing;

    if (existingRecord) {
      // Update existing
      const [updated] = await db
        .update(productAvailability)
        .set({ isAvailable: insertAvailability.isAvailable })
        .where(eq(productAvailability.id, existingRecord.id))
        .returning();
      return updated;
    } else {
      // Insert new
      const [created] = await db
        .insert(productAvailability)
        .values(insertAvailability)
        .returning();
      return created;
    }
  }

  async deleteAvailability(date: string, category: string): Promise<void> {
    await db
      .delete(productAvailability)
      .where(
        and(
          eq(productAvailability.date, date),
          eq(productAvailability.category, category) as any
        )
      );
  }

  // Payment Methods
  async getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]> {
    return await db.select().from(paymentMethods).where(eq(paymentMethods.userId, userId));
  }

  async createPaymentMethod(insertMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const [method] = await db.insert(paymentMethods).values(insertMethod).returning();
    return method;
  }

  async deletePaymentMethod(id: string): Promise<void> {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
  }
}

export const storage = new DatabaseStorage();
