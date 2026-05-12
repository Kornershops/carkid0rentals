'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Trophy, Star } from 'lucide-react';

interface CelebrationProps {
  type: 'account-created' | 'kyc-approved' | 'first-booking' | 'milestone';
  onClose: () => void;
}

const celebrations = {
  'account-created': {
    icon: CheckCircle,
    title: 'Welcome Aboard! 🎉',
    message: 'Your account is ready. Start exploring vehicles now!',
    color: 'bg-green-500'
  },
  'kyc-approved': {
    icon: Star,
    title: 'Verified! ✨',
    message: 'Your identity is confirmed. You can now book any vehicle.',
    color: 'bg-blue-500'
  },
  'first-booking': {
    icon: Trophy,
    title: 'First Booking Complete! 🚗',
    message: 'Enjoy your ride and stay within the Safe-Halt boundary.',
    color: 'bg-purple-500'
  },
  'milestone': {
    icon: Sparkles,
    title: 'Achievement Unlocked! 🏆',
    message: 'You\'ve completed 10 successful rentals!',
    color: 'bg-yellow-500'
  }
};

export function SuccessCelebration({ type, onClose }: CelebrationProps) {
  const [visible, setVisible] = useState(true);
  const celebration = celebrations[type];
  const Icon = celebration.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          />
        ))}
      </div>

      {/* Success card */}
      <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-in zoom-in-95 fade-in-0">
        <div className={`w-20 h-20 ${celebration.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {celebration.title}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {celebration.message}
        </p>

        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// Hook for triggering celebrations
export function useCelebration() {
  const [celebration, setCelebration] = useState<CelebrationProps['type'] | null>(null);

  const celebrate = (type: CelebrationProps['type']) => {
    setCelebration(type);
  };

  const CelebrationComponent = celebration ? (
    <SuccessCelebration type={celebration} onClose={() => setCelebration(null)} />
  ) : null;

  return { celebrate, CelebrationComponent };
}
