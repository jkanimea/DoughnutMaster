export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: 'customer' | 'admin';
}

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

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'donuts' | 'pastries' | 'buns';
  unit: string;
  isActive?: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryDate: string;
  createdAt: Date;
}

export interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  total: number;
  status?: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryDate: string;
}

export interface ProductAvailability {
  id: string;
  date: string;
  category: 'donuts' | 'pastries' | 'buns';
  isAvailable: boolean;
}

export interface SetAvailabilityInput {
  date: string;
  category: 'donuts' | 'pastries' | 'buns';
  isAvailable: boolean;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface CreatePaymentMethodInput {
  userId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
}
