'use client';

import { useEffect } from 'react';
import { useOnboardingStore } from '@/lib/onboarding/store';
import { useAnalytics } from '@/hooks/useAnalytics';
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { KYCWizard } from '@/components/onboarding/KYCWizard';
import { SafeHaltTutorial } from '@/components/onboarding/SafeHaltTutorial';
import { FirstBookingGuide } from '@/components/tours/FirstBookingGuide';
import { FeatureTour } from '@/components/tours/FeatureTour';
import { useCelebration } from '@/components/progress/SuccessCelebration';

export function OnboardingOrchestrator() {
  const { 
    currentStep, 
    isStepComplete, 
    shouldShowTooltips,
    progress 
  } = useOnboardingStore();
  
  const { trackOnboardingStart, trackOnboardingStep, trackOnboardingComplete } = useAnalytics();
  const { celebrate, CelebrationComponent } = useCelebration();

  // Track onboarding start
  useEffect(() => {
    if (!isStepComplete('welcome')) {
      trackOnboardingStart();
    }
  }, []);

  // Track progress and trigger celebrations
  useEffect(() => {
    if (progress === 100 && isStepComplete('complete')) {
      trackOnboardingComplete(Date.now());
      celebrate('account-created');
    }
  }, [progress]);

  // Render current onboarding component
  const renderCurrentStep = () => {
    // Welcome screen (first time)
    if (!isStepComplete('welcome')) {
      return <WelcomeScreen />;
    }

    // KYC wizard (after phone verification)
    if (isStepComplete('phone-verification') && !isStepComplete('kyc-upload')) {
      return <KYCWizard />;
    }

    // Safe-Halt tutorial (after KYC)
    if (isStepComplete('kyc-pending') && !isStepComplete('safe-halt-intro')) {
      return <SafeHaltTutorial />;
    }

    // First booking guide (before first booking)
    if (isStepComplete('safe-halt-intro') && !isStepComplete('first-booking-intro')) {
      return <FirstBookingGuide />;
    }

    // Feature tour (after first booking guide)
    if (isStepComplete('first-booking-intro') && !isStepComplete('feature-tour')) {
      return <FeatureTour />;
    }

    return null;
  };

  return (
    <>
      {renderCurrentStep()}
      {CelebrationComponent}
    </>
  );
}

// Hook to trigger onboarding from any component
export function useOnboarding() {
  const { markStepComplete, resetOnboarding, progress } = useOnboardingStore();
  const { celebrate } = useCelebration();

  const triggerKYCApproval = () => {
    markStepComplete('kyc-pending');
    celebrate('kyc-approved');
  };

  const triggerFirstBooking = () => {
    markStepComplete('first-booking-intro');
    celebrate('first-booking');
  };

  return {
    markStepComplete,
    resetOnboarding,
    triggerKYCApproval,
    triggerFirstBooking,
    progress
  };
}
