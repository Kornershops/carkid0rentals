"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { CaretRight, MapPin, ShieldCheck, Truck, Lightning, Crown, Globe, Users, Trophy } from "@phosphor-icons/react";
import { useState } from "react";
import { useStore } from "@/store/use-store";
import { Logo } from "@/components/ui/logo";
import { formatPrice, getCurrencyForCountry } from "@/lib/currency";
import { RegionSelector } from "@/components/region-selector";
import { RoleSelector } from "@/components/role-selector";
import { HUB_DATA, ALL_HUBS } from "@/lib/constants";
import { EnhancedDatePicker } from "@/components/enhanced-date-picker";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

export default function Home() {
  const { hub, setHub, country, role } = useStore();
  const [pickupDate, setPickupDate] = useState("");

  const hubsInCountry = HUB_DATA[country] || [];
  
  // High-fidelity featured fleet based on role
  const featured = MOCK_FLEET.filter(v => {
    const isLocal = v.hubs.includes(hub);
    if (!isLocal) return false;
    
    if (role === 'driver') return v.tier === 'eco-gig';
    if (role === 'logistics') return v.tier === 'heavy-haul';
    return v.tier === 'elite' || v.tier === 'eco-gig'; 
  }).slice(0, 6);

  const currency = getCurrencyForCountry(country);

  return (
    <main className="min-h-screen selection:bg-indigo-500/30">

      {/* --- Navigation --- */}
      <nav className="glass fixed top-0 w-full z-50 border-b border-white/5 h-20">
        <div className="container-wide h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden md:block w-px h-6 bg-white/10" />
            <RegionSelector />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <RoleSelector />
            </div>
            <Link href="/auth/login" className="btn btn-outline h-11 px-6">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Immersive Hero Section --- */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
            alt="Premium Vehicle Background"
            fill
            className="object-cover kenburns brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-indigo-900/20" />
          <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="container-wide relative z-10 pt-32 pb-20">
          <motion.div 
            variants={stagger} 
            initial="hidden" 
            animate="visible" 
            className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center"
          >
            {/* Left Content */}
            <div className="max-w-2xl">
              <motion.div variants={fadeUp} className="badge badge-accent mb-8">
                <Globe size={14} className="animate-pulse" />
                <span>Standardizing Pan-African Mobility</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-[clamp(48px,8vw,88px)] leading-[0.9] font-black tracking-tighter mb-8 text-gradient">
                Institutional<br /> 
                <span className="text-indigo-500">Fleet Access.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-xl text-slate-400 leading-relaxed mb-12 max-w-lg">
                The leading platform for high-performance EV rentals, luxury transport, and specialized logistics across 5 African nations.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-indigo-400">
                    <Trophy size={20} weight="duotone" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">#1 Rated</div>
                    <div className="text-xs text-slate-500">Corporate Choice</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={20} weight="duotone" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">B6 Armored</div>
                    <div className="text-xs text-slate-500">Available on request</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Premium Booking Widget */}
            <motion.div variants={fadeUp} className="glass rounded-[32px] p-8 border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] -mr-16 -mt-16" />
              
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <CalendarBlank size={24} weight="duotone" className="text-indigo-500" />
                Reserve Vehicle
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Location</label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 transition-all focus-within:border-indigo-500/50 focus-within:bg-white/10">
                    <MapPin size={20} className="text-indigo-500" />
                    <select 
                      value={hub} 
                      onChange={e => setHub(e.target.value as any)}
                      className="w-full text-sm font-medium focus:outline-none bg-transparent cursor-pointer"
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

                <Link href="/fleet" className="btn btn-accent w-full h-14 text-base tracking-tight mt-4">
                  Explore Full Fleet
                  <CaretRight size={20} weight="bold" />
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-indigo-400 font-bold">500+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Vehicles</div>
                </div>
                <div>
                  <div className="text-indigo-400 font-bold">12k+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Rentals</div>
                </div>
                <div>
                  <div className="text-indigo-400 font-bold">24/7</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Support</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Tiers of Excellence Showcase --- */}
      <section className="py-32 relative overflow-hidden bg-white/[0.01]">
        <div className="container-wide">
          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-6">Designed for Every Purpose</h2>
            <p className="text-slate-400 leading-relaxed">From sustainable daily commutes to specialized security escort missions, our fleet is engineered for African terrain.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Lightning size={32} weight="duotone" />, color: 'text-emerald-400', title: "Eco-Gig EVs", desc: "Wuling Bingo and Jetour fleets optimized for maximum earnings and zero fuel spend." },
              { icon: <Crown size={32} weight="duotone" />, color: 'text-indigo-400', title: "Elite Executive", desc: "Curated selection of Lexus, LC200s, and armored variants for high-profile movement." },
              { icon: <Truck size={32} weight="duotone" />, color: 'text-amber-400', title: "Haulage & Ops", desc: "Industrial-grade logistics assets and security escort Hiluxes with full comms integration." },
            ].map((tier, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass rounded-3xl p-10 border-white/5 relative group transition-all duration-500 hover:bg-white/[0.04]"
              >
                <div className={`mb-8 ${tier.color} transform transition-transform group-hover:scale-110 duration-500`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{tier.title}</h3>
                <p className="text-slate-400 leading-relaxed">{tier.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <CaretRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Dynamic Featured Fleet --- */}
      <section className="py-32">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="section-divider mb-6" />
              <h2 className="text-5xl font-black tracking-tighter mb-4">Available in {hub}</h2>
              <p className="text-slate-400 text-lg">Curated recommendations for your <span className="text-white font-bold">{role}</span> profile.</p>
            </div>
            <Link href="/fleet" className="btn btn-outline h-12 px-8">
              View All Vehicles
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((v, i) => (
              <motion.div 
                key={v.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/fleet/${v.id}`} className="group block">
                  <div className="card h-full">
                    {/* Visual Container */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image 
                        src={v.images[0].path} 
                        alt={v.images[0].altText} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      
                      {/* Tier Tag */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`
                          px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                          ${v.tier === 'elite' ? 'bg-amber-500/90 text-black' : 
                            v.tier === 'eco-gig' ? 'bg-emerald-500/90 text-white' : 
                            'bg-indigo-600/90 text-white'}
                        `}>
                          {v.tier.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                            {v.brand} • {v.year}
                          </div>
                          <h3 className="text-2xl font-bold">{v.model}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-indigo-400 leading-none">{formatPrice(v.pricePerDay, currency)}</div>
                          <div className="text-[10px] text-slate-500 font-bold">PER DAY</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {v.features.slice(0, 3).map((f, j) => (
                          <span key={j} className="text-[10px] font-bold px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-slate-400">
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="btn btn-outline w-full group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white">
                        Check Availability
                        <CaretRight size={18} weight="bold" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Professional Footer --- */}
      <footer className="pt-32 pb-16 border-t border-white/5 bg-black/40">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <Logo className="mb-8" />
              <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
                CarKid0 is Africa's infrastructure layer for high-performance mobility. We provide standardized fleet access for drivers, logistics operators, and executive clients.
              </p>
              <div className="mt-8 flex gap-4">
                {/* Social icons would go here */}
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Users size={20} weight="duotone" />
                </div>
              </div>
            </div>
            
            {[
              { title: "Fleet Management", links: ["Browse Inventory", "Electric Mobility", "Logistics Hub", "Premium Shield"] },
              { title: "Governance", links: ["Institutional Terms", "Fleet Safety", "Insurance Logic", "Hub Network"] },
              { title: "Corporate", links: ["Investor Portal", "Partner With Us", "Africa Operations", "Contact High-Touch"] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">{col.title}</h4>
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

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs text-slate-500 font-medium">© {new Date().getFullYear()} CarKid0 Rentals. An Institutional Mobility Platform.</p>
            <div className="flex gap-8 text-xs font-bold text-slate-500">
              <Link href="#" className="hover:text-white">Security</Link>
              <Link href="#" className="hover:text-white">Privacy</Link>
              <Link href="#" className="hover:text-white">API</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
