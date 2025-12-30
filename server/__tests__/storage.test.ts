import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../src/database/prisma';
import { userRepository, type User } from '../src/modules/users';
import { productRepository, type Product } from '../src/modules/products';
import { orderRepository, type Order } from '../src/modules/orders';
import { availabilityRepository, type ProductAvailability } from '../src/modules/availability';
import { paymentMethodRepository, type PaymentMethod } from '../src/modules/payment-methods';
import bcrypt from 'bcryptjs';

describe('Repository Layer (Inheritance Pattern)', () => {
  async function cleanupDatabase() {
    try {
      await prisma.order.deleteMany();
      await prisma.paymentMethod.deleteMany();
      await prisma.productAvailability.deleteMany();
      await prisma.product.deleteMany();
      await prisma.user.deleteMany();
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  describe('UserRepository (extends BaseRepository)', () => {
    it('should create a new user via inherited create method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'customer'
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should find user by id via inherited findById method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const created = await userRepository.create({
        email: 'test2@example.com',
        password: hashedPassword,
        name: 'Test User 2',
        role: 'customer'
      });

      const found = await userRepository.findById(created.id);
      expect(found).toBeDefined();
      expect(found?.email).toBe('test2@example.com');
    });

    it('should find user by email via custom method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await userRepository.create({
        email: 'test3@example.com',
        password: hashedPassword,
        name: 'Test User 3',
        role: 'customer'
      });

      const found = await userRepository.findByEmail('test3@example.com');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test User 3');
    });

    it('should return null for non-existent user', async () => {
      const found = await userRepository.findById('00000000-0000-0000-0000-000000000000');
      expect(found).toBeNull();
    });
  });

  describe('ProductRepository (extends BaseRepository)', () => {
    it('should create a product via inherited create method', async () => {
      const product = await productRepository.create({
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
    });

    it('should get all active products via custom method', async () => {
      await productRepository.create({
        name: 'Product 1',
        description: 'Desc 1',
        price: 300,
        image: 'https://example.com/1.jpg',
        category: 'donuts',
        unit: 'per donut',
        isActive: true
      });

      const allProducts = await productRepository.findAllActive();
      expect(allProducts.length).toBeGreaterThanOrEqual(1);
    });

    it('should find product by id via inherited findById method', async () => {
      const created = await productRepository.create({
        name: 'Find Me',
        description: 'Test product',
        price: 500,
        image: 'https://example.com/test.jpg',
        category: 'buns',
        unit: 'per bun',
        isActive: true
      });

      const found = await productRepository.findById(created.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Find Me');
    });
  });

  describe('OrderRepository (extends BaseRepository)', () => {
    it('should create an order via inherited create method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'order@example.com',
        password: hashedPassword,
        name: 'Order User',
        role: 'customer'
      });

      const order = await orderRepository.create({
        userId: user.id,
        items: [{ productId: 'test', quantity: 2, price: 350, name: 'Test Product' }],
        total: 700,
        paymentMethod: 'card',
        deliveryDate: '2025-01-15'
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.total).toBe(700);
    });

    it('should get orders by user via custom method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'orders@example.com',
        password: hashedPassword,
        name: 'Orders User',
        role: 'customer'
      });

      await orderRepository.create({
        userId: user.id,
        items: [{ productId: 'test', quantity: 1, price: 100, name: 'Test' }],
        total: 100,
        paymentMethod: 'card',
        deliveryDate: '2025-01-15'
      });

      const userOrders = await orderRepository.findByUserId(user.id);
      expect(userOrders.length).toBeGreaterThanOrEqual(1);
    });

    it('should update order status via custom method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'status@example.com',
        password: hashedPassword,
        name: 'Status User',
        role: 'customer'
      });

      const order = await orderRepository.create({
        userId: user.id,
        items: [{ productId: 'test', quantity: 1, price: 100, name: 'Test' }],
        total: 100,
        paymentMethod: 'card',
        deliveryDate: '2025-01-15'
      });

      const updated = await orderRepository.updateStatus(order.id, 'processing');
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('processing');
    });
  });

  describe('AvailabilityRepository (extends BaseRepository)', () => {
    it('should upsert availability via custom method', async () => {
      const availability = await availabilityRepository.upsert({
        date: '2025-01-15',
        category: 'donuts',
        isAvailable: false
      });

      expect(availability).toBeDefined();
      expect(availability.date).toBe('2025-01-15');
      expect(availability.isAvailable).toBe(false);
    });

    it('should update existing availability via upsert', async () => {
      await availabilityRepository.upsert({
        date: '2025-01-16',
        category: 'pastries',
        isAvailable: false
      });

      const updated = await availabilityRepository.upsert({
        date: '2025-01-16',
        category: 'pastries',
        isAvailable: true
      });

      expect(updated.isAvailable).toBe(true);
    });

    it('should get availability by date via custom method', async () => {
      await availabilityRepository.upsert({
        date: '2025-01-17',
        category: 'donuts',
        isAvailable: false
      });

      const availabilities = await availabilityRepository.findByDate('2025-01-17');
      expect(availabilities.length).toBeGreaterThanOrEqual(1);
    });

    it('should delete availability via custom method', async () => {
      await availabilityRepository.upsert({
        date: '2025-01-18',
        category: 'donuts',
        isAvailable: false
      });

      await availabilityRepository.deleteByDateAndCategory('2025-01-18', 'donuts');
      
      const availabilities = await availabilityRepository.findByDate('2025-01-18');
      const donutAvailability = availabilities.find(a => a.category === 'donuts');
      expect(donutAvailability).toBeUndefined();
    });
  });

  describe('PaymentMethodRepository (extends BaseRepository)', () => {
    it('should create a payment method via inherited create method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'payment@example.com',
        password: hashedPassword,
        name: 'Payment User',
        role: 'customer'
      });

      const method = await paymentMethodRepository.create({
        userId: user.id,
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
        isDefault: true
      });

      expect(method).toBeDefined();
      expect(method.brand).toBe('visa');
    });

    it('should get payment methods by user via custom method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'methods@example.com',
        password: hashedPassword,
        name: 'Methods User',
        role: 'customer'
      });

      await paymentMethodRepository.create({
        userId: user.id,
        brand: 'visa',
        last4: '1111',
        expMonth: 6,
        expYear: 2026,
        isDefault: false
      });

      const methods = await paymentMethodRepository.findByUserId(user.id);
      expect(methods.length).toBeGreaterThanOrEqual(1);
    });

    it('should delete payment method via inherited delete method', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'delete@example.com',
        password: hashedPassword,
        name: 'Delete User',
        role: 'customer'
      });

      const method = await paymentMethodRepository.create({
        userId: user.id,
        brand: 'mastercard',
        last4: '5555',
        expMonth: 3,
        expYear: 2027,
        isDefault: false
      });

      await paymentMethodRepository.delete(method.id);
      
      const methods = await paymentMethodRepository.findByUserId(user.id);
      const found = methods.find(m => m.id === method.id);
      expect(found).toBeUndefined();
    });
  });
});
