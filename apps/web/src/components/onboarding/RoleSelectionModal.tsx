"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { UserRole, DriverServiceType, HaulerCargoType, ListerFleetType } from '@/types/onboarding.types';
import { DRIVER_SERVICE_OPTIONS, HAULER_CARGO_OPTIONS, LISTER_FLEET_OPTIONS } from '@/constants/onboarding.constants';
import { useOnboarding } from '@/hooks/use-onboarding';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (role: UserRole, subType?: DriverServiceType | HaulerCargoType | ListerFleetType) => void;
}

export function RoleSelectionModal({ isOpen, onClose, onComplete }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initializeOnboarding } = useOnboarding();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      firstFocusableRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  const roles = [
    { value: UserRole.CUSTOMER, label: 'Customer', description: 'Rent vehicles for personal use', icon: '👤' },
    { value: UserRole.DRIVER, label: 'Driver', description: 'Drive for ride-hailing or delivery', icon: '🚗', hasSubTypes: true },
    { value: UserRole.LISTER, label: 'Lister', description: 'List your vehicles for rent', icon: '🏢', hasSubTypes: true },
    { value: UserRole.HAULER, label: 'Hauler', description: 'Transport cargo and goods', icon: '🚛', hasSubTypes: true },
    { value: UserRole.COMPANY, label: 'Company', description: 'Manage corporate fleet', icon: '🏭' },
  ];

  const getSubTypeOptions = () => {
    if (selectedRole === UserRole.DRIVER) return DRIVER_SERVICE_OPTIONS;
    if (selectedRole === UserRole.HAULER) return HAULER_CARGO_OPTIONS;
    if (selectedRole === UserRole.LISTER) return LISTER_FLEET_OPTIONS;
    return [];
  };

  const handleContinue = async () => {
    if (!selectedRole || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const subType = selectedSubType as DriverServiceType | HaulerCargoType | ListerFleetType | undefined;
      initializeOnboarding(selectedRole, subType);
      onComplete(selectedRole, subType);
      onClose();
    } catch (error) {
      console.error('Failed to initialize onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const needsSubType = selectedRole && roles.find(r => r.value === selectedRole)?.hasSubTypes;
  const canContinue = selectedRole && (!needsSubType || selectedSubType);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-selection-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 id="role-selection-title" className="text-2xl font-bold">Choose Your Role</h2>
          <p className="text-gray-600 mt-1">Select how you'll use CarKid0 Rentals</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roles.map((role, index) => (
              <button
                key={role.value}
                ref={index === 0 ? firstFocusableRef : null}
                onClick={() => {
                  setSelectedRole(role.value);
                  setSelectedSubType(null);
                }}
                aria-pressed={selectedRole === role.value}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  selectedRole === role.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{role.label}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </button>
            ))}
          </div>

          {needsSubType && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold mb-4">Select Your Specialty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getSubTypeOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedSubType(option.value)}
                    aria-pressed={selectedSubType === option.value}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSubType === option.value
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{option.label}</h4>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue || isSubmitting}
            aria-busy={isSubmitting}
            className={`px-8 py-2 rounded-lg font-medium transition-all ${
              canContinue && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Loading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
