import type { Request, Response } from 'express';
import { BaseController } from '../../core/base/BaseController';
import { ProductService, type Product, productService } from './service';
import { createProductSchema, updateProductSchema, type CreateProductDto, type UpdateProductDto } from './dto';
import { ForbiddenError } from '../../core/exceptions';

export class ProductController extends BaseController<Product, CreateProductDto, UpdateProductDto> {
  protected get createSchema() {
    return createProductSchema;
  }

  protected get updateSchema() {
    return updateProductSchema;
  }

  constructor(private readonly productSvc: ProductService = productService) {
    super(productSvc);
  }

  async findAllActive(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productSvc.findAllActive();
      res.json(products);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async findByCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = req.params.category as 'donuts' | 'pastries' | 'buns';
      const products = await this.productSvc.findByCategory(category);
      res.json(products);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    if (req.session.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    await super.create(req, res);
  }

  async update(req: Request, res: Response): Promise<void> {
    if (req.session.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    await super.update(req, res);
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (req.session.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    await super.delete(req, res);
  }
}

export const productController = new ProductController();
