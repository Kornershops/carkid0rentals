'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '@/lib/onboarding/store';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="search"]',
    title: 'Search & Filter',
    description: 'Find vehicles by category, location, price, or availability.',
    position: 'bottom'
  },
  {
    target: '[data-tour="profile"]',
    title: 'Your Profile',
    description: 'Manage bookings, documents, and account settings here.',
    position: 'bottom'
  },
  {
    target: '[data-tour="notifications"]',
    title: 'Stay Updated',
    description: 'Get real-time alerts for bookings, payments, and Safe-Halt warnings.',
    position: 'bottom'
  },
  {
    target: '[data-tour="help"]',
    title: 'Need Help?',
    description: 'Access support, FAQs, and emergency contacts anytime.',
    position: 'left'
  }
];

export function FeatureTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const { markStepComplete } = useOnboardingStore();

  useEffect(() => {
    const element = document.querySelector(tourSteps[currentStep].target);
    if (element) {
      setTargetRect(element.getBoundingClientRect());
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    markStepComplete('feature-tour');
  };

  const step = tourSteps[currentStep];

  const getTooltipPosition = () => {
    if (!targetRect) return {};
    
    const positions = {
      top: { bottom: window.innerHeight - targetRect.top + 16, left: targetRect.left + targetRect.width / 2 },
      bottom: { top: targetRect.bottom + 16, left: targetRect.left + targetRect.width / 2 },
      left: { top: targetRect.top + targetRect.height / 2, right: window.innerWidth - targetRect.left + 16 },
      right: { top: targetRect.top + targetRect.height / 2, left: targetRect.right + 16 }
    };

    return positions[step.position];
  };

  return (
    <>
      {/* Overlay with spotlight */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="absolute inset-0 bg-black/60" />
        {targetRect && (
          <div
            className="absolute bg-transparent border-4 border-blue-500 rounded-lg shadow-2xl pointer-events-auto"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl p-4 max-w-xs animate-in fade-in-0 zoom-in-95"
        style={{
          ...getTooltipPosition(),
          transform: step.position === 'top' || step.position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)'
        }}
      >
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-6">{step.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{step.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
