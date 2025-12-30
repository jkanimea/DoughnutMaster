import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, MOCK_USER } from './mock-data';
import { useToast } from '@/hooks/use-toast';

type CartItem = Product & { quantity: number };

type StoreContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  user: typeof MOCK_USER | null;
  login: () => void;
  logout: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<typeof MOCK_USER | null>(null); // Start logged out for demo
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added.`,
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const login = () => {
    setUser(MOCK_USER);
    toast({ title: "Welcome back!", description: `Logged in as ${MOCK_USER.name}` });
  };

  const logout = () => {
    setUser(null);
    toast({ title: "Logged out" });
  };

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, cartTotal,
      user, login, logout,
      isCartOpen, setIsCartOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
