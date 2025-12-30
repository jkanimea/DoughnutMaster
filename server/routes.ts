import type { Express } from 'express';
import { type Server } from 'http';
import { userController } from './src/modules/users';
import { productController } from './src/modules/products';
import { orderController } from './src/modules/orders';
import { availabilityController } from './src/modules/availability';
import { paymentMethodController } from './src/modules/payment-methods';
import { passwordResetController } from './src/modules/password-reset';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes
  app.post('/api/auth/register', (req, res) => userController.register(req, res));
  app.post('/api/auth/login', (req, res) => userController.login(req, res));
  app.post('/api/auth/logout', (req, res) => userController.logout(req, res));
  app.get('/api/auth/me', (req, res) => userController.me(req, res));

  // Password reset routes
  app.post('/api/auth/forgot-password', (req, res) => passwordResetController.forgotPassword(req, res));
  app.get('/api/auth/reset-password/:token', (req, res) => passwordResetController.validateToken(req, res));
  app.post('/api/auth/reset-password', (req, res) => passwordResetController.resetPassword(req, res));

  // User CRUD routes (admin only would typically have these)
  app.get('/api/users', (req, res) => userController.findAll(req, res));
  app.get('/api/users/:id', (req, res) => userController.findById(req, res));

  // Product routes - CRUD inherited from BaseController
  app.get('/api/products', (req, res) => productController.findAllActive(req, res));
  app.get('/api/products/:id', (req, res) => productController.findById(req, res));
  app.get('/api/products/category/:category', (req, res) => productController.findByCategory(req, res));
  app.post('/api/products', (req, res) => productController.create(req, res));
  app.put('/api/products/:id', (req, res) => productController.update(req, res));
  app.delete('/api/products/:id', (req, res) => productController.delete(req, res));

  // Order routes
  app.get('/api/orders', (req, res) => orderController.findByUser(req, res));
  app.get('/api/orders/:id', (req, res) => orderController.findById(req, res));
  app.post('/api/orders', (req, res) => orderController.create(req, res));
  app.patch('/api/orders/:id/status', (req, res) => orderController.updateStatus(req, res));

  // Availability routes
  app.get('/api/availability/:date', (req, res) => availabilityController.getByDate(req, res));
  app.post('/api/availability', (req, res) => availabilityController.set(req, res));
  app.delete('/api/availability/:date/:category', (req, res) => availabilityController.deleteByDateAndCategory(req, res));

  // Payment methods routes
  app.get('/api/payment-methods', (req, res) => paymentMethodController.getByUser(req, res));
  app.post('/api/payment-methods', (req, res) => paymentMethodController.create(req, res));
  app.delete('/api/payment-methods/:id', (req, res) => paymentMethodController.delete(req, res));

  return httpServer;
}
