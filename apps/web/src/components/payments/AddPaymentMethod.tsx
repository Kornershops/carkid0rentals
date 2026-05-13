"use client";

import { useState } from "react";
import { CreditCard, Lock, AlertCircle, CheckCircle } from "lucide-react";

interface AddPaymentMethodProps {
  onSuccess?: (method: any) => void;
  onCancel?: () => void;
}

export default function AddPaymentMethod({ onSuccess, onCancel }: AddPaymentMethodProps) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    provider: "paystack",
    saveCard: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Luhn algorithm for card validation
  const validateCardNumber = (number: string): boolean => {
    const digits = number.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(digits)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateExpiryDate = (date: string): boolean => {
    const [month, year] = date.split("/");
    if (!month || !year) return false;

    const monthNum = parseInt(month);
    const yearNum = parseInt("20" + year);

    if (monthNum < 1 || monthNum > 12) return false;

    const now = new Date();
    const expiry = new Date(yearNum, monthNum - 1);

    return expiry > now;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\s/g, "");
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ") : digits;
  };

  const formatExpiryDate = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2, 4);
    }
    return digits;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData({ ...formData, [field]: formattedValue });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid or expired date";
    }

    if (!validateCVV(formData.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/v1/payments/methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          card_number: formData.cardNumber.replace(/\s/g, ""),
          expiry_month: formData.expiryDate.split("/")[0],
          expiry_year: "20" + formData.expiryDate.split("/")[1],
          cvv: formData.cvv,
          cardholder_name: formData.cardholderName,
          provider: formData.provider,
          save_card: formData.saveCard,
        }),
      });

      if (!response.ok) throw new Error("Failed to add payment method");

      const data = await response.json();
      setSuccess(true);

      setTimeout(() => {
        onSuccess?.(data);
      }, 1500);
    } catch (error) {
      setErrors({ submit: "Failed to add payment method. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Payment Method Added!</h3>
        <p className="text-gray-600">Your card has been securely saved.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Your payment information is secure</p>
          <p className="text-blue-600">We use industry-standard encryption to protect your data.</p>
        </div>
      </div>

      {/* Provider Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Provider
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "paystack", name: "Paystack", fee: "1.5%" },
            { id: "flutterwave", name: "Flutterwave", fee: "1.4%" },
            { id: "stripe", name: "Stripe", fee: "2.9%" },
          ].map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => setFormData({ ...formData, provider: provider.id })}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                formData.provider === provider.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-sm">{provider.name}</div>
              <div className="text-xs text-gray-500">{provider.fee} fee</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => handleInputChange("cardholderName", e.target.value)}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.cardholderName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.cardholderName}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`w-full px-4 py-2 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.cardNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.cardNumber}
          </p>
        )}
      </div>

      {/* Expiry Date & CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            placeholder="MM/YY"
            maxLength={5}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.expiryDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.expiryDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={formData.cvv}
            onChange={(e) => handleInputChange("cvv", e.target.value)}
            placeholder="123"
            maxLength={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.cvv ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      {/* Save Card Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="saveCard"
          checked={formData.saveCard}
          onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="saveCard" className="text-sm text-gray-700">
          Save this card for future payments
        </label>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Adding..." : "Add Payment Method"}
        </button>
      </div>
    </form>
  );
}
