"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  ShieldCheck, 
  CloudArrowUp, 
  Camera, 
  CheckCircle, 
  CaretRight, 
  WarningCircle 
} from "@phosphor-icons/react";
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
      className="bg-surface border border-border rounded-3xl p-10 shadow-2xl max-w-md w-full font-inter antialiased"
    >
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck size={32} weight="duotone" className="text-primary" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Compliance Check</h1>
        <p className="text-[10px] font-bold text-muted mt-3 uppercase tracking-widest">
          CarKid0 requires identity verification to unlock fleet assets.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                step >= i ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-background border border-border text-muted"
              }`}
            >
              {step > i ? <CheckCircle size={20} weight="bold" /> : i}
            </div>
            {i !== 3 && (
              <div className={`w-6 h-1 rounded-full transition-all ${step > i ? "bg-primary" : "bg-border"}`} />
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
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="font-black text-xl uppercase tracking-tight mb-2">Government ID</h3>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">NIN SLIP, DRIVER'S LICENSE, OR INT. PASSPORT</p>
            </div>
            <div className="border-2 border-dashed border-border rounded-3xl p-10 flex flex-col items-center justify-center gap-5 hover:border-primary/50 transition-all cursor-pointer bg-background hover:shadow-inner group">
              <CloudArrowUp size={48} weight="duotone" className="text-muted group-hover:text-primary transition-colors" />
              <div className="text-center">
                <span className="text-xs font-black text-primary uppercase tracking-widest">Select Archive File</span>
                <p className="text-[10px] font-bold text-muted mt-1 uppercase tracking-tighter">OR DRAG AND DROP HERE</p>
              </div>
              <p className="text-[9px] font-bold text-muted/50 uppercase tracking-widest">PNG, JPG, PDF (MAX 10MB)</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="font-black text-xl uppercase tracking-tight mb-2">3D Biometric Scan</h3>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">CENTER YOUR FACE WITHIN THE SECURE FRAME</p>
            </div>
            <div className="aspect-[3/4] rounded-3xl bg-black border border-border relative overflow-hidden flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80')] bg-cover bg-center grayscale" />
              <div className="w-56 h-72 border-2 border-primary/40 rounded-[60px] absolute z-10 shadow-[0_0_50px_rgba(124,58,237,0.2)]" />
              <Camera size={48} weight="bold" className="text-white/20 z-20" />
              <div className="absolute bottom-6 left-0 w-full flex justify-center z-20">
                <div className="px-5 py-2.5 bg-background/90 backdrop-blur rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-border">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> SCANNING...
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl text-[10px] font-bold text-muted uppercase tracking-tight leading-relaxed">
              <WarningCircle size={18} weight="duotone" className="text-primary shrink-0" />
              BIOMETRIC AUTHENTICATION POWERED BY SMILEID ENCRYPTION. DATA PURGED AFTER SESSION.
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle size={48} weight="duotone" className="text-green-500" />
            </motion.div>
            <h3 className="font-black text-3xl uppercase tracking-tighter">Clearance Granted</h3>
            <p className="text-muted text-[11px] font-medium uppercase tracking-widest max-w-[280px] mx-auto leading-loose">
              Your institutional identity has been confirmed. You are now authorized to operate fleet assets.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleNext}
        disabled={isLoading}
        className="btn-primary w-full h-14 text-xs mt-10"
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            VERIFYING...
          </span>
        ) : (
          <>
            {step === 3 ? "Command Dashboard" : "Proceed"} <CaretRight size={18} weight="bold" />
          </>
        )}
      </button>
    </motion.div>
  );
}
