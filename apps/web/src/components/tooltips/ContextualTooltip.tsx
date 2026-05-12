'use client';

import { useState, useRef, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children: React.ReactNode;
}

export function ContextualTooltip({ content, position = 'top', trigger = 'hover', children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 'click' && visible) {
      const handleClickOutside = (e: MouseEvent) => {
        if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
          setVisible(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [visible, trigger]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <div
        onMouseEnter={() => trigger === 'hover' && setVisible(true)}
        onMouseLeave={() => trigger === 'hover' && setVisible(false)}
        onClick={() => trigger === 'click' && setVisible(!visible)}
      >
        {children}
      </div>
      {visible && (
        <div className={`absolute z-50 ${positionClasses[position]} animate-in fade-in-0 zoom-in-95`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg">
            {content}
            {trigger === 'click' && (
              <button onClick={() => setVisible(false)} className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function HelpTooltip({ content, position = 'top' }: Omit<TooltipProps, 'children' | 'trigger'>) {
  return (
    <ContextualTooltip content={content} position={position} trigger="hover">
      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help inline-block" />
    </ContextualTooltip>
  );
}
