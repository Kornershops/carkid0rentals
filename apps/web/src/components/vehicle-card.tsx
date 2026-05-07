"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CaretLeft, CaretRight, Lightning } from "@phosphor-icons/react";
import { useState } from "react";
import { BlurImage } from "@/components/ui/blur-image";
import { formatPrice } from "@/lib/currency";
import { FleetVehicle } from "@/data/mock-fleet";

interface VehicleCardProps {
  vehicle: FleetVehicle;
  duration: string;
  currency: string;
  index: number;
  activeHub: string;
}

export function VehicleCard({ vehicle: v, duration, currency, index }: VehicleCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [isComparing, setIsComparing] = useState(false);

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((prev) => (prev + 1) % v.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((prev) => (prev - 1 + v.images.length) % v.images.length);
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsComparing(!isComparing);
  };

  const price = v.pricing?.[duration] || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.6, ease: [0.4, 0, 0.2, 1] as any }}
      className="group"
    >
      <Link href={`/fleet/${v.id}`} className="block bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:border-black/10 transition-all hover:shadow-xl group">
        {/* Image Section */}
        <div className="relative aspect-[16/10] bg-neutral-50 overflow-hidden">
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
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-tight backdrop-blur-md ${
              v.tier === 'elite' ? 'bg-amber-400/90 text-white' : 
              v.tier === 'eco-gig' ? 'bg-emerald-500/90 text-white' : 
              'bg-blue-500/90 text-white'
            }`}>
              {v.tier.toUpperCase()}
            </div>
          </div>

          <button 
            onClick={toggleCompare}
            className={`absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-md transition-all ${
              isComparing ? 'bg-blue-600 text-white' : 'bg-white/80 text-black/60 hover:bg-white'
            }`}
          >
            {isComparing ? 'COMPARING' : '+ COMPARE'}
          </button>

          {/* Navigation */}
          {v.images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
              <button onClick={prevImg} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white pointer-events-auto transition-transform active:scale-95">
                <CaretLeft size={16} weight="bold" />
              </button>
              <button onClick={nextImg} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white pointer-events-auto transition-transform active:scale-95">
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight mb-1">{v.brand} • {v.year}</p>
              <h3 className="text-lg font-semibold text-black tracking-tight leading-tight">{v.model}</h3>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600 leading-none">{formatPrice(price, currency)}</p>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight mt-1">/{duration}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {v.isEV && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                <Lightning size={10} weight="fill" /> ELECTRIC
              </span>
            )}
            {v.features.slice(0, 2).map((f, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-50 text-neutral-500 text-[9px] font-bold uppercase">
                {f}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-black/[0.03]">
            <span className="text-[11px] font-bold text-neutral-300">DETAILS</span>
            <div className="flex items-center gap-1 text-[13px] font-bold text-blue-600">
              Reserve <CaretRight size={14} weight="bold" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
