"use client";

import { useState } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { useStore, UserRole } from '@/store/use-store';
import { Car, Truck, Crown, Buildings, CaretDown } from '@phosphor-icons/react';

export interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roles = [
  {
    id: 'customer' as UserRole,
    title: 'Renter',
    description: 'Browse and book premium vehicles for personal or business use',
    icon: Crown,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hasSubOptions: false,
  },
  {
    id: 'driver' as UserRole,
    title: 'Driver (Eco-Gig)',
    description: 'Access eco-gig vehicles for ride-hailing and delivery services',
    icon: Car,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hasSubOptions: true,
    subOptions: [
      { value: 'ride-hailing', label: 'Ride-Hailing (Uber, Bolt, etc.)' },
      { value: 'delivery', label: 'Delivery Services' },
      { value: 'both', label: 'Both Ride-Hailing & Delivery' },
    ],
  },
  {
    id: 'logistics' as UserRole,
    title: 'Hauler',
    description: 'Book heavy-haul vehicles for logistics and transportation',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hasSubOptions: true,
    subOptions: [
      { value: 'light-cargo', label: 'Light Cargo (Pickup Trucks)' },
      { value: 'medium-cargo', label: 'Medium Cargo (Box Trucks)' },
      { value: 'heavy-cargo', label: 'Heavy Cargo (Semi-Trucks)' },
      { value: 'specialized', label: 'Specialized (Flatbed, Tanker)' },
    ],
  },
  {
    id: 'admin' as UserRole,
    title: 'Vehicle Owner (Lister)',
    description: 'List and manage your fleet, connect with renters',
    icon: Buildings,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hasSubOptions: true,
    subOptions: [
      { value: 'exotic', label: 'Exotic & Luxury Vehicles' },
      { value: 'premium', label: 'Premium Vehicles' },
      { value: 'eco-gig', label: 'Eco-Gig Vehicles (for drivers)' },
      { value: 'heavy-haul', label: 'Heavy-Haul Vehicles (trucks)' },
      { value: 'mixed-fleet', label: 'Mixed Fleet (Multiple Types)' },
    ],
  },
];

export function RoleModal({ isOpen, onClose }: RoleModalProps) {
  const { role, setRole } = useStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(role);
  const [selectedSubOption, setSelectedSubOption] = useState<string>('');
  
  const selectedRoleData = roles.find(r => r.id === selectedRole);
  
  const handleConfirm = () => {
    if (selectedRole) {
      setRole(selectedRole);
      
      // Store sub-option selection in localStorage for onboarding
      if (selectedSubOption) {
        localStorage.setItem('userRoleSubType', selectedSubOption);
      }
      
      // Redirect to appropriate onboarding based on role
      if (selectedRole === 'driver') {
        window.location.href = '/driver/register';
      } else if (selectedRole === 'admin') {
        window.location.href = '/auth/register/lister';
      } else if (selectedRole === 'logistics') {
        window.location.href = '/hauler/vehicles';
      } else {
        onClose();
      }
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Role"
      size="lg"
      showCloseButton={false}
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Select how you'd like to use CarKid0. You can change this anytime.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((roleOption) => {
            const Icon = roleOption.icon;
            const isSelected = selectedRole === roleOption.id;
            
            return (
              <button
                key={roleOption.id}
                onClick={() => {
                  setSelectedRole(roleOption.id);
                  setSelectedSubOption('');
                }}
                className={`
                  p-6 rounded-lg border-2 transition-all text-left
                  ${isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-lg ${roleOption.bgColor} flex items-center justify-center mb-4`}>
                  <Icon size={24} weight="bold" className={roleOption.color} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {roleOption.title}
                </h3>
                
                <p className="text-sm text-gray-600">
                  {roleOption.description}
                </p>
              </button>
            );
          })}
        </div>
        
        {/* Sub-option dropdown */}
        {selectedRoleData?.hasSubOptions && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {selectedRoleData.id === 'driver' && 'What type of gig work will you do?'}
              {selectedRoleData.id === 'logistics' && 'What type of cargo will you haul?'}
              {selectedRoleData.id === 'admin' && 'What type of vehicles will you list?'}
            </label>
            <div className="relative">
              <select
                value={selectedSubOption}
                onChange={(e) => setSelectedSubOption(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select an option...</option>
                {selectedRoleData.subOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <CaretDown 
                size={16} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedRole || (selectedRoleData?.hasSubOptions && !selectedSubOption)}
          >
            Continue as {selectedRole && roles.find(r => r.id === selectedRole)?.title}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
