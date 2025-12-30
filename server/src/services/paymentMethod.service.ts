import { paymentMethodRepository } from '../repositories';
import type { PaymentMethod, CreatePaymentMethodInput } from '../models';

export class PaymentMethodService {
  async getPaymentMethodsByUserId(userId: string): Promise<PaymentMethod[]> {
    return paymentMethodRepository.findByUserId(userId);
  }

  async createPaymentMethod(data: CreatePaymentMethodInput): Promise<PaymentMethod> {
    return paymentMethodRepository.create(data);
  }

  async deletePaymentMethod(id: string): Promise<void> {
    return paymentMethodRepository.delete(id);
  }
}

export const paymentMethodService = new PaymentMethodService();
