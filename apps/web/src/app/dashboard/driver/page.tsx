"use client";
import Link from "next/link";
import { Clock, Car, MapPin, CurrencyNgn, TrendUp, Gauge } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";

export default function DriverDashboard() {
  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ height: 36, padding: '0 14px', fontSize: 12 }}>← Home</Link>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 900 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Driver Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>Track your shift, earnings, and vehicle status.</p>

        {/* Active Vehicle */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div>
              <span className="badge badge-accent" style={{ marginBottom: 8 }}>Active Shift</span>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Toyota Corolla</h2>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>License: EKY-123-AB · Eco-Gig Tier</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 2 }}>Time Remaining</p>
              <p style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>06:45:30</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
            {[
              { icon: <Gauge size={16} weight="bold" />, label: "Fuel Economy", value: "22 km/L" },
              { icon: <MapPin size={16} weight="bold" />, label: "Current Zone", value: "Lekki, Lagos" },
              { icon: <Car size={16} weight="bold" />, label: "Odometer", value: "142 km today" },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border-primary)' }}>
                <div style={{ color: 'var(--accent)', marginBottom: 4 }}>{s.icon}</div>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 14, padding: 20 }}>
            <div style={{ color: 'var(--accent)', marginBottom: 8 }}><CurrencyNgn size={20} weight="bold" /></div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 2 }}>Today's Net Revenue</p>
            <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>₦12,500</p>
            <p style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <TrendUp size={12} weight="bold" /> Rental cost covered
            </p>
          </div>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 14, padding: 20 }}>
            <div style={{ color: 'var(--accent)', marginBottom: 8 }}><Clock size={20} weight="bold" /></div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 2 }}>This Week</p>
            <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>₦78,400</p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>5 shifts completed</p>
          </div>
        </div>

        {/* Rent-to-Own Progress */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Rent-to-Own Progress</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>On track to own this vehicle in 4 months.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)' }}>Total Paid</p>
              <p style={{ fontSize: 20, fontWeight: 800 }}>₦1,250,000</p>
            </div>
          </div>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <div style={{ width: '100%', height: 12, borderRadius: 100, background: 'var(--bg-surface)', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', borderRadius: 100, background: 'linear-gradient(90deg, var(--accent), #ff9f43)', transition: 'width 1s ease' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)' }}>
            <span>0%</span><span>25%</span><span>50%</span><span>65% ✓</span><span>100%</span>
          </div>
        </div>
      </div>
    </main>
  );
}
