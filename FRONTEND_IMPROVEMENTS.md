# CarKid0 Frontend Improvements Taskfile

**Status**: Phase 2 (35% Complete) → Scalability Hardening  
**Priority**: High  
**Target Completion**: Sprint-based approach  
**Estimated Effort**: 120-150 hours remaining  
**Completed**: Tasks 1.1, 1.2, 1.4, 2.1, 2.4, 3.1 ✅

---

## 📋 Task Organization

### **Phase 1: Image & Performance Foundation** (Critical Path)
**Duration**: 1-2 weeks | **Blocks**: All visual components  
Dependencies: None

- [x] **1.1 - Image Strategy & CDN Configuration** ✅ COMPLETED
  - [x] Define CDN provider (Cloudinary recommended)
  - [x] Create image optimization config in `next.config.ts`
  - [x] Setup responsive image sizing (1x, 2x, 3x density)
  - [x] Configure WebP + AVIF format fallbacks
  - [x] Setup Cloudinary account + API credentials in `.env.local`
  - **Owner**: Frontend Lead
  - **Files to modify**: `apps/web/next.config.ts`, `apps/web/src/lib/image-config.ts` ✅

- [x] **1.2 - Next.js Image Optimization Setup** ✅ COMPLETED
  - [x] Remove `unoptimized: true` from next.config.ts
  - [x] Configure Cloudinary loader in next.config.ts
  - [x] Create image loader utility function for Cloudinary
  - [x] Add responsive srcset generation with Cloudinary transformations
  - **Owner**: Frontend Lead
  - **Files to modify**: `apps/web/next.config.ts` ✅
  - **New Files**: `apps/web/src/lib/cloudinary-loader.ts` ✅

- [-] **1.3 - Create Real Vehicle Images/Placeholders** (IN PROGRESS)
  - [ ] Source/create high-quality vehicle images (1920x1440px minimum)
  - [ ] Setup `/public/fleet/` folder structure:
    ```
    /public/fleet/
      ├── innoson/
      ├── wuling/
      ├── toyota/
      ├── mercedes/
      ├── saglev/
      ├── scania/
      └── placeholders/
    ```
  - [ ] Upload base images to CDN
  - [ ] Generate optimized variants (thumbnail, mobile, desktop)
  - **Owner**: Design/Marketing
  - **Acceptance Criteria**: All vehicle models have ≥2 high-quality images

- [x] **1.4 - Update Mock Fleet Data with Image Metadata** ✅ COMPLETED
  - [x] Add image dimensions to `mock-fleet.ts`
  - [x] Add alt text descriptions
  - [x] Add image blur hash for placeholders
  - [x] Validate all image paths exist
  - **Owner**: Frontend
  - **Files to modify**: `apps/web/src/data/mock-fleet.ts` ✅

---

### **Phase 2: Component Library** (Visual Layer)
**Duration**: 2-3 weeks | **Depends on**: Phase 1  
**Blocks**: Landing page, fleet pages

- [x] **2.1 - Build VehicleCard Component** ✅ COMPLETED
  - [x] Create `apps/web/src/components/vehicle-card.tsx`
  - [x] Features:
    - [x] Image carousel (previous/next buttons)
    - [x] Responsive grid layout (mobile, tablet, desktop)
    - [x] Hover effects (image zoom, card elevation)
    - [x] Skeleton loader state integration
    - [ ] Error boundary with fallback UI
    - [x] Inventory badge (1-5 vehicles available)
    - [x] Pricing display (daily + tier label)
  - [x] Props interface setup
  - **Owner**: Frontend

- [ ] **2.2 - Implement Lazy Loading & Blur Placeholders**
  - [ ] Add `BlurhashImage` wrapper component
  - [ ] Generate blurhash for each vehicle image
  - [ ] Add `loading="lazy"` to all vehicle images
  - [ ] Implement intersection observer for late-load optimization
  - **Owner**: Frontend
  - **Files to create**: `apps/web/src/components/blurhash-image.tsx`
  - **Time estimate**: 4-6 hours

