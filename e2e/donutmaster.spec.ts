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

  test('should navigate to admin page', async ({ page }) => {
    await page.goto('/admin');
    
    await expect(page.locator('body')).toContainText(/admin|login|sign/i);
  });
});

test.describe('Dashboard Registration Flow', () => {
  test('should display registration form on dashboard for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.getByTestId('register-card')).toBeVisible();
    await expect(page.getByTestId('input-name')).toBeVisible();
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('input-phone')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
    await expect(page.getByTestId('input-confirm-password')).toBeVisible();
  });

  test('should display social login buttons on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.getByTestId('btn-google-login')).toBeVisible();
    await expect(page.getByTestId('btn-facebook-login')).toBeVisible();
  });

  test('should show validation error for mismatched passwords on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByTestId('input-name').fill('Test User');
    await page.getByTestId('input-email').fill('test@example.com');
    await page.getByTestId('input-password').fill('password123');
    await page.getByTestId('input-confirm-password').fill('different');
    await page.getByTestId('btn-register').click();
    
    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
  });

  test('should register from dashboard successfully', async ({ page }) => {
    const uniqueEmail = `dashboard-${Date.now()}@test.com`;
    await page.goto('/dashboard');
    
    await page.getByTestId('input-name').fill('Dashboard User');
    await page.getByTestId('input-email').fill(uniqueEmail);
    await page.getByTestId('input-phone').fill('+64 21 555 1234');
    await page.getByTestId('input-password').fill('password123');
    await page.getByTestId('input-confirm-password').fill('password123');
    await page.getByTestId('btn-register').click();
    
    await expect(page.getByText(/Welcome!/i)).toBeVisible({ timeout: 10000 });
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

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');
    
    const forgotLink = page.getByTestId('link-forgot-password');
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();
    
    await expect(page).toHaveURL('/forgot-password');
  });

  test('should link to dashboard for registration', async ({ page }) => {
    await page.goto('/login');
    
    const registerLink = page.getByTestId('link-register');
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    
    await expect(page).toHaveURL('/dashboard');
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

test.describe('Forgot Password Flow', () => {
  test('should display forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await expect(page.getByTestId('forgot-password-card')).toBeVisible();
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('btn-send-reset')).toBeVisible();
  });

  test('should have back to login link', async ({ page }) => {
    await page.goto('/forgot-password');
    
    const backLink = page.getByTestId('link-back-login');
    await expect(backLink).toBeVisible();
    await backLink.click();
    
    await expect(page).toHaveURL('/login');
  });

  test('should submit forgot password request', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await page.getByTestId('input-email').fill('admin@donutmaster.co.nz');
    await page.getByTestId('btn-send-reset').click();
    
    await expect(page.getByTestId('forgot-password-success')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Check Your Email/i)).toBeVisible();
  });

  test('should show reset link in development mode', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await page.getByTestId('input-email').fill('admin@donutmaster.co.nz');
    await page.getByTestId('btn-send-reset').click();
    
    await expect(page.getByTestId('link-reset-token')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Reset Password Flow', () => {
  test('should show invalid link message without token', async ({ page }) => {
    await page.goto('/reset-password');
    
    await expect(page.getByTestId('reset-password-invalid')).toBeVisible();
    await expect(page.getByText(/Invalid Link/i)).toBeVisible();
  });

  test('should show expired message for invalid token', async ({ page }) => {
    await page.goto('/reset-password?token=invalid-token');
    
    await expect(page.getByTestId('reset-password-expired')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Link Expired/i)).toBeVisible();
  });

  test('should complete full password reset flow', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByTestId('input-email').fill('admin@donutmaster.co.nz');
    await page.getByTestId('btn-send-reset').click();
    
    await expect(page.getByTestId('link-reset-token')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('link-reset-token').click();
    
    await expect(page.getByTestId('reset-password-card')).toBeVisible();
    await page.getByTestId('input-password').fill('newpassword123');
    await page.getByTestId('input-confirm-password').fill('newpassword123');
    await page.getByTestId('btn-reset-password').click();
    
    await expect(page.getByTestId('reset-password-success')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Password Reset!/i)).toBeVisible();
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
