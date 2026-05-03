"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OperatingHub, useStore } from "@/store/use-store";
import { MOCK_FLEET, Vehicle } from "@/data/mock-fleet";
import { MapPin, Faders, Lightning, ShieldCheck, Truck, CaretRight, CaretLeft, Clock, ArrowsLeftRight, Database } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { RentalDuration, calculatePrice, formatPrice } from "@/lib/pricing";
import { Logo } from "@/components/ui/logo";

export default function FleetPage() {
  const { tier, setTier, hub, setHub, route, setRoute } = useStore();
  const [filteredFleet, setFilteredFleet] = useState<Vehicle[]>([]);
  const [duration, setDuration] = useState<RentalDuration>("24 Hours");

  const hubs: OperatingHub[] = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"];
  const durations: RentalDuration[] = ["30 Min", "1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];

  const tierOptions = [
    { id: "all", label: "All Vehicles", icon: <Database size={16} weight="bold" /> },
    { id: "eco-gig", label: "Economy", icon: <Lightning size={16} weight="bold" /> },
    { id: "elite", label: "Premium & Luxury", icon: <ShieldCheck size={16} weight="bold" /> },
    { id: "heavy-haul", label: "Logistics & Trucks", icon: <Truck size={16} weight="bold" /> },
  ] as const;

  useEffect(() => {
    let filtered = MOCK_FLEET.filter(v => v.hubs.includes(hub));
    if (tier !== "all") filtered = filtered.filter(v => v.tier === tier);
    setFilteredFleet(filtered);
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

      <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 64, display: 'flex', gap: 32 }}>
        {/* ── Sidebar Filters ──────────────────────────── */}
        <aside style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 96, alignSelf: 'flex-start' }} className="hidden-mobile">
          {/* Hub Selector */}
          <FilterSection title="Location" icon={<MapPin size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
            {hubs.map(h => (
              <button key={h} onClick={() => setHub(h)} style={{
                width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: hub === h ? 'var(--accent)' : 'transparent',
                color: hub === h ? 'white' : 'var(--text-secondary)',
                border: hub === h ? 'none' : '1px solid var(--border-primary)',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: 4,
              }}>
                {h}
              </button>
            ))}
          </FilterSection>

          {/* Tier Selector */}
          <FilterSection title="Vehicle Type" icon={<Faders size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
            {tierOptions.map(t => (
              <button key={t.id} onClick={() => setTier(t.id as any)} style={{
                width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 8,
                background: tier === t.id ? 'var(--accent)' : 'transparent',
                color: tier === t.id ? 'white' : 'var(--text-secondary)',
                border: tier === t.id ? 'none' : '1px solid var(--border-primary)',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: 4,
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </FilterSection>

          {/* Duration Selector */}
          <FilterSection title="Rental Duration" icon={<Clock size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {durations.map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: 'center',
                  background: duration === d ? 'var(--accent-soft)' : 'transparent',
                  color: duration === d ? 'var(--accent)' : 'var(--text-tertiary)',
                  border: `1px solid ${duration === d ? 'rgba(255,107,44,0.3)' : 'var(--border-primary)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {d}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Haulage Route (conditional) */}
          {tier === "heavy-haul" && (
            <FilterSection title="Haulage Route" icon={<ArrowsLeftRight size={14} weight="bold" style={{ color: 'var(--accent)' }} />}>
              <input placeholder="Origin city" value={route.origin} onChange={e => setRoute(e.target.value, route.destination)} style={inputStyle} />
              <input placeholder="Destination city" value={route.destination} onChange={e => setRoute(route.origin, e.target.value)} style={{ ...inputStyle, marginTop: 8 }} />
            </FilterSection>
          )}
        </aside>

        {/* ── Fleet Grid ───────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Available Vehicles
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {filteredFleet.length} vehicles in {hub} · {tier === 'all' ? 'All categories' : tierOptions.find(t => t.id === tier)?.label}
            </p>
          </div>

          {/* Mobile Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }} className="mobile-only">
            <select value={hub} onChange={e => setHub(e.target.value as any)} style={selectStyle}>
              {hubs.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <select value={tier} onChange={e => setTier(e.target.value as any)} style={selectStyle}>
              {tierOptions.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <select value={duration} onChange={e => setDuration(e.target.value as RentalDuration)} style={selectStyle}>
              {durations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Grid */}
          {filteredFleet.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', border: '2px dashed var(--border-primary)', borderRadius: 20, background: 'var(--bg-elevated)' }}>
              <p style={{ fontSize: 15, color: 'var(--text-tertiary)', fontWeight: 500 }}>No vehicles available in {hub} for this category.</p>
              <button onClick={() => setTier("all")} className="btn btn-accent" style={{ marginTop: 16, height: 40, padding: '0 20px' }}>
                Show all vehicles
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
              {filteredFleet.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} duration={duration} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hidden-mobile { display: flex; }
        .mobile-only { display: none !important; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </main>
  );
}

/* ── Filter Section Component ────────────────────────── */
function FilterSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 16, padding: 16 }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

/* ── Vehicle Card Component ──────────────────────────── */
function VehicleCard({ vehicle: v, duration, index }: { vehicle: Vehicle; duration: RentalDuration; index: number }) {
  const [imgIdx, setImgIdx] = useState(0);
  const price = calculatePrice(v.pricePerDay, duration);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}>
      <Link href={`/fleet/${v.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div className="card">
          {/* Image with carousel */}
          <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-surface)', overflow: 'hidden' }}>
            <Image src={v.images[imgIdx]} alt={`${v.brand} ${v.model}`} fill style={{ objectFit: 'cover', transition: 'opacity 0.4s' }} unoptimized />

            {/* Tier badge */}
            <div style={{
              position: 'absolute', top: 10, left: 10, padding: '4px 10px', borderRadius: 6,
              fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
              background: v.tier === 'elite' ? 'var(--gold)' : v.tier === 'eco-gig' ? 'var(--success)' : 'var(--accent)',
              color: v.tier === 'elite' ? '#1a1a1a' : 'white',
            }}>
              {v.tier === 'eco-gig' ? 'Economy' : v.tier === 'heavy-haul' ? 'Logistics' : 'Premium'}
            </div>

            {/* Image dots */}
            {v.images.length > 1 && (
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                {v.images.map((_, i) => (
                  <button key={i} onClick={e => { e.preventDefault(); setImgIdx(i); }} style={{
                    width: i === imgIdx ? 16 : 6, height: 6, borderRadius: 100, border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                    background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.4)',
                  }} />
                ))}
              </div>
            )}

            {/* Carousel arrows */}
            {v.images.length > 1 && (
              <>
                <button onClick={e => { e.preventDefault(); setImgIdx(p => p === 0 ? v.images.length - 1 : p - 1); }} style={{ ...arrowStyle, left: 8 }}>
                  <CaretLeft size={14} weight="bold" />
                </button>
                <button onClick={e => { e.preventDefault(); setImgIdx(p => (p + 1) % v.images.length); }} style={{ ...arrowStyle, right: 8 }}>
                  <CaretRight size={14} weight="bold" />
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '16px 18px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
              {v.brand} · {v.year}
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>{v.model}</h3>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {v.features.slice(0, 3).map((f, j) => (
                <span key={j} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 5, fontWeight: 500,
                  background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)',
                }}>
                  {f}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border-primary)' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                  {duration} rate
                </p>
                <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatPrice(price)}</span>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--accent-soft)', color: 'var(--accent)', transition: 'all 0.2s',
              }}>
                <CaretRight size={16} weight="bold" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Shared Styles ───────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500,
  background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
  background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)',
  cursor: 'pointer', flex: 1, minWidth: 0,
};

const arrowStyle: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer',
  backdropFilter: 'blur(8px)', transition: 'all 0.2s',
};
