# Task: Premium Listing Platform — Complete User Journey + UI Overhaul

## Current State (Problems)

1. **No auth gate on booking** — Users can reach `/booking/[id]` without signing in
2. **Login → KYC flow is disconnected** — After KYC, user goes to dashboard, not back to their intended booking
3. **No "intent" preservation** — If a user wants to book a vehicle, signs in, completes KYC, they lose context of what they were booking
4. **Attribution is flat** — No distinction between platform-posted vs third-party listings
5. **Unused fleet images** — 12+ vehicles in `/public/fleet/cars/` not shown anywhere
6. **Inconsistent UI** — Auth pages use inline styles (dark theme), listing pages use Tailwind (light theme)

---

## Correct User Journey (Standard Listing Platform)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DISCOVERY (No Auth)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Landing Page ──→ Browse Listings ──→ Listing Detail                │
│       │                │                    │                       │
│       │                │                    ▼                       │
│       │                │          "Request to Book" clicked         │
│       │                │                    │                       │
│       │                │         ┌──────────┴──────────┐            │
│       │                │         │ Authenticated?      │            │
│       │                │         └──────────┬──────────┘            │
│       │                │              YES / \ NO                    │
│       │                │              /     \                       │
│       │                │             ▼       ▼                      │
│       │                │      Booking    Login Page                 │
│       │                │       Form      (save intent)              │
│       │                │         │            │                     │
│       │                │         │            ▼                     │
│       │                │         │        KYC (if new user)         │
│       │                │         │            │                     │
│       │                │         │            ▼                     │
│       │                │         │     Redirect back to             │
│       │                │         │      Booking Form                │
│       │                │         │            │                     │
│       │                │         ▼            ▼                     │
│       │                │      Booking Confirmation                  │
│       │                │              │                             │
│       │                │              ▼                             │
│       │                │        Dashboard (track booking)           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Journey by Role:

| Role | Discovery | Action | Auth Gate | Post-Auth |
|------|-----------|--------|-----------|-----------|
| Customer (Renter) | `/listings` → `/listings/[id]` | "Request to Book" | Login → KYC | `/booking/[id]` → Confirmation → Dashboard |
| Driver (Gig) | `/driver/gig-vehicles` → `/listings/[id]` | "Rent for Gig" | Login → KYC → Driver Onboarding | `/booking/[id]` → Confirmation → Driver Dashboard |
| Hauler (Logistics) | `/hauler/vehicles` → `/listings/[id]` | "Book for Haul" | Login → KYC | `/hauler/booking/[id]` → Confirmation → Dashboard |

---

## Implementation Plan

### Part A: Auth Guard + Intent Preservation

#### A1. Add `redirectTo` to auth store

**File**: `src/store/use-store.ts`

```ts
// Add to AppState interface:
redirectTo: string | null;
setRedirectTo: (url: string | null) => void;
```

This stores where the user was trying to go before being sent to login.

#### A2. Auth guard utility

**File**: `src/lib/auth-guard.ts` (new)

```ts
export function requireAuth(redirectTo: string): boolean
// Returns true if authenticated, otherwise redirects to /auth/login?redirect=redirectTo
```

#### A3. Update booking pages to check auth

**Files**: `src/app/booking/[id]/page.tsx`, `src/app/hauler/booking/[id]/page.tsx`

- On mount: check if user is authenticated (cookie or store)
- If not: redirect to `/auth/login?redirect=/booking/[id]`

#### A4. Update login page to read redirect param

**File**: `src/app/auth/login/page.tsx`

- Read `?redirect=` from URL search params
- After successful login → proceed to KYC (if needed) or redirect directly

#### A5. Update KYC page to honor redirect

**File**: `src/app/auth/kyc/page.tsx`

- After KYC completion: check `redirectTo` in store
- If exists → redirect there (e.g. `/booking/listing-1`)
- If not → go to role-based dashboard (current behavior)

---

### Part B: Data Model — Admin vs Lister Attribution

#### B1. Extend `Lister` interface

**File**: `src/data/mock-listings.ts`

- Add `role: 'admin' | 'lister'` to `Lister` interface
- Add `role: 'lister'` to all existing MOCK_LISTERS
- Create platform admin lister entry

#### B2. Add new listings from unused fleet images

| Vehicle | Tier | Assign to |
|---------|------|-----------|
| Innoson IVM EX02 (White) | eco-gig | admin |
| Jet Mover EV (Black) | heavy-haul | admin |
| Lexus GX460 (Pre-facelift) | premium | lister |
| Saglev S5 EV (White) | eco-gig | admin |
| Toyota Corolla 2006–2015 (6 cars) | eco-gig | mix |
| Toyota Highlander | premium | lister |
| Toyota LC200 (White) | premium | admin |
| Wuling Bingo EV (White) | eco-gig | lister |

#### B3. Expand image arrays for existing listings

Use all available images per vehicle folder (currently many are unused).

---

### Part C: ListingCard Premium Redesign

