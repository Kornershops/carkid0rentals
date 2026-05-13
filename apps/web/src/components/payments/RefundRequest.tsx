"use client";

import { useState } from "react";
import { Upload, X, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface RefundRequestProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
}

export default function RefundRequest({ bookingId, amount, onSuccess }: RefundRequestProps) {
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    refundAmount: amount,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const refundReasons = [
    { value: "cancellation", label: "Booking Cancellation" },
    { value: "vehicle_issue", label: "Vehicle Issue" },
    { value: "service_issue", label: "Service Issue" },
    { value: "overcharge", label: "Overcharge" },
    { value: "duplicate", label: "Duplicate Payment" },
    { value: "other", label: "Other" },
  ];

  const refundPolicy = {
    "24_hours": { percentage: 100, description: "Full refund" },
    "48_hours": { percentage: 75, description: "75% refund" },
    "72_hours": { percentage: 50, description: "50% refund" },
    "after_72": { percentage: 0, description: "No refund" },
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > 5) {
      setErrors({ ...errors, files: "Maximum 5 files allowed" });
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, files: "Each file must be less than 10MB" });
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles]);
    setErrors({ ...errors, files: "" });
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const calculateRefundAmount = (): number => {
    // This would typically be calculated based on booking date and cancellation policy
    // For now, returning the full amount
    return formData.refundAmount;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.reason) {
      newErrors.reason = "Please select a reason";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please provide a description";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (formData.refundAmount <= 0 || formData.refundAmount > amount) {
      newErrors.refundAmount = `Amount must be between ₦1 and ₦${amount.toLocaleString()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("booking_id", bookingId);
      formDataToSend.append("reason", formData.reason);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("refund_amount", formData.refundAmount.toString());

      files.forEach((file) => {
        formDataToSend.append("documents", file);
      });

      const response = await fetch("/api/v1/payments/refunds", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to submit refund request");

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setErrors({ submit: "Failed to submit refund request. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Refund Request Submitted!</h3>
        <p className="text-gray-600 mb-4">
          Your refund request has been received and is being processed.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-md">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Processing Timeline</span>
          </div>
          <p className="text-sm text-blue-700">
            Refunds typically take 5-7 business days to process and appear in your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Request Refund</h3>
        <p className="text-sm text-blue-700">
          Booking ID: <span className="font-medium">{bookingId}</span>
        </p>
        <p className="text-sm text-blue-700">
          Original Amount: <span className="font-medium">₦{amount.toLocaleString()}</span>
        </p>
      </div>

      {/* Refund Policy */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-3">Refund Policy</h4>
        <div className="space-y-2 text-sm text-yellow-800">
          <div className="flex items-center justify-between">
            <span>Cancellation within 24 hours:</span>
            <span className="font-medium">{refundPolicy["24_hours"].description}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Cancellation within 48 hours:</span>
            <span className="font-medium">{refundPolicy["48_hours"].description}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Cancellation within 72 hours:</span>
            <span className="font-medium">{refundPolicy["72_hours"].description}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>After 72 hours:</span>
            <span className="font-medium">{refundPolicy["after_72"].description}</span>
          </div>
        </div>
      </div>

      {/* Refund Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Refund *
        </label>
        <select
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.reason ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select a reason</option>
          {refundReasons.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.reason}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description * (min. 20 characters)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Please provide details about your refund request..."
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.description ? (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.description}
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              {formData.description.length} characters
            </p>
          )}
        </div>
      </div>

      {/* Refund Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Refund Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
          <input
            type="number"
            value={formData.refundAmount}
            onChange={(e) =>
              setFormData({ ...formData, refundAmount: parseFloat(e.target.value) || 0 })
            }
            step="0.01"
            className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.refundAmount ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.refundAmount && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.refundAmount}
          </p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Maximum refundable: ₦{amount.toLocaleString()}
        </p>
      </div>

      {/* Supporting Documents */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Supporting Documents (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Max 5 files, 10MB each (Images, PDF, DOC)
            </p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.files && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.files}
          </p>
        )}
      </div>

      {/* Processing Timeline */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Refund Timeline</span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Request review: 1-2 business days</p>
          <p>• Approval processing: 2-3 business days</p>
          <p>• Refund to account: 2-3 business days</p>
          <p className="font-medium text-gray-700 pt-2">
            Total estimated time: 5-7 business days
          </p>
        </div>
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
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? "Submitting..." : "Submit Refund Request"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        You will receive email updates about your refund request status
      </p>
    </form>
  );
}
