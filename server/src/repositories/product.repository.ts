import prisma from '../database/prisma';
import type { Product, CreateProductInput } from '../models';

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });
    return products;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    return product;
  }

  async create(data: CreateProductInput): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category,
        unit: data.unit,
        isActive: data.isActive ?? true,
      },
    });
    return product;
  }
}

export const productRepository = new ProductRepository();
