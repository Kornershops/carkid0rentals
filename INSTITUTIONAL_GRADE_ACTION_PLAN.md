# 🎯 Institutional-Grade Action Plan

**Goal:** Achieve 100% institutional-grade compliance  
**Current Score:** 92/100  
**Target Score:** 100/100  
**Timeline:** 4-6 weeks

---

## Priority 1: Critical Gaps (Week 1-2)

### 1.1 Testing Infrastructure ⚠️ CRITICAL
**Impact:** High | **Effort:** High | **Score Impact:** +8 points

#### Unit Tests (Jest/Vitest)
```bash
# Install dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Create test files
apps/web/src/hooks/__tests__/use-onboarding.test.tsx
apps/web/src/components/__tests__/RoleSelectionModal.test.tsx
apps/web/src/lib/__tests__/api-client.test.ts
```

**Test Coverage Targets:**
- Hooks: 90%+ coverage
- Components: 85%+ coverage
- Utilities: 95%+ coverage

#### E2E Tests (Playwright)
```bash
# Install Playwright
npm install -D @playwright/test

# Create E2E tests
apps/web/e2e/auth-flow.spec.ts
apps/web/e2e/booking-flow.spec.ts
apps/web/e2e/onboarding-flow.spec.ts
```

**Critical Flows to Test:**
- ✅ User authentication (OTP flow)
- ✅ KYC submission
- ✅ Onboarding completion
- ✅ Booking creation
- ✅ Payment processing

#### Accessibility Tests (axe-core)
```bash
# Install axe
npm install -D @axe-core/playwright

# Add to E2E tests
apps/web/e2e/accessibility.spec.ts
```

**Files to Create:**
- `vitest.config.ts`
- `playwright.config.ts`
- `apps/web/src/test-utils.tsx` (test setup)
- `.github/workflows/test.yml` (CI integration)

---

### 1.2 Security Enhancements ⚠️ CRITICAL
**Impact:** High | **Effort:** Medium | **Score Impact:** +3 points

#### Move Tokens to httpOnly Cookies
**Current:** Tokens in localStorage (vulnerable to XSS)  
**Target:** httpOnly cookies (XSS-proof)

```typescript
// apps/web/src/lib/auth.ts
export async function setAuthToken(token: string) {
  await fetch('/api/auth/set-cookie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
}

export async function getAuthToken(): Promise<string | null> {
  // Token automatically sent via httpOnly cookie
  return null; // No client-side access needed
}
```

**Backend Changes Required:**
```go
// apps/api/middleware/auth.go
func SetAuthCookie(c *fiber.Ctx, token string) {
    c.Cookie(&fiber.Cookie{
        Name:     "auth_token",
        Value:    token,
        HTTPOnly: true,
        Secure:   true,
        SameSite: "Strict",
        MaxAge:   7 * 24 * 60 * 60, // 7 days
    })
}
```

#### CSRF Protection
```typescript
// apps/web/src/lib/csrf.ts
export async function getCsrfToken(): Promise<string> {
  const res = await fetch('/api/auth/csrf-token');
  const { token } = await res.json();
  return token;
}

// Add to all mutation requests
headers: {
  'X-CSRF-Token': await getCsrfToken(),
}
```

#### Content Security Policy
```typescript
// apps/web/next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
];
```

**Files to Create/Modify:**
- `apps/web/src/lib/auth.ts` (refactor token management)
- `apps/web/src/lib/csrf.ts` (new)
- `apps/web/next.config.ts` (add security headers)
- `apps/api/middleware/csrf.go` (new)

---

### 1.3 Global Error Handling ⚠️ CRITICAL
**Impact:** Medium | **Effort:** Low | **Score Impact:** +2 points

#### Root Error Boundary
```typescript
// apps/web/src/app/layout.tsx
import ErrorBoundary from '@/components/ui/error-boundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

#### API Error Interceptor
```typescript
// apps/web/src/lib/api-client.ts
class ApiClient {
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof NetworkError) {
        // Retry logic
        return this.retryRequest(url, options);
      }
      throw error;
    }
  }

  private async retryRequest<T>(
    url: string, 
    options: RequestInit, 
    attempt = 1
  ): Promise<T> {
    const maxRetries = 3;
    const backoff = Math.min(1000 * Math.pow(2, attempt), 10000);
    
    if (attempt > maxRetries) {
      throw new NetworkError('Max retries exceeded');
    }
    
    await new Promise(resolve => setTimeout(resolve, backoff));
    return this.request(url, options);
  }
}
```

#### Error Monitoring (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

**Files to Create/Modify:**
- `apps/web/src/app/layout.tsx` (add error boundary)
- `apps/web/src/lib/api-client.ts` (add retry logic)
- `sentry.client.config.ts` (new)
- `sentry.server.config.ts` (new)

---

### 1.4 Accessibility Enhancements ⚠️ CRITICAL
**Impact:** Medium | **Effort:** Low | **Score Impact:** +2 points

#### Skip to Content Links
```typescript
// apps/web/src/components/layout/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
    >
      Skip to main content
    </a>
  );
}

// Add to layout
<SkipLink />
<main id="main-content">
  {children}
</main>
```

#### Enhanced Focus Indicators
```css
/* apps/web/src/app/globals.css */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

