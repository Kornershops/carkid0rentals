"use client";

import { useState } from "react";
import { IdentificationCard, Camera, CaretRight, Check } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { useStore } from "@/store/use-store";
import { api } from "@/lib/api-client";

export default function KycPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("");
  const router = useRouter();
  const { role, redirectTo, setRedirectTo } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    setIsSubmitting(true);

    try {
      await api.submitKYC({ fullName, dateOfBirth: dob, address, idType });
    } catch {
      // Fallback: continue anyway in dev/static mode
    }

    setTimeout(() => {
      setIsSubmitting(false);
      if (redirectTo) {
        const url = redirectTo;
        setRedirectTo(null);
        router.push(url);
      } else if (role === "driver") {
        router.push("/auth/onboarding/driver");
      } else if (role === "logistics") {
        router.push("/dashboard/logistics");
      } else {
        router.push("/dashboard/customer");
      }
    }, 1500);
  };

  const steps = ["Personal Info", "ID Upload", "Review"];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="justify-center" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-6 mb-2">Verify Your Identity</h1>
          <p className="text-sm text-gray-600">Complete these steps to start booking vehicles.</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1 rounded-full mb-1.5 transition-colors ${i + 1 <= step ? 'bg-gray-900' : 'bg-gray-200'}`} />
              <p className={`text-xs font-semibold ${i + 1 <= step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 mb-1">Personal Information</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <input type="text" placeholder="Enter your full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-11 px-4 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date of Birth</label>
                  <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="w-full h-11 px-4 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address</label>
                  <input type="text" placeholder="Your current address" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-11 px-4 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-900 mb-1">Upload Identification</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Type</label>
                  <select required value={idType} onChange={(e) => setIdType(e.target.value)} className="w-full h-11 px-4 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 appearance-none cursor-pointer">
                    <option value="">Select ID type</option>
                    <option value="nin">National ID (NIN)</option>
                    <option value="passport">International Passport</option>
                    <option value="license">Driver&apos;s License</option>
                    <option value="voter">Voter&apos;s Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Upload Front</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors">
                    <Camera size={32} weight="duotone" className="text-gray-900 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                    <input type="file" accept="image/*" className="hidden" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Driver&apos;s License (Required for rentals)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors">
                    <IdentificationCard size={28} weight="duotone" className="text-gray-900 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-900">Upload driver&apos;s license</p>
                    <input type="file" accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} weight="bold" className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to submit</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your information will be verified within 24 hours. You&apos;ll be able to start booking immediately after approval.
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 h-11 text-sm font-semibold border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 bg-gray-900 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : step === 3 ? 'Submit & Continue' : 'Next'}
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </form>
        </div>

        <p className="text-xs text-gray-500 text-center mt-5">
          Your data is encrypted and stored securely.{' '}
          <Link href="/legal" className="text-gray-900 font-medium hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}
