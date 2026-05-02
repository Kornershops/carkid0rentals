"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ShieldCheck, UploadCloud, Camera, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KYCPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep((s) => (s + 1) as 1 | 2 | 3);
        if (step === 2) {
          // Setting cookie upon reaching the final step completion
          document.cookie = "carkid0_kyc=true; path=/";
        }
      }, 1000);
    } else {
      router.push("/dashboard/customer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Identity Verification</h1>
        <p className="text-sm text-muted mt-2">
          CarKid0 requires KYC verification to unlock vehicles.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= i ? "bg-primary text-white" : "bg-surface border border-border text-muted"
              }`}
            >
              {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
            </div>
            {i !== 3 && (
              <div className={`w-8 h-px transition-colors ${step > i ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Upload National ID</h3>
              <p className="text-xs text-muted">NIN Slip, Driver's License, or Int. Passport</p>
            </div>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer bg-surface/30">
              <UploadCloud className="w-10 h-10 text-muted" />
              <div className="text-center">
                <span className="text-sm font-medium text-primary">Click to upload</span>
                <span className="text-sm text-muted"> or drag and drop</span>
              </div>
              <p className="text-xs text-muted">PNG, JPG up to 10MB</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">3D Liveness Scan</h3>
              <p className="text-xs text-muted">Position your face within the frame</p>
            </div>
            <div className="aspect-[3/4] rounded-2xl bg-black border border-white/10 relative overflow-hidden flex items-center justify-center">
              {/* Camera placeholder */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80')] bg-cover bg-center" />
              <div className="w-48 h-64 border-2 border-primary/50 rounded-full absolute z-10" />
              <Camera className="w-12 h-12 text-white/50 z-20" />
              <div className="absolute bottom-4 left-0 w-full flex justify-center z-20">
                <div className="px-4 py-2 bg-background/80 backdrop-blur rounded-full text-xs font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              Powered by SmileID/Dojah. We do not store your biometric data.
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>
            <h3 className="font-bold text-2xl">Verification Complete</h3>
            <p className="text-muted text-sm max-w-[250px] mx-auto">
              Your identity has been verified. You can now book and unlock vehicles.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleNext}
        disabled={isLoading}
        className="w-full py-4 mt-8 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Processing...
          </span>
        ) : (
          <>
            {step === 3 ? "Go to Dashboard" : "Continue"} <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </motion.div>
  );
}
