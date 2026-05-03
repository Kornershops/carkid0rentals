"use client";
import Link from "next/link";
import { MapPin, CaretRight, Phone, Buildings, Globe } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { OperatingHub } from "@/store/use-store";
import { motion } from "framer-motion";

const hubs: { city: OperatingHub; country: string; desc: string; address: string; phone: string }[] = [
  // Nigeria
  { city: "Lagos", country: "Nigeria", desc: "Our flagship West African hub. Hub for Eco-Gig, Exotic, and Heavy-Haul logistics.", address: "12 Admiralty Way, Lekki Phase 1", phone: "+234 801 000 0001" },
  { city: "Abuja", country: "Nigeria", desc: "Federal Capital hub. Specializing in executive transport and diplomatic fleets.", address: "Plot 45 Aminu Kano Crescent, Wuse 2", phone: "+234 801 000 0002" },
  
  // Kenya
  { city: "Nairobi", country: "Kenya", desc: "East African headquarters. Focus on sustainable EV mobility and safari-ready elite fleets.", address: "Westlands Commercial Center", phone: "+254 700 000 001" },
  
  // South Africa
  { city: "Johannesburg", country: "South Africa", desc: "Southern African powerhouse. Advanced logistics hub and premium performance rentals.", address: "Sandton City Office Tower", phone: "+27 11 000 0001" },
  
  // Ghana
  { city: "Accra", country: "Ghana", desc: "Gold Coast logistics corridor. Connecting West African trade with rugged haulage and local EV fleets.", address: "Airport Residential Area", phone: "+233 24 000 0001" },
  
  // Egypt
  { city: "Cairo", country: "Egypt", desc: "North African gateway. Servicing the Nile valley with modern economy and executive fleets.", address: "Maadi District, Cairo", phone: "+20 100 000 0001" },
];

export default function LocationsPage() {
  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ height: 36, padding: '0 14px', fontSize: 12 }}>← Home</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 0 48px', textAlign: 'center' }}>
        <div className="container-wide">
          <div className="badge badge-accent" style={{ margin: '0 auto 16px' }}>PAN-AFRICAN NETWORK</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>Our Hub Network</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Connected mobility infrastructure across 5 countries and {hubs.length} major economic hubs.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
            {hubs.map((hub, i) => {
              const count = MOCK_FLEET.filter(v => v.hubs.includes(hub.city)).length;
              return (
                <motion.div key={hub.city} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <div className="card" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-elevated)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 2 }}>{hub.city}</h2>
                        <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Globe size={14} weight="bold" /> {hub.country.toUpperCase()}
                        </p>
                      </div>
                      <span className="badge" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', fontSize: 11 }}>{count} assets</span>
                    </div>

                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, flex: 1 }}>{hub.desc}</p>

                    <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Buildings size={16} weight="duotone" color="var(--accent)" /> {hub.address}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Phone size={16} weight="duotone" color="var(--accent)" /> {hub.phone}
                      </div>
                    </div>

                    <Link href="/fleet" className="btn btn-accent" style={{ width: '100%', height: 44, fontSize: 13 }}>
                      Explore {hub.city} Fleet <CaretRight size={14} weight="bold" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
