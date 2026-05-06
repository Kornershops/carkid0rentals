"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CaretLeft, CaretRight, TrendUp, Lightning, ShieldCheck, Gauge, Package } from "@phosphor-icons/react";
import { Vehicle } from "@/data/mock-fleet";
import { RentalDuration, calculatePrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/currency";
import { BlurImage } from "@/components/ui/blur-image";

import { useStore } from "@/store/use-store";

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
  const { comparisonIds, addToCompare, removeFromCompare } = useStore();
  const isComparing = comparisonIds.includes(v.id);
  const canCompare = comparisonIds.length < 3 || isComparing;
  
  const price = calculatePrice(v.pricePerDay, duration);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComparing) {
      removeFromCompare(v.id);
    } else if (canCompare) {
      addToCompare(v.id);
    }
  };

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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
      className="h-full"
    >
      <div className="card group h-full flex flex-col bg-[#0a0a0a] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden rounded-[2rem]">
        {/* Visual Layer */}
        <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <BlurImage
                src={v.images[imgIdx].path}
                alt={v.images[imgIdx].altText}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors pointer-events-none" />
          
          {/* Tier Label */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className={`
              px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md
              ${v.tier === 'elite' ? 'bg-amber-500/90 text-black' : 
                v.tier === 'eco-gig' ? 'bg-emerald-500/90 text-white' : 
                'bg-indigo-600/90 text-white'}
            `}>
              {v.tier.replace('-', ' ')}
            </span>
            
            <button 
              onClick={toggleCompare}
              aria-pressed={isComparing}
              aria-label={isComparing ? `Remove ${v.model} from comparison` : `Add ${v.model} to comparison`}
              className={`
                px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all
                ${isComparing 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'}
                ${!canCompare && !isComparing ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isComparing ? '✓ Comparing' : '+ Contrast'}
            </button>
          </div>

          {/* Institutional Badge */}
          {activeHub && v.hubs.includes(activeHub) && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-lg bg-white/95 text-black text-[9px] font-black tracking-tighter flex items-center gap-1.5 shadow-xl">
              <TrendUp size={12} weight="bold" /> HUB ACTIVE
            </div>
          )}

          {/* Navigation Overlay */}
          {v.images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity z-30">
              <button 
                onClick={prevImg} 
                aria-label="Previous image"
                className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button 
                onClick={nextImg} 
                aria-label="Next image"
                className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          )}

          {/* Slider Progress */}
          {v.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
              {v.images.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-4 bg-white' : 'w-1 bg-white/30'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Content Layer */}
        <Link href={`/fleet/${v.id}`} aria-label={`View details for ${v.model}`} className="flex-grow flex flex-col p-6 lg:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-1">
                {v.brand} • {v.year}
              </div>
              <h3 className="text-xl lg:text-2xl font-bold group-hover:text-indigo-400 transition-colors">{v.model}</h3>
            </div>
            <div className="text-right">
              <div className="text-xl lg:text-2xl font-black text-indigo-400 leading-none">{formatPrice(price, currency)}</div>
              <div className="text-[10px] text-slate-500 font-black tracking-tighter">TOTAL {duration.toUpperCase()}</div>
            </div>
          </div>

          {/* Dynamic Specs Engine (Phase 2.3) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {v.isEV && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <Lightning size={14} weight="fill" /> 100% ELECTRIC
              </div>
            )}
            
            {v.tier === 'elite' && v.zeroToSixty && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                <Gauge size={14} weight="fill" /> {v.zeroToSixty} (0-60)
              </div>
            )}

            {v.tier === 'heavy-haul' && v.payloadKg && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                <Package size={14} weight="fill" /> {v.payloadKg.toLocaleString()}KG PAYLOAD
              </div>
            )}

            {v.features.slice(0, 2).map((f, j) => (
              <span key={j} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 text-[10px] font-bold uppercase">
                {f}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group/btn">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">View Configuration</span>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover/btn:gap-3 transition-all">
              Detail Access <CaretRight size={18} weight="bold" />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
