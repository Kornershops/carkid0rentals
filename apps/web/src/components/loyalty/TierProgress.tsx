"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Crown, Gem } from "lucide-react";

interface TierData {
  current_tier: string;
  lifetime_points: number;
  next_tier: string;
  points_to_next: number;
}

const tierInfo = {
  bronze: {
    icon: Trophy,
    color: "from-amber-700 to-amber-900",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    min: 0,
    max: 5000,
    discount: "5%",
    benefits: ["Basic support", "Points earning", "Rewards catalog access"],
  },
  silver: {
    icon: Star,
    color: "from-gray-400 to-gray-600",
    textColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300",
    min: 5001,
    max: 15000,
    discount: "10%",
    benefits: ["Priority support", "10% discount", "Birthday bonus", "Early access to deals"],
  },
  gold: {
    icon: Crown,
    color: "from-yellow-500 to-yellow-700",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    min: 15001,
    max: 30000,
    discount: "15%",
    benefits: ["Free upgrades", "15% discount", "Priority booking", "Dedicated support line"],
  },
  platinum: {
    icon: Gem,
    color: "from-purple-600 to-purple-900",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    min: 30001,
    max: 999999,
    discount: "20%",
    benefits: ["Concierge service", "20% discount", "VIP treatment", "Exclusive events", "Personal account manager"],
  },
};

export default function TierProgress() {
  const [data, setData] = useState<TierData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTierData();
  }, []);

  const fetchTierData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loyalty/points`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData({
        current_tier: json.tier,
        lifetime_points: json.lifetime_points,
        next_tier: json.next_tier,
        points_to_next: json.points_to_next,
      });
    } catch (error) {
      console.error("Failed to fetch tier data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  const currentInfo = tierInfo[data.current_tier as keyof typeof tierInfo];
  const Icon = currentInfo.icon;
  const progress = data.points_to_next > 0
    ? ((data.lifetime_points - currentInfo.min) / (currentInfo.max - currentInfo.min)) * 100
    : 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tier Status</h2>

      <div className={`bg-gradient-to-r ${currentInfo.color} rounded-xl p-6 text-white mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur p-3 rounded-full">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm opacity-90">Current Tier</p>
              <p className="text-3xl font-bold uppercase">{data.current_tier}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Lifetime Points</p>
            <p className="text-2xl font-bold">{data.lifetime_points.toLocaleString()}</p>
          </div>
        </div>

        {data.points_to_next > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to {data.next_tier.toUpperCase()}</span>
              <span className="font-semibold">{data.points_to_next.toLocaleString()} points to go</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {data.points_to_next === 0 && (
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
            <p className="font-semibold">🎉 You've reached the highest tier!</p>
          </div>
        )}
      </div>

      <div className={`${currentInfo.bgColor} border-2 ${currentInfo.borderColor} rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${currentInfo.textColor} mb-4`}>
          {data.current_tier.toUpperCase()} Benefits
        </h3>
        <ul className="space-y-2">
          {currentInfo.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className={`${currentInfo.textColor} font-bold`}>✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className={`mt-4 pt-4 border-t ${currentInfo.borderColor}`}>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Discount Rate:</span>{" "}
            <span className={`${currentInfo.textColor} font-bold text-lg`}>{currentInfo.discount}</span> off all bookings
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {Object.entries(tierInfo).map(([tier, info]) => {
          const TierIcon = info.icon;
          const isActive = tier === data.current_tier;
          const isPast = tierInfo[tier as keyof typeof tierInfo].min < data.lifetime_points;
          return (
            <div
              key={tier}
              className={`text-center p-3 rounded-lg border-2 transition ${
                isActive
                  ? `${info.borderColor} ${info.bgColor}`
                  : isPast
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <TierIcon className={`w-6 h-6 mx-auto mb-1 ${isActive ? info.textColor : isPast ? "text-green-600" : "text-gray-400"}`} />
              <p className={`text-xs font-semibold uppercase ${isActive ? info.textColor : isPast ? "text-green-600" : "text-gray-400"}`}>
                {tier}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