**File**: `src/components/listing-card.tsx`

- Admin attribution: "CarKid0 Official" badge (`bg-gray-900 text-white`)
- Lister attribution: existing avatar + name + rating (unchanged)
- Image count indicator when 2+ images
- Standardized tier badge colors (purple/blue/green/orange with soft backgrounds)
- Currency formatting: ₦ for Nigeria, KSh for Kenya, R for South Africa, $ fallback

---

### Part D: Listing Detail Page Overhaul

**File**: `src/app/listings/[id]/page.tsx`

- Full image gallery (show ALL available images per vehicle)
- Admin listings: platform card with guarantees instead of ListerCard
- Lister listings: existing ListerCard (unchanged)
- "Request to Book" button triggers auth check before navigating to booking page
- Booking sidebar: live price calculation with breakdown

---

### Part E: ListerCard Conditional Rendering

**File**: `src/components/lister-card.tsx`

- `role === 'admin'` → Platform card (shield icon, guarantees, "Contact Support" CTA)
- `role === 'lister'` → Existing card (unchanged)

---

### Part F: Tier Browse Pages — Source Filter + Unified Layout

**Files**: `src/app/listings/page.tsx`, `src/app/driver/gig-vehicles/page.tsx`, `src/app/hauler/vehicles/page.tsx`

- Add "Source" filter: All / CarKid0 Official / Third-Party Fleet
- Consistent page header, grid layout, empty states across all tiers

---

### Part G: Landing Page — Featured Inventory + Category Images

**File**: `src/app/page.tsx`

- Add "Featured Vehicles" section (3–4 listings, one per tier)
- Category cards: use fleet images as backgrounds with dark overlay + white text
- Links to correct tier pages

---

### Part H: Auth Pages — Visual Consistency (Optional Polish)

**Files**: `src/app/auth/login/page.tsx`, `src/app/auth/kyc/page.tsx`

- Migrate inline styles to Tailwind for consistency with rest of app
- Keep the split-panel layout (image left, form right) but use Tailwind classes
- Ensure mobile responsiveness matches listing pages

---

## Implementation Order

| Step | Scope | Priority |
|------|-------|----------|
| 1 | Data model (role field, admin lister, new listings, expanded images) | High |
| 2 | Auth guard + intent preservation (store, guard util, redirect flow) | High |
| 3 | ListingCard redesign (attribution, badges, currency) | High |
| 4 | ListerCard conditional rendering | Medium |
| 5 | Listing detail page (gallery, auth-gated CTA, admin card) | High |
| 6 | Booking pages (auth check on mount) | High |
| 7 | Tier browse pages (source filter) | Medium |
| 8 | Landing page (featured vehicles, category images) | Medium |
| 9 | Auth pages Tailwind migration | Low |

---

## Files Modified / Created

| File | Action |
|------|--------|
| `src/data/mock-listings.ts` | Modify — role field, admin lister, new listings |
| `src/store/use-store.ts` | Modify — add redirectTo |
| `src/lib/auth-guard.ts` | Create — auth check utility |
| `src/components/listing-card.tsx` | Modify — attribution, badges, currency |
| `src/components/lister-card.tsx` | Modify — conditional admin/lister |
| `src/app/listings/[id]/page.tsx` | Modify — gallery, auth CTA, admin card |
| `src/app/booking/[id]/page.tsx` | Modify — auth guard on mount |
| `src/app/hauler/booking/[id]/page.tsx` | Modify — auth guard on mount |
| `src/app/listings/page.tsx` | Modify — source filter |
| `src/app/driver/gig-vehicles/page.tsx` | Modify — source filter |
| `src/app/hauler/vehicles/page.tsx` | Modify — source filter |
| `src/app/page.tsx` | Modify — featured section, category images |
| `src/app/auth/login/page.tsx` | Modify — read redirect param |
| `src/app/auth/kyc/page.tsx` | Modify — honor redirectTo after completion |

---

## Acceptance Criteria

### User Journey
- [ ] Unauthenticated user can browse all listings freely (no auth wall)
- [ ] Clicking "Request to Book" redirects to login if not authenticated
- [ ] After login + KYC, user is redirected back to their intended booking
- [ ] Authenticated user goes directly to booking form
- [ ] Booking confirmation shows correct lister/admin attribution

### Attribution
- [ ] Admin listings show "CarKid0 Official" badge on cards and detail page
- [ ] Lister listings show name + rating + verification
- [ ] Source filter works on all 3 tier browse pages

### Inventory
- [ ] All fleet images in `/public/fleet/cars/` are referenced in listings
- [ ] Every listing uses all available images from its folder
- [ ] New listings cover all 3 tiers with admin + lister mix

### UI
- [ ] Landing page showcases featured inventory with real images
- [ ] Category cards use fleet images as backgrounds
- [ ] Currency displays correctly per country
- [ ] Responsive grid: 3-col desktop, 2-col tablet, 1-col mobile
- [ ] TypeScript compiles without errors (`next build` passes)
