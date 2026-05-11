"use client";

import { useMemo } from 'react';
import { OnboardingProgress, StageStatus } from '@/types/onboarding.types';
import { STAGE_DISPLAY_NAMES } from '@/constants/onboarding.constants';

interface OnboardingProgressIndicatorProps {
  progress: OnboardingProgress;
  isLoading?: boolean;
}

export function OnboardingProgressIndicator({ progress, isLoading = false }: OnboardingProgressIndicatorProps) {
  const progressPercentage = useMemo(() => {
    return Math.min(100, Math.max(0, progress.completionPercentage));
  }, [progress.completionPercentage]);

  if (isLoading) {
    return (
      <div className="w-full py-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6" role="region" aria-label="Onboarding progress">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Your Progress</h3>
        <span className="text-sm font-medium text-blue-600" aria-live="polite">
          {progressPercentage}% Complete
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="space-y-3" role="list">
        {progress.stages.map((stage, index) => {
          const isCompleted = stage.status === StageStatus.COMPLETED;
          const isCurrent = stage.stage === progress.currentStage;
          const isInProgress = stage.status === StageStatus.IN_PROGRESS;

          return (
            <div
              key={stage.stage}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isCurrent ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent || isInProgress
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
                aria-label={isCompleted ? 'Completed' : isCurrent ? 'Current step' : 'Pending'}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                  {STAGE_DISPLAY_NAMES[stage.stage]}
                </p>
                {stage.completedAt && (
                  <p className="text-xs text-gray-500">
                    Completed {new Date(stage.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              {isCurrent && (
                <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-100 rounded">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
