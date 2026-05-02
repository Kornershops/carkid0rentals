# CarKid0 Rentals

Omni-Tier Vehicle Rental Platform with real-time IoT enforcement.

## Project Structure

- `apps/web`: Next.js 15 Frontend (TypeScript, Tailwind, Zustand)
- `apps/api`: Go Backend (Fiber v3, GORM, PostGIS)
- `apps/mobile`: Expo Mobile App (React Native)
- `infra/`: Infrastructure configuration (Docker, config files)

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Shadcn UI, Zustand, TanStack Query
- **Backend**: Go (Golang), Fiber v3, PostGIS, Redis
- **IoT**: MQTT (EMQX), NATS.io
- **Identity**: SmileID / Dojah

## Getting Started

1. **Start Infrastructure**:
   ```bash
   docker-compose up -d
   ```

2. **Run Backend**:
   ```bash
   cd apps/api
   go run main.go
   ```

3. **Run Frontend**:
   ```bash
   cd apps/web
   npm run dev
   ```
