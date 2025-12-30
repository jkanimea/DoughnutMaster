import prisma from '../../database/prisma';
import crypto from 'crypto';

export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export class PasswordResetRepository {
  async create(userId: string): Promise<{ token: string; record: PasswordResetToken }> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    const record = await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { token, record: this.mapToEntity(record) };
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    return record ? this.mapToEntity(record) : null;
  }

  async markUsed(id: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  private mapToEntity(record: any): PasswordResetToken {
    return {
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
      createdAt: record.createdAt,
    };
  }
}

export const passwordResetRepository = new PasswordResetRepository();
