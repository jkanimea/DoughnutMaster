import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// Mock image imports
vi.mock('@assets/generated_images/hero_image_of_delicious_glazed_donuts.png', () => ({
  default: 'mocked-hero-image.png'
}));
vi.mock('@assets/generated_images/bag_of_10_sugar_donuts.png', () => ({
  default: 'mocked-donut-bag.png'
}));
vi.mock('@assets/generated_images/cinnamon_buns_with_icing.png', () => ({
  default: 'mocked-buns.png'
}));
vi.mock('@assets/generated_images/assorted_cream_pastries.png', () => ({
  default: 'mocked-pastries.png'
}));