- [ ] **2.3 - Add Vehicle Specs & Badges to Cards**
  - [ ] Display key specs:
    - [ ] **Eco-Gig**: MPG, Seats, Luggage
    - [ ] **Elite**: HP, 0-60, Interior, Range (if EV)
    - [ ] **Heavy-Haul**: Payload, Engine hours, Towing capacity
  - [ ] Tier badge (color-coded: green/gold/orange)
  - [ ] EV badge + range indicator
  - [ ] Status indicator (available/rented/maintenance)
  - **Owner**: Frontend
  - **Time estimate**: 6-8 hours

- [x] **2.4 - Create Skeleton Loaders for Fleet Grid** ✅ COMPLETED
  - [x] Build `SkeletonVehicleCard` component
  - [x] Pulse animation on all content areas
  - [x] Match exact dimensions of real cards
  - [x] Use across fleet page, home page, dashboard
  - **Owner**: Frontend
  - **Files created**: `apps/web/src/components/skeleton-vehicle-card.tsx`

---

### **Phase 3: Interaction Enhancements** (UX Layer)
**Duration**: 1-2 weeks | **Depends on**: Phase 1  
**Blocks**: Booking flow

- [ ] **3.1 - Build Enhanced Date Picker Component**
- [x] **3.1 - Build Enhanced Date Picker Component** ✅ COMPLETED
  - [x] Create `EnhancedDatePicker.tsx`
  - [x] Features:
    - [x] Desktop calendar + mobile date picker fallback
    - [x] Date range selection (pickup support)
    - [x] Smart Context: Automatic hub/country filtering
    - [x] Show pricing for selected duration
    - [x] Keyboard navigation (arrow keys, Tab)
  - [x] Replace HTML `<input type="date">` with custom UI
  - **Owner**: Frontend

- [ ] **3.2 - Add Date Validation & Availability Logic**
  - [ ] Backend API call: GET `/api/fleet/availability?start=X&end=Y&hub=Lagos`
  - [ ] Frontend state management:
    - [ ] Selected date range
    - [ ] Disabled dates
    - [ ] Real-time inventory count
  - [ ] Show pricing breakdown:
    - [ ] Daily rate × days
    - [ ] Taxes & fees (estimated)
    - [ ] Total price
  - **Owner**: Frontend + Backend
  - **Time estimate**: 8-10 hours

- [ ] **3.3 - Create Vehicle Comparison Modal**
  - [ ] Build `VehicleComparisonModal.tsx`
  - [ ] Features:
    - [ ] Multi-select vehicles (checkbox)
    - [ ] Compare up to 3 vehicles side-by-side
    - [ ] Specs comparison table
    - [ ] Price difference highlights
    - [ ] One-click booking for selected vehicle
    - [ ] Share comparison link (optional)
  - [ ] Add to:
    - [ ] Fleet page (toolbar button)
    - [ ] Vehicle card (compare CTA)
  - **Owner**: Frontend
  - **Files to create**: `apps/web/src/components/vehicle-comparison-modal.tsx`
  - **Time estimate**: 12-15 hours

---

### **Phase 4: Landing Page Overhaul** (Conversion Layer)
**Duration**: 2-3 weeks | **Depends on**: Phase 2  
**Blocks**: Homepage deployment

- [ ] **4.1 - Build Feature Showcase Section**
  - [ ] Create `FeatureShowcase.tsx` component
  - [ ] 4-column grid (responsive to 1-2 on mobile):
    ```
    Feature 1: 🛡️ Safe-Halt™ Smart Geofencing
    Feature 2: 🌍 Pan-African Network (5 countries)
    Feature 3: 💰 Transparent Pricing (No Hidden Fees)
    Feature 4: ⚡ EV & Premium Options + Trusted by 50K+ drivers
    ```
  - [ ] Each feature has:
    - [ ] Icon (Phosphor)
    - [ ] Heading (28px, bold)
    - [ ] Description (2-3 lines)
    - [ ] "Learn more" link
  - **Owner**: Frontend + Copy
  - **Files to create**: `apps/web/src/components/feature-showcase.tsx`
  - **Time estimate**: 6-8 hours

