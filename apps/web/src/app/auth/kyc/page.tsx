"use client";
import { useState } from "react";
import { IdentificationCard, Camera, CaretRight, Check } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { useStore } from "@/store/use-store";

export default function KycPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { role } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (role === "driver") {
        router.push("/auth/onboarding/driver");
      } else if (role === "logistics") {
        router.push("/dashboard/logistics");
      } else {
        router.push("/dashboard/customer");
      }
    }, 2000);
  };

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Logo className="justify-center" />
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 24, marginBottom: 8 }}>Verify Your Identity</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Complete these steps to start booking vehicles.</p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {["Personal Info", "ID Upload", "Review"].map((s, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: 4, borderRadius: 100, marginBottom: 6,
                background: i + 1 <= step ? 'var(--accent)' : 'var(--bg-surface)',
                transition: 'background 0.3s',
              }} />
              <p style={{ fontSize: 11, fontWeight: 600, color: i + 1 <= step ? 'var(--accent)' : 'var(--text-tertiary)' }}>{s}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Personal Information</h3>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" placeholder="Enter your full name" required style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <input type="date" required style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Address</label>
                  <input type="text" placeholder="Your current address" required style={fieldStyle} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Upload Identification</h3>
                <div>
                  <label style={labelStyle}>ID Type</label>
                  <select required style={fieldStyle}>
                    <option value="">Select ID type</option>
                    <option value="nin">National ID (NIN)</option>
                    <option value="passport">International Passport</option>
                    <option value="license">Driver's License</option>
                    <option value="voter">Voter's Card</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Upload Front</label>
                  <div style={{
                    border: '2px dashed var(--border-primary)', borderRadius: 12, padding: 32, textAlign: 'center',
                    background: 'var(--bg-surface)', cursor: 'pointer',
                  }}>
                    <Camera size={32} weight="duotone" style={{ color: 'var(--accent)', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Click to upload or drag & drop</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>JPG, PNG up to 5MB</p>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Driver's License (Required for rentals)</label>
                  <div style={{
                    border: '2px dashed var(--border-primary)', borderRadius: 12, padding: 24, textAlign: 'center',
                    background: 'var(--bg-surface)', cursor: 'pointer',
                  }}>
                    <IdentificationCard size={28} weight="duotone" style={{ color: 'var(--accent)', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 13, fontWeight: 600 }}>Upload driver's license</p>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(48, 209, 88, 0.1)', color: 'var(--success)', margin: '0 auto 16px',
                }}>
                  <Check size={28} weight="bold" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to submit</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Your information will be verified within 24 hours. You'll be able to start booking immediately after approval.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline" style={{ flex: 1, height: 44, fontSize: 13 }}>
                  Back
                </button>
              )}
              <button type="submit" disabled={isSubmitting} className="btn btn-accent" style={{ flex: 1, height: 44, fontSize: 13, opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Submitting...' : step === 3 ? 'Submit & Continue' : 'Next'}
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </form>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 20 }}>
          Your data is encrypted and stored securely. <Link href="#" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 };
const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500,
  background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};
