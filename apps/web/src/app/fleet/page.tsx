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
  Clock,
  WarningCircle,
  MapPin,
  ArrowsLeftRight
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { RentalDuration, calculatePrice, formatPrice } from "@/lib/pricing";

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
    { id: "all", label: "All Vehicles", icon: <Car size={18} weight="duotone" /> },
    { id: "eco-gig", label: "Eco-Gig", icon: <Lightning size={18} weight="duotone" className="text-amber-500" /> },
    { id: "elite", label: "Elite & Exotic", icon: <ShieldCheck size={18} weight="duotone" className="text-primary" /> },
    { id: "heavy-haul", label: "Heavy Haul", icon: <Truck size={18} weight="duotone" className="text-blue-500" /> },
  ] as const;

  const durations: RentalDuration[] = ["30 Min", "1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];

  return (
    <main className="min-h-screen bg-background font-inter antialiased">
      {/* Enterprise Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="pwa-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Car size={20} weight="bold" className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tight uppercase">CarKid<span className="text-primary">0</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-xl">
                <MapPin size={14} weight="bold" className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">{hub} HUB</span>
             </div>
             <button className="btn-secondary h-10 px-4">
               <MapTrifold size={18} weight="bold" /> Map
             </button>
          </div>
        </div>
      </nav>

      <div className="pwa-container py-8 flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-72 shrink-0 space-y-8">
          {/* Hub Selector */}
          <div>
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <MapPin size={16} weight="bold" /> Operating Hub
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {hubs.map((h) => (
                <button
                  key={h}
                  onClick={() => setHub(h)}
                  className={`px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all border ${
                    hub === h
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-surface border-border text-muted hover:border-primary/30"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Faders size={16} weight="bold" /> Vehicle Tiers
            </h3>
            <div className="space-y-1.5">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all ${
                    tier === t.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-surface border border-transparent text-muted hover:text-foreground hover:bg-border/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {t.icon}
                    {t.label}
                  </div>
                  {tier === t.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Haulage Route Module */}
          {tier === "heavy-haul" && (
            <div className="pt-8 border-t border-border animate-in fade-in slide-in-from-top-4 duration-500">
               <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                 <ArrowsLeftRight size={16} weight="bold" /> Haulage Route Spec
               </h3>
               <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Origin Point</label>
                    <input 
                      type="text" 
                      placeholder="e.g. APAPA WHARF" 
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-[11px] font-black uppercase placeholder:text-muted/30 focus:outline-none focus:border-primary transition-all"
                      value={route.origin}
                      onChange={(e) => setRoute(e.target.value.toUpperCase(), route.destination)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Destination Point</label>
                    <input 
                      type="text" 
                      placeholder="e.g. KANO DISTRO CENTER" 
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-[11px] font-black uppercase placeholder:text-muted/30 focus:outline-none focus:border-primary transition-all"
                      value={route.destination}
                      onChange={(e) => setRoute(route.origin, e.target.value.toUpperCase())}
                    />
                  </div>
               </div>
            </div>
          )}

          {/* Duration Selector */}
          <div className="pt-8 border-t border-border">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Clock size={16} weight="bold" /> Duration
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all border ${
                    duration === d
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-surface border-transparent text-muted hover:border-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Info Card */}
          <div className="pt-8 border-t border-border">
            <div className="bg-surface border border-border p-4 rounded-2xl">
               <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Pricing Model</p>
               <p className="text-[11px] font-bold uppercase tracking-tight">Dynamic duration-based calculations enabled.</p>
            </div>
          </div>
        </aside>

        {/* Fleet Grid */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-foreground">Available Assets</h1>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">Showing {filteredFleet.length} Institutional Vehicles</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={`skel-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-surface border border-border rounded-2xl p-4 flex flex-col h-[400px] animate-pulse"
                  >
                    <div className="w-full h-44 bg-background border border-border rounded-xl mb-4" />
                    <div className="h-6 w-2/3 bg-background border border-border rounded-lg mb-2" />
                    <div className="h-4 w-1/3 bg-background border border-border rounded-lg mb-auto" />
                    <div className="pt-4 border-t border-border flex justify-between items-end">
                      <div className="h-8 w-20 bg-background border border-border rounded-lg" />
                      <div className="w-10 h-10 bg-background border border-border rounded-xl" />
                    </div>
                  </motion.div>
                ))
              ) : filteredFleet.length === 0 ? (
                <div className="col-span-full py-24 text-center border border-dashed border-border rounded-2xl bg-surface/30">
                  <WarningCircle size={40} weight="duotone" className="mx-auto text-muted mb-4" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-muted">No assets found in this tier.</p>
                </div>
              ) : (
                filteredFleet.map((vehicle) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    key={vehicle.id}
                    className="group bg-surface border border-border rounded-2xl p-4 flex flex-col h-[420px] hover:border-primary/50 hover:shadow-xl transition-all"
                  >
                    <div className="relative w-full h-44 rounded-xl overflow-hidden mb-6 bg-background border border-border">
                      <Image
                        src={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-background/90 backdrop-blur rounded-lg text-[9px] font-black uppercase tracking-tighter border border-border shadow-sm">
                        {vehicle.tier.replace("-", " ")}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-black text-xl tracking-tight leading-tight uppercase">{vehicle.brand} {vehicle.model}</h3>
                      <p className="text-[10px] font-bold text-muted mt-1 uppercase tracking-widest">{vehicle.year} • {vehicle.hp ? `${vehicle.hp} HP` : 'Institutional Edition'}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {vehicle.tier === "eco-gig" && (
                          <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[9px] font-black uppercase border border-amber-500/20 tracking-tighter">
                            {vehicle.fuelEfficiency}
                          </span>
                        )}
                        {vehicle.tier === "elite" && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase border border-primary/20 tracking-tighter">
                            Concierge Delivery
                          </span>
                        )}
                        {vehicle.tier === "heavy-haul" && (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-black uppercase border border-blue-500/20 tracking-tighter">
                            {(vehicle.payloadKg! / 1000).toFixed(1)}t PAYLOAD
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-lg text-[9px] font-black uppercase border border-green-500/20 tracking-tighter">
                          SECURE_LOCK
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-6 pt-6 border-t border-border">
                      <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Calculated Price</p>
                        <p className="text-2xl font-black tracking-tighter uppercase">
                          {formatPrice(calculatePrice(vehicle.pricePerDay, duration))}
                          <span className="text-[9px] text-muted ml-1 font-black">/TOTAL</span>
                        </p>
                      </div>
                      <Link 
                        href={`/fleet/${vehicle.id}`}
                        className="w-11 h-11 bg-background border border-border rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm"
                      >
                        <CaretRight size={20} weight="bold" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