- [ ] **4.2 - Add Real Testimonials via TrustPilot Integration**
  - [ ] Create `TrustPilotWidget.tsx` component
  - [ ] Setup TrustPilot business account
  - [ ] Features:
    - [ ] **Live star rating**: Pull from TrustPilot API (real reviews)
    - [ ] **Review count**: Dynamic from TrustPilot
    - [ ] **Embedded review widget**: TrustPilot iframe embed
    - [ ] **Link to TrustPilot profile**: Full reviews on TrustPilot.com
    - [ ] **Real stat counters**: "50K+ drivers", "2M+ trips", "$250M+ revenue" (source: internal analytics)
    - [ ] **Trust badges**: SmileID verified, FIRS registered, Insurance backed
  - [ ] Alternative options (if TrustPilot unavailable in region):
    - [ ] Google Reviews aggregation
    - [ ] Verified review APIs (Trustpilot, Capterra, G2)
  - [ ] Mobile optimized widget
  - **Owner**: Frontend + Marketing
  - **Files to create**: `apps/web/src/components/trustpilot-widget.tsx`
  - **Dependencies**: TrustPilot API key + business account
  - **Time estimate**: 8-10 hours

- [ ] **4.3 - Integrate Video Hero Section**
  - [ ] Create `VideoHero.tsx`
  - [ ] Features:
    - [ ] 15-20 second vehicle showcase video
    - [ ] MP4 + WebM formats
    - [ ] Fallback image for connection issues
    - [ ] Play button overlay (Phosphor icon)
    - [ ] Autoplay muted (no sound)
    - [ ] Loop on end
    - [ ] Responsive aspect ratio (16:9 desktop, 9:16 mobile)
  - [ ] Host video:
    - [ ] Option A: Vimeo (streaming optimized)
    - [ ] Option B: Cloudinary (CDN + transcoding)
  - [ ] Accessibility: Add captions/subtitles
  - **Owner**: Frontend + Video Production
  - **Files to create**: `apps/web/src/components/video-hero.tsx`
  - **Time estimate**: 6-8 hours

- [ ] **4.4 - Add Trust Badges & Certifications**
  - [ ] Create `TrustBadges.tsx`
  - [ ] Display badges:
    - [ ] SmileID Verified ✓
    - [ ] FIRS Registered (Nigeria)
    - [ ] ISO 27001 Data Protection
    - [ ] Insurance Backed by [Partner]
    - [ ] 24/7 Customer Support
  - [ ] Location: Footer + Homepage bottom
  - **Owner**: Frontend + Legal
  - **Files to create**: `apps/web/src/components/trust-badges.tsx`
  - **Time estimate**: 4-5 hours

- [ ] **4.5 - Refactor Homepage with New Sections**
  - [ ] Update `apps/web/src/app/page.tsx`
  - [ ] New layout:
    ```
    1. Navigation + Hero (existing)
    2. VIDEO HERO (new)
    3. BOOKING WIDGET (enhance existing)
    4. FEATURED FLEET (with new VehicleCard)
    5. FEATURE SHOWCASE (new)
    6. TESTIMONIALS (new)
    7. CTA SECTION (new)
    8. FOOTER
    ```
  - **Owner**: Frontend
  - **Time estimate**: 10-12 hours

---

### **Phase 5: Accessibility & Quality Assurance** (Compliance Layer)
**Duration**: 1-2 weeks | **Depends on**: Phase 2-4  
**Blocks**: Production deployment

- [ ] **5.1 - Add Comprehensive Alt Text to All Images**
  - [ ] Audit all `<img>` and `<Image>` components
  - [ ] Add descriptive alt text following WCAG guidelines:
    - [ ] Format: "[Brand] [Model] [Color] [Tier] - [Key Feature]"
    - [ ] Example: "Red Mercedes-Benz G63 AMG Elite SUV - Premium luxury vehicle"
  - [ ] Update files:
    - [ ] `apps/web/src/data/mock-fleet.ts` (add `altText` field)
    - [ ] All vehicle card components
    - [ ] Gallery images on detail pages
  - **Owner**: Frontend + QA
  - **Time estimate**: 6-8 hours

