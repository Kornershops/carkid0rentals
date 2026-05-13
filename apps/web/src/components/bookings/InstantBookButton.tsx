"use client";

import { useState } from "react";
import { Zap, Shield, Check } from "lucide-react";

interface InstantBookButtonProps {
  listingId: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  onSuccess?: (booking: any) => void;
}

export default function InstantBookButton({
  listingId,
  startDate,
  endDate,
  pricePerDay,
  onSuccess,
}: InstantBookButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState("");

  const days = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleInstantBook = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/instant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId,
          startDate,
          endDate,
          insuranceType: selectedInsurance,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess?.(data.booking);
        alert("✅ Booking confirmed instantly!");
      } else {
        alert("Failed to book: " + data.error);
      }
    } catch (error) {
      console.error("Instant book error:", error);
      alert("Failed to complete instant booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowInsurance(true)}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
      >
        <Zap className="w-6 h-6" />
        {loading ? "Processing..." : "Instant Book"}
      </button>

      {showInsurance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add Insurance Protection</h2>
              <p className="text-gray-600 mt-1">Optional but recommended for peace of mind</p>
            </div>

            <div className="p-6 space-y-4">
              <div
                onClick={() => setSelectedInsurance("")}
                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  selectedInsurance === ""
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">No Insurance</h3>
                    <p className="text-sm text-gray-600">Book without insurance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₦0</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedInsurance("basic")}
                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  selectedInsurance === "basic"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">Basic Protection</h3>
                    <p className="text-sm text-gray-600">₦1M coverage • ₦100K deductible</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₦{(5000 * days).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">for {days} days</p>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Collision damage coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Theft protection
                  </li>
                </ul>
              </div>

              <div
                onClick={() => setSelectedInsurance("premium")}
                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  selectedInsurance === "premium"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Premium Protection</h3>
                      <p className="text-sm text-gray-600">₦3M coverage • ₦50K deductible</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₦{(10000 * days).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">for {days} days</p>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Full collision coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Theft protection
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Personal injury coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    24/7 roadside assistance
                  </li>
                </ul>
              </div>

              <div
                onClick={() => setSelectedInsurance("full")}
                className={`border-2 rounded-lg p-4 cursor-pointer transition bg-gradient-to-br from-purple-50 to-blue-50 ${
                  selectedInsurance === "full"
                    ? "border-purple-500"
                    : "border-purple-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Full Coverage</h3>
                      <p className="text-sm text-purple-600 font-semibold">₦5M coverage • Zero deductible</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">₦{(15000 * days).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">for {days} days</p>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Zero deductible - No out-of-pocket costs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Full comprehensive coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Personal injury & medical
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    24/7 premium support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Free replacement vehicle
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowInsurance(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInstantBook}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Booking..." : "Confirm Instant Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
