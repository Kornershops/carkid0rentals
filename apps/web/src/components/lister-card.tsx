import { ShieldCheck, Clock, Car } from '@phosphor-icons/react';
import { Badge, Button } from '@/components/ui';
import { Rating } from '@/components/ui/rating';
import { Lister } from '@/data/mock-listings';

export interface ListerCardProps {
  lister: Lister;
  showContactButton?: boolean;
}

export function ListerCard({ lister, showContactButton = true }: ListerCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600 flex-shrink-0">
          {lister.name.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {lister.name}
            </h3>
            {lister.verificationStatus === 'verified' && (
              <ShieldCheck size={20} weight="fill" className="text-green-600 flex-shrink-0" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{lister.location}</p>
          
          <div className="flex items-center gap-2">
            <Rating value={lister.rating} size={14} showValue />
            <span className="text-sm text-gray-500">
              ({lister.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} weight="bold" className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Response Time</p>
            <p className="text-sm font-medium text-gray-900">{lister.responseTime}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Car size={16} weight="bold" className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Fleet Size</p>
            <p className="text-sm font-medium text-gray-900">{lister.fleetCount} vehicles</p>
          </div>
        </div>
      </div>
      
      {/* Verification Badge */}
      {lister.verificationStatus === 'verified' && (
        <div className="mb-4">
          <Badge variant="success" size="sm">
            <ShieldCheck size={14} weight="fill" />
            Verified Lister
          </Badge>
        </div>
      )}
      
      {/* Contact Button */}
      {showContactButton && (
        <Button variant="primary" size="md" fullWidth>
          Contact Lister
        </Button>
      )}
    </div>
  );
}
