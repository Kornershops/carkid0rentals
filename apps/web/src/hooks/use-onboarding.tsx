"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserRole,
  OnboardingStage,
  OnboardingProgress,
  StageMetadata,
  StageStatus,
  DriverServiceType,
  HaulerCargoType,
  ListerFleetType,
} from '@/types/onboarding.types';
import {
  STORAGE_KEYS,
  SESSION_EXPIRY_DURATION,
  ONBOARDING_CONFIGURATIONS,
} from '@/constants/onboarding.constants';

function validateOnboardingProgress(data: any): data is OnboardingProgress {
  return (
    data &&
    typeof data.sessionId === 'string' &&
    typeof data.userRole === 'string' &&
    typeof data.currentStage === 'string' &&
    Array.isArray(data.stages) &&
    typeof data.completionPercentage === 'number' &&
    Array.isArray(data.documents) &&
    typeof data.createdAt === 'string' &&
    typeof data.updatedAt === 'string' &&
    typeof data.expiresAt === 'string' &&
    typeof data.isComplete === 'boolean'
  );
}

function generateSecureSessionId(role: UserRole): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${role}_${crypto.randomUUID()}`;
  }
  return `${role}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

export function useOnboarding() {
  const router = useRouter();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        if (!validateOnboardingProgress(parsed)) {
          console.warn('Invalid onboarding progress schema, clearing data');
          localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
          setIsLoading(false);
          return;
        }

        if (new Date(parsed.expiresAt) > new Date()) {
          setProgress(parsed);
        } else {
          console.info('Onboarding session expired, clearing data');
          localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
        }
      }
    } catch (err) {
      console.error('Failed to parse onboarding progress:', err);
      setError('Failed to load onboarding progress');
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const saveProgress = useCallback((newProgress: OnboardingProgress) => {
    if (typeof window === 'undefined') return;

    try {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEYS.ONBOARDING_PROGRESS, JSON.stringify(newProgress));
        
        // Sync to backend (optional)
        syncToBackend(newProgress);
      }, 300);

      setProgress(newProgress);
    } catch (err) {
      console.error('Failed to save onboarding progress:', err);
      setError('Failed to save progress');
    }
  }, []);

  const syncToBackend = async (progress: OnboardingProgress) => {
    if (typeof window === 'undefined') return;
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return; // User not authenticated yet

      await fetch('/api/v1/onboarding/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(progress),
      });
    } catch (err) {
      console.warn('Failed to sync progress to backend:', err);
      // Don't throw - LocalStorage is primary, backend is backup
    }
  };

  const initializeOnboarding = useCallback((role: UserRole, roleSubType?: DriverServiceType | HaulerCargoType | ListerFleetType) => {
    const config = ONBOARDING_CONFIGURATIONS[role];
    const now = new Date().toISOString();
    const sessionId = generateSecureSessionId(role);

    const stages: StageMetadata[] = [...config.requiredStages, ...config.optionalStages].map(stage => ({
      stage,
      status: stage === OnboardingStage.ROLE_SELECTION ? StageStatus.COMPLETED : StageStatus.NOT_STARTED,
      attemptCount: 0,
    }));

    const initialProgress: OnboardingProgress = {
      sessionId,
      userRole: role,
      roleSubType,
      currentStage: OnboardingStage.ACCOUNT_CREATION,
      stages,
      completionPercentage: Math.round((1 / stages.length) * 100),
      documents: [],
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(Date.now() + SESSION_EXPIRY_DURATION).toISOString(),
      isComplete: false,
    };

    saveProgress(initialProgress);
    
    // Track analytics
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ analytics }) => {
        analytics.roleSelected(role, roleSubType);
      });
    }
    
    return initialProgress;
  }, [saveProgress]);

  const updateStage = useCallback((stage: OnboardingStage, data?: Partial<OnboardingProgress>) => {
    if (!progress) {
      console.warn('Cannot update stage: no progress found');
      return;
    }

    const stageExists = progress.stages.some(s => s.stage === stage);
    if (!stageExists) {
      console.error(`Stage ${stage} does not exist in onboarding flow`);
      setError(`Invalid stage: ${stage}`);
      return;
    }

    const updatedStages = progress.stages.map(s =>
      s.stage === progress.currentStage
        ? { ...s, status: StageStatus.COMPLETED, completedAt: new Date().toISOString() }
        : s.stage === stage
        ? { ...s, status: StageStatus.IN_PROGRESS, startedAt: new Date().toISOString() }
        : s
    );

    const completedCount = updatedStages.filter(s => s.status === StageStatus.COMPLETED).length;
    const completionPercentage = Math.round((completedCount / updatedStages.length) * 100);

    const updatedProgress: OnboardingProgress = {
      ...progress,
      ...data,
      currentStage: stage,
      stages: updatedStages,
      completionPercentage,
      updatedAt: new Date().toISOString(),
    };

    saveProgress(updatedProgress);
    
    // Track analytics
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ analytics }) => {
        const completedStage = progress.stages.find(s => s.stage === progress.currentStage);
        if (completedStage?.startedAt) {
          const duration = Math.floor((new Date().getTime() - new Date(completedStage.startedAt).getTime()) / 1000);
          analytics.stageCompleted(progress.currentStage, progress.userRole, duration);
        }
        analytics.stageStarted(stage, progress.userRole);
      });
    }
  }, [progress, saveProgress]);

  const completeOnboarding = useCallback(() => {
    if (!progress) return;

    const finalProgress: OnboardingProgress = {
      ...progress,
      currentStage: OnboardingStage.ONBOARDING_COMPLETE,
      completionPercentage: 100,
      isComplete: true,
      updatedAt: new Date().toISOString(),
    };

    setProgress(finalProgress);

    // Track analytics
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ analytics }) => {
        const totalTime = Math.floor((new Date().getTime() - new Date(progress.createdAt).getTime()) / 1000);
        const completedStages = progress.stages.filter(s => s.status === StageStatus.COMPLETED).length;
        analytics.onboardingCompleted(progress.userRole, totalTime, completedStages);
      });
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.ONBOARDING_PROGRESS, JSON.stringify(finalProgress));
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
            setProgress(null);
          }, 1000);
        });
      } catch (err) {
        console.error('Failed to complete onboarding:', err);
      }
    }
  }, [progress]);

  const abandonOnboarding = useCallback(() => {
    if (!progress) return;

    const abandonedProgress: OnboardingProgress = {
      ...progress,
      abandonedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProgress(abandonedProgress);
    
    // Track analytics
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ analytics }) => {
        const timeSpent = Math.floor((new Date().getTime() - new Date(progress.createdAt).getTime()) / 1000);
        analytics.onboardingAbandoned(
          progress.currentStage,
          progress.userRole,
          progress.completionPercentage,
          timeSpent
        );
      });
    }
  }, [progress, saveProgress]);

  return {
    progress,
    isLoading,
    error,
    initializeOnboarding,
    updateStage,
    completeOnboarding,
    abandonOnboarding,
  };
}
