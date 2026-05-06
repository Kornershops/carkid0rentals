"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { CaretRight, MapPin, ShieldCheck, Truck, Lightning, Crown, Globe, Users, Trophy, List, X } from "@phosphor-icons/react";
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
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } } };

export default function Home() {
  const { hub, setHub, country, role } = useStore();
  const [pickupDate, setPickupDate] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on resize
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
    <main className="min-h-screen selection:bg-indigo-500/30 overflow-x-hidden">

      {/* --- Navigation --- */}
      <nav className="glass fixed top-0 w-full z-[100] border-b border-white/5 h-20" aria-label="Main Navigation">
        <div className="container-wide h-full flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo />
            <div className="hidden md:block w-px h-6 bg-white/10" />
            <div className="hidden sm:block">
              <RegionSelector />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <RoleSelector />
            <Link href="/auth/login" className="btn btn-outline h-11 px-6" aria-label="Sign in to your account">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-12 h-12 flex items-center justify-center glass rounded-xl text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] glass bg-[#050505]/95 backdrop-blur-2xl lg:hidden pt-32 p-8"
          >
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Regional Hub</label>
                <RegionSelector />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Active Role</label>
                <RoleSelector />
              </div>
              <div className="pt-8 border-t border-white/10">
                <Link 
                  href="/auth/login" 
                  className="btn btn-accent w-full h-14"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Access Platform
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section className="relative min-h-[100vh] flex items-center pt-20" aria-labelledby="hero-heading">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover kenburns brightness-[0.3] md:brightness-[0.4]"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
        </div>

        <div className="container-wide relative z-10 pt-12 pb-20">
          <motion.div 
            variants={stagger} 
            initial="hidden" 
            animate="visible" 
            className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center"
          >
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div variants={fadeUp} className="badge badge-accent mb-6 md:mb-8">
                <Globe size={14} className="animate-pulse" />
                <span>Pan-African Fleet Network</span>
              </motion.div>

              <motion.h1 
                id="hero-heading"
                variants={fadeUp} 
                className="text-[clamp(42px,10vw,88px)] leading-[0.9] font-black tracking-tighter mb-8 text-gradient"
              >
                Institutional<br className="hidden md:block" /> 
                <span className="text-indigo-500">Fleet Access.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                High-performance EV rentals, executive luxury, and specialized logistics for the modern African enterprise.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-indigo-400">
                    <Trophy size={20} weight="duotone" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">#1 Rated</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fleet Ops</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={20} weight="duotone" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">Standardized</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Security</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Widget */}
            <motion.div variants={fadeUp} className="glass rounded-[2rem] md:rounded-[32px] p-6 md:p-8 border-white/10 shadow-2xl relative overflow-hidden max-w-xl mx-auto w-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] -mr-16 -mt-16" />
              
              <h2 className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
                <Lightning size={24} weight="duotone" className="text-indigo-500" />
                Quick Reserve
              </h2>

              <div className="space-y-6">
                <div role="group" aria-labelledby="label-location">
                  <label id="label-location" className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Pick-up Location</label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 transition-all focus-within:border-indigo-500/50 focus-within:bg-white/10">
                    <MapPin size={20} className="text-indigo-500" />
                    <select 
                      value={hub} 
                      onChange={e => setHub(e.target.value as any)}
                      className="w-full text-sm font-bold focus:outline-none bg-transparent cursor-pointer"
                      aria-label="Select pick-up hub"
                    >
                      {hubsInCountry.map(h => <option key={h} value={h} className="bg-slate-900 text-white">{h}</option>)}
                    </select>
                  </div>
                </div>

                <EnhancedDatePicker 
                  value={pickupDate}
                  onChange={setPickupDate}
                  label="Pick-up Schedule"
                />

                <Link 
                  href="/fleet" 
                  className="btn btn-accent w-full h-14 md:h-16 text-base tracking-tight mt-4"
                  aria-label="Find available vehicles for rent"
                >
                  Explore Available Fleet
                  <CaretRight size={20} weight="bold" />
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-indigo-400 font-bold text-lg md:text-xl">500+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Units</div>
                </div>
                <div>
                  <div className="text-indigo-400 font-bold text-lg md:text-xl">12k+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Active</div>
                </div>
                <div>
                  <div className="text-indigo-400 font-bold text-lg md:text-xl">24/7</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Ops</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Purpose Grid --- */}
      <section className="py-24 md:py-32 bg-white/[0.01]" aria-labelledby="purpose-heading">
        <div className="container-wide">
          <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
            <h2 id="purpose-heading" className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Mission Critical Fleet</h2>
            <p className="text-slate-400 text-base md:text-lg">Specialized vehicle infrastructure for the modern African terrain and economy.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <Lightning size={32} weight="duotone" />, color: 'text-emerald-400', title: "Eco-Gig EVs", desc: "Optimized for maximum earnings. Zero emissions, zero fuel spend." },
              { icon: <Crown size={32} weight="duotone" />, color: 'text-indigo-400', title: "Elite Executive", desc: "Discreet luxury and armored variants for high-profile operations." },
              { icon: <Truck size={32} weight="duotone" />, color: 'text-amber-400', title: "Industrial Ops", desc: "Heavy logistics and security escort units with mission comms." },
            ].map((tier, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="glass rounded-[2.5rem] p-10 border-white/5 relative group transition-all duration-500"
              >
                <div className={`mb-8 ${tier.color} transform transition-transform group-hover:scale-110 duration-500`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{tier.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">{tier.desc}</p>
                <Link href="/fleet" className="mt-8 flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:gap-3 transition-all" aria-label={`View ${tier.title} fleet`}>
                  Explore Tier <CaretRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Fleet Gallery --- */}
      <section className="py-24 md:py-32" aria-labelledby="fleet-heading">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
            <div className="text-center md:text-left">
              <div className="section-divider mb-6 mx-auto md:mx-0" />
              <h2 id="fleet-heading" className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Available in {hub}</h2>
              <p className="text-slate-400 text-lg">Personalized fleet for <span className="text-white font-bold">{role}</span> profile.</p>
            </div>
            <Link href="/fleet" className="btn btn-outline h-14 px-10 w-full md:w-auto" aria-label="View our full vehicle fleet">
              Browse Full Catalog
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

      {/* --- Footer --- */}
      <footer className="pt-24 pb-12 border-t border-white/5 bg-black/40" role="contentinfo">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-20">
            <div className="sm:col-span-2">
              <Logo className="mb-8" />
              <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
                Africa's infrastructure layer for standardized mobility. Delivering fleet excellence for the gig economy and executive transport.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-indigo-600/20 transition-all cursor-pointer">
                  <Users size={22} weight="duotone" className="text-indigo-400" />
                </div>
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-indigo-600/20 transition-all cursor-pointer">
                  <Globe size={22} weight="duotone" className="text-indigo-400" />
                </div>
              </div>
            </div>
            
            {[
              { title: "Fleet Ops", links: ["Electric Units", "Security Escort", "Logistics Hub", "Premium Shield"] },
              { title: "Network", links: ["Hub Locations", "Partner Portal", "Fleet Health", "Coverage Map"] },
              { title: "Legal", links: ["Rental Terms", "Insurance Policy", "Safety Logic", "Privacy Hub"] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} CarKid0 Rentals. Institutional Mobility Engine.
            </p>
            <div className="flex gap-8 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">Compliance</Link>
              <Link href="#" className="hover:text-white transition-colors">Governance</Link>
              <Link href="#" className="hover:text-white transition-colors">Fleet API</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
