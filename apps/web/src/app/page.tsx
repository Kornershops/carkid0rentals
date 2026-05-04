"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { CaretRight, MapPin, CalendarBlank, Clock, ShieldCheck, Truck, Lightning, CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import { useStore } from "@/store/use-store";
import { Logo } from "@/components/ui/logo";
import { formatPrice, getCurrencyForCountry } from "@/lib/currency";
import { RegionSelector } from "@/components/region-selector";
import { RoleSelector } from "@/components/role-selector";
import { HUB_DATA, ALL_HUBS } from "@/lib/constants";
import { VehicleTier } from "@/data/mock-fleet";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

export default function Home() {
  const { hub, setHub, country, role } = useStore();
  const [pickupDate, setPickupDate] = useState("");

  const hubsInCountry = HUB_DATA[country] || [];
  
  // Smart Content: Filter featured fleet based on Role
  const featured = MOCK_FLEET.filter(v => {
    const isLocal = v.hubs.includes(hub);
    if (!isLocal) return false;
    
    if (role === 'driver') return v.tier === 'eco-gig';
    if (role === 'logistics') return v.tier === 'heavy-haul';
    return v.tier === 'elite' || v.tier === 'eco-gig'; // Standard customer
  }).slice(0, 6);

  const currency = getCurrencyForCountry(country);

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* ── Navigation ──────────────────────────────────── */}
      <nav className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, borderBottom: '1px solid var(--border-primary)' }}>
        <div className="container-wide" style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Logo />
            <div style={{ width: 1, height: 24, background: 'var(--border-primary)' }} className="hidden sm:block" />
            <RegionSelector />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="hidden lg:flex" style={{ marginRight: 12 }}>
              <RoleSelector />
            </div>
            <Link href="/auth/login" className="btn btn-ghost" style={{ height: 44, padding: '0 16px', fontSize: 13, fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Cinematic Hero ──────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background Image with Ken Burns */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=1080&fit=crop&q=80"
            alt="Premium vehicle"
            fill
            style={{ objectFit: 'cover' }}
            className="kenburns"
            priority
            unoptimized
          />
          {/* Gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(12,12,14,0.92) 0%, rgba(12,12,14,0.6) 50%, rgba(12,12,14,0.4) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)' }} />
        </div>

        {/* Hero Content */}
        <div className="container-wide" style={{ position: 'relative', zIndex: 10, paddingTop: 160, paddingBottom: 80 }}>
          <motion.div variants={stagger} initial="hidden" animate="visible" style={{ maxWidth: 680 }}>
            <motion.div variants={fadeUp} className="badge badge-accent" style={{ marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
              Live across 5 African Countries
            </motion.div>

            <motion.h1 variants={fadeUp} style={{
              fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900,
              letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 24,
            }}>
              Drive First Class.<br />
              <span style={{ color: 'var(--accent)' }}>Pay Economy.</span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{
              fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6,
              maxWidth: 520, marginBottom: 40, fontWeight: 400,
            }}>
              Africa's premier vehicle infrastructure platform. 
              Rent sustainable EVs, premium luxury, and heavy logistics assets across the continent.
            </motion.p>

            {/* ── Booking Widget ──────────────────────────── */}
            <motion.div variants={fadeUp} className="glass" style={{
              padding: 24, borderRadius: 20,
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: 560,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {/* Location */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'block' }}>
                    Pick-up Location
                  </label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
                    borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
                  }}>
                    <MapPin size={16} weight="bold" style={{ color: 'var(--accent)' }} />
                    <select
                      value={hub}
                      onChange={e => setHub(e.target.value as any)}
                      style={{
                        background: 'transparent', border: 'none', color: 'var(--text-primary)',
                        fontSize: 14, fontWeight: 500, outline: 'none', width: '100%',
                        fontFamily: 'var(--font-body)', cursor: 'pointer',
                      }}
                    >
                      {hubsInCountry.map(h => <option key={h} value={h} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{h}</option>)}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'block' }}>
                    Pick-up Date
                  </label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
                    borderRadius: 10, padding: '10px 14px',
                  }}>
                    <CalendarBlank size={16} weight="bold" style={{ color: 'var(--accent)' }} />
                    <input 
                      type="date" 
                      value={pickupDate}
                      onChange={e => setPickupDate(e.target.value)}
                      style={{
                        background: 'transparent', border: 'none', color: 'var(--text-primary)',
                        fontSize: 14, fontWeight: 500, outline: 'none', width: '100%',
                        fontFamily: 'var(--font-body)', cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>
              </div>

              <Link href="/fleet" className="btn btn-accent" style={{ width: '100%', height: 48, fontSize: 14, fontWeight: 700 }}>
                Find Available Vehicles
                <CaretRight size={18} weight="bold" />
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
              {[
                { icon: <ShieldCheck size={16} weight="bold" />, text: "Verified fleet" },
                { icon: <Clock size={16} weight="bold" />, text: "30 min — 7 day rentals" },
                { icon: <MapPin size={16} weight="bold" />, text: `${ALL_HUBS.length} hubs across 5 countries` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Services Strip ──────────────────────────────── */}
      <section style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', padding: '64px 0' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { icon: <Lightning size={24} weight="duotone" />, title: "Eco-Gig & City EVs", desc: "Sustainable, fuel-efficient vehicles optimized for city driving and ride-hailing. Featuring the new Wuling and Jetour EV fleets." },
              { icon: <ShieldCheck size={24} weight="duotone" />, title: "Luxury & Executive", desc: "Elite EVs like Tesla and Taycan, alongside classic G-Wagons and Land Cruisers for professional transport." },
              { icon: <Truck size={24} weight="duotone" />, title: "Logistics & Haulage", desc: "Electric and diesel trucks for inter-city freight. Payload tracking and route planning included as standard." },
            ].map((svc, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--accent-soft)', color: 'var(--accent)', flexShrink: 0,
                }}>
                  {svc.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{svc.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Fleet ──────────────────────────────── */}
      <section style={{ padding: '96px 0' }}>
        <div className="container-wide">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-divider" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Featured Vehicles
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 400 }}>
                {featured.length} {role === 'driver' ? 'gig-ready' : role === 'logistics' ? 'logistics' : 'premium'} vehicles available in {hub}.
              </p>
            </div>
            <Link href="/fleet" className="btn btn-outline" style={{ height: 44, padding: '0 24px' }}>
              View All Vehicles <CaretRight size={16} weight="bold" />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {featured.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Link href={`/fleet/${v.id}`} style={{ display: 'block' }}>
                  <div className="card" style={{ cursor: 'pointer' }}>
                    {/* Image */}
                    <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-surface)' }}>
                      <Image src={v.images[0]} alt={`${v.brand} ${v.model}`} fill style={{ objectFit: 'cover' }} unoptimized />
                      <div style={{
                        position: 'absolute', top: 12, left: 12,
                        padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: v.tier === 'elite' ? 'var(--gold)' : v.tier === 'eco-gig' ? 'var(--success)' : 'var(--accent)',
                        color: v.tier === 'elite' ? '#1a1a1a' : 'white',
                        textTransform: 'capitalize',
                      }}>
                        {v.tier === 'eco-gig' ? 'Economy' : v.tier === 'heavy-haul' ? 'Logistics' : 'Premium'}
                      </div>
                    </div>
                    {/* Details */}
                    <div style={{ padding: '20px 20px 24px' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                        {v.brand} · {v.year}
                      </p>
                      <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>{v.model}</h3>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        {v.features.slice(0, 3).map((f, j) => (
                          <span key={j} style={{
                            fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 500,
                            background: 'var(--bg-surface)', color: 'var(--text-secondary)',
                            border: '1px solid var(--border-primary)',
                          }}>{f}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-primary)' }}>
                        <div>
                          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatPrice(v.pricePerDay, currency)}</span>
                          <span style={{ fontSize: 13, color: 'var(--text-tertiary)', marginLeft: 4 }}>/day</span>
                        </div>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'var(--accent-soft)', color: 'var(--accent)', transition: 'all 0.2s',
                        }}>
                          <CaretRight size={18} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-primary)', padding: '80px 0 40px' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>
            <div>
              <Logo className="mb-6" />
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 280, marginTop: 16 }}>
                Nigeria's premier vehicle rental platform. Gig economy, luxury, and logistics — all in one place.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Our Fleet", "Pricing", "Locations", "For Business"] },
              { title: "Company", links: ["About Us", "Legal Hub", "Technical Specs", "Partner Portal"] },
              { title: "Hubs", links: ["Lagos", "Nairobi", "Johannesburg", "Cairo", "Accra"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>{col.title}</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-white">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>© {new Date().getFullYear()} CarKid0. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              {["Privacy", "Terms", "Cookies"].map(l => (
                <Link key={l} href="#" style={{ fontSize: 13, color: 'var(--text-tertiary)', transition: 'color 0.2s' }} className="hover:text-white">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
