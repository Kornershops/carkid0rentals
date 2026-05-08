# Task: Admin-Posted Listings Attribution

## Objective

Implement a standard listing platform model where:
- **Admin** can post vehicles directly (platform inventory)
- **Listers** (third-party fleet owners) can post their own vehicles
- Each listing clearly shows who posted it with appropriate badges

---

## Implementation Steps

### 1. Update Data Model

**File**: `apps/web/src/data/mock-listings.ts`

- Add `role` field to `Lister` interface: `'admin' | 'lister'`
- Add a platform admin lister entry to `MOCK_LISTERS`
- Assign some listings to the admin lister

```ts
// Addition to Lister interface
role: 'admin' | 'lister';
```

---

### 2. Update ListingCard Attribution

**File**: `apps/web/src/components/listing-card.tsx`

- Show "Posted by Admin" badge (distinct color) when `listing.lister.role === 'admin'`
- Show "Posted by [Lister Name]" for third-party listers
- Admin badge: solid dark/brand background to distinguish from user-posted content

---

### 3. Update Listing Detail Page

**File**: `apps/web/src/app/listings/[id]/page.tsx`

- Display admin attribution in the lister info section
- Show "CarKid0 Official" or similar branding for admin posts
- Hide "Contact Lister" or replace with "Platform Support" for admin listings

---

### 4. Update Hauler Vehicles Page

**File**: `apps/web/src/app/hauler/vehicles/page.tsx`

- Apply same attribution logic for heavy-haul listings

---

## Badge Design

| Poster | Badge Text | Style |
|--------|-----------|-------|
| Admin | `CARKID0 OFFICIAL` | `bg-gray-900 text-white` |
| Lister | `{lister.name}` | Existing avatar + name style |

---

## Acceptance Criteria

- [ ] Listings clearly distinguish admin vs lister posts
- [ ] Admin listings show "CarKid0 Official" badge on card and detail page
- [ ] Lister listings continue showing lister name, avatar, and rating
- [ ] No breaking changes to existing booking or filter flows
- [ ] TypeScript compiles without errors
