import type { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../core/base/BaseController';
import { UserService, type User, userService } from './service';
import { createUserSchema, updateUserSchema, loginSchema, type CreateUserDto, type UpdateUserDto } from './dto';

export class UserController extends BaseController<User, CreateUserDto, UpdateUserDto> {
  protected get createSchema() {
    return createUserSchema;
  }

  protected get updateSchema() {
    return updateUserSchema;
  }

  constructor(private readonly userSvc: UserService = userService) {
    super(userSvc);
  }

  protected formatResponse(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(req: Request, res: Response): Promise<void> {
    await this.create(req, res);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await this.userSvc.login(credentials);

      req.session.userId = user.id;
      req.session.role = user.role;

      res.json(this.formatResponse(user));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    req.session.destroy(() => {
      res.json({ message: 'Logged out' });
    });
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.session.userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const user = await this.userSvc.findById(req.session.userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(this.formatResponse(user));
    } catch (error) {
      this.handleError(error, res);
    }
  }
}

export const userController = new UserController();
