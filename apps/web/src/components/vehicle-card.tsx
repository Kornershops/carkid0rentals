"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CaretLeft, CaretRight, TrendUp } from "@phosphor-icons/react";
import { Vehicle } from "@/data/mock-fleet";
import { RentalDuration, calculatePrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/currency";

interface VehicleCardProps {
  vehicle: Vehicle;
  duration: RentalDuration;
  currency: any;
  index: number;
  activeHub?: string;
  compact?: boolean;
}

export function VehicleCard({ 
  vehicle: v, 
  duration, 
  currency, 
  index, 
  activeHub,
  compact = false 
}: VehicleCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const price = calculatePrice(v.pricePerDay, duration);

  const prevImg = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(p => p === 0 ? v.images.length - 1 : p - 1);
  }, [v.images.length]);

  const nextImg = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(p => (p + 1) % v.images.length);
  }, [v.images.length]);

  const selectImg = useCallback((e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(i);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: Math.min(index * 0.04, 0.5), duration: 0.35 }}
      style={{ height: '100%' }}
    >
      <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}>
        {/* Image Slider */}
        <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
          {v.images.map((img, i) => (
            <Image
              key={i}
              src={img.path}
              alt={img.altText}
              fill
              style={{
                objectFit: 'cover',
                opacity: i === imgIdx ? 1 : 0,
                transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'absolute',
                inset: 0,
              }}
              blurDataURL={img.blurHash}
              placeholder={img.blurHash ? "blur" : "empty"}
            />
          ))}

          {/* Tier badge */}
          <div style={{
            position: 'absolute', top: 10, left: 10, padding: '4px 10px', borderRadius: 6, zIndex: 2,
            fontSize: 11, fontWeight: 600,
            background: v.tier === 'elite' ? 'var(--gold)' : v.tier === 'eco-gig' ? 'var(--success)' : 'var(--accent)',
            color: v.tier === 'elite' ? '#1a1a1a' : 'white',
          }}>
            {v.tier === 'eco-gig' ? 'Eco-Gig' : v.tier === 'heavy-haul' ? 'Haulage' : 'Exotic'}
          </div>

          {activeHub && v.hubs[0] === activeHub && (
            <div style={{
              position: 'absolute', top: 10, right: 10, padding: '4px 10px', borderRadius: 6, zIndex: 2,
              fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,0.95)', color: '#000',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 4
            }}>
              <TrendUp size={12} weight="bold" /> MOST USED IN {activeHub.toUpperCase()}
            </div>
          )}

          {/* Arrow buttons */}
          {v.images.length > 1 && (
            <>
              <button onClick={prevImg} aria-label="Previous image" style={{ ...arrowBtnStyle, left: 8 }}>
                <CaretLeft size={14} weight="bold" />
              </button>
              <button onClick={nextImg} aria-label="Next image" style={{ ...arrowBtnStyle, right: 8 }}>
                <CaretRight size={14} weight="bold" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {v.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 2 }}>
              {v.images.map((_, i) => (
                <button key={i} onClick={e => selectImg(e, i)} aria-label={`View image ${i + 1}`} style={{
                  width: i === imgIdx ? 18 : 7, height: 7, borderRadius: 100, border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.45)',
                  padding: 0,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Card content */}
        <Link href={`/fleet/${v.id}`} style={{ display: 'flex', flexDirection: 'column', flex: 1, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ padding: compact ? '12px' : '14px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
              {v.brand} · {v.year}
            </p>
            <h3 style={{ fontSize: compact ? 16 : 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{v.model}</h3>

            {!compact && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                {v.features.slice(0, 3).map((f, j) => (
                  <span key={j} style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 500,
                    background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)',
                  }}>{f}</span>
                ))}
              </div>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-primary)' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 1 }}>
                  {duration}
                </p>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatPrice(price, currency)}</span>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--accent-soft)', color: 'var(--accent)',
              }}>
                <CaretRight size={14} weight="bold" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 3,
  width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', cursor: 'pointer',
  backdropFilter: 'blur(4px)', transition: 'background 0.2s', padding: 0,
};
