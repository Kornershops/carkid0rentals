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

- KYC integration (SmileID / Dojah)
- Driver onboarding with document upload
- Role-based access control (Renter, Driver, Hauler, Lister, Admin, Company)

### Booking & Payments

- Dynamic pricing with per-day rates
- Service fee calculation (15%)
- Cargo insurance (hauler tier)
- Booking state management across navigation
- Confirmation receipts with full cost breakdown

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
| Backend | Go (Fiber v3), GORM |
| Database | PostgreSQL + PostGIS |
| Cache | Redis |
| Messaging | NATS.io |
| IoT Broker | EMQX (MQTT) |
| Identity | SmileID / Dojah |
| Mobile | Expo (React Native) |
| Deployment | Docker, Netlify (frontend) |

---

## Deployment

- Monorepo with npm workspaces
- Next.js build via Turbopack
- Netlify hosting for web frontend
- Docker Compose for local infrastructure
- Node.js 22 / npm 10 build environment
