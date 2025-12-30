import type { Request, Response } from 'express';
import { productService } from '../services';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string().url(),
  category: z.enum(['donuts', 'pastries', 'buns']),
  unit: z.string().min(1),
  isActive: z.boolean().optional(),
});

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async create(req: Request, res: Response) {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.createProduct(data);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export const productController = new ProductController();
