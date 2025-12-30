# DonutMaster Pro

## Overview

DonutMaster Pro is a full-stack bakery management and e-commerce platform for selling donuts, pastries, and buns. The system supports customer ordering with date-based product availability, shopping cart functionality, checkout with payment processing, customer dashboards, and an admin panel for inventory and availability management.

The application follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: React Context API via custom `StoreProvider` for cart, user session, and availability state
- **Data Fetching**: TanStack React Query for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom theme variables for a warm bakery aesthetic
- **Animations**: Framer Motion for page transitions and micro-interactions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api` prefix
- **Development Server**: Vite dev server proxied through Express for HMR support
- **Production Build**: esbuild bundles server code, Vite builds client assets to `dist/public`

### Database Layer
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: Users, Products, Orders, ProductAvailability, PaymentMethods

### Key Data Models
- **Users**: Email/password auth with customer and admin roles
- **Products**: Donuts, pastries, buns with pricing in cents, category-based organization
- **Orders**: Links users to products with delivery dates, status tracking, and payment info
- **ProductAvailability**: Date-based availability toggling per product category

### Authentication
- Session-based authentication using bcrypt for password hashing
- Role-based access control (customer vs admin)
- Currently uses mock users for development; database-backed auth routes are implemented

### Testing Infrastructure
- **Unit/Integration Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright configured for Chromium
- **Coverage**: V8 coverage provider with 80%+ target
- **Test Setup**: Custom setup file at `tests/setup.ts` with image mocking
- **Test Files**: 
  - `server/__tests__/storage.test.ts`: 17 storage layer tests
  - `server/__tests__/routes.test.ts`: 15 API integration tests
  - `client/src/__tests__/components/ProductCard.test.tsx`: 4 component tests
  - `e2e/donutmaster.spec.ts`: 9 end-to-end test scenarios
- **Test Commands**:
  - `npx vitest run`: Run all unit/integration tests
  - `npx vitest run --coverage`: Run with coverage report
  - `npx playwright test`: Run E2E tests
- **Current Status**: 36 passing unit/integration tests, E2E framework configured

## External Dependencies

### Database
- **PostgreSQL**: Required database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema definitions and query builder
- **drizzle-kit**: Database migrations with `db:push` command

### Payment Processing
- **Stripe**: Listed in build allowlist for payment processing (implementation pending)

### UI/UX Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tabs, etc.)
- **Recharts**: Charting library for admin dashboard analytics
- **Lucide React**: Icon library
- **date-fns**: Date formatting and manipulation

### Build Tools
- **Vite**: Frontend bundling with React plugin and Tailwind CSS
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development server

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator
- **Custom meta-images plugin**: Updates OpenGraph images with deployment URL