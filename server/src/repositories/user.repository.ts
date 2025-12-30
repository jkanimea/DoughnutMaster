import prisma from '../database/prisma';
import type { User, CreateUserInput } from '../models';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  async create(data: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || 'customer',
      },
    });
    return user;
  }
}

export const userRepository = new UserRepository();