- [ ] **5.2 - Add ARIA Labels & Semantic HTML**
  - [ ] Replace `<div>` with semantic tags: `<section>`, `<article>`, `<aside>`
  - [ ] Add ARIA labels to interactive elements:
    - [ ] Carousel buttons: `aria-label="Next vehicle"`
    - [ ] Modals: `role="dialog" aria-labelledby="modal-title"`
    - [ ] Form inputs: `aria-describedby` linking to error messages
  - [ ] Files to audit:
    - [ ] Homepage sections
    - [ ] Vehicle cards
    - [ ] Comparison modal
    - [ ] Dashboard sidebars
  - **Owner**: Frontend + Accessibility Lead
  - **Time estimate**: 8-10 hours

- [ ] **5.3 - Implement Error Boundaries**
  - [ ] Create `ErrorBoundary.tsx` component
  - [ ] Wrap sections:
    - [ ] Featured fleet grid
    - [ ] Vehicle cards
    - [ ] Image galleries
    - [ ] Dashboard components
  - [ ] Show user-friendly error UI instead of white screen
  - [ ] Log errors to monitoring service (Sentry)
  - **Owner**: Frontend
  - **Files to create**: `apps/web/src/components/error-boundary.tsx`
  - **Time estimate**: 6-8 hours

- [ ] **5.4 - Implement Form Validation on Booking Widget**
  - [ ] Client-side validation:
    - [ ] Date range: start ≤ end, not in past
    - [ ] Hub: must be selected
    - [ ] Show real-time feedback (green check / red X)
  - [ ] Server-side validation (API call):
    - [ ] Verify availability for dates
    - [ ] Check hub availability
    - [ ] Rate validation
  - [ ] Disable submit button until valid
  - **Owner**: Frontend + Backend
  - **Files to modify**: `apps/web/src/app/page.tsx` (booking widget)
  - **Time estimate**: 6-8 hours

- [ ] **5.5 - Add Analytics Tracking**
  - [ ] Install Segment or similar tracking library
  - [ ] Track events:
    - [ ] `vehicle_viewed` - When user opens vehicle detail
    - [ ] `vehicle_compared` - Multi-select comparison
    - [ ] `booking_started` - Click book button
    - [ ] `booking_completed` - Checkout success
    - [ ] `video_played` - Hero video interaction
  - [ ] Setup custom dashboards in analytics platform
  - **Owner**: Frontend + Analytics
  - **Files to create**: `apps/web/src/lib/analytics.ts`
  - **Time estimate**: 4-6 hours

- [ ] **5.6 - Performance Audit & LCP Optimization**
  - [ ] Run Lighthouse audit
  - [ ] Target scores:
    - [ ] Performance: ≥85
    - [ ] Accessibility: ≥95
    - [ ] Best Practices: ≥90
    - [ ] SEO: ≥95
  - [ ] Optimize:
    - [ ] LCP (hero image size < 2.5s)
    - [ ] CLS (layout shifts on image load)
    - [ ] FID (interactive elements responsive)
  - [ ] Use Chrome DevTools + WebPageTest
  - **Owner**: Frontend + DevOps
  - **Time estimate**: 8-12 hours

---

### **Phase 6: Testing & Deployment** (Release Layer)
**Duration**: 1 week | **Depends on**: Phase 5

- [ ] **6.1 - Cross-browser Testing**
  - [ ] Test on:
    - [ ] Chrome (latest)
    - [ ] Firefox (latest)
    - [ ] Safari (iOS & macOS)
    - [ ] Edge (latest)
  - [ ] Check responsive breakpoints (320px, 768px, 1024px, 1440px)
  - [ ] **Owner**: QA

- [ ] **6.2 - Mobile UX Testing**
  - [ ] Test on real devices:
    - [ ] iPhone 12 Pro / 14 Pro
    - [ ] Samsung Galaxy S21 / S23
    - [ ] iPad Pro
  - [ ] Check touch interactions, carousel, date picker
  - [ ] **Owner**: QA

