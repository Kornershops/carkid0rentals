# Task: Listing Creation User Journey — End-to-End

## Current State

### What EXISTS:

| Layer | What's Built | Status |
|-------|-------------|--------|
| Backend API | `POST /api/v1/listings` (auth-protected) | ✅ |
| Backend API | `GET /api/v1/listings` (public) | ✅ |
| Backend API | `GET /api/v1/listings/:id` (public) | ✅ |
| Auth/JWT | Role embedded in token (`customer`, `driver`, `logistics`, `admin`) | ✅ |
| Auth middleware | `Protected()` — requires JWT | ✅ |
| Auth middleware | `AdminOnly()` — restricts to admin role | ✅ (unused on listings) |
| Frontend | `/lister/fleet` — fleet management page with "Add Vehicle" button | ✅ (UI only) |
| Frontend | `/lister/fleet/add` — linked but page doesn't exist | ❌ |
| Frontend | Admin dashboard to post listings | ❌ |
| Frontend | API client integration for creating listings | ❌ |

### What's MISSING:

1. **No "Add Listing" form page** — `/lister/fleet/add` is linked but 404s
2. **No admin listing creation UI** — admin can only create via direct API call
3. **No role-based restriction on create endpoint** — any authenticated user can `POST /listings`
4. **No "lister" role in User model** — backend has `customer | driver | logistics | admin` but listing system expects `admin | lister`
5. **No listing approval workflow** — third-party listings should require approval before going live
6. **No image upload endpoint** — create endpoint accepts URLs but no upload mechanism
7. **Frontend is fully static** — browse page reads from `MOCK_LISTINGS`, not from API

---

## Target State

```
Admin → /dashboard/admin/listings/add → POST /api/v1/listings → auto-approved → visible immediately
Lister → /lister/fleet/add → POST /api/v1/listings → status: pending → visible after admin approval
Customer → /listings → GET /api/v1/listings (DB, with fallback to mock when API unavailable)
```

---

## Implementation Plan

### Step 1: Backend — Add `lister` role + listing `status` field

**Files:**
- `apps/api/domain/auth/models.go` — add `lister` to role options
- `apps/api/domain/listings/models.go` — add `Status` field (`pending`, `approved`, `rejected`)
- `apps/api/domain/listings/handler.go`:
  - `CreateListing`: set `status = approved` if admin, `status = pending` if lister
  - `GetListings`: only return `status = approved` for public queries
  - Restrict `POST` to `admin` or `lister` roles only

### Step 2: Backend — Add update/delete endpoints

**File:** `apps/api/domain/listings/handler.go`

- `PUT /api/v1/listings/:id` — owner or admin can edit
- `DELETE /api/v1/listings/:id` — owner or admin can delete
- `PATCH /api/v1/listings/:id/status` — admin only (approve/reject)

**Routes:**
```go
l.Put("/:id", middleware.Protected(), UpdateListing)
l.Delete("/:id", middleware.Protected(), DeleteListing)
l.Patch("/:id/status", middleware.Protected(), middleware.AdminOnly(), UpdateListingStatus)
```

### Step 3: Backend — Image upload endpoint

**File:** `apps/api/domain/listings/upload.go` (new)

- `POST /api/v1/listings/upload` — accepts multipart image, stores to Cloudinary (or local `/uploads` for dev)
- Returns URL array for use in listing creation
- Alternative: direct Cloudinary upload from frontend (unsigned preset)

### Step 4: Frontend — Create `/lister/fleet/add` page

**File:** `apps/web/src/app/lister/fleet/add/page.tsx` (new)

Form fields:
- Title, Brand, Model, Year
- Category (dropdown: exotic, premium, eco-gig, heavy-haul)
- Price per day, Currency/Country
- Location, Country
- Features (multi-input)
- Specs (seats, transmission, fuel type, mileage, hp, payload)
- Images (upload or URL input)
- isEV toggle

On submit: `POST /api/v1/listings` with JWT → show success/pending message

### Step 5: Frontend — Admin listing management

**File:** `apps/web/src/app/dashboard/admin/listings/page.tsx` (new)

- Table of all listings (including pending)
- Status badge (pending/approved/rejected)
- Approve/Reject actions → `PATCH /api/v1/listings/:id/status`
- "Add Listing" button (admin posts go live immediately)

### Step 6: Frontend — Connect browse page to API

**File:** `apps/web/src/app/listings/page.tsx`

- Try `GET /api/v1/listings` first
- If API unavailable (network error / no backend running), fall back to `MOCK_LISTINGS`
- This preserves the static-mode development experience

### Step 7: Frontend — Lister registration flow

**Files:**
- `apps/web/src/app/auth/register/lister/page.tsx` (new)
- Update auth flow to allow role selection during signup

A user who wants to list vehicles:
1. Signs up → selects "List my fleet" role
2. Completes KYC
3. Gets `lister` role in JWT
4. Can access `/lister/fleet/add`

---

## API Endpoints (Final)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | /api/v1/listings | No | — | Browse approved listings |
| GET | /api/v1/listings/:id | No | — | Listing detail |
| POST | /api/v1/listings | Yes | admin, lister | Create listing |
| PUT | /api/v1/listings/:id | Yes | owner, admin | Update listing |
| DELETE | /api/v1/listings/:id | Yes | owner, admin | Delete listing |
| PATCH | /api/v1/listings/:id/status | Yes | admin | Approve/reject listing |
| POST | /api/v1/listings/upload | Yes | admin, lister | Upload images |

---

## File Changes Summary

| File | Action |
|------|--------|
| `apps/api/domain/auth/models.go` | Modify — add lister role |
| `apps/api/domain/listings/models.go` | Modify — add Status field |
| `apps/api/domain/listings/handler.go` | Modify — role restriction, status logic, PUT/DELETE/PATCH |
| `apps/api/domain/listings/upload.go` | Create — image upload handler |
| `apps/web/src/app/lister/fleet/add/page.tsx` | Create — add listing form |
| `apps/web/src/app/dashboard/admin/listings/page.tsx` | Create — admin listing management |
| `apps/web/src/app/auth/register/lister/page.tsx` | Create — lister registration |
| `apps/web/src/app/listings/page.tsx` | Modify — API integration with mock fallback |

---

## Priority Order

| Step | Scope | Priority |
|------|-------|----------|
| 1 | Backend model fixes (role + status) | High |
| 2 | Backend update/delete/approve endpoints | High |
| 3 | Frontend add listing form (`/lister/fleet/add`) | High |
| 4 | Frontend admin listing management | Medium |
| 5 | Image upload (backend + frontend) | Medium |
| 6 | Connect browse page to API | Medium |
| 7 | Lister registration flow | Medium |

---

## Status: COMPLETE ✅

### All Steps Done:
- ✅ Step 1: Backend — `lister` role added, `Status` field on Listing model
- ✅ Step 2: Backend — PUT, DELETE, PATCH /status endpoints with role-based access
- ✅ Step 3: Backend — Role restriction on POST (only admin/lister can create)
- ✅ Step 4: Frontend — `/lister/fleet/add` form page (full CRUD form)
- ✅ Step 5: Frontend — `/dashboard/admin/listings` management page (approve/reject)
- ✅ Step 6: Frontend — Browse page connected to API with mock fallback
- ✅ Step 7: Frontend — Lister registration flow (`/auth/register/lister`) + `PATCH /auth/role` endpoint

### Remaining (deferred):
- ⬜ Image upload endpoint (Cloudinary integration) — currently uses URL input
