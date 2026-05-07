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
    <main className="min-h-screen bg-white selection:bg-blue-500/30 overflow-x-hidden">
 
       {/* --- Navigation --- */}
       <nav className="glass fixed top-0 w-full z-[100] h-20" aria-label="Main Navigation">
         <div className="container-wide h-full flex items-center justify-between">
           <div className="flex items-center gap-4 md:gap-8">
             <Logo />
             <div className="hidden md:block w-px h-6 bg-black/10" />
             <div className="hidden sm:block">
               <RegionSelector />
             </div>
           </div>
 
           {/* Desktop Actions */}
           <div className="hidden lg:flex items-center gap-6">
             <RoleSelector />
             <Link href="/auth/login" className="btn btn-outline h-12 px-8" aria-label="Sign in to your account">
               Sign In
             </Link>
           </div>
 
           {/* Mobile Menu Toggle */}
           <button 
             className="lg:hidden w-12 h-12 flex items-center justify-center bg-white border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_#000000]"
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
             className="fixed inset-0 z-[90] bg-white lg:hidden pt-32 p-8"
           >
             <div className="space-y-8">
               <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 block">Regional Hub</label>
                 <RegionSelector />
               </div>
               <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 block">Active Role</label>
                 <RoleSelector />
               </div>
               <div className="pt-8 border-t-2 border-neutral-100">
                 <Link 
                   href="/auth/login" 
                   className="btn btn-accent w-full h-16 shadow-[4px_4px_0px_#000000]"
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
       <section className="relative min-h-[90vh] flex items-center pt-20 bg-[#D8F8C8] border-b-2 border-black overflow-hidden" aria-labelledby="hero-heading">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/40 blur-[80px] rounded-full -ml-32 -mb-32" />
 
         <div className="container-wide relative z-10 pt-12 pb-20">
           <motion.div 
             variants={stagger} 
             initial="hidden" 
             animate="visible" 
             className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center"
           >
             {/* Left Content */}
             <div className="text-center lg:text-left">
               <motion.div 
                 variants={fadeUp} 
                 className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white border-2 border-black text-black font-black text-[10px] uppercase tracking-[0.2em] mb-10 shadow-[2px_2px_0px_#000000]"
               >
                 <Globe size={14} className="text-blue-600" />
                 <span>Pan-African Fleet Network</span>
               </motion.div>
 
               <motion.h1 
                 id="hero-heading"
                 variants={fadeUp} 
                 className="text-[clamp(44px,10vw,88px)] leading-[0.9] font-black tracking-tight mb-8 text-black"
               >
                 Get your<br className="hidden md:block" /> 
                 <span className="text-blue-600 underline decoration-black decoration-8 underline-offset-8">Virtual Fleet.</span>
               </motion.h1>
 
               <motion.p 
                 variants={fadeUp} 
                 className="text-neutral-700 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0 font-bold"
               >
                 Institutional-grade vehicle infrastructure for the modern African terrain. Rent with power and flexibility.
               </motion.p>
 
               <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                 <Link href="/fleet" className="btn btn-accent h-16 px-12 shadow-[4px_4px_0px_#000000]">
                   Reserve Unit Now
                 </Link>
                 <Link href="/tech" className="btn btn-outline h-16 px-12">
                   Platform Tech
                 </Link>
               </motion.div>
             </div>
 
             {/* Booking Widget */}
             <motion.div variants={fadeUp} className="bg-white rounded-[32px] p-6 md:p-10 border-2 border-black shadow-[8px_8px_0px_#000000] relative overflow-hidden max-w-xl mx-auto w-full">
               <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-black">
                 <Lightning size={28} weight="bold" className="text-blue-600" />
                 Quick Reserve
               </h2>
 
               <div className="space-y-8">
                 <div role="group">
                   <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 block">Pick-up Location</label>
                   <div className="flex items-center gap-4 bg-neutral-50 border-2 border-black rounded-2xl px-5 py-5 transition-all focus-within:bg-white shadow-[2px_2px_0px_#000000]">
                     <MapPin size={22} className="text-blue-600" />
                     <select 
                       value={hub} 
                       onChange={e => setHub(e.target.value as any)}
                       className="w-full text-base font-black focus:outline-none bg-transparent cursor-pointer text-black"
                     >
                       {hubsInCountry.map(h => <option key={h} value={h} className="bg-white text-black">{h}</option>)}
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
                   className="btn btn-accent w-full h-16 text-lg mt-4 shadow-[4px_4px_0px_#000000]"
                 >
                   Find Vehicles
                   <CaretRight size={22} weight="bold" />
                 </Link>
               </div>
 
               <div className="mt-10 pt-10 border-t-2 border-neutral-100 grid grid-cols-3 gap-4 text-center">
                 <div>
                   <div className="text-blue-600 font-black text-xl md:text-2xl">500+</div>
                   <div className="text-[9px] text-neutral-400 uppercase font-black tracking-widest">Units</div>
                 </div>
                 <div>
                   <div className="text-blue-600 font-black text-xl md:text-2xl">12k+</div>
                   <div className="text-[9px] text-neutral-400 uppercase font-black tracking-widest">Active</div>
                 </div>
                 <div>
                   <div className="text-blue-600 font-black text-xl md:text-2xl">24/7</div>
                   <div className="text-[9px] text-neutral-400 uppercase font-black tracking-widest">Ops</div>
                 </div>
               </div>
             </motion.div>
           </motion.div>
         </div>
       </section>
 
       {/* --- Purpose Grid --- */}
       <section className="py-24 md:py-32 bg-white" aria-labelledby="purpose-heading">
         <div className="container-wide">
           <div className="max-w-3xl mb-20 md:mb-24">
             <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6">
               <span className="w-10 h-[2px] bg-blue-600" />
               Strategic Verticals
             </div>
             <h2 id="purpose-heading" className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-black leading-[0.9]">
               Mission Critical <span className="text-blue-600 italic">Fleet.</span>
             </h2>
             <p className="text-neutral-600 text-lg md:text-xl max-w-xl font-bold">
               Specialized vehicle infrastructure engineered for the modern African enterprise economy.
             </p>
           </div>
 
           <div className="grid lg:grid-cols-12 gap-6 md:gap-10 auto-rows-[340px]">
             {/* Elite Executive */}
             <motion.div 
               whileHover={{ translate: '-4px -4px', boxShadow: '8px 8px 0px #000000' }}
               className="lg:col-span-8 lg:row-span-2 bg-white border-2 border-black rounded-[2.5rem] p-10 md:p-14 relative group overflow-hidden flex flex-col justify-end shadow-[4px_4px_0px_#000000] transition-all"
             >
               <div className="absolute top-0 right-0 p-12 text-[160px] font-black text-black/[0.03] leading-none select-none">01</div>
               <div className="relative z-10">
                 <div className="mb-10 text-blue-600">
                   <Crown size={72} weight="bold" />
                 </div>
                 <h3 className="text-4xl md:text-5xl font-black mb-6 text-black">Elite Executive</h3>
                 <p className="text-neutral-600 leading-relaxed text-lg max-w-xl mb-10 font-bold">
                   Discreet luxury and armored variants for high-profile operations. Standardized security meets comfort.
                 </p>
                 <Link href="/fleet" className="btn btn-accent px-10 h-14 w-fit">
                   Explore Registry <CaretRight size={22} />
                 </Link>
               </div>
             </motion.div>
 
             {/* Eco-Gig EVs */}
             <motion.div 
               whileHover={{ translate: '-4px -4px', boxShadow: '8px 8px 0px #000000' }}
               className="lg:col-span-4 lg:row-span-1 bg-[#D8F8C8] border-2 border-black rounded-[2rem] p-10 relative group overflow-hidden shadow-[4px_4px_0px_#000000] transition-all"
             >
               <div className="absolute top-0 right-0 p-8 text-6xl font-black text-black/[0.05] select-none">02</div>
               <div className="mb-8 text-black">
                 <Lightning size={44} weight="bold" />
               </div>
               <h3 className="text-2xl font-black mb-4 text-black">Eco-Gig EVs</h3>
               <p className="text-neutral-800 leading-relaxed text-sm font-bold">
                 Maximum earnings. Zero emissions, zero fuel spend, 100% uptime.
               </p>
             </motion.div>
 
             {/* Industrial Ops */}
             <motion.div 
               whileHover={{ translate: '-4px -4px', boxShadow: '8px 8px 0px #000000' }}
               className="lg:col-span-4 lg:row-span-1 bg-blue-600 border-2 border-black rounded-[2rem] p-10 relative group overflow-hidden shadow-[4px_4px_0px_#000000] transition-all"
             >
               <div className="absolute top-0 right-0 p-8 text-6xl font-black text-white/[0.1] select-none">03</div>
               <div className="mb-8 text-white">
                 <Truck size={44} weight="bold" />
               </div>
               <h3 className="text-2xl font-black mb-4 text-white">Industrial Ops</h3>
               <p className="text-blue-100 leading-relaxed text-sm font-bold">
                 Heavy logistics and security units equipped with mission-grade gear.
               </p>
             </motion.div>
           </div>
         </div>
       </section>
 
       {/* --- Fleet Gallery --- */}
       <section className="py-24 md:py-32 bg-neutral-50 border-t-2 border-black" aria-labelledby="fleet-heading">
         <div className="container-wide">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 md:mb-24">
             <div className="text-center md:text-left">
               <h2 id="fleet-heading" className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-black">Available in {hub}</h2>
               <p className="text-neutral-500 text-xl font-bold">Personalized fleet for <span className="text-blue-600 font-black">{role}</span> profile.</p>
             </div>
             <Link href="/fleet" className="btn btn-outline h-16 px-12 w-full md:w-auto shadow-[4px_4px_0px_#000000]">
               Browse Catalog
             </Link>
           </div>
 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
       <footer className="pt-24 pb-12 bg-white border-t-2 border-black" role="contentinfo">
         <div className="container-wide">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
             <div className="lg:col-span-1">
               <Logo className="mb-10 scale-110 origin-left" />
               <p className="text-neutral-600 leading-relaxed text-base mb-10 font-bold">
                 Africa's infrastructure layer for standardized mobility. Delivering fleet excellence for the modern economy.
               </p>
               <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer shadow-[2px_2px_0px_#000000]">
                   <Users size={24} weight="bold" className="text-black" />
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-50 transition-all cursor-pointer shadow-[2px_2px_0px_#000000]">
                   <Globe size={24} weight="bold" className="text-black" />
                 </div>
               </div>
             </div>
             
             {[
               { title: "Fleet Ops", links: ["Electric Units", "Security Escort", "Logistics Hub", "Premium Shield"] },
               { title: "Network", links: ["Hub Locations", "Partner Portal", "Fleet Health", "Coverage Map"] },
               { title: "Legal", links: ["Rental Terms", "Insurance Policy", "Safety Logic", "Privacy Hub"] }
             ].map((col, i) => (
               <div key={i}>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-10">{col.title}</h4>
                 <ul className="space-y-6">
                   {col.links.map(link => (
                     <li key={link}>
                       <Link href="#" className="text-base text-neutral-600 hover:text-blue-600 transition-colors font-black uppercase tracking-wider">{link}</Link>
                     </li>
                   ))}
                 </ul>
               </div>
             ))}
           </div>
 
           <div className="pt-10 border-t-2 border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest text-center md:text-left">
               © {new Date().getFullYear()} CarKid0 Rentals. Institutional Mobility Engine.
             </p>
             <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-neutral-400">
               <Link href="#" className="hover:text-black transition-colors">Compliance</Link>
               <Link href="#" className="hover:text-black transition-colors">Governance</Link>
               <Link href="#" className="hover:text-black transition-colors">Fleet API</Link>
             </div>
           </div>
         </div>
       </footer>
     </main>
   );;
}
