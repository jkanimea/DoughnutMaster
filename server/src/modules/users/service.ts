import bcrypt from 'bcryptjs';
import { BaseService } from '../../core/base/BaseService';
import { ConflictError, UnauthorizedError } from '../../core/exceptions';
import { UserRepository, type User, userRepository } from './repository';
import type { CreateUserDto, CreateSocialUserDto, UpdateUserDto, LoginDto } from './dto';

export class UserService extends BaseService<User, CreateUserDto, UpdateUserDto> {
  constructor(private readonly userRepo: UserRepository = userRepository) {
    super(userRepo, 'User');
  }

  protected async beforeCreate(data: CreateUserDto): Promise<CreateUserDto> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return { ...data, password: hashedPassword };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.userRepo.findByProvider(provider, providerId);
  }

  async login(credentials: LoginDto): Promise<User> {
    const user = await this.userRepo.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedError('Please use social login for this account');
    }

    const valid = await bcrypt.compare(credentials.password, user.password);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return user;
  }

  async updatePassword(userId: string, newPassword: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.update(userId, { password: hashedPassword } as any);
  }

  async createFromSocialLogin(data: CreateSocialUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      if (existing.provider === data.provider) {
        return existing;
      }
      throw new ConflictError('Email already registered with different login method');
    }

    return this.userRepo.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role || 'customer',
      provider: data.provider,
      providerId: data.providerId,
    } as any);
  }
}

export const userService = new UserService();
export type { User };
