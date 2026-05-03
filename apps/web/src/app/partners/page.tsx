"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { 
  Handshake, 
  TrendUp, 
  ChartLineUp, 
  ShieldCheck, 
  Globe, 
  Users,
  CheckCircle,
  CaretRight,
  CurrencyCircleDollar
} from "@phosphor-icons/react";
import Link from "next/link";
import { CURRENCIES, getCurrencyForCountry, formatPrice } from "@/lib/currency";
import { useStore } from "@/store/use-store";

export default function PartnerPage() {
  const { country } = useStore();
  const [vehicleCount, setVehicleCount] = useState(5);
  const [tier, setTier] = useState<"eco-gig" | "elite" | "heavy-haul">("eco-gig");
  
  const currency = getCurrencyForCountry(country);

  const stats = useMemo(() => {
    const dailyRates = { "eco-gig": 40, "elite": 450, "heavy-haul": 250 }; // USD
    const utilization = 0.75; // 75% occupancy
    const monthlyRev = dailyRates[tier] * 30 * utilization * vehicleCount;
    return {
      monthly: monthlyRev,
      yearly: monthlyRev * 12
    };
  }, [vehicleCount, tier]);

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>Back to Home</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: 160, paddingBottom: 100 }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="badge badge-accent" style={{ marginBottom: 24 }}>FLEET PARTNERSHIP</div>
              <h1 style={{ fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 32 }}>
                Turn your assets into <br />
                <span style={{ color: 'var(--accent)' }}>Institutional Yield.</span>
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40 }}>
                Join Africa's leading mobility infrastructure. We provide the IoT security, the professional drivers, and the enterprise demand. You provide the fleet.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <a href="#calculator" className="btn btn-accent" style={{ height: 56, padding: '0 32px' }}>Calculate Potential</a>
                <a href="#onboard" className="btn btn-outline" style={{ height: 56, padding: '0 32px' }}>Apply Now</a>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
              <div className="card" style={{ padding: 48, background: 'var(--bg-elevated)', border: '1px solid var(--accent)' }}>
                <Users size={48} weight="duotone" color="var(--accent)" style={{ marginBottom: 24 }} />
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Scale without Friction</h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                  Our partner dashboard gives you real-time visibility into your entire fleet’s earnings, maintenance health, and geofence compliance.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {["Guaranteed Driver Vetting", "Safe-Halt™ Theft Protection", "Automated Daily Remittances"].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600 }}>
                      <CheckCircle size={20} weight="fill" color="var(--success)" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revenue Calculator */}
      <section id="calculator" style={{ padding: '120px 0', background: 'var(--bg-elevated)' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>Revenue Projection Calculator</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Estimate your monthly yield based on fleet size and vehicle tier.</p>
          </div>

          <div className="card" style={{ padding: 64, maxWidth: 1000, margin: '0 auto', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
              <div>
                <div style={{ marginBottom: 40 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>Select Asset Tier</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {(['eco-gig', 'elite', 'heavy-haul'] as const).map(t => (
                      <button 
                        key={t}
                        onClick={() => setTier(t)}
                        style={{
                          flex: 1, padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                          background: tier === t ? 'var(--accent)' : 'var(--bg-surface)',
                          color: tier === t ? 'white' : 'var(--text-secondary)',
                          border: tier === t ? '1px solid var(--accent)' : '1px solid var(--border-primary)',
                        }}
                      >
                        {t === 'eco-gig' ? 'Eco-Gig' : t === 'elite' ? 'Exotic' : 'Haulage'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
                    Fleet Size: <span style={{ color: 'var(--text-primary)' }}>{vehicleCount} Vehicles</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={vehicleCount} 
                    onChange={e => setVehicleCount(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)' }}>
                    <span>1 Unit</span>
                    <span>50 Units</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', borderRadius: 24, padding: 40, textAlign: 'center', border: '1px solid var(--border-primary)' }}>
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>Est. Monthly Yield</p>
                  <h3 style={{ fontSize: 48, fontWeight: 900, color: 'var(--success)', letterSpacing: '-0.04em' }}>
                    {formatPrice(stats.monthly, currency)}
                  </h3>
                </div>
                <div style={{ height: 1, background: 'var(--border-primary)', margin: '0 auto 24px', width: '60%' }} />
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>Annual Potential</p>
                <p style={{ fontSize: 24, fontWeight: 800 }}>{formatPrice(stats.yearly, currency)}</p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 24 }}>*Based on 75% average utilization across {country} hubs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Form */}
      <section id="onboard" style={{ padding: '120px 0' }}>
        <div className="container-wide" style={{ maxWidth: 700 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Become a Partner</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Tell us about your fleet and our regional head will contact you within 24 hours.</p>
          </div>

          <form className="card" style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label style={labelStyle}>Full Name</label>
                <input placeholder="John Doe" style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Email Address</label>
                <input type="email" placeholder="john@company.com" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label style={labelStyle}>Company Name (Optional)</label>
                <input placeholder="Fleet Logistics Ltd" style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Operating City</label>
                <select style={inputStyle}>
                  <option>Lagos, Nigeria</option>
                  <option>Nairobi, Kenya</option>
                  <option>Joburg, South Africa</option>
                  <option>Accra, Ghana</option>
                  <option>Cairo, Egypt</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label style={labelStyle}>Fleet Description</label>
              <textarea placeholder="Tell us about the types of vehicles you own (e.g. 10 Toyota Corollas, 5 Mack Trucks)" style={{ ...inputStyle, height: 120, resize: 'none', paddingTop: 12 }} />
            </div>
            <button className="btn btn-accent" style={{ height: 56, fontSize: 16, marginTop: 12 }}>Submit Application</button>
          </form>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ paddingBottom: 100 }}>
        <div className="container-wide">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 64, opacity: 0.5, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}>
              <ShieldCheck size={24} /> SECURED BY SAFE-HALT™
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}>
              <Globe size={24} /> PAN-AFRICAN SCALE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}>
              <Handshake size={24} /> VETTED PARTNERSHIPS
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  marginBottom: 8,
  display: 'block'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  padding: '0 16px',
  borderRadius: 12,
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit'
};
