"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/hooks/use-onboarding';
import { OnboardingStage, UserRole, StageStatus } from '@/types/onboarding.types';

const STAGE_ROUTES: Record<UserRole, Record<OnboardingStage, string>> = {
  [UserRole.CUSTOMER]: {
    [OnboardingStage.ROLE_SELECTION]: '/',
    [OnboardingStage.ACCOUNT_CREATION]: '/auth/login',
    [OnboardingStage.IDENTITY_VERIFICATION]: '/auth/kyc',
    [OnboardingStage.DOCUMENT_SUBMISSION]: '/dashboard/customer',
    [OnboardingStage.BUSINESS_REGISTRATION]: '/dashboard/customer',
    [OnboardingStage.VEHICLE_LISTING]: '/dashboard/customer',
    [OnboardingStage.PREFERENCES_SETUP]: '/dashboard/customer',
    [OnboardingStage.PAYMENT_SETUP]: '/dashboard/customer',
    [OnboardingStage.ONBOARDING_COMPLETE]: '/dashboard/customer',
  },
  [UserRole.DRIVER]: {
    [OnboardingStage.ROLE_SELECTION]: '/',
    [OnboardingStage.ACCOUNT_CREATION]: '/driver/register',
    [OnboardingStage.IDENTITY_VERIFICATION]: '/auth/kyc',
    [OnboardingStage.DOCUMENT_SUBMISSION]: '/driver/verify',
    [OnboardingStage.BUSINESS_REGISTRATION]: '/driver/dashboard',
    [OnboardingStage.VEHICLE_LISTING]: '/driver/dashboard',
    [OnboardingStage.PREFERENCES_SETUP]: '/driver/dashboard',
    [OnboardingStage.PAYMENT_SETUP]: '/driver/dashboard',
    [OnboardingStage.ONBOARDING_COMPLETE]: '/driver/dashboard',
  },
  [UserRole.LISTER]: {
    [OnboardingStage.ROLE_SELECTION]: '/',
    [OnboardingStage.ACCOUNT_CREATION]: '/auth/register',
    [OnboardingStage.IDENTITY_VERIFICATION]: '/auth/kyc',
    [OnboardingStage.DOCUMENT_SUBMISSION]: '/lister/dashboard',
    [OnboardingStage.BUSINESS_REGISTRATION]: '/lister/dashboard',
    [OnboardingStage.VEHICLE_LISTING]: '/lister/fleet',
    [OnboardingStage.PREFERENCES_SETUP]: '/lister/dashboard',
    [OnboardingStage.PAYMENT_SETUP]: '/lister/dashboard',
    [OnboardingStage.ONBOARDING_COMPLETE]: '/lister/dashboard',
  },
  [UserRole.HAULER]: {
    [OnboardingStage.ROLE_SELECTION]: '/',
    [OnboardingStage.ACCOUNT_CREATION]: '/auth/register',
    [OnboardingStage.IDENTITY_VERIFICATION]: '/auth/kyc',
    [OnboardingStage.DOCUMENT_SUBMISSION]: '/hauler/vehicles',
    [OnboardingStage.BUSINESS_REGISTRATION]: '/hauler/vehicles',
    [OnboardingStage.VEHICLE_LISTING]: '/hauler/vehicles',
    [OnboardingStage.PREFERENCES_SETUP]: '/hauler/vehicles',
    [OnboardingStage.PAYMENT_SETUP]: '/hauler/vehicles',
    [OnboardingStage.ONBOARDING_COMPLETE]: '/hauler/vehicles',
  },
  [UserRole.COMPANY]: {
    [OnboardingStage.ROLE_SELECTION]: '/',
    [OnboardingStage.ACCOUNT_CREATION]: '/auth/register',
    [OnboardingStage.IDENTITY_VERIFICATION]: '/auth/kyc',
    [OnboardingStage.DOCUMENT_SUBMISSION]: '/dashboard/company',
    [OnboardingStage.BUSINESS_REGISTRATION]: '/dashboard/company',
    [OnboardingStage.VEHICLE_LISTING]: '/fleet',
    [OnboardingStage.PREFERENCES_SETUP]: '/dashboard/company',
    [OnboardingStage.PAYMENT_SETUP]: '/dashboard/company',
    [OnboardingStage.ONBOARDING_COMPLETE]: '/dashboard/company',
  },
  [UserRole.ADMIN]: {
    [OnboardingStage.ROLE_SELECTION]: '/',
    [OnboardingStage.ACCOUNT_CREATION]: '/auth/register',
    [OnboardingStage.IDENTITY_VERIFICATION]: '/dashboard/admin',
    [OnboardingStage.DOCUMENT_SUBMISSION]: '/dashboard/admin',
    [OnboardingStage.BUSINESS_REGISTRATION]: '/dashboard/admin',
    [OnboardingStage.VEHICLE_LISTING]: '/dashboard/admin',
    [OnboardingStage.PREFERENCES_SETUP]: '/dashboard/admin',
    [OnboardingStage.PAYMENT_SETUP]: '/dashboard/admin',
    [OnboardingStage.ONBOARDING_COMPLETE]: '/dashboard/admin',
  },
};

export function ContinueOnboardingBanner() {
  const router = useRouter();
  const { progress } = useOnboarding();

  const completedStages = useMemo(() => {
    if (!progress) return 0;
    return progress.stages.filter(s => s.status === StageStatus.COMPLETED).length;
  }, [progress]);

  const totalStages = useMemo(() => {
    return progress?.stages.length || 0;
  }, [progress]);

  if (!progress || progress.isComplete || progress.currentStage === OnboardingStage.ONBOARDING_COMPLETE) {
    return null;
  }

  const handleContinue = () => {
    if (!progress) return;
    const route = STAGE_ROUTES[progress.userRole]?.[progress.currentStage] || '/';
    router.push(route);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl z-50"
      role="banner"
      aria-label="Continue onboarding"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <p className="font-semibold text-lg">Complete Your Onboarding</p>
                <p className="text-sm text-blue-100" aria-live="polite">
                  {completedStages} of {totalStages} steps complete • {progress.completionPercentage}% done
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-32 bg-white/20 rounded-full h-2" role="progressbar" aria-valuenow={progress.completionPercentage} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
            <button
              onClick={handleContinue}
              className="px-6 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              Continue Setup →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
