"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OperatingHub, useStore } from "@/store/use-store";
import { MOCK_FLEET, Vehicle } from "@/data/mock-fleet";
import { 
  Faders, 
  MapTrifold, 
  Car, 
  Lightning, 
  ShieldCheck, 
  Truck, 
  CaretRight,
  CaretLeft,
  Clock,
  WarningCircle,
  MapPin,
  ArrowsLeftRight,
  Database
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { RentalDuration, calculatePrice, formatPrice } from "@/lib/pricing";
import { Logo } from "@/components/ui/logo";

export default function FleetPage() {
  const { tier, setTier, hub, setHub, route, setRoute } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredFleet, setFilteredFleet] = useState<Vehicle[]>([]);
  const [duration, setDuration] = useState<RentalDuration>("24 Hours");

  const hubs: OperatingHub[] = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = MOCK_FLEET;
      
      // Filter by Hub
      filtered = filtered.filter(v => v.hubs.includes(hub));

      // Filter by Tier
      if (tier !== "all") {
        filtered = filtered.filter((v) => v.tier === tier);
      }

      setFilteredFleet(filtered);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [tier, hub]);

  const tiers = [
    { id: "all", label: "All Vehicles", icon: <Database size={18} weight="duotone" /> },
    { id: "eco-gig", label: "Eco-Gig", icon: <Lightning size={18} weight="duotone" className="text-amber-500" /> },
    { id: "elite", label: "Elite & Exotic", icon: <ShieldCheck size={18} weight="duotone" className="text-primary" /> },
    { id: "heavy-haul", label: "Heavy Haul", icon: <Truck size={18} weight="duotone" className="text-blue-500" /> },
  ] as const;

  const durations: RentalDuration[] = ["30 Min", "1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];

  return (
    <main className="min-h-screen bg-background font-inter antialiased">
      {/* Enterprise Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border shadow-sm">
        <div className="pwa-container h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-surface border border-border rounded-2xl shadow-sm">
                <MapPin size={16} weight="bold" className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{hub} HUB ONLINE</span>
             </div>
             <button className="btn-secondary h-12 px-6">
               <MapTrifold size={20} weight="bold" /> Network Map
             </button>
          </div>
        </div>
      </nav>

      <div className="pwa-container py-12 flex flex-col md:flex-row gap-12 lg:gap-16">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-80 shrink-0 space-y-12">
          {/* Hub Selector */}
          <div className="bg-surface border border-border rounded-[32px] p-6">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <MapPin size={18} weight="bold" className="text-accent" /> Regional Hubs
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {hubs.map((h) => (
                <button
                  key={h}
                  onClick={() => setHub(h)}
                  className={`px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all text-left border ${
                    hub === h
                      ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20"
                      : "bg-background border-border text-muted hover:border-accent/40"
                  }`}
                >
                  {h} <span className="opacity-40 ml-1">Terminal</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[32px] p-6">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <Faders size={18} weight="bold" className="text-accent" /> Infrastructure Tier
            </h3>
            <div className="space-y-2">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id as any)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-tight transition-all border ${
                    tier === t.id
                      ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20"
                      : "bg-background border-border text-muted hover:text-foreground hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {t.icon}
                    {t.label}
                  </div>
                  {tier === t.id && <div className="w-2 h-2 rounded-full bg-success" />}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Haulage Route Module */}
          {tier === "heavy-haul" && (
            <div className="bg-surface border border-border rounded-[32px] p-6 animate-in fade-in slide-in-from-top-4 duration-500">
               <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                 <ArrowsLeftRight size={18} weight="bold" className="text-accent" /> Logistics Routing
               </h3>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Hub Entry (Origin)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. APAPA WHARF" 
                      className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-[11px] font-bold uppercase placeholder:text-muted/30 focus:outline-none focus:border-accent transition-all"
                      value={route.origin}
                      onChange={(e) => setRoute(e.target.value.toUpperCase(), route.destination)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Hub Exit (Dest.)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KANO DISTRO CENTER" 
                      className="w-full bg-background border border-border rounded-2xl px-5 py-4 text-[11px] font-bold uppercase placeholder:text-muted/30 focus:outline-none focus:border-accent transition-all"
                      value={route.destination}
                      onChange={(e) => setRoute(route.origin, e.target.value.toUpperCase())}
                    />
                  </div>
               </div>
            </div>
          )}

          {/* Duration Selector */}
          <div className="bg-surface border border-border rounded-[32px] p-6">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <Clock size={18} weight="bold" className="text-accent" /> Mission Duration
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3 py-4 rounded-2xl text-[9px] font-black uppercase tracking-tighter transition-all border ${
                    duration === d
                      ? "bg-accent/10 border-accent/40 text-accent"
                      : "bg-background border-border text-muted hover:border-accent/40"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Fleet Grid */}
        <div className="flex-1">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em] uppercase text-foreground leading-[0.9]">Institutional<br/><span className="text-muted opacity-30 tracking-tight font-black">Assets</span></h1>
            <p className="text-[11px] font-bold text-muted uppercase tracking-[0.4em] mt-6 leading-loose border-l-2 border-accent pl-6">
              Authenticated fleet data from {hub} Terminal. {filteredFleet.length} verified units operational.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={`skel-${i}`} className="enterprise-card p-6 h-[500px] animate-pulse">
                    <div className="w-full h-64 bg-border/20 rounded-[32px] mb-8" />
                    <div className="h-8 w-2/3 bg-border/20 rounded-xl mb-4" />
                    <div className="h-4 w-1/3 bg-border/20 rounded-xl" />
                  </div>
                ))
              ) : filteredFleet.length === 0 ? (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[40px] bg-surface/30">
                  <WarningCircle size={48} weight="duotone" className="mx-auto text-muted mb-6" />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted">No assets deployed to {hub} Terminal.</p>
                </div>
              ) : (
                filteredFleet.map((vehicle) => (
                  <FleetCard key={vehicle.id} vehicle={vehicle} duration={duration} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

function FleetCard({ vehicle, duration }: { vehicle: Vehicle, duration: RentalDuration }) {
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="enterprise-card p-6 flex flex-col group h-full"
    >
      <div className="relative w-full h-72 bg-background border border-border rounded-[32px] mb-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={vehicle.images[currentImg]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {vehicle.images.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => { e.preventDefault(); setCurrentImg(idx); }}
              className={`h-1 rounded-full transition-all duration-500 ${idx === currentImg ? "w-6 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentImg(prev => prev === 0 ? vehicle.images.length - 1 : prev - 1); 
            }}
            className="w-10 h-10 bg-background/80 backdrop-blur rounded-xl flex items-center justify-center border border-border hover:bg-primary hover:text-white transition-all"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentImg(prev => (prev + 1) % vehicle.images.length); 
            }}
            className="w-10 h-10 bg-background/80 backdrop-blur rounded-xl flex items-center justify-center border border-border hover:bg-primary hover:text-white transition-all"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>

        <div className="absolute top-5 left-5 px-4 py-1.5 bg-background/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-border">
          {vehicle.tier.replace("-", " ")}
        </div>
      </div>
      
      <div className="flex-1 px-2">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-2">{vehicle.brand}</p>
        <h3 className="text-4xl font-black tracking-[-0.05em] uppercase text-foreground leading-[0.9] mb-4">{vehicle.model}</h3>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {vehicle.features.slice(0, 3).map((f, i) => (
            <span key={i} className="px-3 py-1.5 bg-surface border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-muted">
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-end mt-12 pt-8 border-t border-border">
        <div>
          <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-2">Calculated Infrastructure Cost</p>
          <p className="text-3xl font-black tracking-tighter uppercase">
            {formatPrice(calculatePrice(vehicle.pricePerDay, duration))}
            <span className="text-[11px] text-muted ml-1 font-black opacity-40">/TOTAL</span>
          </p>
        </div>
        <Link 
          href={`/fleet/${vehicle.id}`}
          className="w-14 h-14 bg-surface border border-border rounded-[20px] flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-xl shadow-black/5"
        >
          <CaretRight size={24} weight="bold" />
        </Link>
      </div>
    </motion.div>
  );
}
