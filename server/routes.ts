import type { Express } from 'express';
import { createServer, type Server } from 'http';
import {
  authController,
  productController,
  orderController,
  availabilityController,
  paymentMethodController
} from './src/controllers';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', (req, res) => authController.register(req, res));
  app.post('/api/auth/login', (req, res) => authController.login(req, res));
  app.post('/api/auth/logout', (req, res) => authController.logout(req, res));
  app.get('/api/auth/me', (req, res) => authController.me(req, res));

  // Product routes
  app.get('/api/products', (req, res) => productController.getAll(req, res));
  app.post('/api/products', (req, res) => productController.create(req, res));

  // Availability routes
  app.get('/api/availability/:date', (req, res) => availabilityController.getByDate(req, res));
  app.post('/api/availability', (req, res) => availabilityController.set(req, res));
  app.delete('/api/availability/:date/:category', (req, res) => availabilityController.delete(req, res));

  // Order routes
  app.get('/api/orders', (req, res) => orderController.getByUser(req, res));
  app.post('/api/orders', (req, res) => orderController.create(req, res));
  app.patch('/api/orders/:id/status', (req, res) => orderController.updateStatus(req, res));

  // Payment methods routes
  app.get('/api/payment-methods', (req, res) => paymentMethodController.getByUser(req, res));
  app.post('/api/payment-methods', (req, res) => paymentMethodController.create(req, res));
  app.delete('/api/payment-methods/:id', (req, res) => paymentMethodController.delete(req, res));

  return httpServer;
}
