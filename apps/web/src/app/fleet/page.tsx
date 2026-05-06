"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { OperatingHub, useStore } from "@/store/use-store";
import { MOCK_FLEET, Vehicle } from "@/data/mock-fleet";
import { MapPin, Faders, Lightning, ShieldCheck, Truck, CaretRight, CaretLeft, Clock, ArrowsLeftRight, Database, TrendUp, CalendarBlank } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { RentalDuration, calculatePrice } from "@/lib/pricing";
import { formatPrice, getCurrencyForCountry } from "@/lib/currency";
import { Logo } from "@/components/ui/logo";
import { HUB_DATA } from "@/lib/constants";
import { VehicleCard } from "@/components/vehicle-card";
import { EnhancedDatePicker } from "@/components/enhanced-date-picker";
import { SkeletonVehicleCard } from "@/components/skeleton-vehicle-card";

export default function FleetPage() {
  const { tier, setTier, hub, setHub, country, route, setRoute } = useStore();
  const [filteredFleet, setFilteredFleet] = useState<Vehicle[]>([]);
  const [duration, setDuration] = useState<RentalDuration>("24 Hours");
  const [pickupDate, setPickupDate] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currency = getCurrencyForCountry(country);


  const hubs = HUB_DATA[country] || [];
  const durations: RentalDuration[] = ["30 Min", "1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];

  const tierOptions = [
    { id: "all", label: "All Vehicles", icon: <Database size={16} weight="bold" /> },
    { id: "eco-gig", label: "Economy", icon: <Lightning size={16} weight="bold" /> },
    { id: "elite", label: "Premium & Luxury", icon: <ShieldCheck size={16} weight="bold" /> },
    { id: "heavy-haul", label: "Logistics & Trucks", icon: <Truck size={16} weight="bold" /> },
  ] as const;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = MOCK_FLEET.filter(v => v.hubs.includes(hub));
      if (tier !== "all") filtered = filtered.filter(v => v.tier === tier);
      setFilteredFleet(filtered);
      setIsLoading(false);
    }, 400); // Fast simulation for premium feel
    return () => clearTimeout(timer);
  }, [tier, hub]);

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="badge badge-accent">
              <MapPin size={14} weight="bold" /> {hub}
            </div>
            <Link href="/" className="btn btn-ghost" style={{ height: 36, padding: '0 14px', fontSize: 12 }}>← Home</Link>
          </div>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Mobile Filters Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }} className="mobile-filters">
          <select value={hub} onChange={e => setHub(e.target.value as OperatingHub)} style={selectStyle}>
            {hubs.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <select value={tier} onChange={e => setTier(e.target.value as any)} style={selectStyle}>
            {tierOptions.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <select value={duration} onChange={e => setDuration(e.target.value as RentalDuration)} style={selectStyle}>
            {durations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div style={{ width: '100%', marginTop: 8 }}>
            <EnhancedDatePicker value={pickupDate} onChange={setPickupDate} placeholder="Pick-up Date" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          {/* ── Sidebar ──────────────────────────────────── */}
          <aside style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 96, alignSelf: 'flex-start' }} className="desktop-sidebar">
            <FilterSection title="Location" icon={<MapPin size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
              {hubs.map(h => (
                <SidebarButton key={h} active={hub === h} onClick={() => setHub(h as any)} label={h} />
              ))}
            </FilterSection>

            <FilterSection title="Vehicle Type" icon={<Faders size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
              {tierOptions.map(t => (
                <SidebarButton key={t.id} active={tier === t.id} onClick={() => setTier(t.id as any)} label={t.label} icon={t.icon} />
              ))}
            </FilterSection>

            <FilterSection title="Booking Date" icon={<CalendarBlank size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
              <EnhancedDatePicker value={pickupDate} onChange={setPickupDate} placeholder="Select date" />
            </FilterSection>

            <FilterSection title="Rental Duration" icon={<Clock size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {durations.map(d => (
                  <button key={d} onClick={() => setDuration(d)} style={{
                    padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: 'center',
                    background: duration === d ? 'var(--accent)' : 'transparent',
                    color: duration === d ? 'white' : 'var(--text-tertiary)',
                    border: `1px solid ${duration === d ? 'var(--accent)' : 'var(--border-primary)'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {d}
                  </button>
                ))}
              </div>
            </FilterSection>

            {tier === "heavy-haul" && (
              <FilterSection title="Haulage Route" icon={<ArrowsLeftRight size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
                <input placeholder="Origin" value={route.origin} onChange={e => setRoute(e.target.value, route.destination)} style={inputStyle} />
                <div style={{ height: 8 }} />
                <input placeholder="Destination" value={route.destination} onChange={e => setRoute(route.origin, e.target.value)} style={inputStyle} />
              </FilterSection>
            )}
          </aside>

          {/* ── Fleet Grid ─────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mobility Segment Tabs */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid var(--border-primary)', paddingBottom: 16 }}>
              {tierOptions.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setTier(t.id as any)}
                  style={{
                    padding: '8px 20px', borderRadius: 100, fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s',
                    background: tier === t.id ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: tier === t.id ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${tier === t.id ? 'var(--accent)' : 'var(--border-primary)'}`,
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
                  {tier === 'all' ? 'The Global Fleet' : tierOptions.find(t => t.id === tier)?.label}
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {filteredFleet.length} professional-grade assets available in {hub}, {country}
                </p>
              </div>
              <button onClick={() => setShowComparison(true)} className="btn btn-ghost" style={{ fontSize: 13, gap: 8 }}>
                <ArrowsLeftRight size={18} /> Compare Tiers
              </button>
            </div>

            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
                {[...Array(6)].map((_, i) => <SkeletonVehicleCard key={i} />)}
              </div>
            ) : filteredFleet.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px dashed var(--border-primary)', borderRadius: 16, background: 'var(--bg-elevated)' }}>
                <p style={{ fontSize: 15, color: 'var(--text-tertiary)', fontWeight: 500, marginBottom: 12 }}>No vehicles available in {hub} for this category.</p>
                <button onClick={() => setTier("all")} className="btn btn-accent" style={{ height: 40, padding: '0 20px' }}>Show all vehicles</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
                {filteredFleet.map((v, i) => (
                  <VehicleCard key={v.id} vehicle={v} duration={duration} currency={currency} index={i} activeHub={hub} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .desktop-sidebar { display: flex; }
        .mobile-filters { display: none !important; }
        @media (max-width: 860px) {
          .desktop-sidebar { display: none !important; }
          .mobile-filters { display: flex !important; }
        }
      `}</style>
    </main>
  );
}

/* ── Sidebar Button ──────────────────────────────────── */
function SidebarButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400,
      display: 'flex', alignItems: 'center', gap: 8,
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? 'white' : 'var(--text-secondary)',
      border: 'none', cursor: 'pointer', transition: 'all 0.15s', marginBottom: 2,
    }}>
      {icon}{label}
    </button>
  );
}

/* ── Filter Section ──────────────────────────────────── */
function FilterSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 14, padding: 14 }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}


/* ── Styles ──────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
  background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
  background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
  cursor: 'pointer', flex: 1, minWidth: 0,
};

const arrowBtnStyle: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 3,
  width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', cursor: 'pointer',
  backdropFilter: 'blur(4px)', transition: 'background 0.2s', padding: 0,
};
