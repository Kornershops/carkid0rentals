"use client";

import { MOCK_FLEET } from "@/data/mock-fleet";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { 
  ArrowLeft, Clock, ArrowsClockwise, CaretRight, 
  CaretLeft, MapPin, Check, Gauge, ShieldCheck, 
  Star, Lightning, Package, Trophy, Globe
} from "@phosphor-icons/react";
import { RentalDuration, calculatePrice } from "@/lib/pricing";
import { formatPrice, getCurrencyForCountry } from "@/lib/currency";
import { useStore } from "@/store/use-store";
import { Logo } from "@/components/ui/logo";
import { EnhancedDatePicker } from "@/components/enhanced-date-picker";
import { BlurImage } from "@/components/ui/blur-image";
import { motion, AnimatePresence } from "framer-motion";

export default function VehicleDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const { country } = useStore();
  const vehicle = MOCK_FLEET.find((v) => v.id === id);
  
  const [selectedDuration, setSelectedDuration] = useState<RentalDuration>("24 Hours");
  const [startDate, setStartDate] = useState("");
  const [currentImg, setCurrentImg] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4 tracking-tighter">Vehicle Not Found</h1>
          <p className="text-slate-500 mb-8">The requested asset is not available in our registry.</p>
          <Link href="/fleet" className="btn btn-accent px-8 h-12">Return to Fleet</Link>
        </div>
      </main>
    );
  }

  const currency = getCurrencyForCountry(country);
  const totalPrice = calculatePrice(vehicle.pricePerDay, selectedDuration);
  const durations: RentalDuration[] = ["1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];

  const prevImg = () => setCurrentImg(p => p === 0 ? vehicle.images.length - 1 : p - 1);
  const nextImg = () => setCurrentImg(p => (p + 1) % vehicle.images.length);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* --- Navigation --- */}
      <nav className="glass fixed top-0 w-full z-50 border-b border-white/5 h-20">
        <div className="container-wide h-full flex items-center justify-between">
          <Logo />
          <Link href="/fleet" className="btn btn-outline h-11 px-6 flex items-center gap-2">
            <ArrowLeft size={18} weight="bold" />
            <span className="hidden sm:inline">Fleet Registry</span>
          </Link>
        </div>
      </nav>

      <div className="container-wide pt-32 pb-24">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
          
          {/* Left: Cinematic Visuals */}
          <div className="space-y-8">
            <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/5 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <BlurImage
                    src={vehicle.images[currentImg].path}
                    alt={vehicle.images[currentImg].altText}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {vehicle.images.length > 1 && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-10">
                  <button onClick={prevImg} className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <CaretLeft size={20} weight="bold" />
                  </button>
                  <button onClick={nextImg} className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <CaretRight size={20} weight="bold" />
                  </button>
                </div>
              )}

              {/* Progress Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {vehicle.images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentImg(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImg ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {vehicle.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`
                    relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300
                    ${i === currentImg ? 'border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20' : 'border-transparent opacity-50 hover:opacity-100'}
                  `}
                >
                  <div className="relative w-full h-full">
                    <BlurImage src={img.path} alt="" fill className="object-cover" shimmer={false} />
                  </div>
                </button>
              ))}
            </div>

            {/* Features & Narrative */}
            <div className="pt-8 border-t border-white/5">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Standard Configuration</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {vehicle.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 glass rounded-2xl border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Check size={16} weight="bold" />
                    </div>
                    <span className="text-sm font-bold text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Institutional Intelligence */}
          <div className="space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <span className={`
                  px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md
                  ${vehicle.tier === 'elite' ? 'bg-amber-500/90 text-black' : 
                    vehicle.tier === 'eco-gig' ? 'bg-emerald-500/90 text-white' : 
                    'bg-indigo-600/90 text-white'}
                `}>
                  {vehicle.tier.replace('-', ' ')}
                </span>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-emerald-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Inventory
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">{vehicle.brand} {vehicle.model}</h1>
              
              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <MapPin size={18} className="text-indigo-500" />
                  {vehicle.hubs.join(', ')} Hubs
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-400">
                  <Globe size={18} />
                  Pan-African Standardized
                </div>
              </div>
            </div>

            {/* Technical Spec Matrix */}
            <div className="grid grid-cols-2 gap-4">
              <SpecBox icon={<Gauge size={20} weight="duotone" />} label="Zero to Sixty" value={vehicle.zeroToSixty ? `${vehicle.zeroToSixty}s` : "Optimal"} />
              <SpecBox icon={<Lightning size={20} weight="duotone" />} label="Propulsion" value={vehicle.isEV ? "EV Hub-Motor" : "Standard Fuel"} />
              <SpecBox icon={<ShieldCheck size={20} weight="duotone" />} label="Chassis" value={vehicle.tier === 'elite' ? 'B6 Armored Ready' : 'High-Tensile'} />
              <SpecBox icon={<Package size={20} weight="duotone" />} label="Payload" value={vehicle.payloadKg ? `${vehicle.payloadKg.toLocaleString()}kg` : "Standard"} />
            </div>

            {/* Booking Engine */}
            <div className="glass rounded-[2.5rem] p-8 lg:p-10 border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] -mr-16 -mt-16" />
              
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <Trophy size={24} weight="duotone" className="text-indigo-500" />
                Reserve Configuration
              </h2>

              <div className="space-y-8">
                <EnhancedDatePicker 
                  value={startDate} 
                  onChange={setStartDate} 
                  label="Mission Start Date"
                  placeholder="Select deployment date"
                />

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Operation Duration</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {durations.map(d => (
                      <button 
                        key={d} 
                        onClick={() => setSelectedDuration(d)} 
                        className={`
                          h-12 rounded-xl text-xs font-bold transition-all
                          ${selectedDuration === d ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-slate-400'}
                        `}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Institutional Rate</p>
                      <div className="text-4xl font-black text-indigo-400 leading-none">
                        {formatPrice(totalPrice, currency)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Includes</div>
                      <div className="text-xs font-bold">Standard Insurance</div>
                    </div>
                  </div>

                  <Link 
                    href="/auth/login" 
                    className="btn btn-accent w-full h-16 text-lg tracking-tight group"
                  >
                    Confirm Deployment
                    <CaretRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
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

function SpecBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-5 glass rounded-3xl border-white/5 space-y-3">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-base font-bold text-white truncate">{value}</p>
      </div>
    </div>
  );
}
