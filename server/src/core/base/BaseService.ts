import type { IBaseService } from '../interfaces';
import type { IBaseRepository } from '../interfaces';
import { NotFoundError } from '../exceptions';

export abstract class BaseService<T, CreateDto, UpdateDto = Partial<CreateDto>>
  implements IBaseService<T, CreateDto, UpdateDto>
{
  constructor(
    protected readonly repository: IBaseRepository<T, CreateDto, UpdateDto>,
    protected readonly resourceName: string = 'Resource'
  ) {}

  protected async beforeCreate(data: CreateDto): Promise<CreateDto> {
    return data;
  }

  protected async afterCreate(entity: T): Promise<T> {
    return entity;
  }

  protected async beforeUpdate(id: string, data: UpdateDto): Promise<UpdateDto> {
    return data;
  }

  protected async afterUpdate(entity: T): Promise<T> {
    return entity;
  }

  protected async beforeDelete(id: string): Promise<void> {}

  protected async afterDelete(id: string): Promise<void> {}

  async create(data: CreateDto): Promise<T> {
    const processedData = await this.beforeCreate(data);
    const entity = await this.repository.create(processedData);
    return this.afterCreate(entity);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findAll(options?: { skip?: number; take?: number }): Promise<T[]> {
    return this.repository.findAll(options);
  }

  async update(id: string, data: UpdateDto): Promise<T | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(this.resourceName, id);
    }

    const processedData = await this.beforeUpdate(id, data);
    const entity = await this.repository.update(id, processedData);
    if (entity) {
      return this.afterUpdate(entity);
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError(this.resourceName, id);
    }

    await this.beforeDelete(id);
    await this.repository.delete(id);
    await this.afterDelete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
