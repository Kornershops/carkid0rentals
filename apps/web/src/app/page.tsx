"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { CaretRight, MapPin, Truck, Lightning, Crown, Globe, List, X } from "@phosphor-icons/react";
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
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any } } };

export default function Home() {
  const { hub, country, role } = useStore();
  const [pickupDate, setPickupDate] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const featured = MOCK_FLEET.filter(v => {
    const isLocal = v.hubs.includes(hub);
    if (!isLocal) return false;
    if (role === 'driver') return v.tier === 'eco-gig';
    if (role === 'logistics') return v.tier === 'heavy-haul';
    return v.tier === 'elite' || v.tier === 'eco-gig'; 
  }).slice(0, 6);

  const currency = getCurrencyForCountry(country);

  return (
    <main className="min-h-screen bg-white selection:bg-blue-600/10 font-sans text-[#1D1D1F]">
 
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-[100] h-16 bg-white/80 backdrop-blur-xl border-b border-black/[0.05]" aria-label="Main Navigation">
        <div className="container-wide h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden lg:flex items-center gap-4">
              <RegionSelector />
              <RoleSelector />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:flex btn bg-blue-600 text-white hover:bg-blue-700 h-10 px-6 text-[13px] font-bold rounded-full transition-all hover:shadow-lg hover:shadow-blue-600/20">
              Sign In
            </Link>
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center text-black/60 transition-colors hover:text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[90] bg-white lg:hidden pt-24 p-6 flex flex-col gap-8"
          >
            <RegionSelector />
            <RoleSelector />
            <Link href="/auth/login" className="btn bg-blue-600 text-white h-14 w-full font-bold rounded-2xl">
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden bg-white">
        {/* Visual Hero Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-white/0 via-white/80 to-white z-10" />
          <Image 
            src="/fleet/cars/mercedes-gle-coupe/exterior-front.png" 
            alt="Premium Fleet"
            fill
            className="object-contain object-right transform translate-x-20 scale-110 opacity-90"
            priority
          />
        </div>

        <div className="container-wide relative z-20">
          <motion.div 
            variants={stagger} initial="hidden" animate="visible"
            className="grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 items-center"
          >
            <div className="text-center lg:text-left">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[12px] mb-8 tracking-tight">
                <Globe size={16} weight="bold" />
                <span>Pan-African Institutional Mobility Layer</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-[clamp(48px,9vw,96px)] font-semibold leading-[1.02] tracking-tighter mb-10 text-black">
                Premium Fleet. <br /> 
                <span className="text-blue-600">Pure Intelligence.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-neutral-500 text-xl lg:text-2xl mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Standardized vehicle infrastructure for high-growth enterprises and modern professionals across the continent.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link href="/fleet" className="btn bg-black text-white px-10 h-14 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-black/20 transition-all">
                  Browse Registry
                </Link>
                <Link href="/tech" className="btn bg-neutral-50 text-black px-10 h-14 rounded-2xl font-bold text-lg hover:bg-neutral-100 transition-all">
                  How it Works
                </Link>
              </motion.div>
            </div>

            {/* Quick Reserve Widget */}
            <motion.div variants={fadeUp} className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl border border-black/[0.03] backdrop-blur-sm">
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-2 tracking-tight text-black">Reserve Unit</h2>
                <p className="text-neutral-400 text-sm font-medium">Select your mission parameters.</p>
              </div>

              <div className="space-y-8">
                <RegionSelector />
                <EnhancedDatePicker value={pickupDate} onChange={setPickupDate} label="Pick-up Schedule" />
                <Link href="/fleet" className="btn bg-blue-600 text-white w-full h-16 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                  Check Availability
                </Link>
              </div>

              <div className="mt-12 pt-10 border-t border-black/[0.05] grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-black font-bold text-2xl tracking-tighter">500+</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Units</div>
                </div>
                <div>
                  <div className="text-black font-bold text-2xl tracking-tighter">100%</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Secured</div>
                </div>
                <div>
                  <div className="text-black font-bold text-2xl tracking-tighter">24/7</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Support</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Catalog --- */}
      <section className="py-24 md:py-32 bg-[#FBFBFD] border-y border-black/[0.03]">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-black">Available in {hub}</h2>
              <p className="text-neutral-400 text-xl font-medium leading-relaxed">
                Personalized for your <span className="text-blue-600 font-bold">{role}</span> profile.
              </p>
            </div>
            <Link href="/fleet" className="btn text-blue-600 font-bold flex items-center gap-1 hover:gap-3 transition-all text-lg">
              View All <CaretRight weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {featured.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} duration="24 Hours" currency={currency} index={i} activeHub={hub} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Mission Critical Bento --- */}
      <section className="py-24 md:py-40 bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mb-24">
            <h2 className="text-4xl md:text-7xl font-semibold tracking-tighter mb-8 text-black">
              Standardized <br /> <span className="text-neutral-300">Infrastructure.</span>
            </h2>
            <p className="text-neutral-500 text-xl md:text-2xl font-medium leading-relaxed">
              Specialized vehicle solutions engineered for the continent's high-stakes enterprise economy.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 auto-rows-[420px]">
            {/* Elite */}
            <motion.div whileHover={{ y: -5 }} className="lg:col-span-8 lg:row-span-2 bg-[#F5F5F7] rounded-[40px] p-12 md:p-16 flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 text-[180px] font-bold text-black/[0.02] leading-none select-none">01</div>
              <div className="relative z-10">
                <div className="mb-12 text-blue-600">
                  <Crown size={72} weight="bold" />
                </div>
                <h3 className="text-4xl md:text-5xl font-semibold mb-6 text-black tracking-tight">Elite Executive</h3>
                <p className="text-neutral-500 text-xl max-w-lg mb-12 font-medium">
                  Discreet luxury and armored variants for high-profile institutional operations.
                </p>
                <Link href="/fleet" className="btn bg-black text-white px-12 h-14 rounded-2xl font-bold text-lg hover:shadow-xl transition-all">
                  Registry
                </Link>
              </div>
            </motion.div>

            {/* Eco-Gig */}
            <motion.div whileHover={{ y: -5 }} className="lg:col-span-4 lg:row-span-1 bg-emerald-50 rounded-[32px] p-12 flex flex-col justify-center border border-emerald-100/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 text-7xl font-bold text-emerald-600/[0.05] select-none">02</div>
              <div className="mb-8 text-emerald-600">
                <Lightning size={44} weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-black">Eco-Gig EVs</h3>
              <p className="text-neutral-500 font-medium">Maximum earnings. Zero emissions. 100% uptime.</p>
            </motion.div>

            {/* Industrial */}
            <motion.div whileHover={{ y: -5 }} className="lg:col-span-4 lg:row-span-1 bg-neutral-900 rounded-[32px] p-12 flex flex-col justify-center overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 text-7xl font-bold text-white/[0.02] select-none">03</div>
              <div className="mb-8 text-white/40">
                <Truck size={44} weight="bold" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Industrial Ops</h3>
              <p className="text-neutral-400 font-medium text-lg">Heavy logistics and mission-grade escort units.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="pt-32 pb-20 bg-[#FBFBFD] border-t border-black/[0.05]">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-24">
            <div className="lg:col-span-1">
              <Logo className="mb-10 scale-110 origin-left" />
              <p className="text-neutral-500 text-lg leading-relaxed font-medium">
                Africa's primary layer for institutional fleet management and mobility infrastructure.
              </p>
            </div>
            
            {[
              { title: "FLEET OPS", links: ["Elite Registry", "Eco-Gig EV", "Industrial Ops", "Security Escort"] },
              { title: "NETWORK", links: ["Hub Locations", "Partner Hub", "Fleet Status", "API Docs"] },
              { title: "GOVERNANCE", links: ["Privacy Policy", "Rental Terms", "Safety Standard", "Insurance"] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-10">{col.title}</h4>
                <ul className="space-y-5">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-[15px] text-neutral-500 hover:text-black transition-colors font-medium">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-black/[0.05] flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-[12px] text-neutral-400 font-bold uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} CarKid0 Rentals. Institutional Mobility Engine.
            </p>
            <div className="flex flex-wrap justify-center gap-10 text-[12px] font-bold uppercase tracking-widest text-neutral-400">
              <Link href="#" className="hover:text-black transition-colors">Compliance</Link>
              <Link href="#" className="hover:text-black transition-colors">Support</Link>
              <Link href="#" className="hover:text-black transition-colors">Fleet API</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
