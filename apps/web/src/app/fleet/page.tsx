"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OperatingHub, useStore } from "@/store/use-store";
import { MOCK_FLEET, Vehicle } from "@/data/mock-fleet";
import { 
  MapPin, Faders, Lightning, ShieldCheck, 
  Truck, CaretRight, CaretLeft, Clock, 
  ArrowsLeftRight, Database, TrendUp, CalendarBlank,
  CaretDown, MagnifyingGlass
} from "@phosphor-icons/react";
import Link from "next/link";
import { RentalDuration } from "@/lib/pricing";
import { getCurrencyForCountry } from "@/lib/currency";
import { Logo } from "@/components/ui/logo";
import { HUB_DATA } from "@/lib/constants";
import { VehicleCard } from "@/components/vehicle-card";
import { EnhancedDatePicker } from "@/components/enhanced-date-picker";
import { SkeletonVehicleCard } from "@/components/skeleton-vehicle-card";

export default function FleetPage() {
  const { tier, setTier, hub, setHub, country, route, setRoute } = useStore();
  const [filteredFleet, setFilteredFleet] = useState<Vehicle[]>([]);
  const [duration, setDuration] = useState<RentalDuration>("24 Hours");
  const [pickupDate, setPickupDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const currency = getCurrencyForCountry(country);
  const hubs = HUB_DATA[country] || [];
  const durations: RentalDuration[] = ["1 Hour", "12 Hours", "24 Hours", "3 Days", "7 Days"];

  const tierOptions = [
    { id: "all", label: "All Vehicles", icon: <Database size={16} weight="bold" /> },
    { id: "eco-gig", label: "Economy", icon: <Lightning size={16} weight="bold" /> },
    { id: "elite", label: "Premium & Luxury", icon: <ShieldCheck size={16} weight="bold" /> },
    { id: "heavy-haul", label: "Logistics & Trucks", icon: <Truck size={16} weight="bold" /> },
  ] as const;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = MOCK_FLEET.filter(v => v.hubs.includes(hub));
      if (tier !== "all") filtered = filtered.filter(v => v.tier === tier);
      if (searchQuery) {
        filtered = filtered.filter(v => 
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
          v.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredFleet(filtered);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [tier, hub, searchQuery]);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* --- Navigation --- */}
      <nav className="glass fixed top-0 w-full z-[80] border-b border-white/5 h-20">
        <div className="container-wide h-full flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
              <MapPin size={14} className="text-indigo-400" />
              {hub} Hub
            </div>
            <Link href="/" className="btn btn-outline h-11 px-6 text-xs uppercase tracking-widest font-black">
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container-wide pt-32 pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
          
          {/* --- Sidebar Filters --- */}
          <aside className="space-y-8 lg:sticky lg:top-28 self-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter mb-2">Fleet Registry</h1>
              <p className="text-slate-500 text-sm">Configure your institutional asset requirements.</p>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="relative group">
                <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search model..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>

              <FilterGroup title="Location" icon={<MapPin />}>
                <div className="relative">
                  <select 
                    value={hub} 
                    onChange={e => setHub(e.target.value as OperatingHub)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold appearance-none focus:outline-none cursor-pointer"
                  >
                    {hubs.map(h => <option key={h} value={h} className="bg-slate-900">{h}</option>)}
                  </select>
                  <CaretDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </FilterGroup>

              <FilterGroup title="Vehicle Tier" icon={<Database />}>
                <div className="flex flex-col gap-1">
                  {tierOptions.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id as any)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all
                        ${tier === t.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:bg-white/5 text-slate-400'}
                      `}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Duration" icon={<Clock />}>
                <div className="grid grid-cols-2 gap-2">
                  {durations.map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`
                        h-10 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all
                        ${duration === d ? 'bg-white text-black' : 'bg-white/5 text-slate-500 hover:bg-white/10'}
                      `}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              {tier === "heavy-haul" && (
                <FilterGroup title="Logistics Routing" icon={<ArrowsLeftRight />}>
                  <div className="space-y-3">
                    <input placeholder="Origin Hub" value={route.origin} onChange={e => setRoute(e.target.value, route.destination)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-xs font-bold focus:outline-none" />
                    <input placeholder="Destination" value={route.destination} onChange={e => setRoute(route.origin, e.target.value)} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-4 text-xs font-bold focus:outline-none" />
                  </div>
                </FilterGroup>
              )}
            </div>
          </aside>

          {/* --- Main Content --- */}
          <div className="min-w-0">
            {/* Active Hub Stats */}
            <div className="mb-12 p-8 glass rounded-[2.5rem] border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32" />
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <TrendUp size={16} weight="bold" /> Operational High-Load
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Current Assets in {hub}</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {filteredFleet.length} units cleared for immediate institutional deployment.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black text-white">{filteredFleet.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Available</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400">98%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uptime</div>
                </div>
              </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {[...Array(4)].map((_, i) => <SkeletonVehicleCard key={i} />)}
                </motion.div>
              ) : filteredFleet.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 text-center glass rounded-[3rem] border-dashed border-white/5"
                >
                  <p className="text-slate-500 font-bold mb-6">No assets match the selected configuration in {hub}.</p>
                  <button onClick={() => { setTier("all"); setSearchQuery(""); }} className="btn btn-accent px-8 h-12">Reset Registry Filter</button>
                </motion.div>
              ) : (
                <motion.div 
                  key="grid"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {filteredFleet.map((v, i) => (
                    <motion.div
                      key={v.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
                      }}
                    >
                      <VehicleCard vehicle={v} duration={duration} currency={currency} index={i} activeHub={hub} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}

function FilterGroup({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-6 glass rounded-3xl border-white/5">
      <div className="flex items-center gap-2 text-indigo-400">
        {icon}
        <h3 className="text-[10px] font-black uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}

