import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DatabaseStorage } from '../storage';
import { db } from '../db';
import { users, products, orders, productAvailability, paymentMethods } from '@shared/schema';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

describe('DatabaseStorage', () => {
  let storage: DatabaseStorage;

  beforeAll(() => {
    storage = new DatabaseStorage();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await db.delete(orders);
    await db.delete(paymentMethods);
    await db.delete(productAvailability);
    await db.delete(products);
    await db.delete(users);
  });

  afterAll(async () => {
    // Final cleanup
    await db.delete(orders);
    await db.delete(paymentMethods);
    await db.delete(productAvailability);
    await db.delete(products);
    await db.delete(users);
  });

  describe('User operations', () => {
    it('should create a new user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await storage.createUser({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'customer'
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('customer');
    });

    it('should get user by id', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const created = await storage.createUser({
        email: 'test2@example.com',
        password: hashedPassword,
        name: 'Test User 2',
        role: 'customer'
      });

      const found = await storage.getUser(created.id);
      expect(found).toBeDefined();
      expect(found?.email).toBe('test2@example.com');
    });

    it('should get user by email', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await storage.createUser({
        email: 'test3@example.com',
        password: hashedPassword,
        name: 'Test User 3',
        role: 'customer'
      });

      const found = await storage.getUserByEmail('test3@example.com');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test User 3');
    });

    it('should return undefined for non-existent user', async () => {
      const found = await storage.getUser('00000000-0000-0000-0000-000000000000');
      expect(found).toBeUndefined();
    });
  });

  describe('Product operations', () => {
    it('should create a product', async () => {
      const product = await storage.createProduct({
        name: 'Test Donut',
        description: 'A delicious test donut',
        price: 350,
        image: 'https://example.com/donut.jpg',
        category: 'donuts',
        unit: 'per donut',
        isActive: true
      });

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe('Test Donut');
      expect(product.price).toBe(350);
      expect(product.category).toBe('donuts');
    });

    it('should get all active products', async () => {
      await storage.createProduct({
        name: 'Product 1',
        description: 'Desc 1',
        price: 300,
        image: 'https://example.com/1.jpg',
        category: 'donuts',
        unit: 'per donut',
        isActive: true
      });

      await storage.createProduct({
        name: 'Product 2',
        description: 'Desc 2',
        price: 400,
        image: 'https://example.com/2.jpg',
        category: 'pastries',
        unit: 'per piece',
        isActive: true
      });

      const allProducts = await storage.getAllProducts();
      expect(allProducts.length).toBeGreaterThanOrEqual(2);
    });

    it('should get product by id', async () => {
      const created = await storage.createProduct({
        name: 'Find Me',
        description: 'Test product',
        price: 500,
        image: 'https://example.com/test.jpg',
        category: 'buns',
        unit: 'per bun',
        isActive: true
      });

      const found = await storage.getProduct(created.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Find Me');
    });
  });

  describe('Order operations', () => {
    it('should create an order', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await storage.createUser({
        email: 'order@example.com',
        password: hashedPassword,
        name: 'Order User',
        role: 'customer'
      });

      const product = await storage.createProduct({
        name: 'Test Product',
        description: 'For order',
        price: 350,
        image: 'https://example.com/product.jpg',
        category: 'donuts',
        unit: 'per donut',
        isActive: true
      });

      const order = await storage.createOrder({
        userId: user.id,
        items: [
          {
            productId: product.id,
            quantity: 2,
            price: 350,
            name: 'Test Product'
          }
        ],
        total: 700,
        status: 'pending',
        paymentMethod: 'card',
        deliveryDate: '2025-01-15'
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.total).toBe(700);
      expect(order.items).toHaveLength(1);
    });

    it('should get orders by user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await storage.createUser({
        email: 'orders@example.com',
        password: hashedPassword,
        name: 'Orders User',
        role: 'customer'
      });

      await storage.createOrder({
        userId: user.id,
        items: [{ productId: 'test', quantity: 1, price: 100, name: 'Test' }],
        total: 100,
        status: 'pending',
        paymentMethod: 'card',
        deliveryDate: '2025-01-15'
      });

      const userOrders = await storage.getOrdersByUser(user.id);
      expect(userOrders.length).toBeGreaterThanOrEqual(1);
    });

    it('should update order status', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await storage.createUser({
        email: 'status@example.com',
        password: hashedPassword,
        name: 'Status User',
        role: 'customer'
      });

      const order = await storage.createOrder({
        userId: user.id,
        items: [{ productId: 'test', quantity: 1, price: 100, name: 'Test' }],
        total: 100,
        status: 'pending',
        paymentMethod: 'card',
        deliveryDate: '2025-01-15'
      });

      const updated = await storage.updateOrderStatus(order.id, 'processing');
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('processing');
    });
  });

  describe('Product availability operations', () => {
    it('should set availability for a category on a date', async () => {
      const availability = await storage.setAvailability({
        date: '2025-01-15',
        category: 'donuts',
        isAvailable: false
      });

      expect(availability).toBeDefined();
      expect(availability.date).toBe('2025-01-15');
      expect(availability.category).toBe('donuts');
      expect(availability.isAvailable).toBe(false);
    });

    it('should update existing availability', async () => {
      await storage.setAvailability({
        date: '2025-01-16',
        category: 'pastries',
        isAvailable: false
      });

      const updated = await storage.setAvailability({
        date: '2025-01-16',
        category: 'pastries',
        isAvailable: true
      });

      expect(updated.isAvailable).toBe(true);
    });

    it('should get availability by date', async () => {
      await storage.setAvailability({
        date: '2025-01-17',
        category: 'donuts',
        isAvailable: false
      });

      await storage.setAvailability({
        date: '2025-01-17',
        category: 'buns',
        isAvailable: true
      });

      const availabilities = await storage.getAvailabilityByDate('2025-01-17');
      expect(availabilities.length).toBeGreaterThanOrEqual(2);
    });

    it('should delete availability', async () => {
      await storage.setAvailability({
        date: '2025-01-18',
        category: 'donuts',
        isAvailable: false
      });

      await storage.deleteAvailability('2025-01-18', 'donuts');
      
      const availabilities = await storage.getAvailabilityByDate('2025-01-18');
      const donutAvailability = availabilities.find(a => a.category === 'donuts');
      expect(donutAvailability).toBeUndefined();
    });
  });

  describe('Payment method operations', () => {
    it('should create a payment method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await storage.createUser({
        email: 'payment@example.com',
        password: hashedPassword,
        name: 'Payment User',
        role: 'customer'
      });

      const method = await storage.createPaymentMethod({
        userId: user.id,
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
        isDefault: true
      });

      expect(method).toBeDefined();
      expect(method.brand).toBe('visa');
      expect(method.last4).toBe('4242');
    });

    it('should get payment methods by user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await storage.createUser({
        email: 'methods@example.com',
        password: hashedPassword,
        name: 'Methods User',
        role: 'customer'
      });

      await storage.createPaymentMethod({
        userId: user.id,
        brand: 'visa',
        last4: '1111',
        expMonth: 6,
        expYear: 2026,
        isDefault: false
      });

      const methods = await storage.getPaymentMethodsByUser(user.id);
      expect(methods.length).toBeGreaterThanOrEqual(1);
    });

    it('should delete payment method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await storage.createUser({
        email: 'delete@example.com',
        password: hashedPassword,
        name: 'Delete User',
        role: 'customer'
      });

      const method = await storage.createPaymentMethod({
        userId: user.id,
        brand: 'mastercard',
        last4: '5555',
        expMonth: 3,
        expYear: 2027,
        isDefault: false
      });

      await storage.deletePaymentMethod(method.id);
      
      const methods = await storage.getPaymentMethodsByUser(user.id);
      const found = methods.find(m => m.id === method.id);
      expect(found).toBeUndefined();
    });
  });
});
