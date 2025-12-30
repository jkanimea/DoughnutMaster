import type { IBaseRepository } from '../interfaces';
import prisma from '../../database/prisma';

type PrismaDelegate = {
  create: (args: any) => Promise<any>;
  findUnique: (args: any) => Promise<any>;
  findMany: (args: any) => Promise<any[]>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
};

export abstract class BaseRepository<T, CreateDto, UpdateDto = Partial<CreateDto>>
  implements IBaseRepository<T, CreateDto, UpdateDto>
{
  constructor(protected readonly modelName: keyof typeof prisma) {}

  protected get model(): PrismaDelegate {
    return (prisma as any)[this.modelName] as PrismaDelegate;
  }

  protected mapToEntity(data: any): T {
    return data as T;
  }

  protected mapCreateData(data: CreateDto): any {
    return data;
  }

  protected mapUpdateData(data: UpdateDto): any {
    return data;
  }

  async create(data: CreateDto): Promise<T> {
    const result = await this.model.create({
      data: this.mapCreateData(data),
    });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findUnique({
      where: { id },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findAll(options?: { skip?: number; take?: number }): Promise<T[]> {
    const results = await this.model.findMany({
      skip: options?.skip,
      take: options?.take,
    });
    return results.map((item: any) => this.mapToEntity(item));
  }

  async update(id: string, data: UpdateDto): Promise<T | null> {
    try {
      const result = await this.model.update({
        where: { id },
        data: this.mapUpdateData(data),
      });
      return this.mapToEntity(result);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.model.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return;
      }
      throw error;
    }
  }

  async count(): Promise<number> {
    return this.model.count();
  }
}
