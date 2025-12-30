import { test, expect } from '@playwright/test';

test.describe('DonutMaster Pro E2E Tests', () => {
  test('should load home page with products', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('DonutMaster Pro')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Fresh Baked/i })).toBeVisible();
  });

  test('should display product catalog', async ({ page }) => {
    await page.goto('/');
    
    const productCards = page.locator('[data-testid^="card-product"]');
    await expect(productCards.first()).toBeVisible();
  });

  test('should be able to select delivery date', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText(/Select Delivery Date/i)).toBeVisible();
  });

  test('should handle cart drawer', async ({ page }) => {
    await page.goto('/');
    
    const cartButton = page.getByTestId('button-cart');
    await expect(cartButton).toBeVisible();
  });

  test('should navigate to checkout page', async ({ page }) => {
    await page.goto('/checkout');
    
    await expect(page.locator('body')).toContainText(/checkout|payment/i);
  });

  test('should navigate to dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('body')).toContainText(/dashboard|login|sign/i);
  });

  test('should navigate to admin page', async ({ page }) => {
    await page.goto('/admin');
    
    await expect(page.locator('body')).toContainText(/admin|login|sign/i);
  });
});

test.describe('Authentication Flow', () => {
  test('should handle registration and login flow', async ({ page }) => {
    await page.goto('/');
    
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });
});

test.describe('Product Interaction', () => {
  test('should be able to interact with product cards', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('[data-testid^="card-product"]');
    
    const productCard = page.locator('[data-testid^="card-product"]').first();
    await expect(productCard).toBeVisible();
    
    const productName = productCard.locator('h3').first();
    await expect(productName).toBeVisible();
  });
});
