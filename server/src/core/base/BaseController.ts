import type { Request, Response } from 'express';
import type { IBaseController } from '../interfaces';
import type { IBaseService } from '../interfaces';
import { AppError, ValidationError, NotFoundError } from '../exceptions';
import { z } from 'zod';

export abstract class BaseController<T, CreateDto, UpdateDto = Partial<CreateDto>>
  implements IBaseController
{
  constructor(protected readonly service: IBaseService<T, CreateDto, UpdateDto>) {}

  protected abstract get createSchema(): z.ZodSchema<CreateDto>;
  protected abstract get updateSchema(): z.ZodSchema<UpdateDto>;

  protected handleError(error: unknown, res: Response): void {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.errors,
      });
      return;
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        message: error.message,
        code: error.code,
      });
      return;
    }

    console.error('Unhandled error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  protected formatResponse(data: T): any {
    return data;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = this.createSchema.parse(req.body);
      const entity = await this.service.create(validatedData);
      res.status(201).json(this.formatResponse(entity));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const entity = await this.service.findById(id);
      
      if (!entity) {
        res.status(404).json({ message: 'Not found' });
        return;
      }

      res.json(this.formatResponse(entity));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;
      
      const entities = await this.service.findAll({ skip, take });
      res.json(entities.map((e) => this.formatResponse(e)));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = this.updateSchema.parse(req.body);
      const entity = await this.service.update(id, validatedData);

      if (!entity) {
        res.status(404).json({ message: 'Not found' });
        return;
      }

      res.json(this.formatResponse(entity));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
