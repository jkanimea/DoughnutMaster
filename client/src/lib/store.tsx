import { createContext, useContext, useState, type ReactNode } from 'react';
import { Product, MOCK_USER } from './mock-data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
  // Availability Management
  selectedOrderDate: Date | undefined;
  setSelectedOrderDate: (date: Date | undefined) => void;
  availability: Record<string, string[]>; // Date string -> Array of unavailable product category IDs
  updateAvailability: (date: Date, category: string, isAvailable: boolean) => void;
  checkAvailability: (category: string) => boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<typeof MOCK_USER | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // New State for Availability
  const [selectedOrderDate, setSelectedOrderDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Record<string, string[]>>({}); // Stores UNAVAILABLE categories per date
  
  const { toast } = useToast();

  const addToCart = (product: Product, quantity: number) => {
    // Basic check - though UI should disable it
    if (!checkAvailability(product.category)) {
      toast({ title: "Item Unavailable", description: "This item is not available for the selected date.", variant: "destructive" });
      return;
    }

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

  // Availability Logic
  const updateAvailability = (date: Date, category: string, isAvailable: boolean) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setAvailability(prev => {
      const currentUnavailable = prev[dateKey] || [];
      if (isAvailable) {
        // Remove from unavailable list
        return { ...prev, [dateKey]: currentUnavailable.filter(c => c !== category) };
      } else {
        // Add to unavailable list
        if (currentUnavailable.includes(category)) return prev;
        return { ...prev, [dateKey]: [...currentUnavailable, category] };
      }
    });
  };

  const checkAvailability = (category: string) => {
    if (!selectedOrderDate) return true; // Assume available if no date picked (or enforce date picking first)
    const dateKey = format(selectedOrderDate, 'yyyy-MM-dd');
    const unavailableCategories = availability[dateKey] || [];
    return !unavailableCategories.includes(category);
  };

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, cartTotal,
      user, login, logout,
      isCartOpen, setIsCartOpen,
      selectedOrderDate, setSelectedOrderDate,
      availability, updateAvailability, checkAvailability
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
