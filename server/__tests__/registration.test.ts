import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../src/database/prisma';
import { userRepository } from '../src/modules/users';
import { userService } from '../src/modules/users/service';
import bcrypt from 'bcryptjs';

describe('User Registration', () => {
  async function cleanupDatabase() {
    try {
      await prisma.order.deleteMany();
      await prisma.paymentMethod.deleteMany();
      await prisma.user.deleteMany();
    } catch (e) {}
  }

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  describe('UserRepository', () => {
    it('should create a user with phone number', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        phone: '+64 21 123 4567',
        role: 'customer'
      });

      expect(user).toBeDefined();
      expect(user.phone).toBe('+64 21 123 4567');
      expect(user.role).toBe('customer');
    });

    it('should create a user with optional phone', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await userRepository.create({
        email: 'nophone@example.com',
        password: hashedPassword,
        name: 'No Phone User',
        role: 'customer'
      });

      expect(user).toBeDefined();
      expect(user.phone).toBeNull();
    });

    it('should create a social login user without password', async () => {
      const user = await userRepository.create({
        email: 'social@example.com',
        password: '',
        name: 'Social User',
        role: 'customer',
        provider: 'google',
        providerId: 'google-123'
      });

      expect(user).toBeDefined();
      expect(user.provider).toBe('google');
      expect(user.providerId).toBe('google-123');
    });

    it('should find user by provider and providerId', async () => {
      await userRepository.create({
        email: 'provider@example.com',
        password: '',
        name: 'Provider User',
        role: 'customer',
        provider: 'facebook',
        providerId: 'fb-456'
      });

      const found = await userRepository.findByProvider('facebook', 'fb-456');
      expect(found).toBeDefined();
      expect(found?.email).toBe('provider@example.com');
    });

    it('should return null for non-existent provider', async () => {
      const found = await userRepository.findByProvider('unknown', 'invalid');
      expect(found).toBeNull();
    });
  });

  describe('UserService', () => {
    it('should hash password when creating user', async () => {
      const user = await userService.create({
        email: 'hash@example.com',
        password: 'password123',
        name: 'Hash User',
        role: 'customer'
      });

      expect(user).toBeDefined();
      expect(user.password).not.toBe('password123');
      
      const isValid = await bcrypt.compare('password123', user.password || '');
      expect(isValid).toBe(true);
    });

    it('should prevent duplicate email registration', async () => {
      await userService.create({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'First User',
        role: 'customer'
      });

      await expect(
        userService.create({
          email: 'duplicate@example.com',
          password: 'password456',
          name: 'Second User',
          role: 'customer'
        })
      ).rejects.toThrow('Email already registered');
    });

    it('should default to customer role', async () => {
      const user = await userService.create({
        email: 'customer@example.com',
        password: 'password123',
        name: 'Customer User'
      });

      expect(user.role).toBe('customer');
    });

    it('should login with correct credentials', async () => {
      await userService.create({
        email: 'login@example.com',
        password: 'password123',
        name: 'Login User',
        role: 'customer'
      });

      const user = await userService.login({
        email: 'login@example.com',
        password: 'password123'
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('login@example.com');
    });

    it('should reject invalid credentials', async () => {
      await userService.create({
        email: 'reject@example.com',
        password: 'password123',
        name: 'Reject User',
        role: 'customer'
      });

      await expect(
        userService.login({
          email: 'reject@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should reject login for non-existent user', async () => {
      await expect(
        userService.login({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should create user from social login', async () => {
      const user = await userService.createFromSocialLogin({
        email: 'google@example.com',
        name: 'Google User',
        provider: 'google',
        providerId: 'google-abc123',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('google@example.com');
      expect(user.provider).toBe('google');
      expect(user.role).toBe('customer');
    });

    it('should return existing user for duplicate social login', async () => {
      const first = await userService.createFromSocialLogin({
        email: 'existing@example.com',
        name: 'Existing User',
        provider: 'google',
        providerId: 'google-existing',
      });

      const second = await userService.createFromSocialLogin({
        email: 'existing@example.com',
        name: 'Existing User',
        provider: 'google',
        providerId: 'google-existing',
      });

      expect(first.id).toBe(second.id);
    });

    it('should reject social login for user with different provider', async () => {
      await userService.create({
        email: 'password@example.com',
        password: 'password123',
        name: 'Password User',
      });

      await expect(
        userService.createFromSocialLogin({
          email: 'password@example.com',
          name: 'Password User',
          provider: 'google',
          providerId: 'google-new',
        })
      ).rejects.toThrow('Email already registered with different login method');
    });
  });
});
