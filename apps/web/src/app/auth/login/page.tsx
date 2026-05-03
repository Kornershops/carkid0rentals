"use client";
import { useState } from "react";
import { Envelope, Phone, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      document.cookie = "carkid0_auth=true; path=/";
      setIsLoading(false);
      router.push("/auth/kyc");
    }, 1500);
  };

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex' }}>
      {/* Left: Branding Panel */}
      <div style={{
        flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }} className="auth-brand">
        <Image
          src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=900&fit=crop&q=80"
          alt="Premium vehicle" fill style={{ objectFit: 'cover' }} unoptimized
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(12,12,14,0.85) 0%, rgba(12,12,14,0.5) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: 48, maxWidth: 440 }}>
          <Logo />
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 32, marginBottom: 16 }}>
            Drive First Class.<br /><span style={{ color: 'var(--accent)' }}>Pay Economy.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Rent premium vehicles across 7 cities in Nigeria. From gig-economy sedans to luxury SUVs.
          </p>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div style={{
        width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ marginBottom: 32 }}>
          <div className="auth-logo-mobile" style={{ marginBottom: 24 }}><Logo /></div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Sign in</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Enter your phone number or email to continue.
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg-surface)', borderRadius: 10, padding: 3, marginBottom: 24,
          border: '1px solid var(--border-primary)',
        }}>
          {[
            { id: "phone" as const, icon: <Phone size={16} weight="bold" />, label: "Phone" },
            { id: "email" as const, icon: <Envelope size={16} weight="bold" />, label: "Email" },
          ].map(m => (
            <button key={m.id} onClick={() => setAuthMode(m.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: authMode === m.id ? 'var(--accent)' : 'transparent',
              color: authMode === m.id ? 'white' : 'var(--text-tertiary)',
              transition: 'all 0.2s',
            }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              {authMode === "phone" ? "Phone Number" : "Email Address"}
            </label>
            {authMode === "phone" ? (
              <div style={{ display: 'flex' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 14, fontWeight: 600,
                  background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
                  borderRight: 'none', borderRadius: '10px 0 0 10px', color: 'var(--text-tertiary)',
                }}>+234</span>
                <input type="tel" placeholder="801 234 5678" required style={{
                  ...fieldStyle, borderRadius: '0 10px 10px 0',
                }} />
              </div>
            ) : (
              <input type="email" placeholder="you@example.com" required style={fieldStyle} />
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-accent" style={{
            width: '100%', height: 48, fontSize: 14, fontWeight: 700, marginBottom: 16,
            opacity: isLoading ? 0.7 : 1,
          }}>
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.6s linear infinite' }} />
                Sending code...
              </span>
            ) : (
              <>Continue <CaretRight size={16} weight="bold" /></>
            )}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5, marginTop: 16 }}>
          By continuing, you agree to our{' '}
          <Link href="#" style={{ color: 'var(--accent)', fontWeight: 500 }}>Terms of Service</Link> and{' '}
          <Link href="#" style={{ color: 'var(--accent)', fontWeight: 500 }}>Privacy Policy</Link>.
        </p>

        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            New to CarKid0? <Link href="/auth/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-brand { display: flex; }
        .auth-logo-mobile { display: none; }
        @media (max-width: 860px) {
          .auth-brand { display: none !important; }
          .auth-logo-mobile { display: block !important; }
        }
      `}</style>
    </main>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500,
  background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};
