import { Star } from '@phosphor-icons/react';

export interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = 16,
  showValue = false,
  className = '',
}: RatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {stars.map((star) => (
          <Star
            key={star}
            size={size}
            weight={star <= value ? 'fill' : 'regular'}
            className={star <= value ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-900 ml-1">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
