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
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
      className="group relative h-full"
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/20 to-orange-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
      
      <div className="relative h-full flex flex-col bg-[#0a0a0c] border border-white/5 group-hover:border-white/10 transition-all duration-500 overflow-hidden rounded-[2.5rem] backdrop-blur-3xl">
        {/* Visual Layer */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIdx}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="absolute inset-0"
            >
              <BlurImage
                src={v.images[imgIdx].path}
                alt={v.images[imgIdx].altText}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
          
          {/* Tier Badge */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
            <div className={`
              px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-2xl border shadow-2xl
              ${v.tier === 'elite' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 
                v.tier === 'eco-gig' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 
                'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'}
            `}>
              {v.tier.replace('-', ' ')}
            </div>
            
            <button 
              onClick={toggleCompare}
              className={`
                px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] backdrop-blur-2xl transition-all border
                ${isComparing 
                  ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}
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
        <Link href={`/fleet/${v.id}`} className="flex-grow flex flex-col p-8 lg:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                <span>{v.brand}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>{v.year}</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black group-hover:text-indigo-400 transition-colors leading-tight">{v.model}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-black text-indigo-400 leading-none mb-1">
                {formatPrice(price, currency)}
              </div>
              <div className="text-[10px] text-slate-500 font-black tracking-widest opacity-60 uppercase">TOTAL {duration}</div>
            </div>
          </div>

          {/* Specs Engine */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {v.isEV && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <Lightning size={14} weight="fill" /> ELECTRIC
              </div>
            )}
            {v.tier === 'elite' && v.zeroToSixty && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                <Gauge size={14} weight="fill" /> {v.zeroToSixty}
              </div>
            )}
            {v.features.slice(0, 2).map((f, j) => (
              <div key={j} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold uppercase">
                {f}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between group/cta">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/cta:text-white transition-colors">Configuration Access</span>
            <div className="flex items-center gap-3 text-indigo-400 text-sm font-bold group-hover/cta:gap-5 transition-all">
              Detail <CaretRight size={20} weight="bold" />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
