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
    <main className="min-h-screen bg-white selection:bg-blue-500/10 overflow-x-hidden font-sans">
 
       {/* --- Navigation --- */}
       <nav className="glass fixed top-0 w-full z-[100] h-16" aria-label="Main Navigation">
         <div className="container-wide h-full flex items-center justify-between">
           <div className="flex items-center gap-6">
             <Logo />
             <div className="hidden md:block w-px h-5 bg-black/10" />
             <div className="hidden sm:block">
               <RegionSelector />
             </div>
           </div>
 
           {/* Desktop Actions */}
           <div className="hidden lg:flex items-center gap-8">
             <RoleSelector />
             <Link href="/auth/login" className="btn btn-accent h-10 px-6 font-semibold" aria-label="Sign in to your account">
               Sign In
             </Link>
           </div>
 
           {/* Mobile Menu Toggle */}
           <button 
             className="lg:hidden w-10 h-10 flex items-center justify-center text-black"
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
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="fixed inset-0 z-[90] bg-white lg:hidden pt-24 p-6"
           >
             <div className="space-y-6">
               <div>
                 <label className="text-xs font-semibold text-neutral-400 mb-3 block uppercase tracking-tight">Location</label>
                 <RegionSelector />
               </div>
               <div>
                 <label className="text-xs font-semibold text-neutral-400 mb-3 block uppercase tracking-tight">Account Type</label>
                 <RoleSelector />
               </div>
               <div className="pt-6 border-t border-neutral-100">
                 <Link 
                   href="/auth/login" 
                   className="btn btn-accent w-full h-12 text-base font-semibold"
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
       <section className="relative min-h-[85vh] flex items-center pt-16 bg-white overflow-hidden" aria-labelledby="hero-heading">
         <div className="container-wide relative z-10 pt-12 pb-20">
           <motion.div 
             variants={stagger} 
             initial="hidden" 
             animate="visible" 
             className="grid lg:grid-cols-[1fr_0.9fr] gap-16 lg:gap-24 items-center"
           >
             {/* Left Content */}
             <div className="text-center lg:text-left">
               <motion.div 
                 variants={fadeUp} 
                 className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-[11px] mb-8"
               >
                 <Globe size={14} />
                 <span>Pan-African Fleet Excellence</span>
               </motion.div>
 
               <motion.h1 
                 id="hero-heading"
                 variants={fadeUp} 
                 className="text-[clamp(42px,9vw,80px)] leading-[1.05] font-semibold tracking-tight mb-8 text-black"
               >
                 Institutional<br /> 
                 <span className="text-blue-600">Mobility Layer.</span>
               </motion.h1>
 
               <motion.p 
                 variants={fadeUp} 
                 className="text-neutral-500 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-medium"
               >
                 Premium vehicle infrastructure for the modern African terrain. Effortless, standardized, and secure.
               </motion.p>
 
               <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                 <Link href="/fleet" className="btn btn-accent h-12 px-10 text-base font-semibold">
                   Browse Fleet
                 </Link>
                 <Link href="/tech" className="btn btn-ghost h-12 px-10 text-base font-semibold">
                   Learn More <CaretRight size={18} />
                 </Link>
               </motion.div>
             </div>
 
             {/* Booking Widget */}
             <motion.div variants={fadeUp} className="bg-[#FBFBFD] rounded-[40px] p-8 md:p-10 shadow-lg relative overflow-hidden max-w-xl mx-auto w-full border border-black/[0.03]">
               <h2 className="text-2xl font-semibold mb-10 flex items-center gap-2 text-black tracking-tight">
                 Reserve
               </h2>
 
               <div className="space-y-8">
                 <div>
                   <label className="text-[11px] font-semibold text-neutral-400 mb-3 block uppercase tracking-tight">Pick-up Location</label>
                   <div className="flex items-center gap-3 bg-white border border-black/[0.05] rounded-2xl px-5 py-4 shadow-sm">
                     <MapPin size={20} className="text-blue-600" />
                     <select 
                       value={hub} 
                       onChange={e => setHub(e.target.value as any)}
                       className="w-full text-base font-medium focus:outline-none bg-transparent cursor-pointer text-black"
                     >
                       {hubsInCountry.map(h => <option key={h} value={h}>{h}</option>)}
                     </select>
                   </div>
                 </div>
 
                 <EnhancedDatePicker 
                   value={pickupDate}
                   onChange={setPickupDate}
                   label="Schedule"
                 />
 
                 <Link 
                   href="/fleet" 
                   className="btn btn-accent w-full h-14 text-base font-semibold mt-4"
                 >
                   Search Available Units
                 </Link>
               </div>
 
               <div className="mt-10 pt-10 border-t border-black/[0.05] grid grid-cols-3 gap-4 text-center">
                 <div>
                   <div className="text-black font-semibold text-xl">500+</div>
                   <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">Units</div>
                 </div>
                 <div>
                   <div className="text-black font-semibold text-xl">12k+</div>
                   <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">Active</div>
                 </div>
                 <div>
                   <div className="text-black font-semibold text-xl">24/7</div>
                   <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">Support</div>
                 </div>
               </div>
             </motion.div>
           </motion.div>
         </div>
       </section>
 
       {/* --- Purpose Grid --- */}
       <section className="py-24 md:py-32 bg-white" aria-labelledby="purpose-heading">
         <div className="container-wide">
           <div className="max-w-3xl mb-20">
             <h2 id="purpose-heading" className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-black">
               Mission Critical <span className="text-neutral-400">Fleet.</span>
             </h2>
             <p className="text-neutral-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
               Specialized vehicle infrastructure engineered for the modern African enterprise economy.
             </p>
           </div>
 
           <div className="grid lg:grid-cols-12 gap-8 auto-rows-[360px]">
             {/* Elite Executive */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="lg:col-span-8 lg:row-span-2 bg-[#F5F5F7] rounded-[48px] p-12 md:p-16 relative group overflow-hidden flex flex-col justify-end transition-all"
             >
               <div className="relative z-10">
                 <div className="mb-10 text-blue-600">
                   <Crown size={64} />
                 </div>
                 <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-black tracking-tight">Elite Executive</h3>
                 <p className="text-neutral-500 leading-relaxed text-lg max-w-lg mb-10 font-medium">
                   Discreet luxury and armored variants for high-profile operations. Standardized security meets unparalleled comfort.
                 </p>
                 <Link href="/fleet" className="btn btn-accent px-10 h-12 w-fit">
                   Explore Registry
                 </Link>
               </div>
             </motion.div>
 
             {/* Eco-Gig EVs */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="lg:col-span-4 lg:row-span-1 bg-[#E8E8ED] rounded-[40px] p-10 relative group overflow-hidden transition-all"
             >
               <div className="mb-8 text-emerald-600">
                 <Lightning size={40} weight="fill" />
               </div>
               <h3 className="text-2xl font-semibold mb-3 text-black tracking-tight">Eco-Gig EVs</h3>
               <p className="text-neutral-500 leading-relaxed text-sm font-medium">
                 Maximum earnings. Zero emissions, zero fuel spend, 100% uptime.
               </p>
             </motion.div>
 
             {/* Industrial Ops */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="lg:col-span-4 lg:row-span-1 bg-neutral-900 rounded-[40px] p-10 relative group overflow-hidden transition-all"
             >
               <div className="mb-8 text-white">
                 <Truck size={40} />
               </div>
               <h3 className="text-2xl font-semibold mb-3 text-white tracking-tight">Industrial Ops</h3>
               <p className="text-neutral-400 leading-relaxed text-sm font-medium">
                 Heavy logistics and security units equipped with mission-grade gear.
               </p>
             </motion.div>
           </div>
         </div>
       </section>
 
       {/* --- Fleet Gallery --- */}
       <section className="py-24 md:py-32 bg-[#FBFBFD]" aria-labelledby="fleet-heading">
         <div className="container-wide">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
             <div>
               <h2 id="fleet-heading" className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-black">Available in {hub}</h2>
               <p className="text-neutral-400 text-xl font-medium">Personalized for <span className="text-blue-600 font-semibold">{role}</span> profile.</p>
             </div>
             <Link href="/fleet" className="btn btn-ghost h-12 px-8 font-semibold">
               View Full Catalog <CaretRight size={18} />
             </Link>
           </div>
 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
       <footer className="pt-24 pb-12 bg-white" role="contentinfo">
         <div className="container-wide">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
             <div className="lg:col-span-1">
               <Logo className="mb-10 scale-110 origin-left" />
               <p className="text-neutral-500 leading-relaxed text-base mb-10 font-medium">
                 Africa's infrastructure layer for standardized mobility. Delivering fleet excellence for the modern economy.
               </p>
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-all cursor-pointer">
                   <Users size={20} className="text-neutral-600" />
                 </div>
                 <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-all cursor-pointer">
                   <Globe size={20} className="text-neutral-600" />
                 </div>
               </div>
             </div>
             
             {[
               { title: "Fleet Ops", links: ["Electric Units", "Security Escort", "Logistics Hub", "Premium Shield"] },
               { title: "Network", links: ["Hub Locations", "Partner Portal", "Fleet Health", "Coverage Map"] },
               { title: "Legal", links: ["Rental Terms", "Insurance Policy", "Safety Logic", "Privacy Hub"] }
             ].map((col, i) => (
               <div key={i}>
                 <h4 className="text-[11px] font-semibold text-neutral-400 mb-8 uppercase tracking-tight">{col.title}</h4>
                 <ul className="space-y-4">
                   {col.links.map(link => (
                     <li key={link}>
                       <Link href="#" className="text-sm text-neutral-500 hover:text-blue-600 transition-colors font-medium">{link}</Link>
                     </li>
                   ))}
                 </ul>
               </div>
             ))}
           </div>
 
           <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-tight text-center md:text-left">
               © {new Date().getFullYear()} CarKid0 Rentals. Institutional Mobility Engine.
             </p>
             <div className="flex flex-wrap justify-center gap-8 text-[11px] font-medium uppercase tracking-tight text-neutral-400">
               <Link href="#" className="hover:text-black transition-colors">Compliance</Link>
               <Link href="#" className="hover:text-black transition-colors">Governance</Link>
               <Link href="#" className="hover:text-black transition-colors">Fleet API</Link>
             </div>
           </div>
         </div>
       </footer>
     </main>
   );
}
