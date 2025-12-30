import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ui/ProductCard';
import { StoreProvider } from '@/lib/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
});

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'donuts' | 'pastries' | 'buns';
  unit: string;
  isActive?: boolean;
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        {ui}
      </StoreProvider>
    </QueryClientProvider>
  );
}

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Classic Glazed Donut',
    description: 'Our signature glazed donut',
    price: 350,
    image: 'https://example.com/donut.jpg',
    category: 'donuts',
    unit: 'per donut',
    isActive: true
  };

  it('should render product information', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Classic Glazed Donut')).toBeInTheDocument();
    expect(screen.getByText('Our signature glazed donut')).toBeInTheDocument();
    expect(screen.getByText('$3.50')).toBeInTheDocument();
  });

  it('should display product image', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Classic Glazed Donut');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/donut.jpg');
  });

  it('should have proper data-testid for the card', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const card = screen.getByTestId('card-product-1');
    expect(card).toBeInTheDocument();
  });

  it('should show sold out state when availability is false', () => {
    renderWithProviders(<ProductCard product={mockProduct} isAvailable={false} />);
    
    const soldOutElements = screen.getAllByText('Sold Out');
    expect(soldOutElements.length).toBeGreaterThan(0);
  });
});
