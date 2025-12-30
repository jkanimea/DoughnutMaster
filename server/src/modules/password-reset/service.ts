import { passwordResetRepository, type PasswordResetToken } from './repository';
import { userService } from '../users/service';
import { NotFoundError, ValidationError } from '../../core/exceptions';

export class PasswordResetService {
  async requestReset(email: string): Promise<{ token: string }> {
    const user = await userService.findByEmail(email);
    if (!user) {
      return { token: '' };
    }

    if (!user.password) {
      throw new ValidationError('This account uses social login. Please sign in with Google or Facebook.');
    }

    const { token } = await passwordResetRepository.create(user.id);
    return { token };
  }

  async validateToken(token: string): Promise<PasswordResetToken | null> {
    return passwordResetRepository.findByToken(token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await passwordResetRepository.findByToken(token);
    if (!resetToken) {
      throw new ValidationError('Invalid or expired reset token');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    await userService.updatePassword(resetToken.userId, newPassword);
    await passwordResetRepository.markUsed(resetToken.id);
  }
}

export const passwordResetService = new PasswordResetService();
