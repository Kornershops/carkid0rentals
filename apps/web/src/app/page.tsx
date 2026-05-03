"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { 
  Car, 
  Truck, 
  Lightning, 
  ShieldCheck, 
  CaretRight, 
  CaretDown, 
  Stack, 
  WarningCircle,
  MagnifyingGlass,
  UserCircle
} from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/use-store";

export default function Home() {
  const { tier, setTier } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tierContent = {
    "all": {
      title: "Rent with Intelligence",
      subtitle: "Drive with Freedom.",
      description: "The enterprise-grade vehicle platform featuring real-time Safe-Halt™ IoT enforcement. From daily gig commutes to heavy logistics.",
      primaryAction: "Explore Fleet",
      features: ["Multi-tier Vehicles", "IoT Enforcement", "Real-time Verification"],
      color: "text-primary",
      icon: <Stack size={48} className="text-primary" weight="duotone" />,
      label: "All Services"
    },
    "eco-gig": {
      title: "Drive & Earn",
      subtitle: "Smart rentals for Gig Drivers.",
      description: "Optimized for Bolt & Uber. Track your daily revenue, maximize fuel efficiency, and explore rent-to-own options.",
      primaryAction: "Find a Car",
      features: ["Daily Revenue Tracker", "High-Efficiency Vehicles", "Rent-to-Own Path"],
      color: "text-amber-500",
      icon: <Lightning size={48} className="text-amber-500" weight="duotone" />,
      label: "Eco-Gig (Bolt/Uber)"
    },
    "elite": {
      title: "Premium Luxury",
      subtitle: "Exotic rentals for every occasion.",
      description: "Experience high-performance supercars and luxury sedans. Concierge booking and 360° inspections included.",
      primaryAction: "Book Luxury",
      features: ["Concierge Delivery", "360° Video Inspection", "Insurance Waivers"],
      color: "text-primary",
      icon: <ShieldCheck size={48} className="text-primary" weight="duotone" />,
      label: "Elite & Exotic"
    },
    "heavy-haul": {
      title: "Heavy Haulage",
      subtitle: "Logistics-ready trucks & vans.",
      description: "Built for businesses. Filter by payload capacity, monitor load weights via OBD-II, and avoid low-clearance routes.",
      primaryAction: "Explore Trucks",
      features: ["Payload Filters", "Route Clearance Maps", "Engine-Hour Maintenance"],
      color: "text-blue-500",
      icon: <Truck size={48} className="text-blue-500" weight="duotone" />,
      label: "Heavy Haul (Logistics)"
    }
  };

  const currentContent = tierContent[tier];

  const tiers = [
    { id: "all", label: "All Services" },
    { id: "eco-gig", label: "Eco-Gig (Bolt/Uber)" },
    { id: "elite", label: "Elite & Exotic" },
    { id: "heavy-haul", label: "Heavy Haul (Logistics)" }
  ] as const;

  return (
    <main className="min-h-screen relative overflow-hidden bg-background font-inter antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="pwa-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/10">
                <Car size={20} weight="bold" className="text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground uppercase">CarKid<span className="text-primary">0</span></span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors">Services</Link>
              <Link href="/fleet" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors">Fleet</Link>
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors">Pricing</Link>
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors">Security</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors pr-4 border-r border-border">
              <UserCircle size={20} weight="bold" /> Sign In
            </Link>
            <Link href="/auth/login" className="btn-primary h-10 px-5">
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 pwa-container min-h-[90vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="text-left">
            <AnimatePresence mode="wait">
              <motion.div 
                key={tier}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-6">
                  <span className={`h-1.5 w-1.5 rounded-full ${currentContent.color.replace('text', 'bg')}`} />
                  {currentContent.label}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter leading-[1.1] text-foreground uppercase">
                  {tier === "all" ? (
                    <>
                      Scale Your Fleet with <span className="text-primary">Intelligence</span>.
                    </>
                  ) : (
                    <>
                      {currentContent.title}.<br />
                      <span className="text-primary">{currentContent.subtitle}</span>
                    </>
                  )}
                </h1>
                
                <p className="text-base md:text-lg text-muted mb-10 max-w-xl leading-relaxed font-bold uppercase tracking-tight opacity-80">
                  {currentContent.description}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full sm:w-64 h-12 px-5 bg-surface border border-border rounded-xl font-black uppercase tracking-widest flex items-center justify-between hover:bg-border/30 transition-all text-[11px]"
                    >
                      <span className="flex items-center gap-2">
                        <Stack size={18} weight="duotone" className="text-primary" />
                        {tierContent[tier].label}
                      </span>
                      <CaretDown size={14} weight="bold" className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute top-full mt-2 left-0 w-full bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50 p-1.5"
                        >
                          {tiers.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setTier(t.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                tier === t.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-background text-muted hover:text-foreground"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link 
                    href="/fleet"
                    className="btn-primary h-12 w-full sm:w-auto px-8"
                  >
                    {currentContent.primaryAction}
                    <CaretRight size={18} weight="bold" />
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-6">
                  {currentContent.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] font-black text-muted uppercase tracking-[0.2em]">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden lg:block relative aspect-square w-full max-w-md ml-auto">
            <div className="absolute inset-0 bg-surface border border-border rounded-[40px] shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={tier + "-icon"}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  {currentContent.icon}
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute bottom-8 left-8 right-8 p-5 bg-background border border-border rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black uppercase text-muted tracking-[0.2em]">Safe-Halt™ Telemetry</span>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75" />
                  </div>
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ["20%", "85%", "40%", "95%"] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase */}
      <section className="py-24 bg-surface/50 border-t border-border">
        <div className="pwa-container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3 text-foreground uppercase">Managed Fleet Ecosystem</h2>
            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] max-w-lg leading-relaxed">
              Explore professional-grade vehicle tiers optimized for high-utilization environments in Nigeria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {MOCK_FLEET.slice(0, 3).map((vehicle) => (
                <Link key={vehicle.id} href={`/fleet/${vehicle.id}`} className="bg-surface border border-border rounded-3xl p-5 flex flex-col group hover:border-primary/50 hover:shadow-2xl transition-all">
                   <div className="w-full h-48 bg-background border border-border rounded-2xl mb-6 overflow-hidden relative">
                      <Image 
                        src={vehicle.image} 
                        alt={vehicle.model} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        unoptimized
                      />
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/90 backdrop-blur rounded-xl text-[9px] font-black uppercase tracking-widest border border-border shadow-sm">
                        {vehicle.tier.replace('-', ' ')}
                      </div>
                   </div>
                   <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">{vehicle.brand}</p>
                   <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-auto">{vehicle.model}</h3>
                   <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
                      <p className="text-base font-black tracking-tighter uppercase">₦{vehicle.pricePerDay.toLocaleString()}<span className="text-[9px] text-muted ml-1 font-black">/DAY</span></p>
                      <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center text-muted group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
                        <CaretRight size={20} weight="bold" />
                      </div>
                   </div>
                </Link>
             ))}
          </div>
        </div>
      </section>

      <footer className="bg-background border-t border-border pt-20 pb-12">
        <div className="pwa-container grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Car size={24} weight="bold" className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">CarKid<span className="text-primary">0</span></span>
            </div>
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest leading-loose mb-10 max-w-xs opacity-70">
              Institutional-grade vehicle platform in Nigeria. Advanced IoT enforcement, multi-tier solutions, and professional asset management.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase text-foreground tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-widest text-muted">
              <li><Link href="/fleet" className="hover:text-primary transition-colors">Fleet</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase text-foreground tracking-[0.2em] mb-8">Company</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase tracking-widest text-muted">
              <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Legal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col md:items-end">
            <h4 className="text-[10px] font-black uppercase text-foreground tracking-[0.2em] mb-8">Global Infrastructure</h4>
            <div className="px-5 py-3 bg-surface border border-border rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Safe-Halt™ Engine Online</span>
            </div>
          </div>
        </div>
        
        <div className="pwa-container pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-[9px] font-black uppercase tracking-widest text-muted opacity-60">
          <p>© {new Date().getFullYear()} CarKid0 Rentals. Lagos, Nigeria.</p>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
