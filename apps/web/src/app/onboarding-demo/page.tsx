"use client";

import { useState } from 'react';
import { RoleSelectionModal, OnboardingProgressIndicator, ContinueOnboardingBanner, OnboardingErrorBoundary } from '@/components/onboarding';
import { useOnboarding } from '@/hooks/use-onboarding';
import { UserRole, DriverServiceType, HaulerCargoType, ListerFleetType } from '@/types/onboarding.types';

export default function OnboardingExample() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { progress, isLoading, error } = useOnboarding();

  const handleRoleComplete = (
    role: UserRole,
    subType?: DriverServiceType | HaulerCargoType | ListerFleetType
  ) => {
    console.log('Role selected:', role, subType);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Onboarding System Demo</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Start Onboarding</h2>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Select Your Role
            </button>
          </div>

          {progress && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Current Progress</h2>
              <OnboardingProgressIndicator progress={progress} isLoading={isLoading} />
            </div>
          )}

          <RoleSelectionModal
            isOpen={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            onComplete={handleRoleComplete}
          />

          <ContinueOnboardingBanner />
        </div>
      </div>
    </OnboardingErrorBoundary>
  );
}
