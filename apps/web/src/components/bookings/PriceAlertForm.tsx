"use client";

import { useState } from "react";
import { Bell, TrendingDown, Check } from "lucide-react";

interface PriceAlertFormProps {
  listingId: string;
  currentPrice: number;
  vehicleName: string;
}

export default function PriceAlertForm({
  listingId,
  currentPrice,
  vehicleName,
}: PriceAlertFormProps) {
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const savings = currentPrice - targetPrice;
  const savingsPercent = Math.round((savings / currentPrice) * 100);

  const handleCreateAlert = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/price-alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId,
          targetPrice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to create alert: " + data.error);
      }
    } catch (error) {
      console.error("Failed to create price alert:", error);
      alert("Failed to create price alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Set Price Alert</h3>
      </div>

      <p className="text-gray-600 mb-6">
        Get notified when the price for <span className="font-semibold">{vehicleName}</span> drops to your target
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Price (per day)
          </label>
          <div className="text-3xl font-bold text-gray-900">
            ₦{currentPrice.toLocaleString()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target Price (per day)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              ₦
            </span>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
              min="0"
              max={currentPrice}
            />
          </div>

          <input
            type="range"
            value={targetPrice}
            onChange={(e) => setTargetPrice(parseInt(e.target.value))}
            min={Math.round(currentPrice * 0.5)}
            max={currentPrice}
            step="1000"
            className="w-full mt-3"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50% off</span>
            <span>Current price</span>
          </div>
        </div>

        {savings > 0 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <TrendingDown className="w-5 h-5" />
              <span className="font-semibold">Potential Savings</span>
            </div>
            <div className="text-3xl font-bold text-green-700">
              ₦{savings.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 mt-1">
              {savingsPercent}% discount from current price
            </div>
          </div>
        )}

        {savings <= 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700 text-sm">
              ⚠️ Target price must be lower than current price to create an alert
            </p>
          </div>
        )}

        <button
          onClick={handleCreateAlert}
          disabled={loading || savings <= 0 || success}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {success ? (
            <>
              <Check className="w-6 h-6" />
              Alert Created!
            </>
          ) : loading ? (
            "Creating Alert..."
          ) : (
            <>
              <Bell className="w-6 h-6" />
              Create Price Alert
            </>
          )}
        </button>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Set your target price below the current price</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>We'll monitor the price daily</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Get notified via email, SMS, and push notification when price drops</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Book quickly before the price goes back up!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
