import { BaseService } from '../../core/base/BaseService';
import { ProductRepository, type Product, productRepository } from './repository';
import type { CreateProductDto, UpdateProductDto } from './dto';

export class ProductService extends BaseService<Product, CreateProductDto, UpdateProductDto> {
  constructor(private readonly productRepo: ProductRepository = productRepository) {
    super(productRepo, 'Product');
  }

  async findAllActive(): Promise<Product[]> {
    return this.productRepo.findAllActive();
  }

  async findByCategory(category: 'donuts' | 'pastries' | 'buns'): Promise<Product[]> {
    return this.productRepo.findByCategory(category);
  }
}

export const productService = new ProductService();
