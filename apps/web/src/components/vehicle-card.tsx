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
      initial={{ opacity: 0, y: 10 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.8, ease: [0.4, 0, 0.2, 1] as any }}
      className="group relative h-full"
    >
      <div className="card relative h-full flex flex-col bg-white overflow-hidden">
        {/* Visual Layer */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <BlurImage
                src={v.images[imgIdx].path}
                alt={v.images[imgIdx].altText}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Tier Badge */}
          <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
            <div className={`
              px-3 py-1 rounded-full text-[10px] font-semibold tracking-tight backdrop-blur-md
              ${v.tier === 'elite' ? 'bg-amber-400/90 text-white' : 
                v.tier === 'eco-gig' ? 'bg-emerald-500/90 text-white' : 
                'bg-blue-500/90 text-white'}
            `}>
              {v.tier.replace('-', ' ')}
            </div>
            
            <button 
              onClick={toggleCompare}
              className={`
                px-3 py-1 rounded-full text-[10px] font-semibold transition-all backdrop-blur-md
                ${isComparing 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/80 text-black/70 hover:bg-white'}
              `}
            >
              {isComparing ? '✓ Comparing' : '+ Compare'}
            </button>
          </div>

          {/* Navigation Overlay - Very subtle for Apple style */}
          {v.images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity z-30">
              <button 
                onClick={prevImg} 
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white transition-all"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button 
                onClick={nextImg} 
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white transition-all"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {/* Content Layer */}
        <Link href={`/fleet/${v.id}`} className="flex-grow flex flex-col p-6 lg:p-7">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-400">
                <span>{v.brand}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
                <span>{v.year}</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-black tracking-tight">{v.model}</h3>
            </div>
            <div className="text-right">
              <div className="text-xl lg:text-2xl font-bold text-blue-600 tracking-tight">
                {formatPrice(price, currency)}
              </div>
              <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">Per {duration}</div>
            </div>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {v.isEV && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">
                <Lightning size={12} weight="fill" /> ELECTRIC
              </div>
            )}
            {v.features.slice(0, 2).map((f, j) => (
              <div key={j} className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-semibold">
                {f}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-neutral-50 flex items-center justify-between group/cta">
            <span className="text-[11px] font-medium text-neutral-400">View Specs</span>
            <div className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold">
              Reserve <CaretRight size={16} weight="bold" />
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
