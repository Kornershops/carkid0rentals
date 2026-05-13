"use client";

import { useState, useEffect } from "react";
import { Upload, X, FileText, AlertCircle, Save, Send } from "lucide-react";

interface SupportTicketFormProps {
  onSuccess?: (ticketId: string) => void;
  onCancel?: () => void;
}

export default function SupportTicketForm({ onSuccess, onCancel }: SupportTicketFormProps) {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const categories = [
    { value: "booking", label: "Booking Issue", icon: "📅" },
    { value: "payment", label: "Payment Issue", icon: "💳" },
    { value: "vehicle", label: "Vehicle Issue", icon: "🚗" },
    { value: "account", label: "Account Issue", icon: "👤" },
    { value: "technical", label: "Technical Issue", icon: "⚙️" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.subject || formData.description) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("ticket_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
        setLastSaved(new Date(parsed.savedAt));
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  const saveDraft = () => {
    setAutoSaving(true);
    const draft = { ...formData, savedAt: new Date().toISOString() };
    localStorage.setItem("ticket_draft", JSON.stringify(draft));
    setLastSaved(new Date());
    setTimeout(() => setAutoSaving(false), 1000);
  };

  const clearDraft = () => {
    localStorage.removeItem("ticket_draft");
    setLastSaved(null);
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
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
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("priority", formData.priority);
      formDataToSend.append("description", formData.description);

      files.forEach((file) => {
        formDataToSend.append("attachments", file);
      });

      const response = await fetch("/api/v1/support/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      const data = await response.json();
      clearDraft();
      onSuccess?.(data.ticket_id);
    } catch (error) {
      setErrors({ submit: "Failed to create ticket. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const charCount = formData.description.length;
  const charMin = 50;
  const charMax = 1000;
  const charProgress = (charCount / charMax) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>
              {autoSaving ? "Saving..." : `Last saved: ${lastSaved.toLocaleTimeString()}`}
            </span>
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="text-blue-600 hover:text-blue-700"
          >
            Clear draft
          </button>
        </div>
      )}

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => {
            setFormData({ ...formData, subject: e.target.value });
            setErrors({ ...errors, subject: "" });
          }}
          placeholder="Brief description of your issue"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.subject ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.subject}
          </p>
        )}
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              setErrors({ ...errors, category: "" });
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="grid grid-cols-4 gap-2">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: priority.value })}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  formData.priority === priority.value
                    ? priority.color + " ring-2 ring-offset-1 ring-blue-500"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description * ({charMin}-{charMax} characters)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            setErrors({ ...errors, description: "" });
          }}
          placeholder="Please provide detailed information about your issue..."
          rows={8}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        
        {/* Character counter */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className={charCount < charMin ? "text-red-500" : "text-gray-500"}>
              {charCount} / {charMax} characters
            </span>
            <span className={charCount < charMin ? "text-red-500" : "text-green-600"}>
              {charCount < charMin
                ? `${charMin - charCount} more needed`
                : "✓ Minimum reached"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                charCount < charMin
                  ? "bg-red-500"
                  : charCount > charMax
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(charProgress, 100)}%` }}
            />
          </div>
        </div>

        {errors.description && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.description}
          </p>
        )}
      </div>

      {/* File Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments (Optional)
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
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
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
          disabled={loading || charCount < charMin}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
          {loading ? "Creating Ticket..." : "Create Ticket"}
        </button>
      </div>
    </form>
  );
}
