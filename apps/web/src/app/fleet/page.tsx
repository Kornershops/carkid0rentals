"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/use-store";
import { MOCK_FLEET, Vehicle } from "@/data/mock-fleet";
import { SlidersHorizontal, Map, Car, Zap, Shield, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FleetPage() {
  const { tier, setTier } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredFleet, setFilteredFleet] = useState<Vehicle[]>([]);

  // Simulate API fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (tier === "all") {
        setFilteredFleet(MOCK_FLEET);
      } else {
        setFilteredFleet(MOCK_FLEET.filter((v) => v.tier === tier));
      }
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [tier]);

  const tiers = [
    { id: "all", label: "All Vehicles", icon: <Car className="w-4 h-4" /> },
    { id: "eco-gig", label: "Eco-Gig", icon: <Zap className="w-4 h-4" /> },
    { id: "elite", label: "Elite & Exotic", icon: <Shield className="w-4 h-4" /> },
    { id: "heavy-haul", label: "Heavy Haul", icon: <Truck className="w-4 h-4" /> },
  ] as const;

  return (
    <main className="min-h-screen bg-background">
      {/* Simple Header */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-premium-gradient rounded-lg flex items-center justify-center">
              <Car className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">CarKid0</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-border/50 transition-colors">
              <Map className="w-4 h-4" /> Map View
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <div className="space-y-2">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    tier === t.id
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "bg-surface border border-transparent text-muted hover:text-foreground hover:bg-border/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {t.icon}
                    {t.label}
                  </div>
                  {tier === t.id && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Filter (Mock) */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Price Range</h3>
            <input type="range" className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-muted mt-2">
              <span>₦10,000/day</span>
              <span>₦500,000+/day</span>
            </div>
          </div>
        </aside>

        {/* Fleet Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Available Fleet</h1>
            <span className="text-sm text-muted">{filteredFleet.length} vehicles found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                // Skeleton Loaders
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={`skel-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-surface/50 border border-border rounded-3xl p-4 flex flex-col h-[380px]"
                  >
                    <div className="w-full h-48 bg-border/50 rounded-2xl animate-pulse mb-4" />
                    <div className="h-6 w-2/3 bg-border/50 rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-1/3 bg-border/50 rounded-lg animate-pulse mb-auto" />
                    <div className="flex justify-between items-end mt-4">
                      <div className="h-8 w-24 bg-border/50 rounded-lg animate-pulse" />
                      <div className="h-10 w-10 bg-border/50 rounded-xl animate-pulse" />
                    </div>
                  </motion.div>
                ))
              ) : filteredFleet.length === 0 ? (
                <div className="col-span-full py-20 text-center border border-dashed border-border rounded-3xl bg-surface/30">
                  <p className="text-muted">No vehicles found for this tier.</p>
                </div>
              ) : (
                filteredFleet.map((vehicle) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={vehicle.id}
                    className="group bg-background border border-border rounded-3xl p-4 flex flex-col h-[380px] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] transition-all"
                  >
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-surface">
                      <Image
                        src={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/80 backdrop-blur rounded-lg text-xs font-semibold capitalize border border-white/10 shadow-sm">
                        {vehicle.tier.replace("-", " ")}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg leading-tight">{vehicle.brand} {vehicle.model}</h3>
                      <p className="text-sm text-muted mt-1">{vehicle.year} • Auto</p>
                      
                      {/* Dynamic Tier Specs Preview */}
                      <div className="mt-3 flex gap-2">
                        {vehicle.tier === "eco-gig" && (
                          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded text-xs font-medium border border-yellow-500/20">
                            {vehicle.fuelEfficiency}
                          </span>
                        )}
                        {vehicle.tier === "elite" && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium border border-primary/20">
                            {vehicle.hp} HP
                          </span>
                        )}
                        {vehicle.tier === "heavy-haul" && (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-medium border border-blue-500/20">
                            {(vehicle.payloadKg! / 1000).toFixed(1)}t Payload
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted uppercase font-semibold">Per Day</p>
                        <p className="text-lg font-bold">₦{vehicle.pricePerDay.toLocaleString()}</p>
                      </div>
                      <Link 
                        href={`/fleet/${vehicle.id}`}
                        className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
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
