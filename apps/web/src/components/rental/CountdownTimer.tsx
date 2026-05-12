"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: string;
  onExpire?: () => void;
}

export default function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("Expired");
        setIsExpired(true);
        setPercentage(0);
        onExpire?.();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }

      const totalDuration = end - new Date(endTime).getTime() + diff;
      setPercentage(Math.max(0, (diff / totalDuration) * 100));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const getColorClass = () => {
    if (isExpired) return "text-red-600";
    if (percentage < 10) return "text-red-500";
    if (percentage < 25) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-2xl font-bold ${getColorClass()}`}>
        {timeRemaining}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isExpired ? "bg-red-600" : percentage < 25 ? "bg-orange-500" : "bg-green-600"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
