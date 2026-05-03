"use client";

import { useState } from "react";
import { 
  SteeringWheel, 
  Wallet, 
  SealCheck, 
  CaretRight, 
  Check, 
  Globe, 
  IdentificationCard,
  CurrencyCircleDollar
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { useStore } from "@/store/use-store";
import { motion, AnimatePresence } from "framer-motion";

export default function DriverOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const { country, hub } = useStore();
  const router = useRouter();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else router.push("/dashboard/driver");
  };

  return (
    <main style={{ 
      background: 'var(--bg-primary)', 
      color: 'var(--text-primary)', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 24 
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Logo className="justify-center" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            <span className="badge badge-accent" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
              ECO-GIG ONBOARDING
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{country} • {hub}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ 
              flex: 1, 
              height: 4, 
              borderRadius: 2, 
              background: step >= s ? 'var(--accent)' : 'var(--bg-elevated)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card"
            style={{ padding: 32, minHeight: 400, display: 'flex', flexDirection: 'column' }}
          >
            {step === 1 && (
              <>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <SteeringWheel size={32} weight="duotone" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Welcome, Captain</h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                  You're joining the elite Pan-African driver network. We'll help you get gig-ready vehicles with integrated maintenance and easy remittance.
                </p>
                <div style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <SealCheck size={20} color="var(--success)" weight="fill" />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Regional Compliance Active</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    Your documents will be verified against {hub}'s local transport regulations.
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: '#2D5BFF1A', color: '#2D5BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Globe size={32} weight="duotone" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Connect Platforms</h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
                  Link your active gig accounts to unlock lower security deposits and rental rates based on your history.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {["Bolt", "Uber", "InDrive"].map((p) => (
                    <button 
                      key={p}
                      onClick={() => {
                        setIsSyncing(true);
                        setTimeout(() => setIsSyncing(false), 2000);
                      }}
                      style={{ 
                        width: '100%', padding: '16px', borderRadius: 12, border: '1px solid var(--border-primary)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'var(--bg-surface)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>
                          {p[0]}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Connect {p}</span>
                      </div>
                      {isSyncing ? <span style={{ fontSize: 11, color: 'var(--accent)' }}>Syncing...</span> : <CaretRight size={16} />}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <IdentificationCard size={32} weight="duotone" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Local Permits</h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                  Upload your commercial driving documents for **{hub}**.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
                      {hub === "Lagos" ? "Hackney Permit" : "PSV / Commercial License"}
                    </label>
                    <div style={{ 
                      padding: 20, borderRadius: 12, border: '2px dashed var(--border-primary)', textAlign: 'center',
                      background: 'var(--bg-surface)'
                    }}>
                      <Check size={24} weight="bold" color="var(--success)" style={{ margin: '0 auto 8px' }} />
                      <p style={{ fontSize: 12, fontWeight: 700 }}>Document Detected</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Wallet size={32} weight="duotone" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Activate Wallet</h2>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
                  Set up your CarKid0 wallet for seamless daily remittance and rent-to-own tracking.
                </p>

                <div className="glass" style={{ padding: 24, borderRadius: 16, border: '1px solid var(--accent)', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Daily Remittance</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>₦12,000 / day</span>
                  </div>
                  <div style={{ height: 1, background: 'var(--border-primary)', marginBottom: 16 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CurrencyCircleDollar size={24} weight="duotone" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700 }}>Auto-Deduct Enabled</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Linked to your main earnings account</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div style={{ marginTop: 'auto', paddingTop: 32 }}>
              <button 
                onClick={handleNext}
                className="btn btn-accent" 
                style={{ width: '100%', height: 48, fontSize: 14, fontWeight: 700 }}
              >
                {step === 4 ? "Complete Onboarding" : "Continue"}
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 24 }}>
          Step {step} of 4 • Need help? <span style={{ color: 'var(--accent)' }}>Contact Agent</span>
        </p>
      </div>
    </main>
  );
}
