# 🎯 Enhanced Onboarding System - Implementation Guide

## Overview

Implemented a comprehensive multi-stage onboarding system with:
- ✅ Role selection dropdown with vehicle type specification
- ✅ Multi-stage registration process
- ✅ Progress tracking and resume capability
- ✅ LocalStorage persistence

---

## 🆕 New Components

### 1. Enhanced Role Modal
**File:** `apps/web/src/components/role-modal-enhanced.tsx`

**Features:**
- Role selection with 4 options (Customer, Driver, Hauler, Lister)
- Dynamic dropdown for sub-options based on role:
  - **Driver:** Ride-hailing, Delivery, Both
  - **Hauler:** Light/Medium/Heavy/Specialized cargo
  - **Lister:** Exotic, Premium, Eco-Gig, Heavy-Haul, Mixed Fleet
- Auto-redirect to appropriate onboarding flow
- Sub-type stored in localStorage

**Usage:**
```tsx
import { RoleModal } from '@/components/role-modal-enhanced';

<RoleModal isOpen={isOpen} onClose={onClose} />
```

---

### 2. Onboarding Hook & Progress System
**File:** `apps/web/src/hooks/use-onboarding.tsx`

**Features:**
- Multi-stage flow management
- Progress persistence in localStorage
- Resume from last completed stage
- Role-specific stage flows
- Progress bar component
- Continue banner component

**Stages:**
1. **Role Selection** - Choose user type
2. **Basic Info** - Name, email, phone
3. **Verification** - KYC submission
4. **Documents** - Upload required docs (driver/lister only)
5. **Preferences** - Settings and preferences
6. **Complete** - Redirect to dashboard

**Usage:**
```tsx
import { useOnboarding, OnboardingProgressBar, ContinueOnboardingBanner } from '@/hooks/use-onboarding';

function MyComponent() {
  const { 
    progress, 
    initializeOnboarding, 
    updateStage, 
    continueOnboarding 
  } = useOnboarding();

  // Initialize onboarding
  const handleRoleSelect = (role: string, subType: string) => {
    initializeOnboarding(role, subType);
  };

  // Update stage with data
  const handleBasicInfoSubmit = (data: any) => {
    updateStage('verification', { basicInfo: data });
  };

  return (
    <>
      <OnboardingProgressBar 
        currentStage={progress.currentStage}
        completedStages={progress.completedStages}
        userRole={progress.userRole}
      />
      
      <ContinueOnboardingBanner />
    </>
  );
}
```

---

## 📋 Stage Flows by Role

### Customer Flow
```
1. Role Selection
2. Basic Info (Login/Register)
3. Verification (KYC)
4. Preferences
5. Complete → Customer Dashboard
```

### Driver Flow
```
1. Role Selection + Gig Type
2. Basic Info (Registration)
3. Verification (KYC)
4. Documents (License, ID, Address)
5. Preferences
6. Complete → Driver Dashboard
```

### Lister Flow
```
1. Role Selection + Vehicle Type
2. Business Info (Registration)
3. Verification (KYC)
4. First Vehicle Listing
5. Complete → Lister Dashboard
```

### Hauler Flow
```
1. Role Selection + Cargo Type
2. Basic Info (Login/Register)
3. Verification (KYC)
4. Preferences
5. Complete → Logistics Dashboard
```

---

## 🔄 Implementation Steps

### Step 1: Replace Role Modal
```tsx
// apps/web/src/app/page.tsx

// OLD
import { RoleModal } from '@/components/role-modal';

// NEW
import { RoleModal } from '@/components/role-modal-enhanced';
```

### Step 2: Add Onboarding Hook to Pages
```tsx
// apps/web/src/app/driver/register/page.tsx

import { useOnboarding, OnboardingProgressBar } from '@/hooks/use-onboarding';

export default function DriverRegister() {
  const { progress, updateStage } = useOnboarding();

  const handleSubmit = async (data: any) => {
    // Submit to API
    await api.registerDriver(data);
    
    // Update onboarding progress
    updateStage('verification', { driverInfo: data });
  };

  return (
    <div>
      {progress && (
        <OnboardingProgressBar 
          currentStage={progress.currentStage}
          completedStages={progress.completedStages}
          userRole={progress.userRole}
        />
      )}
      
      {/* Registration form */}
    </div>
  );
}
```

### Step 3: Add Continue Banner to Layout
```tsx
// apps/web/src/app/layout.tsx

import { ContinueOnboardingBanner } from '@/hooks/use-onboarding';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ContinueOnboardingBanner />
      </body>
    </html>
  );
}
```

### Step 4: Update Each Onboarding Page

**Driver Registration:**
```tsx
// apps/web/src/app/driver/register/page.tsx
const { updateStage } = useOnboarding();

const handleSubmit = (data) => {
  updateStage('verification', { driverInfo: data });
  router.push('/auth/kyc');
};
```

