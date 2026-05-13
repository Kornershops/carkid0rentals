"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Gift, Users } from "lucide-react";

interface PointsData {
  points: number;
  tier: string;
  lifetime_points: number;
  next_tier: string;
  points_to_next: number;
}

const tierColors = {
  bronze: "bg-amber-700 text-amber-100",
  silver: "bg-gray-400 text-gray-900",
  gold: "bg-yellow-500 text-yellow-900",
  platinum: "bg-purple-600 text-purple-100",
};

const tierIcons = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
};

export default function PointsBalance() {
  const [data, setData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loyalty/points`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch points:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!data) return null;

  const progress = data.points_to_next > 0 
    ? ((data.lifetime_points % 5000) / 5000) * 100 
    : 100;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Loyalty Points</h2>
          <p className="text-blue-100 text-sm">Earn rewards with every booking</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${tierColors[data.tier as keyof typeof tierColors]} font-bold text-lg`}>
          {tierIcons[data.tier as keyof typeof tierIcons]} {data.tier.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5" />
            <span className="text-sm opacity-90">Available Points</span>
          </div>
          <p className="text-3xl font-bold">{data.points.toLocaleString()}</p>
        </div>

        <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm opacity-90">Lifetime Points</span>
          </div>
          <p className="text-3xl font-bold">{data.lifetime_points.toLocaleString()}</p>
        </div>
      </div>

      {data.points_to_next > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to {data.next_tier}</span>
            <span className="font-semibold">{data.points_to_next} points to go</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => (window.location.href = "/loyalty/rewards")}
          className="bg-white text-purple-700 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
        >
          <Gift className="w-5 h-5" />
          Redeem Rewards
        </button>
        <button
          onClick={() => (window.location.href = "/loyalty/referrals")}
          className="bg-white/20 backdrop-blur px-4 py-3 rounded-lg font-semibold hover:bg-white/30 transition flex items-center justify-center gap-2"
        >
          <Users className="w-5 h-5" />
          Refer Friends
        </button>
      </div>
    </div>
  );
}
