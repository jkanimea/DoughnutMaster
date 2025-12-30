import { db } from './db';
import { products, users } from '@shared/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.insert(users).values({
    email: 'admin@donutmaster.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin'
  }).onConflictDoNothing();

  // Create sample products
  const sampleProducts = [
    // Donuts
    {
      name: 'Classic Glazed',
      description: 'Our signature glazed donut, perfectly sweet and fluffy',
      price: 350, // $3.50 in cents
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
      category: 'donuts' as const,
      unit: 'per donut',
      isActive: true
    },
    {
      name: 'Chocolate Frosted',
      description: 'Rich chocolate frosting on a soft donut base',
      price: 375,
      image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400',
      category: 'donuts' as const,
      unit: 'per donut',
      isActive: true
    },
    {
      name: 'Boston Cream',
      description: 'Filled with custard and topped with chocolate',
      price: 425,
      image: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400',
      category: 'donuts' as const,
      unit: 'per donut',
      isActive: true
    },
    // Pastries
    {
      name: 'Croissant',
      description: 'Buttery, flaky French croissant',
      price: 450,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
      category: 'pastries' as const,
      unit: 'per piece',
      isActive: true
    },
    {
      name: 'Apple Turnover',
      description: 'Flaky pastry filled with sweet cinnamon apples',
      price: 475,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      category: 'pastries' as const,
      unit: 'per piece',
      isActive: true
    },
    {
      name: 'Danish',
      description: 'Sweet Danish pastry with fruit filling',
      price: 450,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      category: 'pastries' as const,
      unit: 'per piece',
      isActive: true
    },
    // Buns
    {
      name: 'Cinnamon Roll',
      description: 'Soft cinnamon roll with cream cheese frosting',
      price: 425,
      image: 'https://images.unsplash.com/photo-1509365390-8b6b1825f0eb?w=400',
      category: 'buns' as const,
      unit: 'per roll',
      isActive: true
    },
    {
      name: 'Hot Cross Buns',
      description: 'Traditional spiced buns with dried fruit',
      price: 400,
      image: 'https://images.unsplash.com/photo-1612182062366-6f6445ab38da?w=400',
      category: 'buns' as const,
      unit: 'per bun',
      isActive: true
    },
    {
      name: 'Sticky Buns',
      description: 'Sweet buns with caramel and pecans',
      price: 475,
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=400',
      category: 'buns' as const,
      unit: 'per bun',
      isActive: true
    }
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product).onConflictDoNothing();
  }

  console.log('Seeding complete!');
}

seed()
  .catch(console.error)
  .finally(() => process.exit());
