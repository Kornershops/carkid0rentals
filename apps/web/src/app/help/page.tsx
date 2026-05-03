"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { 
  WhatsappLogo, 
  PhoneCall, 
  Warning, 
  Info, 
  Question,
  CaretRight,
  MagnifyingGlass,
  ArrowSquareOut
} from "@phosphor-icons/react";
import Link from "next/link";

export default function SupportPage() {
  const [search, setSearch] = useState("");

  const faqs = [
    { q: "How do I unlock my vehicle?", a: "Once your rental is active, navigate to your dashboard and click 'Unlock'. You may be prompted for a quick walk-around video for insurance purposes." },
    { q: "What is the Safe-Halt™ boundary?", a: "Each hub has a geofence. If you cross it, you will receive a Stage 1 warning. Continued violation will trigger speed restriction and eventually immobilization." },
    { q: "How do I pay for my daily lease?", a: "Drivers can top up their wallet via Paystack or M-Pesa. The daily rate is automatically deducted at the start of your shift." },
  ];

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>Back to Home</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: 'var(--bg-elevated)' }}>
        <div className="container-wide" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge badge-accent" style={{ margin: '0 auto 24px' }}>SUPPORT CENTER</div>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 32 }}>How can we help you today?</h1>
            <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
              <MagnifyingGlass size={20} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                placeholder="Search for articles, guides, or troubleshooting..." 
                style={{ width: '100%', height: 64, padding: '0 64px', borderRadius: 100, background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontSize: 16, outline: 'none' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <div className="card" style={{ padding: 40, background: '#25D366', color: 'white', border: 'none' }}>
              <WhatsappLogo size={48} weight="fill" style={{ marginBottom: 24 }} />
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>WhatsApp Concierge</h3>
              <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 32 }}>Instant support for drivers and renters across all African hubs. Response time &lt; 5 mins.</p>
              <button className="btn" style={{ background: 'white', color: '#25D366', width: '100%', height: 48, fontWeight: 800 }}>Start Chat</button>
            </div>

            <div className="card" style={{ padding: 40 }}>
              <PhoneCall size={48} weight="duotone" color="var(--accent)" style={{ marginBottom: 24 }} />
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Regional Hotlines</h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>Local numbers for immediate escalation or roadside assistance.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>Nigeria</span>
                  <span style={{ fontWeight: 700 }}>0800-CARKID0-NG</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>Kenya</span>
                  <span style={{ fontWeight: 700 }}>+254-800-CARKID0</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 40, border: '2px solid var(--error)', background: 'rgba(255,69,58,0.05)' }}>
              <Warning size={48} weight="duotone" color="var(--error)" style={{ marginBottom: 24 }} />
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--error)', marginBottom: 12 }}>Emergency / SOS</h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>Use this for active theft attempts, accidents, or hardware failures during transit.</p>
              <button className="btn" style={{ background: 'var(--error)', color: 'white', width: '100%', height: 48, fontWeight: 800 }}>Trigger SOS Protocol</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ paddingBottom: 120 }}>
        <div className="container-wide">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, textAlign: 'center' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {faqs.map((f, i) => (
                <div key={i} className="card" style={{ padding: 24 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Question size={20} weight="fill" color="var(--accent)" /> {f.q}
                  </h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Support CTA */}
      <section style={{ paddingBottom: 100, textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 20 }}>Still need help?</p>
        <Link href="/tech" className="btn btn-ghost" style={{ gap: 8 }}>
          View Technical Specs <ArrowSquareOut size={16} />
        </Link>
      </section>
    </main>
  );
}
