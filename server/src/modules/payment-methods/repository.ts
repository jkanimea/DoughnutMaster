import { BaseRepository } from '../../core/base/BaseRepository';
import prisma from '../../database/prisma';
import type { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto';

export interface PaymentMethod {
  id: string;
  userId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  createdAt: Date;
}

interface CreatePaymentMethodWithUser extends CreatePaymentMethodDto {
  userId: string;
}

export class PaymentMethodRepository extends BaseRepository<PaymentMethod, CreatePaymentMethodWithUser, UpdatePaymentMethodDto> {
  constructor() {
    super('paymentMethod');
  }

  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    const results = await (prisma.paymentMethod as any).findMany({
      where: { userId },
    });
    return results.map((item: any) => this.mapToEntity(item));
  }
}

export const paymentMethodRepository = new PaymentMethodRepository();
