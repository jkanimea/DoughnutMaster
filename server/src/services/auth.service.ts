import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories';
import type { User, CreateUserInput } from '../models';

export class AuthService {
  async register(data: CreateUserInput): Promise<User> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  }
}

export const authService = new AuthService();
