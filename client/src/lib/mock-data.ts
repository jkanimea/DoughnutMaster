import heroImage from '@assets/generated_images/hero_image_of_delicious_glazed_donuts.png';
import donutBagImage from '@assets/generated_images/bag_of_10_sugar_donuts.png';
import bunsImage from '@assets/generated_images/cinnamon_buns_with_icing.png';
import pastriesImage from '@assets/generated_images/assorted_cream_pastries.png';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'donuts' | 'pastries' | 'buns';
  unit: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Bag of Donuts',
    description: '10 fresh, golden fried donuts dusted with sugar. The classic choice.',
    price: 10.00,
    image: donutBagImage,
    category: 'donuts',
    unit: 'bag (10 items)'
  },
  {
    id: 'p2',
    name: 'Cinnamon Buns',
    description: 'Gooey, warm cinnamon buns topped with rich cream cheese icing.',
    price: 4.50,
    image: bunsImage,
    category: 'buns',
    unit: 'each'
  },
  {
    id: 'p3',
    name: 'Cream Pastries',
    description: 'Delicate puff pastry filled with vanilla custard and topped with fresh fruit.',
    price: 5.50,
    image: pastriesImage,
    category: 'pastries',
    unit: 'each'
  }
];

export const MOCK_ADMIN_USER = {
  id: 'a1',
  name: 'Admin User',
  email: 'admin@donutmaster.com',
  role: 'admin',
  savedCards: [],
  orders: []
};

export const MOCK_USER = {
  id: 'u1',
  name: 'Sarah Jenkins',
  email: 'sarah@example.com',
  role: 'customer',
  savedCards: [
    { id: 'card_1', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2025 }
  ],
  orders: [
    { id: 'ord_123', date: '2024-12-15', total: 20.00, status: 'delivered', items: '2x Bag of Donuts' },
    { id: 'ord_124', date: '2024-12-28', total: 45.00, status: 'processing', items: '3x Bag of Donuts, 2x Cinnamon Buns' }
  ]
};

export const MOCK_ADMIN_STATS = {
  revenue: 12580.00,
  orders: 142,
  profit: 4250.00,
  recentOrders: [
    { id: 'ord_125', customer: 'John Doe', total: 30.00, status: 'pending', date: 'Today' },
    { id: 'ord_124', customer: 'Sarah Jenkins', total: 45.00, status: 'processing', date: 'Yesterday' },
    { id: 'ord_123', customer: 'Mike Smith', total: 10.00, status: 'delivered', date: 'Dec 28' },
    { id: 'ord_122', customer: 'Emily Brown', total: 25.00, status: 'delivered', date: 'Dec 27' },
  ]
};
