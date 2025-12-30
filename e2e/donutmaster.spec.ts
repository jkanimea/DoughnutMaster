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

test.describe('Registration Flow', () => {
  test('should display registration page with form fields', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByTestId('register-card')).toBeVisible();
    await expect(page.getByTestId('input-name')).toBeVisible();
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('input-phone')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
    await expect(page.getByTestId('input-confirm-password')).toBeVisible();
    await expect(page.getByTestId('btn-register')).toBeVisible();
  });

  test('should display social login buttons', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByTestId('btn-google-login')).toBeVisible();
    await expect(page.getByTestId('btn-facebook-login')).toBeVisible();
  });

  test('should link to login page', async ({ page }) => {
    await page.goto('/register');
    
    const loginLink = page.getByTestId('link-login');
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    
    await expect(page).toHaveURL('/login');
  });

  test('should show validation error for mismatched passwords', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByTestId('input-name').fill('Test User');
    await page.getByTestId('input-email').fill('test@example.com');
    await page.getByTestId('input-password').fill('password123');
    await page.getByTestId('input-confirm-password').fill('different');
    await page.getByTestId('btn-register').click();
    
    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByTestId('input-name').fill('Test User');
    await page.getByTestId('input-email').fill('test@example.com');
    await page.getByTestId('input-password').fill('12345');
    await page.getByTestId('input-confirm-password').fill('12345');
    await page.getByTestId('btn-register').click();
    
    await expect(page.getByText(/at least 6 characters/i)).toBeVisible();
  });

  test('should register a new user successfully', async ({ page }) => {
    const uniqueEmail = `e2e-${Date.now()}@test.com`;
    await page.goto('/register');
    
    await page.getByTestId('input-name').fill('E2E Test User');
    await page.getByTestId('input-email').fill(uniqueEmail);
    await page.getByTestId('input-phone').fill('+64 21 987 6543');
    await page.getByTestId('input-password').fill('password123');
    await page.getByTestId('input-confirm-password').fill('password123');
    await page.getByTestId('btn-register').click();
    
    await expect(page.getByText(/Welcome!/i)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL('/');
  });
});

test.describe('Login Flow', () => {
  test('should display login page with form fields', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByTestId('login-card')).toBeVisible();
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
    await expect(page.getByTestId('btn-login')).toBeVisible();
  });

  test('should display social login buttons on login page', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByTestId('btn-google-login')).toBeVisible();
    await expect(page.getByTestId('btn-facebook-login')).toBeVisible();
  });

  test('should link to register page', async ({ page }) => {
    await page.goto('/login');
    
    const registerLink = page.getByTestId('link-register');
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    
    await expect(page).toHaveURL('/register');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByTestId('input-email').fill('invalid@example.com');
    await page.getByTestId('input-password').fill('wrongpassword');
    await page.getByTestId('btn-login').click();
    
    await expect(page.getByText(/Invalid credentials|Login failed/i)).toBeVisible({ timeout: 5000 });
  });

  test('should login admin user successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByTestId('input-email').fill('admin@donutmaster.co.nz');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('btn-login').click();
    
    await expect(page.getByText(/Welcome back!/i)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL('/admin');
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
