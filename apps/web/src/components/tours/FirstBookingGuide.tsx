'use client';

import { useState } from 'react';
import { Search, Calendar, CreditCard, MapPin, CheckCircle, X } from 'lucide-react';
import { useOnboardingStore } from '@/lib/onboarding/store';

const steps = [
  {
    icon: Search,
    title: 'Browse Vehicles',
    description: 'Explore our fleet by category, location, or price range.',
    tip: 'Use filters to find the perfect vehicle for your needs.'
  },
  {
    icon: Calendar,
    title: 'Select Dates',
    description: 'Choose your pickup and return dates and times.',
    tip: 'Longer rentals often get better daily rates.'
  },
  {
    icon: MapPin,
    title: 'Set Location',
    description: 'Confirm pickup location and delivery preferences.',
    tip: 'Some vehicles offer free delivery within city limits.'
  },
  {
    icon: CreditCard,
    title: 'Make Payment',
    description: 'Secure payment via Paystack with instant confirmation.',
    tip: 'Save your card for faster future bookings.'
  },
  {
    icon: CheckCircle,
    title: 'Start Rental',
    description: 'Receive vehicle access code and Safe-Halt geofence details.',
    tip: 'Check the geofence boundary before starting your trip.'
  }
];

export function FirstBookingGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const { markStepComplete } = useOnboardingStore();

  const handleClose = () => {
    markStepComplete('first-booking-intro');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in-0 zoom-in-95">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
          <p className="text-gray-600">{step.description}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Pro Tip:</span> {step.tip}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
