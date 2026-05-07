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
      <div className="card relative h-full flex flex-col bg-white overflow-hidden rounded-3xl">
        {/* Visual Layer */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border-b-2 border-black">
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
          
          {/* Tier Badge */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className={`
              px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000000]
              ${v.tier === 'elite' ? 'bg-amber-400 text-black' : 
                v.tier === 'eco-gig' ? 'bg-[#D8F8C8] text-black' : 
                'bg-blue-500 text-white'}
            `}>
              {v.tier.replace('-', ' ')}
            </div>
            
            <button 
              onClick={toggleCompare}
              className={`
                px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border-2 border-black shadow-[2px_2px_0px_#000000]
                ${isComparing 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-black hover:bg-neutral-100'}
              `}
            >
              {isComparing ? '✓ Compare' : '+ Contrast'}
            </button>
          </div>

          {/* Navigation Overlay - Optimized for touch */}
          {v.images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 md:opacity-0 transition-opacity z-30 pointer-events-none">
              <button 
                onClick={prevImg} 
                className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 transition-all shadow-[2px_2px_0px_#000000] pointer-events-auto"
              >
                <CaretLeft size={18} weight="bold" />
              </button>
              <button 
                onClick={nextImg} 
                className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 transition-all shadow-[2px_2px_0px_#000000] pointer-events-auto"
              >
                <CaretRight size={18} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {/* Content Layer */}
        <Link href={`/fleet/${v.id}`} className="flex-grow flex flex-col p-6 lg:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500 font-black">
                <span>{v.brand}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span>{v.year}</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-black leading-tight">{v.model}</h3>
            </div>
            <div className="text-right">
              <div className="text-xl lg:text-2xl font-black text-blue-600 leading-none mb-1">
                {formatPrice(price, currency)}
              </div>
              <div className="text-[9px] text-neutral-400 font-black tracking-widest uppercase">TOTAL {duration}</div>
            </div>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {v.isEV && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 border-2 border-black text-emerald-700 text-[9px] font-black">
                <Lightning size={12} weight="fill" /> ELECTRIC
              </div>
            )}
            {v.features.slice(0, 2).map((f, j) => (
              <div key={j} className="px-2.5 py-1 rounded-lg bg-neutral-50 border-2 border-black text-neutral-600 text-[9px] font-black uppercase">
                {f}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t-2 border-neutral-100 flex items-center justify-between group/cta">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">View Details</span>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-black group-hover/cta:gap-4 transition-all">
              Reserve <CaretRight size={18} weight="bold" />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
