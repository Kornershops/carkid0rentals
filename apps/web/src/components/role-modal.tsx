"use client";

import { useState } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { useStore, UserRole } from '@/store/use-store';
import { Car, Truck, Crown, Buildings } from '@phosphor-icons/react';

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
  },
  {
    id: 'driver' as UserRole,
    title: 'Driver',
    description: 'Access eco-gig vehicles for ride-hailing and delivery services',
    icon: Car,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'logistics' as UserRole,
    title: 'Hauler',
    description: 'Book heavy-haul vehicles for logistics and transportation',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'admin' as UserRole,
    title: 'Lister',
    description: 'List and manage your fleet, connect with renters',
    icon: Buildings,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export function RoleModal({ isOpen, onClose }: RoleModalProps) {
  const { role, setRole } = useStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(role);
  
  const handleConfirm = () => {
    if (selectedRole) {
      setRole(selectedRole);
      onClose();
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
                onClick={() => setSelectedRole(roleOption.id)}
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
            disabled={!selectedRole}
          >
            Continue as {selectedRole && roles.find(r => r.id === selectedRole)?.title}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
