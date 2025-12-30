export interface IBaseRepository<T, CreateDto, UpdateDto = Partial<CreateDto>> {
  create(data: CreateDto): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(options?: { skip?: number; take?: number }): Promise<T[]>;
  update(id: string, data: UpdateDto): Promise<T | null>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
