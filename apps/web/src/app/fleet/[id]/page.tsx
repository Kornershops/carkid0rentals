"use client";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  Car, 
  ArrowLeft, 
  CalendarBlank, 
  ShieldCheck, 
  Lightning, 
  Truck, 
  LockKey,
  Gauge,
  Stack,
  Clock,
  ArrowsClockwise,
  CheckCircle,
  CaretRight,
  CaretLeft,
  MapPin,
  Buildings,
  Database
} from "@phosphor-icons/react";
import { RentalDuration, calculatePrice, formatPrice } from "@/lib/pricing";
import { Logo } from "@/components/ui/logo";

export default function VehicleDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const vehicle = MOCK_FLEET.find((v) => v.id === id);
  const [selectedDuration, setSelectedDuration] = useState<RentalDuration>("24 Hours");
  const [autoRenew, setAutoRenew] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  if (!vehicle) {
    notFound();
  }

  const durations: RentalDuration[] = ["30 Min", "1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];

  return (
    <main className="min-h-screen bg-background font-inter antialiased">
      <nav className="fixed top-0 w-full z-50 glass border-b border-border">
        <div className="pwa-container h-20 flex items-center justify-between">
          <Logo />
          <Link href="/fleet" className="btn-secondary h-12 px-6">
            <ArrowLeft size={18} weight="bold" /> Back to Fleet
          </Link>
        </div>
      </nav>

      <div className="pwa-container pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Asset Visualization */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-video bg-surface border border-border rounded-[48px] overflow-hidden group shadow-2xl">
              <Image 
                src={vehicle.images[currentImg]} 
                alt={vehicle.model} 
                fill 
                className="object-cover transition-transform duration-1000"
                unoptimized
              />
              
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setCurrentImg(prev => prev === 0 ? vehicle.images.length - 1 : prev - 1)}
                  className="w-14 h-14 bg-background/90 backdrop-blur-xl rounded-[20px] flex items-center justify-center border border-border shadow-2xl hover:bg-primary hover:text-white transition-all"
                >
                  <CaretLeft size={24} weight="bold" />
                </button>
                <button 
                  onClick={() => setCurrentImg(prev => (prev + 1) % vehicle.images.length)}
                  className="w-14 h-14 bg-background/90 backdrop-blur-xl rounded-[20px] flex items-center justify-center border border-border shadow-2xl hover:bg-primary hover:text-white transition-all"
                >
                  <CaretRight size={24} weight="bold" />
                </button>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {vehicle.images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImg(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImg ? "w-10 bg-primary" : "w-2 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
               {vehicle.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImg(idx)}
                    className={`relative aspect-square rounded-[20px] overflow-hidden border-2 transition-all ${idx === currentImg ? "border-primary shadow-xl" : "border-border hover:border-accent"}`}
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="bg-surface border border-border p-6 rounded-[32px]">
                <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center mb-4">
                   <Gauge size={20} weight="duotone" className="text-accent" />
                </div>
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Max Power</p>
                <p className="text-sm font-black uppercase tracking-tight">{vehicle.hp || "Industrial"}</p>
              </div>
              <div className="bg-surface border border-border p-6 rounded-[32px]">
                <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center mb-4">
                   <Stack size={20} weight="duotone" className="text-accent" />
                </div>
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Infrastructure</p>
                <p className="text-sm font-black uppercase tracking-tight">{vehicle.tier.replace('-', ' ')}</p>
              </div>
              <div className="bg-surface border border-border p-6 rounded-[32px]">
                <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center mb-4">
                   <LockKey size={20} weight="duotone" className="text-accent" />
                </div>
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Security</p>
                <p className="text-sm font-black uppercase tracking-tight">Safe-Halt™</p>
              </div>
              <div className="bg-surface border border-border p-6 rounded-[32px]">
                <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center mb-4">
                   <CheckCircle size={20} weight="duotone" className="text-accent" />
                </div>
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-black uppercase tracking-tight text-success">{vehicle.status}</p>
              </div>
            </div>
          </div>

          {/* Booking & Configuration */}
          <div className="lg:col-span-5">
            <div className="bg-surface border border-border rounded-[48px] p-10 sticky top-32 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="px-3 py-1 bg-background border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-muted">
                    {vehicle.brand}
                 </div>
                 <div className="px-3 py-1 bg-background border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-success">
                    Verified Asset
                 </div>
              </div>
              
              <h1 className="text-5xl font-black tracking-[-0.05em] uppercase text-foreground leading-[0.9] mb-4">
                {vehicle.model}
              </h1>
              <p className="text-[11px] font-bold text-muted uppercase tracking-[0.4em] mb-12 border-l-2 border-accent pl-6">
                Institutional ID: {vehicle.id} • Terminal: {vehicle.hubs[0]}
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <Clock size={18} weight="bold" className="text-accent" /> Configure Mission Duration
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {durations.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDuration(d)}
                        className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                          selectedDuration === d
                            ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20"
                            : "bg-background border-border text-muted hover:border-accent/40"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <button 
                    onClick={() => setAutoRenew(!autoRenew)}
                    className="w-full flex items-center justify-between p-6 bg-background border border-border rounded-[32px] group hover:border-accent/40 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${autoRenew ? "bg-success text-white shadow-lg shadow-success/20" : "bg-surface text-muted"}`}>
                        <ArrowsClockwise size={24} weight="bold" className={autoRenew ? "animate-spin-slow" : ""} />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Safe-Extend™ Auto-Renewal</p>
                        <p className="text-[9px] font-bold text-muted uppercase mt-1">Automatic mission extension on expiry</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all ${autoRenew ? "bg-success" : "bg-border"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoRenew ? "left-7" : "left-1"}`} />
                    </div>
                  </button>
                </div>

                <div className="pt-8 mt-8 border-t border-border">
                  <div className="flex items-end justify-between mb-10">
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-2">Total Infrastructure Commitment</p>
                      <p className="text-5xl font-black tracking-[-0.06em] text-foreground uppercase">
                        {formatPrice(calculatePrice(vehicle.pricePerDay, selectedDuration))}
                      </p>
                    </div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1 opacity-40">Inc. Fees</p>
                  </div>

                  <Link href="/auth/login" className="btn-primary h-20 w-full text-sm">
                    Initialize Deployment <CaretRight size={24} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
