import prisma from '../database/prisma';
import type { PaymentMethod, CreatePaymentMethodInput } from '../models';

export class PaymentMethodRepository {
  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId },
    });
    return methods;
  }

  async create(data: CreatePaymentMethodInput): Promise<PaymentMethod> {
    const method = await prisma.paymentMethod.create({
      data: {
        userId: data.userId,
        brand: data.brand,
        last4: data.last4,
        expMonth: data.expMonth,
        expYear: data.expYear,
        isDefault: data.isDefault ?? false,
      },
    });
    return method;
  }

  async delete(id: string): Promise<void> {
    await prisma.paymentMethod.delete({ where: { id } });
  }
}

export const paymentMethodRepository = new PaymentMethodRepository();
