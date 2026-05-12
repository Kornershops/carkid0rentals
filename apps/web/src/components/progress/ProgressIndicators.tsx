'use client';

import { Check } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ progress, showLabel = true, size = 'md' }: ProgressBarProps) {
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[size]}`}>
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(progress)}%</p>
      )}
    </div>
  );
}

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              index < currentStep ? 'bg-blue-600 border-blue-600' :
              index === currentStep ? 'border-blue-600 bg-white' :
              'border-gray-300 bg-white'
            }`}>
              {index < currentStep ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className={`text-sm font-medium ${index === currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                  {index + 1}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 text-gray-600 hidden sm:block">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  
  return (
    <div className={`${sizes[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}
