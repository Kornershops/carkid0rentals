"use client";

import { useEffect, useState } from "react";
import { Gift, Tag, Sparkles, Filter } from "lucide-react";

interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  type: string;
  value: string;
  active: boolean;
}

const typeLabels: Record<string, string> = {
  discount: "Discount",
  voucher: "Voucher",
  service: "Service",
  partner: "Partner Offer",
  perk: "Special Perk",
};

const typeColors: Record<string, string> = {
  discount: "bg-green-100 text-green-800",
  voucher: "bg-blue-100 text-blue-800",
  service: "bg-purple-100 text-purple-800",
  partner: "bg-orange-100 text-orange-800",
  perk: "bg-pink-100 text-pink-800",
};

export default function RewardsCatalog() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [rewardsRes, pointsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/loyalty/rewards`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/loyalty/points`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const rewardsData = await rewardsRes.json();
      const pointsData = await pointsRes.json();

      setRewards(rewardsData.rewards || []);
      setUserPoints(pointsData.points || 0);
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter(
    (r) => filter === "all" || r.type === filter
  );

  const canAfford = (points: number) => userPoints >= points;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rewards Catalog</h2>
          <p className="text-gray-600">You have {userPoints.toLocaleString()} points</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Rewards</option>
            <option value="discount">Discounts</option>
            <option value="voucher">Vouchers</option>
            <option value="service">Services</option>
            <option value="partner">Partner Offers</option>
            <option value="perk">Special Perks</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const affordable = canAfford(reward.points_required);
          return (
            <div
              key={reward.id}
              className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all hover:shadow-lg ${
                affordable ? "border-blue-200 hover:border-blue-400" : "border-gray-200 opacity-75"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[reward.type]}`}>
                  {typeLabels[reward.type]}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1 text-blue-600 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>{reward.points_required.toLocaleString()} pts</span>
                </div>

                <button
                  disabled={!affordable}
                  onClick={() => (window.location.href = `/loyalty/redeem/${reward.id}`)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    affordable
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {affordable ? "Redeem" : "Locked"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No rewards found</p>
        </div>
      )}
    </div>
  );
}