#### Reduced Motion Support
```typescript
// apps/web/src/hooks/use-reduced-motion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

**Files to Create/Modify:**
- `apps/web/src/components/layout/skip-link.tsx` (new)
- `apps/web/src/hooks/use-reduced-motion.ts` (new)
- `apps/web/src/app/globals.css` (enhance focus styles)
- Update all pages to include skip links

---

## Priority 2: Important Enhancements (Week 3-4)

### 2.1 Offline-First Architecture
**Impact:** Medium | **Effort:** High | **Score Impact:** +2 points

#### Service Worker
```bash
npm install next-pwa
```

```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // existing config
});
```

#### Offline Queue
```typescript
// apps/web/src/lib/offline-queue.ts
export class OfflineQueue {
  private queue: Array<{ url: string; options: RequestInit }> = [];

  async add(url: string, options: RequestInit) {
    this.queue.push({ url, options });
    await this.saveToIndexedDB();
  }

  async processQueue() {
    if (!navigator.onLine) return;

    for (const item of this.queue) {
      try {
        await fetch(item.url, item.options);
        this.queue = this.queue.filter(i => i !== item);
      } catch (error) {
        console.error('Failed to process queued request:', error);
      }
    }

    await this.saveToIndexedDB();
  }
}
```

---

### 2.2 Compliance Features
**Impact:** Medium | **Effort:** Medium | **Score Impact:** +2 points

#### Cookie Consent Banner
```typescript
// apps/web/src/components/cookie-consent.tsx
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShowBanner(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Initialize analytics
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your experience. By continuing, you agree to our{' '}
          <a href="/legal/cookies" className="underline">Cookie Policy</a>.
        </p>
        <div className="flex gap-2">
          <button onClick={handleAccept} className="px-4 py-2 bg-blue-600 rounded-lg">
            Accept
          </button>
          <button onClick={() => setShowBanner(false)} className="px-4 py-2 border border-white rounded-lg">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### Data Export
```typescript
// apps/web/src/lib/data-export.ts
export async function exportUserData() {
  const response = await api.exportUserData();
  const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `carkid0-data-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

---

### 2.3 Performance Monitoring
**Impact:** Low | **Effort:** Medium | **Score Impact:** +1 point

#### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/listings
            http://localhost:3000/auth/login
          uploadArtifacts: true
```

#### Bundle Analysis
```bash
npm install -D @next/bundle-analyzer
```

```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // existing config
});
```

---

## Priority 3: Nice-to-Have Features (Week 5-6)

### 3.1 Dark Mode
```typescript
// apps/web/src/hooks/use-theme.ts
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme, toggleTheme };
}
```

### 3.2 Toast Notifications
```bash
npm install sonner
```

```typescript
// apps/web/src/app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 3.3 Storybook
```bash
npx storybook@latest init
```

---

## Implementation Checklist

### Week 1-2: Critical Fixes
- [ ] Set up Vitest and write unit tests (20+ tests)
- [ ] Set up Playwright and write E2E tests (10+ flows)
- [ ] Add axe-core accessibility tests
- [ ] Move tokens to httpOnly cookies
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy headers
- [ ] Add global error boundary
- [ ] Implement API retry logic
- [ ] Integrate Sentry
- [ ] Add skip-to-content links
- [ ] Enhance focus indicators
- [ ] Implement reduced motion support

### Week 3-4: Important Enhancements
- [ ] Implement service worker
- [ ] Create offline queue system
- [ ] Add cookie consent banner
- [ ] Implement data export functionality
- [ ] Set up Lighthouse CI
- [ ] Add bundle analysis
- [ ] Implement toast notifications

### Week 5-6: Nice-to-Have
- [ ] Add dark mode support
- [ ] Set up Storybook
- [ ] Implement WebSocket for real-time features
- [ ] Add advanced analytics dashboard
- [ ] Implement load testing

---

## Success Metrics

### Testing Coverage
- **Target:** 85%+ overall coverage
- **Current:** 0% (no tests)
- **Measurement:** `npm run test:coverage`

### Security Score
- **Target:** A+ on Mozilla Observatory
- **Current:** Not measured
- **Measurement:** https://observatory.mozilla.org/

### Accessibility Score
- **Target:** 100/100 on Lighthouse
- **Current:** ~88/100 (estimated)
- **Measurement:** Lighthouse CI

### Performance Score
- **Target:** 90+ on Lighthouse
- **Current:** ~85 (estimated)
- **Measurement:** Lighthouse CI

### Bundle Size
- **Target:** < 200KB initial JS
- **Current:** Not measured
- **Measurement:** `ANALYZE=true npm run build`

---

## Estimated Effort

| Priority | Tasks | Effort | Timeline |
|----------|-------|--------|----------|
| P1 Critical | 12 tasks | 80 hours | Week 1-2 |
| P2 Important | 7 tasks | 40 hours | Week 3-4 |
| P3 Nice-to-Have | 5 tasks | 30 hours | Week 5-6 |
| **Total** | **24 tasks** | **150 hours** | **6 weeks** |

---

## Final Score Projection

| Category | Current | Target | Improvement |
|----------|---------|--------|-------------|
| Architecture | 95 | 98 | +3 |
| Security | 90 | 98 | +8 |
| Accessibility | 88 | 95 | +7 |
| Error Handling | 85 | 95 | +10 |
| Performance | 90 | 95 | +5 |
| UX/Design | 95 | 98 | +3 |
| Data Management | 92 | 95 | +3 |
| Testing | 75 | 95 | +20 |
| Documentation | 98 | 100 | +2 |
| Compliance | 90 | 98 | +8 |
| **Overall** | **92** | **100** | **+8** |

---

**Next Steps:**
1. Review and approve this action plan
2. Create GitHub issues for each task
3. Assign tasks to development team
4. Set up CI/CD pipelines
5. Begin implementation in priority order

**Questions?** Refer to INSTITUTIONAL_GRADE_ASSESSMENT.md for detailed analysis.

