"use client";

import Link from "next/link";
import { Lightning, ShieldCheck, Truck, CaretRight } from "@phosphor-icons/react";
import { Vehicle } from "@/data/mock-fleet";
import { RentalDuration, calculatePrice } from "@/lib/pricing";

const TIER_BADGE: Record<string, { label: string; icon: React.ReactNode }> = {
  "eco-gig": { label: "Economy", icon: <Lightning size={12} weight="bold" /> },
  elite: { label: "Premium", icon: <ShieldCheck size={12} weight="bold" /> },
  "heavy-haul": { label: "Logistics", icon: <Truck size={12} weight="bold" /> },
};

export function VehicleCard({ vehicle, duration, currency, activeHub }: { vehicle: Vehicle; duration: RentalDuration; currency: string; index: number; activeHub: string }) {
  const price = calculatePrice(vehicle.pricePerDay, duration);
  const badge = TIER_BADGE[vehicle.tier];

  return (
    <div className="glass rounded-3xl border-white/5 overflow-hidden group hover:border-indigo-500/20 transition-all">
      <div className="aspect-[16/10] bg-white/5 relative overflow-hidden">
        {vehicle.images[0] && (
          <img src={vehicle.images[0].path} alt={vehicle.images[0].altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        {badge && (
          <span className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-[10px] font-black uppercase tracking-widest text-white">
            {badge.icon} {badge.label}
          </span>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{vehicle.brand} · {vehicle.year}</p>
          <h3 className="text-lg font-black tracking-tight">{vehicle.model}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {vehicle.features.slice(0, 3).map(f => (
            <span key={f} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-slate-400">{f}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{duration}</p>
            <p className="text-xl font-black">{currency} {price.toLocaleString()}</p>
          </div>
          <Link href={`/hauler/booking/${vehicle.id}`} className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-colors">
            <CaretRight size={18} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
