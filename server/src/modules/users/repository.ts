import { BaseRepository } from '../../core/base/BaseRepository';
import type { CreateUserDto, UpdateUserDto } from './dto';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

export class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.model.findUnique({
      where: { email },
    });
    return result ? this.mapToEntity(result) : null;
  }
}

export const userRepository = new UserRepository();
