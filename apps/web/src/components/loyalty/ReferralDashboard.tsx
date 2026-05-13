"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Users, TrendingUp, Gift, Check } from "lucide-react";

interface ReferralStats {
  total_referrals: number;
  signed_up: number;
  completed: number;
  total_points_earned: number;
}

export default function ReferralDashboard() {
  const [code, setCode] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [codeRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/referrals/generate-code`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/referrals/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const codeData = await codeRes.json();
      const statsData = await statsRes.json();

      setCode(codeData.code);
      setShareUrl(codeData.share_url);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (platform: string) => {
    const text = `Join CarKid0 Rentals with my referral code ${code} and get 500 bonus points!`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
      email: `mailto:?subject=Join CarKid0 Rentals&body=${encodeURIComponent(text + "\n\n" + shareUrl)}`,
    };
    window.open(urls[platform], "_blank");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Refer Friends, Earn Rewards</h2>
        <p className="text-green-100 mb-6">
          Share your code and earn 500 points per signup + 1000 points when they book!
        </p>

        <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-6">
          <label className="text-sm font-semibold mb-2 block">Your Referral Code</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white text-gray-900 px-6 py-4 rounded-lg font-mono text-2xl font-bold tracking-wider">
              {code}
            </div>
            <button
              onClick={copyCode}
              className="bg-white text-green-600 px-6 py-4 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => shareVia("twitter")}
            className="bg-white/20 backdrop-blur px-4 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
          >
            🐦 Twitter
          </button>
          <button
            onClick={() => shareVia("facebook")}
            className="bg-white/20 backdrop-blur px-4 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
          >
            📘 Facebook
          </button>
          <button
            onClick={() => shareVia("whatsapp")}
            className="bg-white/20 backdrop-blur px-4 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
          >
            💬 WhatsApp
          </button>
          <button
            onClick={() => shareVia("email")}
            className="bg-white/20 backdrop-blur px-4 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
          >
            ✉️ Email
          </button>
        </div>
      </div>

      {stats && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Your Referral Stats
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.total_referrals}</p>
              <p className="text-sm text-gray-600">Total Referrals</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.signed_up}</p>
              <p className="text-sm text-gray-600">Signed Up</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.total_points_earned}</p>
              <p className="text-sm text-gray-600">Points Earned</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">1.</span>
                <span>Share your referral code with friends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">2.</span>
                <span>They sign up using your code → You get 500 points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">3.</span>
                <span>They complete their first booking → You get 1000 more points + they get 500 points</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
