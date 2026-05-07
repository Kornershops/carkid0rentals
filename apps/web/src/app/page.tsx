"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { CaretRight, MapPin, Truck, Lightning, Crown, Globe, Users, List, X } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useStore } from "@/store/use-store";
import { Logo } from "@/components/ui/logo";
import { formatPrice, getCurrencyForCountry } from "@/lib/currency";
import { RegionSelector } from "@/components/region-selector";
import { RoleSelector } from "@/components/role-selector";
import { HUB_DATA } from "@/lib/constants";
import { EnhancedDatePicker } from "@/components/enhanced-date-picker";
import { VehicleCard } from "@/components/vehicle-card";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any } } };

export default function Home() {
  const { hub, setHub, country, role } = useStore();
  const [pickupDate, setPickupDate] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hubsInCountry = HUB_DATA[country] || [];
  
  const featured = MOCK_FLEET.filter(v => {
    const isLocal = v.hubs.includes(hub);
    if (!isLocal) return false;
    if (role === 'driver') return v.tier === 'eco-gig';
    if (role === 'logistics') return v.tier === 'heavy-haul';
    return v.tier === 'elite' || v.tier === 'eco-gig'; 
  }).slice(0, 6);

  const currency = getCurrencyForCountry(country);

  return (
    <main className="min-h-screen bg-white selection:bg-blue-600/10 font-sans">
 
      {/* --- Navigation --- */}
      <nav className="glass fixed top-0 w-full z-[100] h-16 transition-all border-b border-black/5" aria-label="Main Navigation">
        <div className="container-wide h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <div className="hidden lg:block w-px h-5 bg-black/5" />
            <div className="hidden sm:block">
              <RegionSelector />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-8">
            <RoleSelector />
            <Link href="/auth/login" className="btn btn-accent h-9 px-6 text-[13px] font-bold" aria-label="Sign in to your account">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-black/60 hover:text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[90] bg-white lg:hidden pt-24 p-6"
          >
            <div className="space-y-6">
              <div className="grid gap-6">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 mb-3 block uppercase tracking-wider">Active Location</label>
                  <RegionSelector />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 mb-3 block uppercase tracking-wider">Profile Mode</label>
                  <RoleSelector />
                </div>
              </div>
              <div className="pt-6 border-t border-neutral-100">
                <Link 
                  href="/auth/login" 
                  className="btn btn-accent w-full h-12 text-base font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-16 bg-[#FBFBFD]" aria-labelledby="hero-heading">
        <div className="container-wide">
          <motion.div 
            variants={stagger} 
            initial="hidden" 
            animate="visible" 
            className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center"
          >
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div 
                variants={fadeUp} 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] mb-8 tracking-tight"
              >
                <Globe size={14} weight="bold" />
                <span>Pan-African Mobility Architecture</span>
              </motion.div>

              <motion.h1 
                id="hero-heading"
                variants={fadeUp} 
                className="text-[clamp(44px,8vw,80px)] leading-[1.05] font-semibold tracking-tight mb-8 text-black"
              >
                Premium Fleet <br /> 
                <span className="text-blue-600">On Demand.</span>
              </motion.h1>

              <motion.p 
                variants={fadeUp} 
                className="text-neutral-500 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-medium"
              >
                Institutional-grade vehicle infrastructure for Africa's leading enterprises and modern professionals.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/fleet" className="btn btn-accent h-12 px-10 text-[14px] font-bold">
                  Browse Fleet
                </Link>
                <Link href="/tech" className="btn btn-ghost h-12 px-10 text-[14px] font-bold group">
                  How it Works <CaretRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Quick Reserve Widget */}
            <motion.div variants={fadeUp} className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl border border-black/5 relative">
              <h2 className="text-2xl font-semibold mb-10 text-black tracking-tight">Reserve Unit</h2>

              <div className="space-y-8">
                <RegionSelector />
                <EnhancedDatePicker 
                  value={pickupDate}
                  onChange={setPickupDate}
                  label="Pick-up Schedule"
                />

                <Link 
                  href="/fleet" 
                  className="btn btn-accent w-full h-14 text-[15px] font-bold"
                >
                  View Available Vehicles
                </Link>
              </div>

              <div className="mt-10 pt-10 border-t border-black/5 flex justify-between text-center">
                <div>
                  <div className="text-black font-bold text-xl">500+</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Units</div>
                </div>
                <div>
                  <div className="text-black font-bold text-xl">24/7</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Uptime</div>
                </div>
                <div>
                  <div className="text-black font-bold text-xl">100%</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Secured</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Catalog Section --- */}
      <section className="py-24 md:py-32 bg-white" aria-labelledby="fleet-heading">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 id="fleet-heading" className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-black">
                Available in {hub}
              </h2>
              <p className="text-neutral-500 text-lg font-medium leading-relaxed">
                Personalized fleet recommendations for your <span className="text-blue-600 font-bold">{role}</span> profile.
              </p>
            </div>
            <Link href="/fleet" className="btn btn-ghost h-12 px-8 text-blue-600 font-bold group">
              Browse Catalog <CaretRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {featured.map((v, i) => (
              <VehicleCard 
                key={v.id} 
                vehicle={v} 
                duration="24 Hours" 
                currency={currency} 
                index={i} 
                activeHub={hub} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- Purpose Grid --- */}
      <section className="py-24 md:py-32 bg-[#F5F5F7]" aria-labelledby="purpose-heading">
        <div className="container-wide">
          <div className="max-w-3xl mb-20">
            <h2 id="purpose-heading" className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-black">
              Standardized <br /> <span className="text-neutral-400">Mobility Layer.</span>
            </h2>
            <p className="text-neutral-500 text-lg md:text-xl font-medium leading-relaxed">
              Specialized vehicle infrastructure engineered for high-growth African enterprises.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 auto-rows-[400px]">
            {/* Elite Executive */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-8 lg:row-span-2 bg-white rounded-[48px] p-12 md:p-16 relative group overflow-hidden flex flex-col justify-end shadow-sm border border-black/5"
            >
              <div className="relative z-10">
                <div className="mb-10 text-blue-600">
                  <Crown size={64} weight="bold" />
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-black tracking-tight">Elite Executive</h3>
                <p className="text-neutral-500 leading-relaxed text-lg max-w-lg mb-10 font-medium">
                  Discreet luxury and armored variants for high-profile operations.
                </p>
                <Link href="/fleet" className="btn btn-accent px-10 h-12 w-fit">
                  Explore Elite Registry
                </Link>
              </div>
            </motion.div>

            {/* Eco-Gig */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-4 lg:row-span-1 bg-emerald-50 rounded-[40px] p-10 relative group overflow-hidden flex flex-col justify-center border border-emerald-100"
            >
              <div className="mb-8 text-emerald-600">
                <Lightning size={40} weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-emerald-900 tracking-tight">Eco-Gig EVs</h3>
              <p className="text-emerald-700/70 leading-relaxed text-sm font-medium">
                Maximum uptime. Zero emissions. Optimized for drivers.
              </p>
            </motion.div>

            {/* Industrial */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-4 lg:row-span-1 bg-black rounded-[40px] p-10 relative group overflow-hidden flex flex-col justify-center"
            >
              <div className="mb-8 text-white/40">
                <Truck size={40} weight="bold" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">Industrial Ops</h3>
              <p className="text-neutral-400 leading-relaxed text-sm font-medium">
                Heavy-duty logistics and security escort units.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="pt-32 pb-16 bg-white" role="contentinfo">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="lg:col-span-1">
              <Logo className="mb-10" />
              <p className="text-neutral-500 leading-relaxed text-base mb-10 font-medium">
                Delivering institutional mobility across Africa's strategic markets.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors">
                  <Users size={18} className="text-neutral-400" />
                </div>
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors">
                  <Globe size={18} className="text-neutral-400" />
                </div>
              </div>
            </div>
            
            {[
              { title: "Fleet Ops", links: ["Electric Units", "Security Escort", "Logistics Hub", "Premium Shield"] },
              { title: "Network", links: ["Hub Locations", "Partner Portal", "Fleet Health", "Coverage Map"] },
              { title: "Legal", links: ["Rental Terms", "Insurance Policy", "Safety Logic", "Privacy Hub"] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[11px] font-bold text-neutral-400 mb-8 uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-[14px] text-neutral-500 hover:text-blue-600 transition-colors font-medium">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} CarKid0. Institutional Mobility Engine.
            </p>
            <div className="flex flex-wrap justify-center gap-10 text-[11px] font-medium uppercase tracking-widest text-neutral-400">
              <Link href="#" className="hover:text-black transition-colors">Compliance</Link>
              <Link href="#" className="hover:text-black transition-colors">Fleet API</Link>
              <Link href="#" className="hover:text-black transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
