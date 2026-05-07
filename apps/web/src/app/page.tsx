"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as any } } };

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
    <main className="min-h-screen bg-white selection:bg-blue-600/10 font-sans text-[#1D1D1F]">
 
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-[100] h-14 bg-white/80 backdrop-blur-xl border-b border-black/[0.05]" aria-label="Main Navigation">
        <div className="container-wide h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden lg:flex items-center gap-4">
              <RegionSelector />
              <RoleSelector />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:flex btn bg-blue-600 text-white hover:bg-blue-700 h-8 px-4 text-[12px] font-bold rounded-full">
              Sign In
            </Link>
            <button 
              className="lg:hidden w-8 h-8 flex items-center justify-center text-black/60"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
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
            className="fixed inset-0 z-[90] bg-white lg:hidden pt-20 p-6 flex flex-col gap-8"
          >
            <RegionSelector />
            <RoleSelector />
            <Link href="/auth/login" className="btn bg-blue-600 text-white h-12 w-full font-bold rounded-xl">
              Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero --- */}
      <section className="pt-32 pb-16 bg-white overflow-hidden">
        <div className="container-wide">
          <motion.div 
            variants={stagger} initial="hidden" animate="visible"
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.div variants={fadeUp} className="text-blue-600 font-bold text-[12px] tracking-tight mb-4 uppercase">
                Institutional Fleet Infrastructure
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-[clamp(40px,6vw,64px)] font-semibold leading-[1.1] tracking-tight mb-8">
                The standard for <br /> <span className="text-neutral-400">mobility in Africa.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-neutral-500 text-lg mb-10 max-w-lg font-medium leading-relaxed">
                Premium vehicle logistics and rental infrastructure for enterprises, gig-drivers, and elite travelers.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href="/fleet" className="btn bg-black text-white px-8 h-12 rounded-xl font-bold">
                  Browse Registry
                </Link>
                <Link href="/tech" className="btn bg-neutral-50 text-black px-8 h-12 rounded-xl font-bold">
                  Our Technology
                </Link>
              </motion.div>
            </div>

            {/* Reserve Widget */}
            <motion.div variants={fadeUp} className="bg-neutral-50 rounded-3xl p-8 border border-black/[0.03]">
              <h2 className="text-xl font-bold mb-8 tracking-tight">Reserve Unit</h2>
              <div className="space-y-6">
                <RegionSelector />
                <EnhancedDatePicker value={pickupDate} onChange={setPickupDate} label="Pick-up Schedule" />
                <Link href="/fleet" className="btn bg-blue-600 text-white w-full h-14 rounded-2xl font-bold">
                  View Available Fleet
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Catalog --- */}
      <section className="py-24 bg-white border-t border-black/[0.03]">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">Available in {hub}</h2>
              <p className="text-neutral-400 font-medium">Standardized fleet for <span className="text-blue-600">{role}</span> profile.</p>
            </div>
            <Link href="/fleet" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View All <CaretRight weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} duration="24 Hours" currency={currency} index={i} activeHub={hub} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Bento Grid (Mission Critical) --- */}
      <section className="py-24 bg-[#F5F5F7]">
        <div className="container-wide">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Mission Critical <span className="text-neutral-400">Fleet.</span></h2>
            <p className="text-neutral-500 max-w-xl font-medium">Standardized vehicle solutions for Africa's most demanding operations.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 auto-rows-[340px]">
            <motion.div whileHover={{ y: -5 }} className="lg:col-span-8 lg:row-span-2 bg-white rounded-3xl p-12 flex flex-col justify-end border border-black/[0.03] shadow-sm">
              <Crown size={48} weight="bold" className="text-blue-600 mb-8" />
              <h3 className="text-2xl font-semibold mb-4">Elite Executive</h3>
              <p className="text-neutral-500 max-w-md mb-8">Discreet luxury and armored variants for high-profile institutional operations.</p>
              <Link href="/fleet" className="btn bg-black text-white px-8 h-10 rounded-full font-bold w-fit">Registry</Link>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="lg:col-span-4 bg-[#E8E8ED] rounded-3xl p-10 flex flex-col justify-center border border-black/[0.02]">
              <Lightning size={32} weight="fill" className="text-emerald-600 mb-6" />
              <h3 className="text-xl font-semibold mb-2">Eco-Gig EVs</h3>
              <p className="text-neutral-500 text-sm">Maximum earnings. Zero fuel spend. 100% uptime.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="lg:col-span-4 bg-neutral-900 rounded-3xl p-10 flex flex-col justify-center">
              <Truck size={32} weight="bold" className="text-white/40 mb-6" />
              <h3 className="text-xl font-semibold mb-2 text-white">Industrial Ops</h3>
              <p className="text-neutral-400 text-sm">Heavy logistics and mission-grade security escort units.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Proper Footer --- */}
      <footer className="pt-24 pb-16 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-1">
              <Logo className="mb-8" />
              <p className="text-[14px] text-neutral-500 leading-relaxed max-w-xs">
                Standardized mobility layer for Africa. Providing institutional fleet infrastructure for the modern economy.
              </p>
            </div>
            
            {[
              { title: "FLEET", links: ["Elite Registry", "Eco-Gig EV", "Industrial Ops", "Security Escort"] },
              { title: "NETWORK", links: ["Hub Locations", "Partner Hub", "Fleet Status", "API Docs"] },
              { title: "GOVERNANCE", links: ["Privacy Policy", "Rental Terms", "Safety Standard", "Insurance"] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-8">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-[14px] text-neutral-500 hover:text-black transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-black/[0.05] flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} CarKid0 Rentals. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              <Link href="#" className="hover:text-black transition-colors">COMPLIANCE</Link>
              <Link href="#" className="hover:text-black transition-colors">SUPPORT</Link>
              <Link href="#" className="hover:text-black transition-colors">GITHUB</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
