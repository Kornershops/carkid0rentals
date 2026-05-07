import { HTMLAttributes } from 'react';

export interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon?: React.ElementType;
}

export interface StatsProps extends HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
}

export function Stats({ stats, columns = 3, className = '', ...props }: StatsProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`} {...props}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              {Icon && (
                <div className="p-2 bg-gray-100 rounded-md">
                  <Icon size={20} weight="bold" className="text-gray-600" />
                </div>
              )}
            </div>
            
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {stat.value}
            </p>
            
            {stat.change && (
              <p
                className={`text-sm font-medium ${
                  stat.change.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change.trend === 'up' ? '↑' : '↓'} {Math.abs(stat.change.value)}%
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
