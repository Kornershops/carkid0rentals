"use client";

import { useState } from "react";
import { UserPlus, X, Mail, DollarSign, Users, Send, AlertCircle } from "lucide-react";

interface Participant {
  id: string;
  email: string;
  amount: number;
  status: "pending" | "paid" | "failed";
}

interface SplitPaymentFormProps {
  totalAmount: number;
  bookingId: string;
  onSuccess?: () => void;
}

export default function SplitPaymentForm({ totalAmount, bookingId, onSuccess }: SplitPaymentFormProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", email: "", amount: 0, status: "pending" },
  ]);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addParticipant = () => {
    if (participants.length >= 4) {
      setErrors({ ...errors, participants: "Maximum 4 participants allowed" });
      return;
    }

    setParticipants([
      ...participants,
      { id: Date.now().toString(), email: "", amount: 0, status: "pending" },
    ]);
    setErrors({ ...errors, participants: "" });
  };

  const removeParticipant = (id: string) => {
    if (participants.length <= 2) {
      setErrors({ ...errors, participants: "Minimum 2 participants required" });
      return;
    }
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const updateParticipant = (id: string, field: keyof Participant, value: any) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setErrors({ ...errors, [id]: "" });
  };

  const calculateSplitAmounts = () => {
    if (splitType === "equal") {
      const amountPerPerson = totalAmount / participants.length;
      return participants.map((p) => ({ ...p, amount: amountPerPerson }));
    }
    return participants;
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check for duplicate emails
    const emails = participants.map((p) => p.email.toLowerCase());
    const duplicates = emails.filter((e, i) => emails.indexOf(e) !== i);
    if (duplicates.length > 0) {
      newErrors.participants = "Duplicate email addresses found";
    }

    // Validate each participant
    participants.forEach((p) => {
      if (!p.email.trim()) {
        newErrors[p.id] = "Email is required";
      } else if (!validateEmail(p.email)) {
        newErrors[p.id] = "Invalid email address";
      }

      if (splitType === "custom" && p.amount <= 0) {
        newErrors[`${p.id}_amount`] = "Amount must be greater than 0";
      }
    });

    // Validate total amount for custom split
    if (splitType === "custom") {
      const total = participants.reduce((sum, p) => sum + p.amount, 0);
      if (Math.abs(total - totalAmount) > 0.01) {
        newErrors.total = `Total must equal ${totalAmount.toLocaleString()}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const splitParticipants = calculateSplitAmounts();

      const response = await fetch("/api/v1/payments/split", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          total_amount: totalAmount,
          participants: splitParticipants.map((p) => ({
            email: p.email,
            amount: p.amount,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to create split payment");

      onSuccess?.();
    } catch (error) {
      setErrors({ submit: "Failed to create split payment. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const splitParticipants = calculateSplitAmounts();
  const totalSplit = splitParticipants.reduce((sum, p) => sum + p.amount, 0);
  const isValid = Math.abs(totalSplit - totalAmount) < 0.01;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Split Payment</h3>
        </div>
        <p className="text-sm text-blue-700">
          Total Amount: <span className="font-bold">₦{totalAmount.toLocaleString()}</span>
        </p>
      </div>

      {/* Split Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Split Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSplitType("equal")}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              splitType === "equal"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium mb-1">Equal Split</div>
            <div className="text-sm text-gray-600">
              ₦{(totalAmount / participants.length).toLocaleString()} per person
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSplitType("custom")}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              splitType === "custom"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium mb-1">Custom Split</div>
            <div className="text-sm text-gray-600">Set custom amounts</div>
          </button>
        </div>
      </div>

      {/* Participants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Participants ({participants.length}/4)
          </label>
          <button
            type="button"
            onClick={addParticipant}
            disabled={participants.length >= 4}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            Add Participant
          </button>
        </div>

        <div className="space-y-3">
          {splitParticipants.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 space-y-3">
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      value={participant.email}
                      onChange={(e) =>
                        updateParticipant(participant.id, "email", e.target.value)
                      }
                      placeholder={`participant${index + 1}@example.com`}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors[participant.id] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors[participant.id] && (
                    <p className="text-red-500 text-xs mt-1">{errors[participant.id]}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={participant.amount}
                      onChange={(e) =>
                        updateParticipant(
                          participant.id,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      disabled={splitType === "equal"}
                      placeholder="0.00"
                      step="0.01"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        splitType === "equal" ? "bg-gray-100" : ""
                      } ${
                        errors[`${participant.id}_amount`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors[`${participant.id}_amount`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`${participant.id}_amount`]}
                    </p>
                  )}
                </div>
              </div>

              {participants.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeParticipant(participant.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.participants && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.participants}
          </p>
        )}
      </div>

      {/* Total Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total Split Amount:</span>
          <span className={`font-bold ${isValid ? "text-green-600" : "text-red-600"}`}>
            ₦{totalSplit.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Required Amount:</span>
          <span className="font-bold">₦{totalAmount.toLocaleString()}</span>
        </div>
        {!isValid && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.total || "Amounts don't match"}
          </p>
        )}
      </div>

      {/* Email Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Email Invitation Preview</h4>
        <p className="text-sm text-blue-700">
          Each participant will receive an email with a secure payment link to pay their
          share of ₦{splitType === "equal" ? (totalAmount / participants.length).toLocaleString() : "their custom amount"}.
        </p>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !isValid}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-5 h-5" />
        {loading ? "Sending Invitations..." : "Send Payment Invitations"}
      </button>
    </form>
  );
}
