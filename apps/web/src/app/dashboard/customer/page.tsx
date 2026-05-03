"use client";
import { useState } from "react";
import Link from "next/link";
import { CaretRight, Clock, MapPin, Car, CalendarBlank, Receipt, User } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";

export default function CustomerDashboard() {
  const [tab, setTab] = useState<"active" | "history">("active");

  const mockRentals = [
    { id: "R-001", vehicle: "Toyota Camry", duration: "24 Hours", date: "May 2, 2026", price: "₦22,000", status: "active", hub: "Lagos" },
    { id: "R-002", vehicle: "Range Rover Autobiography", duration: "3 Days", date: "Apr 28, 2026", price: "₦1,260,000", status: "completed", hub: "Abuja" },
    { id: "R-003", vehicle: "Toyota Hilux", duration: "7 Days", date: "Apr 20, 2026", price: "₦315,000", status: "completed", hub: "Port Harcourt" },
  ];

  const active = mockRentals.filter(r => r.status === "active");
  const history = mockRentals.filter(r => r.status === "completed");

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} weight="bold" />
            </div>
            <Link href="/" className="btn btn-ghost" style={{ height: 36, padding: '0 14px', fontSize: 12 }}>← Home</Link>
          </div>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 800 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>My Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>Manage your rentals and booking history.</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
          {[
            { label: "Active Rentals", value: active.length.toString(), icon: <Car size={18} weight="bold" /> },
            { label: "Total Bookings", value: mockRentals.length.toString(), icon: <Receipt size={18} weight="bold" /> },
            { label: "Cities Used", value: "3", icon: <MapPin size={18} weight="bold" /> },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ color: 'var(--accent)', marginBottom: 8 }}>{s.icon}</div>
              <p style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{s.value}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', borderRadius: 10, padding: 3, marginBottom: 24, border: '1px solid var(--border-primary)' }}>
          {(["active", "history"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text-tertiary)', transition: 'all 0.2s', textTransform: 'capitalize',
            }}>
              {t === "active" ? `Active (${active.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {/* Rental Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(tab === "active" ? active : history).map(r => (
            <div key={r.id} className="card" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 2 }}>{r.id} · {r.hub}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{r.vehicle}</h3>
                <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} weight="bold" /> {r.duration}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarBlank size={13} weight="bold" /> {r.date}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 800 }}>{r.price}</p>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                  background: r.status === 'active' ? 'rgba(48,209,88,0.1)' : 'var(--bg-surface)',
                  color: r.status === 'active' ? 'var(--success)' : 'var(--text-tertiary)',
                }}>{r.status === 'active' ? 'Active' : 'Completed'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/fleet" className="btn btn-accent" style={{ height: 44, padding: '0 28px', fontSize: 13 }}>
            Book Another Vehicle <CaretRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </main>
  );
}
