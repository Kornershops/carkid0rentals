"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Car, Truck, Zap, Shield, ChevronRight, ChevronDown, Layers, AlertCircle } from "lucide-react";
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

  // Content mapped to each tier
  const tierContent = {
    "all": {
      title: "Rent with Intelligence",
      subtitle: "Drive with Freedom.",
      description: "The only omni-tier vehicle platform featuring real-time Safe-Halt™ IoT enforcement. From daily gig commutes to heavy logistics.",
      primaryAction: "Explore Fleet",
      features: ["Multi-tier Vehicles", "IoT Enforcement", "Real-time Verification"],
      gradient: "from-primary to-secondary",
      icon: <Layers className="w-12 h-12 text-primary" />,
      label: "All Services"
    },
    "eco-gig": {
      title: "Drive & Earn",
      subtitle: "Smart rentals for Gig Drivers.",
      description: "Optimized for Bolt & Uber. Track your daily revenue, maximize fuel efficiency, and explore rent-to-own options.",
      primaryAction: "Find a Car",
      features: ["Daily Revenue Tracker", "High-Efficiency Vehicles", "Rent-to-Own Path"],
      gradient: "from-yellow-400 to-orange-500",
      icon: <Zap className="w-12 h-12 text-yellow-400" />,
      label: "Eco-Gig (Bolt/Uber)"
    },
    "elite": {
      title: "Premium Luxury",
      subtitle: "Exotic rentals for every occasion.",
      description: "Experience the thrill of high-performance supercars and luxury sedans. Concierge booking and 360° inspections included.",
      primaryAction: "Book Luxury",
      features: ["Concierge Delivery", "360° Video Inspection", "Insurance Waivers"],
      gradient: "from-primary to-secondary",
      icon: <Shield className="w-12 h-12 text-primary" />,
      label: "Elite & Exotic"
    },
    "heavy-haul": {
      title: "Heavy Haulage",
      subtitle: "Logistics-ready trucks & vans.",
      description: "Built for businesses. Filter by payload capacity, monitor load weights via OBD-II, and avoid low-clearance routes.",
      primaryAction: "Explore Trucks",
      features: ["Payload Filters", "Route Clearance Maps", "Engine-Hour Maintenance"],
      gradient: "from-blue-500 to-cyan-500",
      icon: <Truck className="w-12 h-12 text-blue-500" />,
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
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Dynamic Background Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tier}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          {tier === "all" && <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />}
          {tier === "eco-gig" && <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />}
          {tier === "elite" && <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />}
          {tier === "heavy-haul" && <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Car className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">CarKid0<span className="text-primary">Rentals</span></span>
          </div>
          
          {/* Global Tier Toggle Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-all ${
                tier === "all" 
                  ? "bg-primary/20 border-primary/50 text-foreground shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-pulse" 
                  : "bg-surface border-border hover:bg-border/50 text-foreground"
              }`}
            >
              {tierContent[tier].label}
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-1"
                >
                  <div className="px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
                    Select a Service
                  </div>
                  {tiers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTier(t.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        tier === t.id ? "bg-primary/10 text-primary" : "hover:bg-background text-muted hover:text-foreground"
                      }`}
                    >
                      {t.label}
                      {tier === t.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/auth/login" className="hidden md:block hover:text-primary transition-colors">Sign In</Link>
            <Link href="/auth/login" className="px-5 py-2.5 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={tier}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="text-left"
            >
              {tier === "all" ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-sm font-semibold mb-6 text-primary shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                >
                  <AlertCircle className="w-4 h-4 animate-bounce" />
                  Please select a service from the dropdown above
                </motion.div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold mb-6">
                  <span className={`flex h-2 w-2 rounded-full animate-pulse bg-gradient-to-r ${currentContent.gradient}`} />
                  {currentContent.label} View
                </div>
              )}
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                {tier === "all" ? (
                  <>
                    Rent with <span className={`bg-clip-text text-transparent bg-gradient-to-r ${currentContent.gradient}`}>Intelligence</span>.<br />
                    Drive with <span className={`bg-clip-text text-transparent bg-gradient-to-r ${currentContent.gradient}`}>Freedom</span>.
                  </>
                ) : (
                  <>
                    {currentContent.title}.<br />
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${currentContent.gradient}`}>
                      {currentContent.subtitle}
                    </span>
                  </>
                )}
              </h1>
              
              <p className="text-lg text-muted mb-10 max-w-xl">
                {currentContent.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  href={tier === "all" ? "#" : "/fleet"}
                  onClick={(e) => {
                    if (tier === "all") {
                      e.preventDefault();
                      setIsDropdownOpen(true);
                    }
                  }}
                  className={`w-full sm:w-auto px-8 py-4 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-xl bg-gradient-to-r ${currentContent.gradient} hover:opacity-90 transition-opacity`}
                >
                  {currentContent.primaryAction}
                  <ChevronRight className={`w-5 h-5 transition-transform ${tier === "all" ? "group-hover:rotate-90" : "group-hover:translate-x-1"}`} />
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto px-8 py-4 bg-surface border border-border rounded-2xl font-bold hover:bg-border/50 transition-colors flex items-center justify-center">
                  List Your Vehicle
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                {currentContent.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-medium text-muted">
                    <Shield className="w-4 h-4 opacity-50" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Visual Showcase Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tier + "-visual"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square w-full max-w-lg mx-auto"
            >
              <div className={`absolute inset-0 bg-surface border ${tier === 'all' ? 'border-primary/30 shadow-[0_0_30px_rgba(124,58,237,0.15)]' : 'border-white/5 shadow-2xl'} rounded-full flex items-center justify-center overflow-hidden glass transition-all duration-700`}>
                 <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${currentContent.gradient}`} />
                 <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 >
                    {currentContent.icon}
                 </motion.div>
                 
                 {/* Decorative elements */}
                 <div className="absolute top-1/4 right-1/4 px-3 py-1.5 bg-background/80 backdrop-blur border border-border rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    IoT Active
                 </div>
                 <div className="absolute bottom-1/4 left-1/4 px-3 py-1.5 bg-background/80 backdrop-blur border border-border rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    GPS Lock
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Vehicle Listings Section */}
      <section className="py-24 px-6 border-t border-border/50 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Available Fleet</h2>
              <p className="text-muted">
                {tier === "all" 
                  ? "Select a service above to view specific vehicles." 
                  : `Showing vehicles for ${currentContent.label}.`
                }
              </p>
            </div>
            {tier !== "all" && (
              <button className="text-primary hover:underline text-sm font-medium">View All {currentContent.label} Vehicles</button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Skeleton Loaders / Placeholder Cards */}
             {[1, 2, 3].map(i => (
                <div key={i} className={`bg-background border ${tier === 'all' ? 'border-border/50 opacity-50' : 'border-border'} rounded-3xl p-4 h-[400px] flex flex-col transition-opacity`}>
                   <div className="w-full h-48 bg-surface rounded-2xl animate-pulse mb-4" />
                   <div className="h-6 w-2/3 bg-surface rounded-lg animate-pulse mb-2" />
                   <div className="h-4 w-1/3 bg-surface rounded-lg animate-pulse mb-auto" />
                   <div className="flex justify-between items-center mt-4">
                      <div className="h-8 w-1/4 bg-surface rounded-lg animate-pulse" />
                      <div className="h-10 w-1/3 bg-primary/10 rounded-xl animate-pulse" />
                   </div>
                </div>
             ))}
          </div>
          
          {tier === "all" && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => setIsDropdownOpen(true)}
                className="px-6 py-3 bg-surface border border-primary/50 rounded-full text-primary font-medium hover:bg-primary/10 transition-colors inline-flex items-center gap-2"
              >
                Select a category to unlock the full fleet
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-background border-t border-border pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-premium-gradient rounded-lg flex items-center justify-center">
                <Car className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight">CarKid0<span className="text-primary">Rentals</span></span>
            </div>
            <p className="text-muted text-sm mb-6">
              The first omni-tier, IoT-enforced vehicle rental platform in Nigeria. Drive with freedom, rent with intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-muted">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/fleet" className="hover:text-primary transition-colors">Explore Fleet</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary transition-colors">Partner with Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-muted">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Investors</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-wider text-xs text-muted">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} CarKid0 Rentals. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Status: Fully Operational
          </div>
        </div>
      </footer>
    </main>
  );
}
