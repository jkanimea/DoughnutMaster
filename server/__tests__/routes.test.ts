import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { registerRoutes } from '../routes';
import { createServer } from 'http';
import prisma from '../src/database/prisma';
import bcrypt from 'bcryptjs';

describe('API Routes (Modular Controllers)', () => {
  let app: express.Express;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    app.use(
      session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
      })
    );

    const httpServer = createServer(app);
    server = await registerRoutes(httpServer, app);
  });

  async function cleanupDatabase() {
    try {
      await prisma.order.deleteMany();
      await prisma.paymentMethod.deleteMany();
      await prisma.productAvailability.deleteMany();
      await prisma.product.deleteMany();
      await prisma.user.deleteMany();
    } catch (e) {
      // Ignore cleanup errors - tables may not exist yet
    }
  }

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  describe('Auth endpoints (UserController)', () => {
    it('POST /api/auth/register should create a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
          role: 'customer'
        });

      expect(response.status).toBe(201);
      expect(response.body.email).toBe('newuser@example.com');
      expect(response.body.password).toBeUndefined();
    });

    it('POST /api/auth/register should reject duplicate email', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          email: 'duplicate@example.com',
          password: hashedPassword,
          name: 'Duplicate User',
          role: 'customer'
        }
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'Another User',
          role: 'customer'
        });

      expect(response.status).toBe(409);
    });

    it('POST /api/auth/login should authenticate valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          email: 'login@example.com',
          password: hashedPassword,
          name: 'Login User',
          role: 'customer'
        }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('login@example.com');
      expect(response.body.password).toBeUndefined();
    });

    it('POST /api/auth/login should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });

    it('GET /api/auth/me should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.status).toBe(401);
    });

    it('POST /api/auth/logout should destroy session', async () => {
      const response = await request(app).post('/api/auth/logout');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out');
    });
  });

  describe('Product endpoints (ProductController)', () => {
    it('GET /api/products should return array of products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /api/products should require admin role', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'New Product',
          description: 'New description',
          price: 400,
          image: 'https://example.com/new.jpg',
          category: 'pastries',
          unit: 'per piece',
          isActive: true
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden');
    });
  });

  describe('Order endpoints (OrderController)', () => {
    it('GET /api/orders should require authentication', async () => {
      const response = await request(app).get('/api/orders');
      expect(response.status).toBe(401);
    });

    it('POST /api/orders should require authentication', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          items: [{ productId: 'test', quantity: 1, price: 100, name: 'Test' }],
          total: 100,
          paymentMethod: 'card',
          deliveryDate: '2025-01-15'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Availability endpoints (AvailabilityController)', () => {
    it('GET /api/availability/:date should return availability for date', async () => {
      const response = await request(app).get('/api/availability/2025-01-15');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('POST /api/availability should require admin role', async () => {
      const response = await request(app)
        .post('/api/availability')
        .send({
          date: '2025-01-15',
          category: 'donuts',
          isAvailable: false
        });

      expect(response.status).toBe(403);
    });

    it('DELETE /api/availability/:date/:category should require admin role', async () => {
      const response = await request(app).delete('/api/availability/2025-01-15/donuts');
      expect(response.status).toBe(403);
    });
  });

  describe('Payment method endpoints (PaymentMethodController)', () => {
    it('GET /api/payment-methods should require authentication', async () => {
      const response = await request(app).get('/api/payment-methods');
      expect(response.status).toBe(401);
    });

    it('POST /api/payment-methods should require authentication', async () => {
      const response = await request(app)
        .post('/api/payment-methods')
        .send({
          brand: 'visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2025,
          isDefault: true
        });

      expect(response.status).toBe(401);
    });
  });
});
