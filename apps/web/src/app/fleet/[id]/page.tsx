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
  CheckCircle
} from "@phosphor-icons/react";
import { RentalDuration, calculatePrice, formatPrice } from "@/lib/pricing";

export default function VehicleDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const vehicle = MOCK_FLEET.find((v) => v.id === id);
  const [selectedDuration, setSelectedDuration] = useState<RentalDuration>("24 Hours");
  const [autoRenew, setAutoRenew] = useState(false);

  if (!vehicle) {
    notFound();
  }

  const isEco = vehicle.tier === "eco-gig";
  const isElite = vehicle.tier === "elite";
  const isHaul = vehicle.tier === "heavy-haul";

  const durations: RentalDuration[] = ["30 Min", "1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];
  const totalPrice = calculatePrice(vehicle.pricePerDay, selectedDuration);
  const escrowDeposit = Math.round(totalPrice * 0.4); // 40% escrow deposit

  return (
    <main className="min-h-screen bg-background pb-24 font-inter antialiased">
      {/* Enterprise Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="pwa-container h-16 flex items-center justify-between">
          <Link href="/fleet" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors">
            <ArrowLeft size={16} weight="bold" /> Back to Fleet
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car size={20} weight="bold" className="text-white" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase">CarKid<span className="text-primary">0</span></span>
          </div>
        </div>
      </nav>

      <div className="pwa-container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Visual Showcase */}
          <div className="space-y-6 md:space-y-8">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-surface border border-border shadow-2xl">
              {(isElite || isHaul) && (
                <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-background/90 backdrop-blur rounded-xl border border-border text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  TELEMETRY ACTIVE
                </div>
              )}
              <Image 
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="aspect-video bg-surface rounded-2xl border border-border overflow-hidden relative opacity-60 hover:opacity-100 transition-all cursor-pointer hover:border-primary/50">
                    <Image src={vehicle.image} alt="thumbnail" fill className="object-cover" unoptimized />
                 </div>
               ))}
            </div>
          </div>

          {/* Asset Intelligence & Booking */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-6 w-fit">
              {isEco && <Lightning size={14} weight="duotone" className="text-amber-500" />}
              {isElite && <ShieldCheck size={14} weight="duotone" className="text-primary" />}
              {isHaul && <Truck size={14} weight="duotone" className="text-blue-500" />}
              {vehicle.tier.replace("-", " ")}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground mb-3 leading-none">
              {vehicle.brand} <span className="text-muted font-medium">{vehicle.model}</span>
            </h1>
            <p className="text-xs font-bold text-muted mb-8 md:mb-10 uppercase tracking-widest leading-none">
              Model Year {vehicle.year} • Institutional Quality • Verified History
            </p>

            {/* Dynamic Duration Selection */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
                <Clock size={16} weight="bold" /> Select Rental Duration
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                      selectedDuration === d 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-surface border-border text-muted hover:border-primary/30"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Ledger */}
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6 border-b border-border pb-4 flex items-center gap-2">
                <Gauge size={16} weight="bold" /> Asset Performance Ledger
              </h3>
              <div className="grid grid-cols-2 gap-8">
                {isEco && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted uppercase tracking-tighter">Fuel Efficiency</p>
                      <p className="text-xl font-black text-amber-500 tracking-tighter">{vehicle.fuelEfficiency}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted uppercase tracking-tighter">Est. Daily Yield</p>
                      <p className="text-xl font-black text-green-500 tracking-tighter">₦{vehicle.estDailyRevenue?.toLocaleString()}</p>
                    </div>
                  </>
                )}

                {isElite && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted uppercase tracking-tighter">Output Power</p>
                      <p className="text-xl font-black text-primary tracking-tighter">{vehicle.hp} HP</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted uppercase tracking-tighter">0-100 Speed</p>
                      <p className="text-xl font-black text-foreground tracking-tighter">{vehicle.zeroToSixty}s</p>
                    </div>
                  </>
                )}

                {isHaul && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted uppercase tracking-tighter">Payload Limit</p>
                      <p className="text-xl font-black text-blue-500 tracking-tighter">{(vehicle.payloadKg! / 1000).toFixed(1)}t</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted uppercase tracking-tighter">Clearance</p>
                      <p className="text-xl font-black text-foreground tracking-tighter">{vehicle.clearanceHeight}m</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Auto-Renewal Setup */}
            <div className="mb-10 bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ArrowsClockwise size={20} weight="bold" className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Auto-Renewal</p>
                  <p className="text-[9px] text-muted font-bold uppercase">Extend rental automatically</p>
                </div>
              </div>
              <button 
                onClick={() => setAutoRenew(!autoRenew)}
                className={`w-12 h-6 rounded-full relative transition-all ${autoRenew ? "bg-primary" : "bg-border"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoRenew ? "left-7" : "left-1"}`} />
              </button>
            </div>

            <div className="mt-auto pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest">Total Rental Price</p>
                  <p className="text-3xl font-black tracking-tighter text-foreground uppercase">
                    {formatPrice(totalPrice)}
                    <span className="text-[10px] text-muted ml-1 font-black">/TOTAL</span>
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest">Escrow Deposit</p>
                  <p className="text-lg font-black tracking-tighter text-foreground opacity-80">{formatPrice(escrowDeposit)}</p>
                </div>
              </div>

              <Link 
                href="/dashboard/customer"
                className="btn-primary w-full shadow-2xl shadow-primary/30 h-14 text-sm"
              >
                <LockKey size={20} weight="bold" />
                Initialize Asset Lock
              </Link>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted">
                <ShieldCheck size={16} weight="duotone" className="text-green-500" />
                Institutional Security Clearance Level 2
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
