import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/layout/Navbar';
import { StoreProvider } from '@/lib/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'wouter';

const queryClient = new QueryClient();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Router>
          {ui}
        </Router>
      </StoreProvider>
    </QueryClientProvider>
  );
}

describe('Navbar', () => {
  it('should render the logo', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('DonutMaster Pro')).toBeInTheDocument();
  });

  it('should have navigation links', () => {
    renderWithProviders(<Navbar />);
    
    const homeLink = screen.getByTestId('link-home');
    expect(homeLink).toBeInTheDocument();
  });

  it('should have cart button', () => {
    renderWithProviders(<Navbar />);
    
    const cartButton = screen.getByTestId('button-cart');
    expect(cartButton).toBeInTheDocument();
  });
});
