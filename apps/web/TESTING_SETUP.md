# Frontend Testing Setup Guide

This guide covers the complete frontend testing setup for CarKid0 Rentals.

## 📦 Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.40.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@axe-core/react": "^4.8.0",
    "lighthouse": "^11.4.0"
  }
}
```

## 🔧 Jest Configuration

**File:** `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/_*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

**File:** `jest.setup.js`

```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = jest.fn()
```

## 🧪 Playwright Configuration

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 📝 Test Scripts

**Add to `package.json`:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:lighthouse": "node scripts/lighthouse.js",
    "test:all": "npm run test && npm run test:e2e && npm run test:lighthouse"
  }
}
```

## 🎯 Test Structure

```
apps/web/
├── src/
│   └── components/
│       ├── notifications/
│       │   ├── NotificationBell.tsx
│       │   └── __tests__/
│       │       └── NotificationBell.test.tsx
│       ├── payments/
│       │   ├── AddPaymentMethod.tsx
│       │   └── __tests__/
│       │       └── AddPaymentMethod.test.tsx
│       └── support/
│           ├── SupportTicketForm.tsx
│           └── __tests__/
│               └── SupportTicketForm.test.tsx
├── e2e/
│   ├── booking-flow.spec.ts
│   ├── payment-flow.spec.ts
│   └── support-flow.spec.ts
├── scripts/
│   └── lighthouse.js
├── jest.config.js
├── jest.setup.js
└── playwright.config.ts
```

## 🚀 Running Tests

### Unit & Component Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Specific browser
npx playwright test --project=chromium
```

### Lighthouse Tests
```bash
npm run test:lighthouse
```

### All Tests
```bash
npm run test:all
```

## 📊 Coverage Reports

After running tests with coverage:
- **Terminal:** Coverage summary
- **HTML Report:** `coverage/lcov-report/index.html`
- **Playwright Report:** `playwright-report/index.html`

## ✅ CI/CD Integration

**GitHub Actions:** `.github/workflows/frontend-tests.yml`

```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd apps/web && npm ci
      
      - name: Run unit tests
        run: cd apps/web && npm run test:coverage
      
      - name: Run E2E tests
        run: cd apps/web && npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/web/coverage/lcov.info
```

## 🎯 Testing Best Practices

1. **Test user behavior, not implementation**
2. **Use semantic queries (getByRole, getByLabelText)**
3. **Mock external dependencies**
4. **Test accessibility**
5. **Keep tests isolated**
6. **Use descriptive test names**
7. **Follow AAA pattern (Arrange, Act, Assert)**

## 📚 Resources

- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev)
- [Jest](https://jestjs.io)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