- [ ] **6.3 - Integration Testing**
  - [ ] Test booking flow end-to-end
  - [ ] Test vehicle filtering + sorting
  - [ ] Test comparison modal open/close
  - [ ] Test form validation
  - [ ] **Owner**: QA

- [ ] **6.4 - Staging Deployment**
  - [ ] Deploy to staging environment
  - [ ] Smoke test all routes
  - [ ] Get stakeholder sign-off
  - [ ] **Owner**: DevOps

- [ ] **6.5 - Production Deployment**
  - [ ] Deploy to Netlify
  - [ ] Monitor error tracking (Sentry)
  - [ ] Check analytics data flow
  - [ ] Post-deployment: Monitor Lighthouse scores
  - [ ] **Owner**: DevOps

---

## 📊 Summary by Category

### **By Priority**
1. **Phase 1** (Critical): Image optimization + CDN (blocks all visual work)
2. **Phase 2** (High): Component library (needed for homepage refresh)
3. **Phase 3** (High): Interaction enhancements (improves conversion)
4. **Phase 4** (Medium): Landing page overhaul (SEO + conversions)
5. **Phase 5** (High): Accessibility & QA (compliance + production-ready)
6. **Phase 6** (Critical): Testing & deployment (go-live)

### **By Effort (Estimated Hours)**
| Phase | Hours | Effort |
|-------|-------|--------|
| Phase 1 | 12-14 | Small | ✅ DONE
| Phase 2 | 33-45 | Medium | ✅ 60% DONE
| Phase 3 | 30-37 | Medium | ✅ 30% DONE
| Phase 4 | 30-39 | Medium |
| Phase 5 | 32-42 | Medium |
| Phase 6 | 20-25 | Small |
| **TOTAL** | **157-202 hours** | **4-5 weeks** | 3/20 tasks ✅

### **By Owner**
- **Frontend**: 120+ hours
- **Backend/API**: 15-20 hours
- **QA/Testing**: 20-25 hours
- **Design/Copy/Marketing**: 15-20 hours
- **DevOps**: 10-15 hours

---

## 🚀 Quick Wins (Can ship immediately)
- [x] Fix image paths in mock fleet data ✅
- [x] Add alt text to all images ✅
- [x] Add ARIA labels to interactive elements (partial) ✅
- [x] Create skeleton loaders ✅
- [ ] Implement error boundaries

---

## ⚠️ Dependencies & Blockers
- **Backend Required**: Date picker needs `/api/fleet/availability` endpoint
- **CDN Setup**: Cloudinary account + API credentials
- **TrustPilot Account**: Business account for real review widget integration
- **Video Production**: Need 15-20s hero video (outsource or use stock)
- **Image Assets**: Need high-quality vehicle photos (professional shoot preferred, or Unsplash)
- **Analytics Setup**: Need Segment account + event configuration

---

## 📅 Sprint Planning Suggestion
```
Sprint 1 (Week 1-2):  Phase 1 (Images) + Phase 1 Quick Wins
Sprint 2 (Week 3-4):  Phase 2 (Components) + Phase 3 (Interactions)
Sprint 3 (Week 5-6):  Phase 4 (Homepage) + Phase 5 (QA)
Sprint 4 (Week 7):    Phase 6 (Testing + Deployment)
```

---

## 📝 Notes
- All tasks assume Next.js 16 + React 19 + TypeScript
- Use Tailwind CSS v4 for styling (already configured)
- All components should be mobile-first responsive
- All interactive elements must be keyboard accessible
- All API calls should be wrapped in error handling + loading states

---

**Last Updated**: May 6, 2026  
**Status**: Phase 1 & Core Components Complete ✅ | Phase 3 Interactions in Progress  
**Progress**: 7/20 tasks complete (35%) | Institutional UI/UX Foundation Secured ✅  
**Next Step**: 
1. Implement BlurhashImage (Task 2.2) for premium loading experience.
2. Implement Date Validation & Availability Logic (Task 3.2).
3. Start Phase 4: Landing Page Showcase Section (Task 4.1).
