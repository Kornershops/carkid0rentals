"use client";
import Link from "next/link";
import { MapPin, CaretRight, Phone, Buildings } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { OperatingHub } from "@/store/use-store";
import { motion } from "framer-motion";

const hubs: { city: OperatingHub; state: string; desc: string; address: string; phone: string }[] = [
  { city: "Lagos", state: "Lagos State", desc: "Nigeria's commercial capital and our largest hub. Covering Victoria Island, Ikeja, Lekki, and mainland areas. Ideal for business rentals and gig economy vehicles.", address: "12 Admiralty Way, Lekki Phase 1", phone: "+234 801 000 0001" },
  { city: "Abuja", state: "FCT", desc: "The federal capital territory hub. Servicing Maitama, Wuse, Garki, and Asokoro districts. Popular for executive and government transport.", address: "Plot 45 Aminu Kano Crescent, Wuse 2", phone: "+234 801 000 0002" },
  { city: "Port Harcourt", state: "Rivers State", desc: "Oil & gas capital of Nigeria. Serving the energy sector with luxury SUVs and heavy-duty logistics for offshore operations.", address: "24 Aba Road, GRA Phase 2", phone: "+234 801 000 0003" },
  { city: "Kano", state: "Kano State", desc: "Northern Nigeria's commercial center. Strong demand for haulage and economy vehicles supporting the agricultural and textile industries.", address: "15 Murtala Mohammed Way, Nassarawa", phone: "+234 801 000 0004" },
  { city: "Kaduna", state: "Kaduna State", desc: "Strategic hub connecting the north. Growing demand for both executive rentals and inter-state logistics vehicles.", address: "8 Yakubu Gowon Way, Barnawa", phone: "+234 801 000 0005" },
  { city: "Enugu", state: "Enugu State", desc: "South-East gateway hub. Serving the coal city and surrounding Igbo states with economy and logistics vehicles.", address: "32 Okpara Avenue, GRA", phone: "+234 801 000 0006" },
  { city: "Warri", state: "Delta State", desc: "Oil-rich Delta hub. Supporting energy companies with heavy-duty logistics and premium SUVs for executive transport.", address: "5 Effurun-Sapele Road", phone: "+234 801 000 0007" },
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
          <div className="section-divider" style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>Our Locations</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Available in {hubs.length} major cities across Nigeria. Pick up from any hub, drop off at any location.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
            {hubs.map((hub, i) => {
              const count = MOCK_FLEET.filter(v => v.hubs.includes(hub.city)).length;
              return (
                <motion.div key={hub.city} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                  <div className="card" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 2 }}>{hub.city}</h2>
                        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{hub.state}</p>
                      </div>
                      <span className="badge badge-accent">{count} vehicles</span>
                    </div>

                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{hub.desc}</p>

                    <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Buildings size={14} weight="bold" style={{ color: 'var(--accent)', flexShrink: 0 }} /> {hub.address}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <Phone size={14} weight="bold" style={{ color: 'var(--accent)', flexShrink: 0 }} /> {hub.phone}
                      </div>
                    </div>

                    <Link href="/fleet" className="btn btn-outline" style={{ width: '100%', height: 40, fontSize: 12, marginTop: 16 }}>
                      Browse {hub.city} Fleet <CaretRight size={14} weight="bold" />
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
