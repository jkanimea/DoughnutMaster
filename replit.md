# DonutMaster Pro

## Overview

DonutMaster Pro is a full-stack bakery management and e-commerce platform for selling donuts, pastries, and buns. The system supports customer ordering with date-based product availability, shopping cart functionality, checkout with payment processing, customer dashboards, and an admin panel for inventory and availability management.

The application follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database using Prisma ORM with a clean layered architecture.

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

### Backend Architecture (Layered / Clean Architecture)
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api` prefix
- **Architecture Pattern**: Inheritance-based layered architecture with generic base classes

#### Core Layer (`server/src/core/`)
- **Interfaces**: `IBaseRepository`, `IBaseService`, `IBaseController` with TypeScript generics
- **Base Classes**:
  - `BaseRepository`: Generic Prisma CRUD operations
  - `BaseService`: Business logic with lifecycle hooks (beforeCreate, afterCreate, beforeUpdate, etc.)
  - `BaseController`: HTTP handling with centralized error management
- **Exceptions**: Centralized error classes (AppError, NotFoundError, ValidationError, UnauthorizedError, ForbiddenError, ConflictError)

#### Module Layer (`server/src/modules/`)
Each entity has its own module folder with:
- `repository.ts`: Extends BaseRepository, adds entity-specific queries
- `service.ts`: Extends BaseService, adds business logic
- `controller.ts`: Extends BaseController, adds custom endpoints
- `dto/index.ts`: Zod schemas and TypeScript types

**Modules:**
- `users/`: Authentication, user management
- `products/`: Product catalog, categories
- `orders/`: Order creation, status management
- `availability/`: Date-based product availability
- `payment-methods/`: Saved payment methods

#### Benefits of This Pattern
- 90% less boilerplate code for new entities
- CRUD operations inherited from base classes
- Only unique business methods added in child classes
- Consistent error handling across all endpoints
- New entity can be added in ~30 minutes following the 6-step workflow

### Database Layer
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Prisma 7 with PostgreSQL adapter pattern
- **Schema Location**: `prisma/schema.prisma` contains all model definitions
- **Tables**: User, Product, Order, ProductAvailability, PaymentMethod

### Key Data Models
- **Users**: Email/password auth with optional phone, social login support (Google/Facebook via provider/providerId fields), customer and admin roles
- **Products**: Donuts, pastries, buns with pricing in cents, category-based organization
- **Orders**: Links users to products with delivery dates, status tracking, and payment info
- **ProductAvailability**: Date-based availability toggling per product category

### Authentication
- Session-based authentication using bcrypt for password hashing
- Role-based access control (customer vs admin) - new users default to customer role
- Social login support with provider/providerId fields (Google, Facebook ready)
- Default admin account: admin@donutmaster.co.nz / admin123 (created via seed script)
- Registration page at `/register` with name, email, phone, and social login buttons
- Login page at `/login` with email/password and social login buttons
- Database-backed auth with Prisma

### Testing Infrastructure
- **Unit/Integration Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright configured for Chromium
- **Coverage**: V8 coverage provider with 80%+ target
- **Test Setup**: Custom setup file at `tests/setup.ts` with image mocking
- **Test Files**: 
  - `server/__tests__/storage.test.ts`: 17 repository layer tests
  - `server/__tests__/routes.test.ts`: 15 API integration tests
  - `server/__tests__/registration.test.ts`: 14 registration and social login tests
  - `client/src/__tests__/components/ProductCard.test.tsx`: 4 component tests
  - `e2e/donutmaster.spec.ts`: 17 end-to-end test scenarios (including registration/login flows)
- **Test Commands**:
  - `npx vitest run`: Run all unit/integration tests
  - `npx vitest run --coverage`: Run with coverage report
  - `npx playwright test`: Run E2E tests
  - `npx tsx prisma/seed.ts`: Seed admin user
- **Current Status**: 46 passing unit/integration tests, E2E framework configured

## Adding New Entities (6-Step Workflow)

1. **Define Entity**: Add model to `prisma/schema.prisma`
2. **Create DTOs**: Add Zod schemas in `modules/<entity>/dto/index.ts`
3. **Create Repository**: Extend BaseRepository, add custom queries (~5 lines)
4. **Create Service**: Extend BaseService, add business methods (~10 lines)
5. **Create Controller**: Extend BaseController, add custom endpoints (~10 lines)
6. **Create Routes**: Add routes to `server/routes.ts`

## External Dependencies

### Database
- **PostgreSQL**: Required database, connection via `DATABASE_URL` environment variable
- **Prisma ORM**: Schema definitions and client generation
- **Prisma Adapter**: PostgreSQL adapter pattern for connection pooling

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
