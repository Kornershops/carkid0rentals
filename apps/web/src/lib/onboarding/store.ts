"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OnboardingStep = 
  | 'welcome'
  | 'phone-verification'
  | 'kyc-intro'
  | 'kyc-upload'
  | 'kyc-pending'
  | 'first-booking-intro'
  | 'safe-halt-intro'
  | 'geofence-explanation'
  | 'complete';

export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';

interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  status: OnboardingStatus;
  showTooltips: boolean;
  hasSeenWelcome: boolean;
  hasSeenSafeHaltIntro: boolean;
  hasCompletedFirstBooking: boolean;
  
  // Actions
  setCurrentStep: (step: OnboardingStep) => void;
  completeStep: (step: OnboardingStep) => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  toggleTooltips: () => void;
  markWelcomeSeen: () => void;
  markSafeHaltIntroSeen: () => void;
  markFirstBookingComplete: () => void;
  
  // Helpers
  isStepCompleted: (step: OnboardingStep) => boolean;
  getProgress: () => number;
  getNextStep: () => OnboardingStep | null;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'phone-verification',
  'kyc-intro',
  'kyc-upload',
  'kyc-pending',
  'first-booking-intro',
  'safe-halt-intro',
  'geofence-explanation',
  'complete',
];

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 'welcome',
      completedSteps: [],
      status: 'not-started',
      showTooltips: true,
      hasSeenWelcome: false,
      hasSeenSafeHaltIntro: false,
      hasCompletedFirstBooking: false,

      setCurrentStep: (step) => {
        set({ 
          currentStep: step,
          status: step === 'complete' ? 'completed' : 'in-progress'
        });
      },

      completeStep: (step) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(step)) {
          const newCompleted = [...completedSteps, step];
          const nextStep = get().getNextStep();
          
          set({
            completedSteps: newCompleted,
            currentStep: nextStep || 'complete',
            status: nextStep ? 'in-progress' : 'completed',
          });
        }
      },

      skipOnboarding: () => {
        set({
          status: 'skipped',
          currentStep: 'complete',
          showTooltips: false,
        });
      },

      resetOnboarding: () => {
        set({
          currentStep: 'welcome',
          completedSteps: [],
          status: 'not-started',
          showTooltips: true,
          hasSeenWelcome: false,
          hasSeenSafeHaltIntro: false,
          hasCompletedFirstBooking: false,
        });
      },

      toggleTooltips: () => {
        set((state) => ({ showTooltips: !state.showTooltips }));
      },

      markWelcomeSeen: () => {
        set({ hasSeenWelcome: true });
      },

      markSafeHaltIntroSeen: () => {
        set({ hasSeenSafeHaltIntro: true });
      },

      markFirstBookingComplete: () => {
        set({ hasCompletedFirstBooking: true });
      },

      isStepCompleted: (step) => {
        return get().completedSteps.includes(step);
      },

      getProgress: () => {
        const { completedSteps } = get();
        return Math.round((completedSteps.length / ONBOARDING_STEPS.length) * 100);
      },

      getNextStep: () => {
        const { currentStep, completedSteps } = get();
        const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
        
        for (let i = currentIndex + 1; i < ONBOARDING_STEPS.length; i++) {
          if (!completedSteps.includes(ONBOARDING_STEPS[i])) {
            return ONBOARDING_STEPS[i];
          }
        }
        
        return null;
      },
    }),
    {
      name: 'carkid0-onboarding',
    }
  )
);
