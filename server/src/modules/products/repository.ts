import { BaseRepository } from '../../core/base/BaseRepository';
import prisma from '../../database/prisma';
import type { CreateProductDto, UpdateProductDto } from './dto';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'donuts' | 'pastries' | 'buns';
  unit: string;
  isActive: boolean;
}

export class ProductRepository extends BaseRepository<Product, CreateProductDto, UpdateProductDto> {
  constructor() {
    super('product');
  }

  async findAllActive(): Promise<Product[]> {
    const results = await (prisma.product as any).findMany({
      where: { isActive: true },
    });
    return results.map((item: any) => this.mapToEntity(item));
  }

  async findByCategory(category: 'donuts' | 'pastries' | 'buns'): Promise<Product[]> {
    const results = await (prisma.product as any).findMany({
      where: { category, isActive: true },
    });
    return results.map((item: any) => this.mapToEntity(item));
  }
}

export const productRepository = new ProductRepository();
