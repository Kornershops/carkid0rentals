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
  MagnifyingGlass,
  UserCircle,
  Globe,
  Database,
  LockKey
} from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/use-store";
import { Logo } from "@/components/ui/logo";

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
      title: "Logistics",
      subtitle: "Unified Infrastructure.",
      description: "The multi-tier vehicle deployment platform featuring real-time Safe-Halt™ hardware enforcement and institutional-grade fleet governance.",
      primaryAction: "Browse Ecosystem",
      features: ["Sovereign Fleet Management", "IoT Telemetry", "Identity Proofing"],
      color: "text-primary",
      icon: <Stack size={64} weight="duotone" className="text-primary" />,
      label: "Institutional Core"
    },
    "eco-gig": {
      title: "Commerce",
      subtitle: "High-Yield Commute.",
      description: "Optimized for high-utilization gig economies. Integrated revenue monitoring and real-time efficiency analytics for professional drivers.",
      primaryAction: "Initialize Fleet",
      features: ["Yield Analytics", "Fuel Optimization", "Direct Ledger Settlement"],
      color: "text-amber-500",
      icon: <Lightning size={64} weight="duotone" className="text-amber-500" />,
      label: "Eco-Gig (Commerce)"
    },
    "elite": {
      title: "Premium",
      subtitle: "Concierge Mobility.",
      description: "Private asset deployment for high-performance supercars and luxury sedans. 360° digital verification and concierge delivery as standard.",
      primaryAction: "Secure Asset",
      features: ["White-Glove Delivery", "Digital Verification", "Risk-Neutral Insurance"],
      color: "text-primary",
      icon: <ShieldCheck size={64} weight="duotone" className="text-primary" />,
      label: "Elite (Exclusive)"
    },
    "heavy-haul": {
      title: "Industrial",
      subtitle: "Heavy Haulage.",
      description: "Mission-critical logistics assets for inter-hub haulage. Payload sensing, route clearance maps, and engine-hour maintenance enforcement.",
      primaryAction: "Deploy Logistics",
      features: ["Payload Telemetry", "Geofence Enforcement", "Maintenance Staking"],
      color: "text-blue-500",
      icon: <Truck size={64} weight="duotone" className="text-blue-500" />,
      label: "Industrial (Haulage)"
    }
  };

  const currentContent = tierContent[tier];

  const tiers = [
    { id: "all", label: "Institutional Core" },
    { id: "eco-gig", label: "Eco-Gig (Commerce)" },
    { id: "elite", label: "Elite (Exclusive)" },
    { id: "heavy-haul", label: "Industrial (Haulage)" }
  ] as const;

  return (
    <main className="min-h-screen bg-background antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Precision Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border">
        <div className="pwa-container h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Logo />
            <div className="hidden lg:flex items-center gap-8">
              <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted hover:text-foreground transition-all">Ecosystem</Link>
              <Link href="/fleet" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted hover:text-foreground transition-all">The Fleet</Link>
              <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted hover:text-foreground transition-all">Governance</Link>
              <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted hover:text-foreground transition-all">Security</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted hover:text-foreground transition-all">
              <UserCircle size={20} weight="bold" /> Sign In
            </Link>
            <Link href="/auth/login" className="btn-primary h-12 px-8">
              Initialize Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Institutional Hero Section */}
      <section className="pt-48 pb-32 pwa-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="text-left">
            <AnimatePresence mode="wait">
              <motion.div 
                key={tier}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface border border-border text-[9px] font-bold uppercase tracking-[0.3em] text-muted mb-10">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentContent.color.replace('text', 'bg')} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${currentContent.color.replace('text', 'bg')}`}></span>
                  </span>
                  {currentContent.label}
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-[-0.04em] leading-[0.9] text-foreground uppercase">
                  {currentContent.title}.<br />
                  <span className="text-muted opacity-40">{currentContent.subtitle}</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted mb-12 max-w-xl leading-snug font-medium tracking-tight">
                  {currentContent.description}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full sm:w-72 h-14 px-6 bg-surface border border-border rounded-2xl font-bold uppercase tracking-widest flex items-center justify-between hover:bg-border/30 transition-all text-[11px]"
                    >
                      <span className="flex items-center gap-3">
                        <Database size={20} weight="duotone" className="text-accent" />
                        {tierContent[tier].label}
                      </span>
                      <CaretDown size={14} weight="bold" className={`transition-transform duration-500 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full mt-3 left-0 w-full bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                        >
                          {tiers.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setTier(t.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                tier === t.id ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-background text-muted hover:text-foreground"
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
                    className="btn-primary h-14 w-full sm:w-auto px-10 text-xs"
                  >
                    {currentContent.primaryAction}
                    <CaretRight size={20} weight="bold" />
                  </Link>
                </div>

                <div className="mt-16 flex flex-wrap items-center gap-10">
                  {currentContent.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-[0.3em]">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden lg:block relative aspect-square w-full max-w-xl ml-auto group">
            <div className="absolute inset-0 bg-surface border border-border rounded-[60px] shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-700 group-hover:scale-[1.02]">
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={tier + "-icon"}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {currentContent.icon}
                </motion.div>
              </AnimatePresence>
              
              {/* Telemetry Indicator */}
              <div className="absolute bottom-12 left-12 right-12 p-8 bg-background border border-border rounded-[32px] shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-foreground tracking-[0.3em]">Infrastructure Telemetry</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse delay-150" />
                  </div>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ["20%", "85%", "40%", "95%"] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="h-full bg-accent" 
                  />
                </div>
                <div className="mt-4 flex justify-between text-[8px] font-black uppercase tracking-widest text-muted">
                   <span>Buffer: 12.4GB</span>
                   <span>Sync: 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Specs Section */}
      <section className="py-32 bg-surface border-y border-border">
        <div className="pwa-container">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                 <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center">
                    <LockKey size={28} weight="duotone" className="text-accent" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Safe-Halt™ Protcol</h3>
                 <p className="text-sm font-medium text-muted leading-relaxed uppercase tracking-tight opacity-70">
                    Proprietary hardware-level engine encryption ensures assets remain within authorized geofences at all times.
                 </p>
              </div>
              <div className="space-y-6">
                 <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center">
                    <Globe size={28} weight="duotone" className="text-accent" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Multi-Hub Sync</h3>
                 <p className="text-sm font-medium text-muted leading-relaxed uppercase tracking-tight opacity-70">
                    Seamless regional asset rotation across 7 major Nigerian hubs with real-time availability updates.
                 </p>
              </div>
              <div className="space-y-6">
                 <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center">
                    <Database size={28} weight="duotone" className="text-accent" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Institutional Ledger</h3>
                 <p className="text-sm font-medium text-muted leading-relaxed uppercase tracking-tight opacity-70">
                    Every transaction and telemetry packet is logged to a high-fidelity audit trail for corporate compliance.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Fleet Showcase - Professional Grid */}
      <section className="py-32 bg-background">
        <div className="pwa-container">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] mb-4 text-foreground uppercase">Managed Ecosystem</h2>
              <p className="text-[11px] font-bold text-muted uppercase tracking-[0.4em] max-w-xl leading-loose">
                High-precision vehicle assets optimized for high-utilization environments across Nigeria.
              </p>
            </div>
            <Link href="/fleet" className="btn-secondary h-12 px-10">
               View Full Ecosystem
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {MOCK_FLEET.slice(0, 3).map((vehicle) => (
                <Link key={vehicle.id} href={`/fleet/${vehicle.id}`} className="enterprise-card p-6 flex flex-col group">
                   <div className="w-full h-56 bg-background border border-border rounded-[32px] mb-8 overflow-hidden relative">
                      <Image 
                        src={vehicle.images[0]} 
                        alt={vehicle.model} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                        unoptimized
                      />
                      <div className="absolute top-5 right-5 px-4 py-1.5 bg-background/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-border shadow-sm">
                        {vehicle.tier.replace('-', ' ')}
                      </div>
                   </div>
                   <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-2">{vehicle.brand}</p>
                   <h3 className="text-3xl font-black text-foreground uppercase tracking-[-0.04em] mb-auto">{vehicle.model}</h3>
                   <div className="pt-8 mt-8 border-t border-border flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Base Rate</p>
                        <p className="text-2xl font-black tracking-tighter uppercase">₦{vehicle.pricePerDay.toLocaleString()}<span className="text-[10px] text-muted ml-1 font-black">/DAY</span></p>
                      </div>
                      <div className="w-12 h-12 bg-background border border-border rounded-2xl flex items-center justify-center text-muted group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm">
                        <CaretRight size={22} weight="bold" />
                      </div>
                   </div>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Global Infrastructure Status Footer */}
      <footer className="bg-surface border-t border-border pt-32 pb-16">
        <div className="pwa-container grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          <div className="md:col-span-5">
            <Logo className="mb-10" />
            <p className="text-[13px] font-medium text-muted uppercase tracking-tight leading-relaxed mb-12 max-w-sm opacity-60">
              CarKid0 is the first institutional-grade vehicle infrastructure platform in Nigeria. We provide high-fidelity asset management for gig economies, luxury rentals, and heavy haulage logistics.
            </p>
            <div className="flex gap-4">
               <div className="px-6 py-3 bg-background border border-border rounded-2xl flex items-center gap-4 shadow-xl">
                 <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Safe-Halt™ Engine: Online</span>
               </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-black uppercase text-foreground tracking-[0.4em] mb-10">Infrastructure</h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-muted">
              <li><Link href="/fleet" className="hover:text-accent transition-colors">The Fleet</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Pricing Ledger</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Safety Layer</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">IoT API</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] font-black uppercase text-foreground tracking-[0.4em] mb-10">Institutional</h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-widest text-muted">
              <li><Link href="#" className="hover:text-accent transition-colors">Governance</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Compliance</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Investors</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Legal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] font-black uppercase text-foreground tracking-[0.4em] mb-10">Regional Hubs</h4>
            <div className="flex flex-wrap gap-2">
               {["LAG", "ABJ", "PHC", "KAN", "KAD", "ENU", "WAR"].map((city) => (
                 <span key={city} className="px-3 py-2 bg-background border border-border rounded-xl text-[9px] font-black uppercase tracking-widest text-muted hover:text-foreground hover:border-primary/30 transition-all cursor-default">
                    {city}
                 </span>
               ))}
            </div>
          </div>
        </div>
        
        <div className="pwa-container pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-10 text-[9px] font-bold uppercase tracking-[0.5em] text-muted opacity-40">
          <p>© {new Date().getFullYear()} CarKid0 Infrastructure Group. Built for Nigeria.</p>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Protocol</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
