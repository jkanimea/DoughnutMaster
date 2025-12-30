import type { Request, Response } from 'express';
import { z } from 'zod';
import { passwordResetService } from './service';
import { ValidationError } from '../../core/exceptions';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export class PasswordResetController {
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      const { token } = await passwordResetService.requestReset(email);
      
      res.json({ 
        message: 'If an account exists with this email, you will receive a password reset link.',
        token: process.env.NODE_ENV === 'development' ? token : undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid email address' });
        return;
      }
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const resetToken = await passwordResetService.validateToken(token);
      
      if (!resetToken) {
        res.status(400).json({ valid: false, message: 'Invalid or expired token' });
        return;
      }
      
      res.json({ valid: true });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      await passwordResetService.resetPassword(token, password);
      
      res.json({ message: 'Password reset successfully. You can now login with your new password.' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
      }
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const passwordResetController = new PasswordResetController();
