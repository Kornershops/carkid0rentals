"use client";

import { useState } from "react";
import { Calendar, TrendingUp, CheckCircle, AlertCircle, FileText } from "lucide-react";

interface InstallmentPlan {
  months: number;
  interestRate: number;
  monthlyPayment: number;
  totalCost: number;
}

interface InstallmentCalculatorProps {
  amount: number;
  bookingId: string;
  minAmount?: number;
  onApply?: (plan: InstallmentPlan) => void;
}

export default function InstallmentCalculator({
  amount,
  bookingId,
  minAmount = 50000,
  onApply,
}: InstallmentCalculatorProps) {
  const [selectedPlan, setSelectedPlan] = useState<number>(3);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const plans: InstallmentPlan[] = [
    {
      months: 3,
      interestRate: 5,
      monthlyPayment: (amount * (1 + 0.05)) / 3,
      totalCost: amount * (1 + 0.05),
    },
    {
      months: 6,
      interestRate: 8,
      monthlyPayment: (amount * (1 + 0.08)) / 6,
      totalCost: amount * (1 + 0.08),
    },
    {
      months: 12,
      interestRate: 12,
      monthlyPayment: (amount * (1 + 0.12)) / 12,
      totalCost: amount * (1 + 0.12),
    },
  ];

  const isEligible = amount >= minAmount;
  const selectedPlanData = plans.find((p) => p.months === selectedPlan)!;

  const generateSchedule = () => {
    const schedule = [];
    const today = new Date();

    for (let i = 0; i < selectedPlan; i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(dueDate.getMonth() + i + 1);

      schedule.push({
        installment: i + 1,
        dueDate: dueDate.toLocaleDateString(),
        amount: selectedPlanData.monthlyPayment,
      });
    }

    return schedule;
  };

  const handleApply = async () => {
    if (!isEligible) return;

    setLoading(true);

    try {
      const response = await fetch("/api/v1/payments/installments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: amount,
          months: selectedPlan,
          interest_rate: selectedPlanData.interestRate,
          monthly_payment: selectedPlanData.monthlyPayment,
          total_cost: selectedPlanData.totalCost,
        }),
      });

      if (!response.ok) throw new Error("Failed to apply for installment");

      onApply?.(selectedPlanData);
    } catch (error) {
      console.error("Error applying for installment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isEligible) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
        <h3 className="font-semibold text-yellow-900 mb-2">
          Installment Not Available
        </h3>
        <p className="text-yellow-700 text-sm">
          Minimum booking amount of ₦{minAmount.toLocaleString()} required for
          installment payments.
        </p>
        <p className="text-yellow-700 text-sm mt-1">
          Current amount: ₦{amount.toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Installment Payment</h3>
        </div>
        <p className="text-sm text-blue-700">
          Split your payment into easy monthly installments
        </p>
      </div>

      {/* Plan Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Payment Plan
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <button
              key={plan.months}
              type="button"
              onClick={() => setSelectedPlan(plan.months)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedPlan === plan.months
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">{plan.months} Months</span>
                {selectedPlan === plan.months && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-medium">{plan.interestRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly:</span>
                  <span className="font-medium">
                    ₦{plan.monthlyPayment.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cost Comparison */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          Cost Comparison
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Original Amount:</span>
            <span className="font-medium">₦{amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Interest ({selectedPlanData.interestRate}%):</span>
            <span className="font-medium text-orange-600">
              +₦{(selectedPlanData.totalCost - amount).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Cost:</span>
              <span className="font-bold text-lg">
                ₦{selectedPlanData.totalCost.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-600">Monthly Payment:</span>
              <span className="font-bold text-xl text-blue-600">
                ₦{selectedPlanData.monthlyPayment.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      <div>
        <h4 className="font-medium mb-3">Payment Schedule</h4>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Installment
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Due Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {generateSchedule().map((item) => (
                <tr key={item.installment} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    Payment {item.installment} of {selectedPlan}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.dueDate}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-right">
                    ₦{item.amount.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <button
          type="button"
          onClick={() => setShowTerms(!showTerms)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FileText className="w-4 h-4" />
          Terms & Conditions
        </button>

        {showTerms && (
          <div className="mt-3 text-sm text-gray-600 space-y-2">
            <p>• Payments are due on the specified dates each month</p>
            <p>• Late payments may incur additional fees (5% per month)</p>
            <p>• Early payment is allowed without penalties</p>
            <p>• Missed payments may result in booking cancellation</p>
            <p>• Interest rates are fixed for the duration of the plan</p>
            <p>• Automatic payment reminders will be sent 3 days before due date</p>
          </div>
        )}
      </div>

      {/* Eligibility Check */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-green-900">You're eligible!</p>
          <p className="text-green-700">
            Your booking amount qualifies for installment payments.
          </p>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? "Processing..." : `Apply for ${selectedPlan}-Month Plan`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By applying, you agree to the terms and conditions of the installment plan
      </p>
    </div>
  );
}
