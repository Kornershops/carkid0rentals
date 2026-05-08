# CarKid0 Rentals — Platform Features

Omni-Tier Vehicle Rental Platform with real-time IoT enforcement.

---

## User Journeys

### 🚗 Renter Journey

| Feature | Description |
|---------|-------------|
| Vehicle Browse | Search and filter vehicles by category, location, price, and availability |
| Listing Detail | Full vehicle gallery, specs, pricing breakdown, and lister profile |
| Booking Flow | Date selection, cost calculator, and secure reservation |
| Booking Confirmation | Summary receipt with trip details and included perks |
| Role Selection | Switch between Renter, Driver, Hauler, or Lister at any time |

### 🧑‍✈️ Driver Journey

| Feature | Description |
|---------|-------------|
| Multi-Step Registration | Progressive onboarding with license, experience, and vehicle preference |
| Document Verification | Upload and verify driver's license, insurance, and identity documents |
| Driver Dashboard | Earnings overview, active trips, performance stats, and trip history |
| Gig Vehicles | Browse available vehicles for gig/ride-hailing work |

### 🚛 Hauler Journey

| Feature | Description |
|---------|-------------|
| Heavy-Haul Vehicles | Dedicated catalog for trucks, flatbeds, and commercial vehicles |
| Commercial Booking | Cargo type selection, weight estimation, and delivery instructions |
| Cargo Insurance | Automatic cargo insurance coverage included per booking day |
| Booking Confirmation | Commercial receipt with cargo details and insurance breakdown |

### 📋 Lister Journey

| Feature | Description |
|---------|-------------|
| Lister Dashboard | Revenue stats, booking trends, and fleet performance metrics |
| Fleet Management | Add, edit, and manage listed vehicles with availability controls |
| Bookings Management | View, approve, and track all incoming reservations |
| Messaging | In-platform communication with renters and drivers |

---

## Platform Capabilities

### Identity & Verification

- JWT authentication with OTP-based login (phone/email)
- KYC integration (SmileID / Dojah)
- Driver onboarding with document upload
- Role-based access control (Renter, Driver, Hauler, Lister, Admin, Company)
- Auth guard with intent preservation (redirects back after login/KYC)
- Token-based API authorization (Bearer JWT)

### Booking & Payments

- Dynamic pricing with per-day rates
- Service fee calculation (10% standard, 15% heavy-haul)
- Cargo insurance (hauler tier)
- Paystack payment integration (NGN, KES, ZAR, GHS)
- Payment webhook verification (HMAC-SHA512)
- Booking state lifecycle: pending → confirmed → paid → active → completed
- Confirmation receipts with full cost breakdown
- Admin listings: instant confirmation; Lister listings: pending approval

### IoT & Telematics

- Real-time vehicle tracking (MQTT via EMQX)
- Geofencing enforcement
- Remote vehicle lock/unlock
- Telemetry dashboard (Company tier)
- Shadow Pilot admin controls

### Fleet Intelligence

- Vehicle categorization (Sedan, SUV, Truck, Van, Bus, Luxury)
- Location-based search (PostGIS)
- Availability calendar
- Lister attribution on all listings

### Dashboards

| Dashboard | Users |
|-----------|-------|
| Customer Dashboard | Renters — active bookings, history |
| Driver Dashboard | Drivers — earnings, trips, gig vehicles |
| Lister Dashboard | Listers — revenue, fleet, bookings, messages |
| Company Dashboard | Fleet companies — telemetry, fleet analytics |
| Admin Dashboard | Platform admins — shadow pilot, oversight |
| Logistics Dashboard | Operations — delivery tracking |

---

## Technical Features

### Performance

- Debounced search (300ms)
- Memoized filter calculations
- Route-level code splitting
- Minimal CSS footprint (no heavy animations)
- Optimized re-renders via Zustand selectors

### Accessibility (WCAG AA)

- Keyboard navigation support
- Screen reader compatible
- Focus-visible states
- ARIA labels on all form elements
- Color contrast ratios ≥ 4.5:1
- Skip-to-content link

### SEO

- Open Graph & Twitter Card metadata
- Canonical URLs
- Semantic HTML structure
- Per-page metadata configuration

### State Management (Zustand)

- Auth store — user session, role, login/logout
- Filters store — search, category, location, sort
- Booking store — dates, form data, flow state
- UI store — modals, menus, loading/toast states

### Form Validation

- Real-time error feedback
- Email, phone, name, and date validation
- Password complexity enforcement
- Custom validation rule support

---

## Infrastructure

| Service | Technology |
|---------|-----------|
| Frontend | Next.js 16 (Turbopack), React 19, TypeScript 5, Tailwind CSS 4 |
| Backend | Go (Fiber v3), GORM, JWT |
| Database | PostgreSQL + PostGIS |
| Cache | Redis |
| Messaging | NATS.io |
| IoT Broker | EMQX (MQTT) |
| Identity | SmileID / Dojah |
| Payments | Paystack |
| Mobile | Expo (React Native) |
| Deployment | Docker, Netlify (frontend) |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/auth/login | No | Send OTP to phone/email |
| POST | /api/v1/auth/verify | No | Verify OTP, receive JWT |
| POST | /api/v1/auth/kyc | Yes | Submit KYC documents |
| GET | /api/v1/auth/me | Yes | Get current user |
| GET | /api/v1/listings | No | Browse listings (filtered) |
| GET | /api/v1/listings/:id | No | Get listing detail |
| POST | /api/v1/listings | Yes | Create listing (admin/lister) |
| POST | /api/v1/bookings | Yes | Create booking |
| GET | /api/v1/bookings | Yes | Get user's bookings |
| GET | /api/v1/bookings/:id | Yes | Get booking detail |
| PATCH | /api/v1/bookings/:id/status | Yes | Update booking status |
| POST | /api/v1/payments/initialize | Yes | Initialize Paystack payment |
| POST | /api/v1/payments/webhook | No | Paystack webhook handler |
| GET | /api/v1/payments/:bookingId | Yes | Get payment status |
| GET | /api/v1/fleet | No | Legacy fleet endpoint |

---

## Deployment

- Monorepo with npm workspaces
- Next.js build via Turbopack
- Netlify hosting for web frontend
- Docker Compose for local infrastructure (Postgres, Redis, EMQX, NATS, API)
- Multi-stage Dockerfile for Go API (alpine)
- Node.js 22 / npm 10 build environment
- Environment-based configuration (.env.example provided)
- Frontend graceful fallback: works in static mode (mock data) or connected mode (real API)
