import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../src/database/prisma';
import { passwordResetRepository } from '../src/modules/password-reset';
import { passwordResetService } from '../src/modules/password-reset/service';
import { userService } from '../src/modules/users/service';
import bcrypt from 'bcryptjs';

describe('Password Reset', () => {
  async function cleanupDatabase() {
    try {
      await prisma.passwordResetToken.deleteMany();
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

  describe('PasswordResetRepository', () => {
    it('should create a reset token', async () => {
      const user = await userService.create({
        email: 'reset@example.com',
        password: 'password123',
        name: 'Reset User',
      });

      const { token, record } = await passwordResetRepository.create(user.id);

      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(record.userId).toBe(user.id);
      expect(record.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should find valid token', async () => {
      const user = await userService.create({
        email: 'find@example.com',
        password: 'password123',
        name: 'Find User',
      });

      const { token } = await passwordResetRepository.create(user.id);
      const found = await passwordResetRepository.findByToken(token);

      expect(found).toBeDefined();
      expect(found?.userId).toBe(user.id);
    });

    it('should return null for invalid token', async () => {
      const found = await passwordResetRepository.findByToken('invalid-token');
      expect(found).toBeNull();
    });

    it('should mark token as used', async () => {
      const user = await userService.create({
        email: 'used@example.com',
        password: 'password123',
        name: 'Used User',
      });

      const { token, record } = await passwordResetRepository.create(user.id);
      await passwordResetRepository.markUsed(record.id);

      const found = await passwordResetRepository.findByToken(token);
      expect(found).toBeNull();
    });

    it('should invalidate previous tokens when creating new one', async () => {
      const user = await userService.create({
        email: 'multi@example.com',
        password: 'password123',
        name: 'Multi User',
      });

      const { token: token1 } = await passwordResetRepository.create(user.id);
      const { token: token2 } = await passwordResetRepository.create(user.id);

      const found1 = await passwordResetRepository.findByToken(token1);
      const found2 = await passwordResetRepository.findByToken(token2);

      expect(found1).toBeNull();
      expect(found2).toBeDefined();
    });
  });

  describe('PasswordResetService', () => {
    it('should request password reset for existing user', async () => {
      await userService.create({
        email: 'request@example.com',
        password: 'password123',
        name: 'Request User',
      });

      const { token } = await passwordResetService.requestReset('request@example.com');
      expect(token).toBeDefined();
      expect(token.length).toBe(64);
    });

    it('should return empty token for non-existent user', async () => {
      const { token } = await passwordResetService.requestReset('nonexistent@example.com');
      expect(token).toBe('');
    });

    it('should reject reset request for social login user', async () => {
      await userService.createFromSocialLogin({
        email: 'social@example.com',
        name: 'Social User',
        provider: 'google',
        providerId: 'google-123',
      });

      await expect(
        passwordResetService.requestReset('social@example.com')
      ).rejects.toThrow('social login');
    });

    it('should validate a valid token', async () => {
      const user = await userService.create({
        email: 'validate@example.com',
        password: 'password123',
        name: 'Validate User',
      });

      const { token } = await passwordResetRepository.create(user.id);
      const result = await passwordResetService.validateToken(token);

      expect(result).toBeDefined();
      expect(result?.userId).toBe(user.id);
    });

    it('should return null for invalid token validation', async () => {
      const result = await passwordResetService.validateToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should reset password successfully', async () => {
      const user = await userService.create({
        email: 'resetpw@example.com',
        password: 'oldpassword',
        name: 'Reset PW User',
      });

      const { token } = await passwordResetRepository.create(user.id);
      await passwordResetService.resetPassword(token, 'newpassword123');

      const loggedIn = await userService.login({
        email: 'resetpw@example.com',
        password: 'newpassword123',
      });

      expect(loggedIn).toBeDefined();
    });

    it('should reject reset with invalid token', async () => {
      await expect(
        passwordResetService.resetPassword('invalid-token', 'newpassword')
      ).rejects.toThrow('Invalid or expired');
    });

    it('should reject reset with short password', async () => {
      const user = await userService.create({
        email: 'short@example.com',
        password: 'password123',
        name: 'Short User',
      });

      const { token } = await passwordResetRepository.create(user.id);

      await expect(
        passwordResetService.resetPassword(token, '12345')
      ).rejects.toThrow('at least 6 characters');
    });

    it('should invalidate token after use', async () => {
      const user = await userService.create({
        email: 'once@example.com',
        password: 'oldpassword',
        name: 'Once User',
      });

      const { token } = await passwordResetRepository.create(user.id);
      await passwordResetService.resetPassword(token, 'newpassword123');

      await expect(
        passwordResetService.resetPassword(token, 'anotherpassword')
      ).rejects.toThrow('Invalid or expired');
    });
  });
});
