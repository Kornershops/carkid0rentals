"use client";

import { useState } from "react";
import { useOnboarding } from "@/lib/onboarding/store";

type KYCStep = "intro" | "id-type" | "id-upload" | "selfie" | "review" | "submit";

export default function KYCWizard() {
  const { completeStep } = useOnboarding();
  const [currentStep, setCurrentStep] = useState<KYCStep>("intro");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bvn: "",
    idType: "",
    idNumber: "",
    idDocument: null as File | null,
    selfie: null as File | null,
  });

  const steps: KYCStep[] = ["intro", "id-type", "id-upload", "selfie", "review", "submit"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleSubmit = async () => {
    // Submit KYC data
    completeStep("kyc-upload");
    setCurrentStep("intro"); // Reset for next time
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === "intro" && (
            <IntroStep onNext={handleNext} />
          )}

          {currentStep === "id-type" && (
            <IDTypeStep
              value={formData.idType}
              onChange={(value) => setFormData({ ...formData, idType: value })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === "id-upload" && (
            <IDUploadStep
              idType={formData.idType}
              onUpload={(file) => setFormData({ ...formData, idDocument: file })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === "selfie" && (
            <SelfieStep
              onUpload={(file) => setFormData({ ...formData, selfie: file })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === "review" && (
            <ReviewStep
              data={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === "submit" && (
            <SubmitStep onSubmit={handleSubmit} onBack={handleBack} />
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Need Help?</h3>
            <p className="text-sm text-blue-700">
              KYC verification typically takes 24-48 hours. You'll receive an email once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">🔐</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Verify Your Identity
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        To ensure safety for everyone, we need to verify your identity before your first booking.
      </p>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">What you'll need:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-600 mt-1">✓</span>
            <span className="text-gray-700">Valid ID (Driver's License, National ID, or Passport)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 mt-1">✓</span>
            <span className="text-gray-700">Bank Verification Number (BVN)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 mt-1">✓</span>
            <span className="text-gray-700">A clear selfie photo</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-yellow-800">
          <strong>⏱️ Time required:</strong> About 3-5 minutes
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-lg"
      >
        Start Verification
      </button>
    </div>
  );
}

function IDTypeStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const idTypes = [
    {
      value: "drivers_license",
      label: "Driver's License",
      icon: "🚗",
      description: "Most common for vehicle rentals",
    },
    {
      value: "national_id",
      label: "National ID Card",
      icon: "🪪",
      description: "Government-issued ID",
    },
    {
      value: "passport",
      label: "International Passport",
      icon: "🛂",
      description: "For international travelers",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Select Your ID Type
      </h2>
      <p className="text-gray-600 mb-6">
        Choose the document you'll use for verification
      </p>

      <div className="space-y-3 mb-8">
        {idTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              value === type.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{type.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{type.label}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
              {value === type.value && (
                <div className="text-blue-600">✓</div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function IDUploadStep({
  idType,
  onUpload,
  onNext,
  onBack,
}: {
  idType: string;
  onUpload: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Upload Your ID Document
      </h2>
      <p className="text-gray-600 mb-6">
        Take a clear photo of your {idType.replace("_", " ")}
      </p>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">📸 Photo Tips:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Ensure all text is clearly readable</li>
          <li>• Use good lighting (avoid shadows)</li>
          <li>• Capture the entire document</li>
          <li>• Avoid glare or reflections</li>
        </ul>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="ID Preview"
              className="w-full rounded-xl border-2 border-gray-200"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="block w-full p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer transition-colors text-center">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-gray-700 font-medium mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG or PDF (max. 10MB)
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!preview}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function SelfieStep({
  onUpload,
  onNext,
  onBack,
}: {
  onUpload: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Take a Selfie
      </h2>
      <p className="text-gray-600 mb-6">
        We'll use this to verify your identity matches your ID
      </p>

      {/* Tips */}
      <div className="bg-green-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">🤳 Selfie Tips:</h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li>• Face the camera directly</li>
          <li>• Remove sunglasses and hats</li>
          <li>• Use natural lighting</li>
          <li>• Keep a neutral expression</li>
        </ul>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Selfie Preview"
              className="w-full max-w-sm mx-auto rounded-xl border-2 border-gray-200"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Retake
            </button>
          </div>
        ) : (
          <label className="block w-full p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 cursor-pointer transition-colors text-center">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-gray-700 font-medium mb-2">
              Click to take or upload selfie
            </p>
            <p className="text-sm text-gray-500">
              PNG or JPG (max. 5MB)
            </p>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!preview}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function ReviewStep({
  data,
  onNext,
  onBack,
}: {
  data: any;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Review Your Information
      </h2>
      <p className="text-gray-600 mb-6">
        Please verify all details are correct before submitting
      </p>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">ID Type</p>
          <p className="font-semibold text-gray-900">
            {data.idType.replace("_", " ").toUpperCase()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Documents</p>
          <div className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-900">ID Document uploaded</span>
          </div>
          <div className="flex gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-900">Selfie uploaded</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Important:</strong> Make sure all information is accurate. 
          Incorrect information may delay your verification.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
        >
          Submit for Review
        </button>
      </div>
    </div>
  );
}

function SubmitStep({
  onSubmit,
  onBack,
}: {
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">✅</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Verification Submitted!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        We're reviewing your documents. You'll receive an email within 24-48 hours.
      </p>

      <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-blue-900 mb-4">What happens next?</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">1.</span>
            <span className="text-blue-800">Our team reviews your documents (24-48 hours)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">2.</span>
            <span className="text-blue-800">You'll receive an email notification</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">3.</span>
            <span className="text-blue-800">Once approved, you can start booking!</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onSubmit}
        className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors shadow-lg"
      >
        Continue to Browse Vehicles
      </button>
    </div>
  );
}
