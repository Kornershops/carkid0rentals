# CarKid0 Rentals

Omni-Tier Vehicle Rental Platform with real-time IoT enforcement.

## Project Structure

- `apps/web`: Next.js 16 Frontend (TypeScript, Tailwind 4, Zustand)
- `apps/api`: Go Backend (Fiber v3, GORM, JWT, Paystack)
- `apps/mobile`: Expo Mobile App (React Native)
- `infra/`: Infrastructure configuration (Docker, config files)

## Tech Stack

- **Frontend**: Next.js 16, Tailwind CSS 4, Shadcn UI, Zustand, TanStack Query
- **Backend**: Go (Golang), Fiber v3, GORM, PostGIS, Redis, JWT
- **Payments**: Paystack (NGN, KES, ZAR, GHS)
- **IoT**: MQTT (EMQX), NATS.io
- **Identity**: SmileID / Dojah (KYC)
- **Infrastructure**: Docker, Netlify, PostgreSQL + PostGIS

## Getting Started

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL (PostGIS), Redis, EMQX (MQTT), NATS, and the Go API.

### 2. Run Backend (standalone)

```bash
cd apps/api
cp .env.example .env  # Edit with your credentials
go run main.go
```

API runs on `http://localhost:8080`. Health check: `GET /health`

### 3. Run Frontend

```bash
cd apps/web
cp .env.example .env.local  # Set NEXT_PUBLIC_API_URL
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/auth/login | No | Send OTP |
| POST | /api/v1/auth/verify | No | Verify OTP → JWT |
| POST | /api/v1/auth/kyc | Yes | Submit KYC |
| GET | /api/v1/listings | No | Browse listings |
| GET | /api/v1/listings/:id | No | Listing detail |
| POST | /api/v1/bookings | Yes | Create booking |
| GET | /api/v1/bookings | Yes | User's bookings |
| POST | /api/v1/payments/initialize | Yes | Start Paystack payment |
| POST | /api/v1/payments/webhook | No | Paystack callback |

## User Journey

```
Browse (no auth) → "Request to Book" → Auth Check
                                          │
                         ┌────────────────┴────────────────┐
                         │ Authenticated                    │ Not Authenticated
                         ▼                                  ▼
                  Booking Form                     Login (OTP) → KYC
                         │                                  │
                         │                         Redirect back to booking
                         │                                  │
                         ◄──────────────────────────────────┘
                         │
                  Proceed to Payment → Paystack Checkout
                         │
                  Confirmation → Dashboard
```

## Environment Variables

### Backend (`apps/api/.env`)

```
DATABASE_URL=host=localhost user=admin password=password dbname=carkid0_rentals port=5432 sslmode=disable
JWT_SECRET=your-secret
PAYSTACK_SECRET_KEY=sk_test_xxx
FRONTEND_URL=http://localhost:3000
```

### Frontend (`apps/web/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Development Notes

- Frontend works in **static mode** (mock data) when API is unavailable
- Mock OTP code: `123456`
- Admin listings auto-confirm; lister listings require approval
- `next build` produces static export for Netlify deployment
