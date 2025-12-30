import { productRepository } from '../repositories';
import type { Product, CreateProductInput } from '../models';

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return productRepository.findById(id);
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    return productRepository.create(data);
  }
}

export const productService = new ProductService();
