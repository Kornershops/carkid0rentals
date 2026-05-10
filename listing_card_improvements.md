# Task: Listing Card & Browse Page UI Improvements

## Issues Identified (from live screenshots)

### 1. Cards lack visual hierarchy and trust signals
- No tier badges (premium, eco-gig, heavy-haul) — all vehicles look identical regardless of price tier
- No source attribution — can't distinguish CarKid0 Official vs third-party listings
- No rating/reviews indicator
- No "verified" or availability status badge

### 2. Image presentation is inconsistent
- No image count indicator — user can't tell if there are more photos
- Mercedes GLE uses a render/stock image while others are real photos — inconsistent trust
- Some images cropped awkwardly (Toyota Highlander, Jet Mover)

### 3. Card information is too sparse
- Only shows: title, location, price
- Missing: year, transmission, seats, fuel type, tier category
- No CTA button on the card
- No "favorite" / save action

### 4. Price display / currency issues
- Ghana uses `$180` — should be `GH₵` (currency.ts already has this, but listing-card.tsx uses its own formatCurrency that falls through to `$`)
- Spacing inconsistency: `₦450` vs `KSh 200` vs `R250`

### 5. Filter bar UX
- "Default" sort label is vague — should say "Sort by" or "Relevance"
- Source filter exists but cards don't visually reflect the distinction

### 6. Grid/layout polish
- Cards have no hover state — feels flat and non-interactive
- No pagination or "load more" for 24 items
- Uses inline styles instead of Tailwind (listing-card.tsx)

### 7. Missing engagement elements
- No "Featured" or "Popular" callouts
- No urgency indicators
- No quick-view capability

---

## Implementation Plan

### Step 1: Rewrite `listing-card.tsx` with Tailwind
- Replace all inline styles with Tailwind classes
- Add hover state (shadow + slight translate)
- Use `getCurrencyForCountry` from `lib/currency.ts` instead of local formatCurrency
- Add tier badge (color-coded by category)
- Add source badge ("CarKid0 Official" for admin, lister name for third-party)
- Add image count indicator overlay (e.g. "1/4")
- Add 2-3 key specs (year, seats, transmission) as subtle chips
- Add EV badge for electric vehicles

### Step 2: Fix Ghana currency in formatCurrency
- Use `GH₵` symbol for Ghana instead of `$` fallback

### Step 3: Card hover & interaction
- Subtle shadow on hover
- Scale transform on hover
- Cursor pointer (already via Link)

### Step 4: Sort label clarity
- Change "Default" to "Relevance" in sort options

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/listing-card.tsx` | Full rewrite — Tailwind, badges, specs, currency fix |
| `src/app/listings/page.tsx` | Update sort label |

---

## Status: IN PROGRESS
