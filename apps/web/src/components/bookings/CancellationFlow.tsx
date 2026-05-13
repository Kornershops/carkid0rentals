"use client";

import { useState } from "react";
import { XCircle, DollarSign, AlertTriangle, Info } from "lucide-react";

interface CancellationFlowProps {
  bookingId: string;
  startDate: string;
  totalAmount: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CancellationFlow({
  bookingId,
  startDate,
  totalAmount,
  onClose,
  onSuccess,
}: CancellationFlowProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const daysUntilStart = Math.ceil(
    (new Date(startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getRefundInfo = () => {
    if (daysUntilStart >= 7) {
      return {
        percentage: 100,
        amount: totalAmount,
        policy: "Full refund",
        color: "green",
      };
    } else if (daysUntilStart >= 3) {
      return {
        percentage: 75,
        amount: Math.round(totalAmount * 0.75),
        policy: "75% refund",
        color: "yellow",
      };
    } else if (daysUntilStart >= 1) {
      return {
        percentage: 50,
        amount: Math.round(totalAmount * 0.5),
        policy: "50% refund",
        color: "orange",
      };
    }
    return {
      percentage: 0,
      amount: 0,
      policy: "No refund",
      color: "red",
    };
  };

  const refundInfo = getRefundInfo();

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();
      if (data.success) {
        setStep(3);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 3000);
      } else {
        alert("Failed to cancel: " + data.error);
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-600" />
                Cancel Booking
              </h2>
              <p className="text-gray-600 mt-1">Review cancellation policy and refund amount</p>
            </div>

            <div className="p-6 space-y-6">
              <div className={`bg-${refundInfo.color}-50 border-2 border-${refundInfo.color}-200 rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className={`w-8 h-8 text-${refundInfo.color}-600`} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Refund Amount</h3>
                    <p className={`text-sm text-${refundInfo.color}-700`}>{refundInfo.policy}</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₦{refundInfo.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {refundInfo.percentage}% of ₦{totalAmount.toLocaleString()} total booking amount
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span><strong>7+ days before:</strong> 100% refund</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span><strong>3-6 days before:</strong> 75% refund</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span><strong>1-2 days before:</strong> 50% refund</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span><strong>Less than 24 hours:</strong> No refund</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Booking starts in:</span>
                  <span className="text-lg font-bold text-gray-900">{daysUntilStart} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-${refundInfo.color}-500 transition-all`}
                    style={{ width: `${refundInfo.percentage}%` }}
                  ></div>
                </div>
              </div>

              {refundInfo.percentage < 100 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Warning:</strong> You will lose ₦{(totalAmount - refundInfo.amount).toLocaleString()} 
                        ({100 - refundInfo.percentage}%) of your booking amount if you cancel now.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Continue Cancellation
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Confirm Cancellation</h2>
              <p className="text-gray-600 mt-1">Please tell us why you're cancelling</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please explain why you need to cancel this booking..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Cancellation Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Original amount:</span>
                    <span className="font-semibold">₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation fee:</span>
                    <span className="font-semibold text-red-600">
                      -₦{(totalAmount - refundInfo.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-base">
                    <span className="font-bold">Refund amount:</span>
                    <span className="font-bold text-green-600">
                      ₦{refundInfo.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💳 Refund will be processed within 5-7 business days to your original payment method.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                disabled={loading || !reason.trim()}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Cancelled</h2>
              <p className="text-gray-600 mb-6">
                Your booking has been cancelled successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Refund: ₦{refundInfo.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Will be processed within 5-7 business days
                </p>
              </div>
              <p className="text-sm text-gray-500">
                This window will close automatically...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
