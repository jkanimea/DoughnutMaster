import { BaseService } from '../../core/base/BaseService';
import { PaymentMethodRepository, type PaymentMethod, paymentMethodRepository } from './repository';
import type { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto';

interface CreatePaymentMethodWithUser extends CreatePaymentMethodDto {
  userId: string;
}

export class PaymentMethodService extends BaseService<PaymentMethod, CreatePaymentMethodWithUser, UpdatePaymentMethodDto> {
  constructor(private readonly pmRepo: PaymentMethodRepository = paymentMethodRepository) {
    super(pmRepo);
  }

  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    return this.pmRepo.findByUserId(userId);
  }
}

export const paymentMethodService = new PaymentMethodService();