**KYC Page:**
```tsx
// apps/web/src/app/auth/kyc/page.tsx
const { updateStage, progress } = useOnboarding();

const handleSubmit = (data) => {
  if (progress.userRole === 'driver') {
    updateStage('documents', { verification: data });
    router.push('/driver/verify');
  } else if (progress.userRole === 'admin') {
    updateStage('documents', { verification: data });
    router.push('/lister/fleet/add');
  }
};
```

**Document Upload:**
```tsx
// apps/web/src/app/driver/verify/page.tsx
const { updateStage } = useOnboarding();

const handleSubmit = (data) => {
  updateStage('preferences', { documents: data });
  router.push('/auth/onboarding/driver');
};
```

**Preferences:**
```tsx
// apps/web/src/app/auth/onboarding/driver/page.tsx
const { completeOnboarding } = useOnboarding();

const handleSubmit = (data) => {
  completeOnboarding();
  router.push('/driver/dashboard');
};
```

---

## 💾 Data Structure

### LocalStorage Key
```
carkid0_onboarding_progress
```

### Stored Data
```json
{
  "currentStage": "documents",
  "completedStages": ["role-selection", "basic-info", "verification"],
  "userRole": "driver",
  "roleSubType": "ride-hailing",
  "data": {
    "basicInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+234..."
    },
    "verification": {
      "kycStatus": "pending",
      "idNumber": "..."
    },
    "driverInfo": {
      "licenseNumber": "DL123456",
      "licenseExpiry": "2026-12-31",
      "experience": 5
    }
  }
}
```

---

## 🎨 UI Components

### Progress Bar
Shows visual progress through onboarding stages with:
- Completed stages (green checkmark)
- Current stage (filled circle)
- Upcoming stages (empty circle)
- Connecting lines

### Continue Banner
Fixed bottom banner that:
- Shows when onboarding is incomplete
- Displays progress (X of 5 steps)
- "Continue Setup" button
- Auto-hides when complete

---

## 🔧 API Integration

### Save Progress to Backend (Optional)
```typescript
// After each stage completion
const saveProgressToBackend = async (progress: OnboardingProgress) => {
  await api.post('/api/v1/onboarding/progress', progress);
};
```

### Sync on Login
```typescript
// On user login, sync progress
const syncOnboarding = async () => {
  const serverProgress = await api.get('/api/v1/onboarding/progress');
  const localProgress = localStorage.getItem('carkid0_onboarding_progress');
  
  // Use most recent
  if (serverProgress.updatedAt > localProgress.updatedAt) {
    localStorage.setItem('carkid0_onboarding_progress', JSON.stringify(serverProgress));
  }
};
```

---

## 🧪 Testing

### Test Scenarios

1. **New User Flow**
   - Select role → Complete all stages → Verify completion

2. **Resume Flow**
   - Start onboarding → Close browser → Return → Verify resume

3. **Role-Specific Flows**
   - Test each role's unique stage flow

4. **Data Persistence**
   - Verify data saved at each stage
   - Check localStorage structure

5. **Banner Behavior**
   - Verify banner shows when incomplete
   - Verify banner hides when complete

---

## 📱 Mobile Considerations

- Progress bar responsive (stacks on mobile)
- Continue banner fixed at bottom
- Dropdown touch-friendly
- Large tap targets for role cards

---

## 🎯 Benefits

### User Experience
- ✅ Clear progress indication
- ✅ Resume capability (no data loss)
- ✅ Role-specific flows
- ✅ Vehicle type specification
- ✅ Reduced friction

### Technical
- ✅ LocalStorage persistence
- ✅ Type-safe with TypeScript
- ✅ Reusable hook pattern
- ✅ Easy to extend
- ✅ Backend sync ready

---

## 🚀 Deployment Checklist

- [ ] Replace old RoleModal with enhanced version
- [ ] Add useOnboarding hook to all registration pages
- [ ] Add OnboardingProgressBar to each stage
- [ ] Add ContinueOnboardingBanner to layout
- [ ] Update API client with onboarding endpoints
- [ ] Test all role flows
- [ ] Test resume functionality
- [ ] Mobile testing
- [ ] Update documentation

---

## 📊 Analytics Events

Track these events for optimization:

```typescript
// Role selection
analytics.track('onboarding_role_selected', {
  role: 'driver',
  subType: 'ride-hailing'
});

// Stage completion
analytics.track('onboarding_stage_completed', {
  stage: 'verification',
  role: 'driver',
  timeSpent: 120 // seconds
});

// Onboarding completion
analytics.track('onboarding_completed', {
  role: 'driver',
  totalTime: 600, // seconds
  stagesCompleted: 5
});

// Resume onboarding
analytics.track('onboarding_resumed', {
  stage: 'documents',
  role: 'driver'
});
```

---

## 🔄 Future Enhancements

1. **Backend Sync** - Sync progress across devices
2. **Email Reminders** - Remind users to complete onboarding
3. **Skip Options** - Allow skipping non-critical stages
4. **Gamification** - Add rewards for completion
5. **A/B Testing** - Test different flows
6. **Time Estimates** - Show time to complete each stage

---

**Status:** ✅ Ready to implement  
**Estimated Time:** 2-3 hours for full integration  
**Priority:** HIGH (improves conversion rate)
