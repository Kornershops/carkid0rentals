"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { 
  FileText, 
  ShieldCheck, 
  Scales, 
  Globe, 
  WarningCircle,
  CaretRight
} from "@phosphor-icons/react";
import Link from "next/link";

type LegalTab = "terms" | "privacy" | "compliance";

export default function LegalHubPage() {
  const [activeTab, setActiveTab] = useState<LegalTab>("terms");

  const tabs = [
    { id: "terms", label: "Terms of Service", icon: <FileText /> },
    { id: "privacy", label: "Privacy Policy", icon: <ShieldCheck /> },
    { id: "compliance", label: "Regional Compliance", icon: <Scales /> },
  ];

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>Back to Home</Link>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 160, paddingBottom: 100 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="badge badge-accent" style={{ marginBottom: 24 }}>GOVERNANCE</div>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 48 }}>
            Legal & Compliance <br />
            <span style={{ color: 'var(--accent)' }}>Framework.</span>
          </h1>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 64, overflowX: 'auto', paddingBottom: 8 }}>
            {tabs.map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id as LegalTab)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 100,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                  background: activeTab === t.id ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: activeTab === t.id ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${activeTab === t.id ? 'var(--accent)' : 'var(--border-primary)'}`
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: 64, lineHeight: 1.7, color: 'var(--text-secondary)' }}
          >
            {activeTab === "terms" && (
              <div className="legal-content">
                <h2 style={{ color: 'var(--text-primary)', marginBottom: 24, fontSize: 32, fontWeight: 800 }}>Terms of Service</h2>
                <p style={{ marginBottom: 20 }}>Last Updated: May 3, 2026</p>
                <p style={{ marginBottom: 20 }}>
                  By accessing the CarKid0 platform, you agree to be bound by these terms. Our services span across Nigeria, Kenya, South Africa, Egypt, and Ghana, and are subject to the local laws of each jurisdiction.
                </p>
                <h3 style={{ color: 'var(--text-primary)', marginTop: 40, marginBottom: 16 }}>1. User Responsibilities</h3>
                <p>
                  Users must provide accurate KYC information. Drivers are responsible for complying with local traffic regulations and geofence boundaries as defined by the Safe-Halt™ system.
                </p>
                <h3 style={{ color: 'var(--text-primary)', marginTop: 40, marginBottom: 16 }}>2. Asset Protection</h3>
                <p>
                  Tampering with IoT hardware or attempting to bypass the immobilizer system is a breach of contract and may result in immediate legal action and recovery costs.
                </p>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="legal-content">
                <h2 style={{ color: 'var(--text-primary)', marginBottom: 24, fontSize: 32, fontWeight: 800 }}>Privacy Policy</h2>
                <p style={{ marginBottom: 20 }}>
                  We are committed to protecting your data in compliance with the NDPR (Nigeria), POPIA (South Africa), and international GDPR standards.
                </p>
                <h3 style={{ color: 'var(--text-primary)', marginTop: 40, marginBottom: 16 }}>Data Collection</h3>
                <p>
                  We collect real-time telemetry data (location, speed, load) for safety and billing purposes. Biometric data for vehicle unlocking is processed locally on the user's device via WebAuthn where possible.
                </p>
              </div>
            )}

            {activeTab === "compliance" && (
              <div className="legal-content">
                <h2 style={{ color: 'var(--text-primary)', marginBottom: 24, fontSize: 32, fontWeight: 800 }}>Regional Compliance</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 32 }}>
                  {[
                    { country: "Nigeria", body: "NITDA / FRSC", status: "Compliant" },
                    { country: "Kenya", body: "NTSA / ODPC", status: "Compliant" },
                    { country: "South Africa", body: "RTMC / Information Regulator", status: "Compliant" },
                    { country: "Ghana", body: "DVLA / DPC", status: "Compliant" },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderRadius: 16, background: 'var(--bg-surface)', border: '1px solid var(--border-primary)' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{c.country}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Regulator: {c.body}</p>
                      </div>
                      <div className="badge badge-success" style={{ fontSize: 10 }}>{c.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div style={{ marginTop: 64, padding: 32, borderRadius: 24, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 24 }}>
            <WarningCircle size={40} weight="duotone" color="var(--accent)" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Need legal assistance?</p>
              <p style={{ fontSize: 13 }}>For jurisdiction-specific inquiries, please contact our legal team at compliance@carkid0.com</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
