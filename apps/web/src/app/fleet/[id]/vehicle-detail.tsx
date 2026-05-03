"use client";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { ArrowLeft, Clock, ArrowsClockwise, CaretRight, CaretLeft, MapPin, Check, Gauge, Shield, Star } from "@phosphor-icons/react";
import { RentalDuration, calculatePrice, formatPrice } from "@/lib/pricing";
import { Logo } from "@/components/ui/logo";

export default function VehicleDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const vehicle = MOCK_FLEET.find((v) => v.id === id);
  const [selectedDuration, setSelectedDuration] = useState<RentalDuration>("24 Hours");
  const [autoRenew, setAutoRenew] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  if (!vehicle) {
    return (
      <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Vehicle Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This vehicle doesn't exist or has been removed.</p>
          <Link href="/fleet" className="btn btn-accent" style={{ height: 40, padding: '0 24px', fontSize: 13 }}>Back to Fleet</Link>
        </div>
      </main>
    );
  }

  const durations: RentalDuration[] = ["30 Min", "1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];
  const totalPrice = calculatePrice(vehicle.pricePerDay, selectedDuration);
  const tierLabel = vehicle.tier === 'eco-gig' ? 'Economy' : vehicle.tier === 'heavy-haul' ? 'Logistics' : 'Premium';

  const prevImg = useCallback(() => setCurrentImg(p => p === 0 ? vehicle.images.length - 1 : p - 1), [vehicle.images.length]);
  const nextImg = useCallback(() => setCurrentImg(p => (p + 1) % vehicle.images.length), [vehicle.images.length]);

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/fleet" className="btn btn-ghost" style={{ height: 36, padding: '0 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} weight="bold" /> Back to Fleet
          </Link>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="detail-layout">
          <div>
            <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', background: 'var(--bg-surface)', marginBottom: 12 }}>
              {vehicle.images.map((src, i) => (
                <Image key={i} src={src} alt={`${vehicle.brand} ${vehicle.model} view ${i + 1}`} fill
                  style={{ objectFit: 'cover', opacity: i === currentImg ? 1 : 0, transition: 'opacity 0.35s ease', position: 'absolute', inset: 0 }}
                  unoptimized priority={i === 0}
                />
              ))}
              {vehicle.images.length > 1 && (
                <>
                  <button onClick={prevImg} aria-label="Previous" style={{ ...arrowStyle, left: 12 }}><CaretLeft size={18} weight="bold" /></button>
                  <button onClick={nextImg} aria-label="Next" style={{ ...arrowStyle, right: 12 }}><CaretRight size={18} weight="bold" /></button>
                </>
              )}
              {vehicle.images.length > 1 && (
                <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                  {vehicle.images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)} style={{
                      width: i === currentImg ? 20 : 8, height: 8, borderRadius: 100, border: 'none', cursor: 'pointer',
                      background: i === currentImg ? 'white' : 'rgba(255,255,255,0.4)', transition: 'all 0.25s', padding: 0,
                    }} />
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {vehicle.images.map((src, i) => (
                <button key={i} onClick={() => setCurrentImg(i)} style={{
                  position: 'relative', width: 80, height: 56, borderRadius: 10, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0,
                  outline: i === currentImg ? '2px solid var(--accent)' : '2px solid transparent', outlineOffset: 2, transition: 'outline 0.2s',
                }}>
                  <Image src={src} alt={`View ${i + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: vehicle.tier === 'elite' ? 'var(--gold)' : vehicle.tier === 'eco-gig' ? 'var(--success)' : 'var(--accent)', color: vehicle.tier === 'elite' ? '#1a1a1a' : 'white', borderColor: 'transparent' }}>{tierLabel}</span>
                <span className="badge" style={{ background: 'rgba(48, 209, 88, 0.1)', color: 'var(--success)', borderColor: 'rgba(48,209,88,0.2)' }}>
                  <Check size={12} weight="bold" /> {vehicle.status === 'available' ? 'Available Now' : vehicle.status}
                </span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{vehicle.brand} · {vehicle.year}</p>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>{vehicle.model}</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} weight="bold" style={{ color: 'var(--accent)' }} /> Available in {vehicle.hubs.join(', ')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 28 }}>
              {vehicle.hp && <SpecCard icon={<Gauge size={18} weight="bold" />} label="Horsepower" value={`${vehicle.hp} HP`} />}
              {vehicle.zeroToSixty && <SpecCard icon={<Clock size={18} weight="bold" />} label="0-60 mph" value={`${vehicle.zeroToSixty}s`} />}
              {vehicle.fuelEfficiency && <SpecCard icon={<Gauge size={18} weight="bold" />} label="Fuel Economy" value={vehicle.fuelEfficiency} />}
              {vehicle.payloadKg && <SpecCard icon={<Shield size={18} weight="bold" />} label="Payload" value={`${(vehicle.payloadKg / 1000).toFixed(1)}T`} />}
              <SpecCard icon={<Star size={18} weight="bold" />} label="Category" value={tierLabel} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Features</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {vehicle.features.map((f, i) => (
                  <span key={i} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, fontWeight: 500, background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>{f}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} weight="bold" style={{ color: 'var(--accent)' }} /> Rental Duration
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                {durations.map(d => (
                  <button key={d} onClick={() => setSelectedDuration(d)} style={{
                    height: 44, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedDuration === d ? 'var(--accent)' : 'var(--bg-surface)',
                    color: selectedDuration === d ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${selectedDuration === d ? 'var(--accent)' : 'var(--border-primary)'}`,
                  }}>{d}</button>
                ))}
              </div>

              <button onClick={() => setAutoRenew(!autoRenew)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-primary)',
                background: autoRenew ? 'rgba(48, 209, 88, 0.08)' : 'var(--bg-surface)', cursor: 'pointer', marginBottom: 20, transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                  <ArrowsClockwise size={18} weight="bold" style={{ color: autoRenew ? 'var(--success)' : 'var(--text-tertiary)' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Auto-Renewal</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Automatically extend when rental expires</p>
                  </div>
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, position: 'relative', background: autoRenew ? 'var(--success)' : 'var(--border-primary)', transition: 'background 0.2s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: autoRenew ? 23 : 3, transition: 'left 0.2s' }} />
                </div>
              </button>

              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 2 }}>Total for {selectedDuration}</p>
                    <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>{formatPrice(totalPrice)}</span>
                  </div>
                  {autoRenew && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ArrowsClockwise size={12} weight="bold" /> Auto-renews
                    </span>
                  )}
                </div>
                <Link href="/auth/login" className="btn btn-accent" style={{ width: '100%', height: 48, fontSize: 14, fontWeight: 700 }}>
                  Book Now <CaretRight size={18} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .detail-layout { grid-template-columns: 1fr 1fr; }
        @media (max-width: 860px) { .detail-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 12, padding: '12px 14px' }}>
      <div style={{ color: 'var(--accent)', marginBottom: 6 }}>{icon}</div>
      <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

const arrowStyle: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 3,
  width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer',
  backdropFilter: 'blur(4px)', transition: 'background 0.2s', padding: 0,
};
