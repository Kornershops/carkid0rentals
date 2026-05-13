"use client";

import { useState } from "react";
import { Calendar, AlertCircle, Check } from "lucide-react";

interface ModifyBookingModalProps {
  bookingId: string;
  currentStartDate: string;
  currentEndDate: string;
  pricePerDay: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModifyBookingModal({
  bookingId,
  currentStartDate,
  currentEndDate,
  pricePerDay,
  onClose,
  onSuccess,
}: ModifyBookingModalProps) {
  const [newStartDate, setNewStartDate] = useState(currentStartDate);
  const [newEndDate, setNewEndDate] = useState(currentEndDate);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const currentDays = Math.ceil(
    (new Date(currentEndDate).getTime() - new Date(currentStartDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const newDays = Math.ceil(
    (new Date(newEndDate).getTime() - new Date(newStartDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysDiff = newDays - currentDays;
  const priceDiff = daysDiff * pricePerDay;

  const handleModify = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for modification");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/modify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStartDate,
          newEndDate,
          reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Booking modified successfully!");
        onSuccess?.();
        onClose();
      } else {
        alert("Failed to modify: " + data.error);
      }
    } catch (error) {
      console.error("Modify booking error:", error);
      alert("Failed to modify booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Modify Booking Dates
          </h2>
          <p className="text-gray-600 mt-1">Change your rental dates</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Start Date
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 font-semibold">
                {new Date(currentStartDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current End Date
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 font-semibold">
                {new Date(currentEndDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">New Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Start Date
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New End Date
                </label>
                <input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  min={newStartDate}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Modification
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need to change the dates..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className={`rounded-lg p-4 border-2 ${
            priceDiff > 0
              ? "bg-yellow-50 border-yellow-200"
              : priceDiff < 0
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex items-start gap-3">
              {priceDiff !== 0 && <AlertCircle className="w-5 h-5 mt-0.5" />}
              {priceDiff === 0 && <Check className="w-5 h-5 mt-0.5 text-blue-600" />}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Price Impact</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Current duration:</span>
                    <span className="font-semibold">{currentDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New duration:</span>
                    <span className="font-semibold">{newDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difference:</span>
                    <span className="font-semibold">
                      {daysDiff > 0 ? "+" : ""}{daysDiff} days
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-base">
                    <span className="font-bold">Price adjustment:</span>
                    <span className={`font-bold ${
                      priceDiff > 0 ? "text-yellow-700" : priceDiff < 0 ? "text-green-700" : "text-blue-700"
                    }`}>
                      {priceDiff > 0 ? "+" : ""}₦{Math.abs(priceDiff).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {priceDiff > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ You will be charged an additional ₦{priceDiff.toLocaleString()} for the extended rental period.
              </p>
            </div>
          )}

          {priceDiff < 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✅ You will receive a refund of ₦{Math.abs(priceDiff).toLocaleString()} for the shortened rental period.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleModify}
            disabled={loading || !reason.trim()}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Modifying..." : "Confirm Modification"}
          </button>
        </div>
      </div>
    </div>
  );
}
