"use client";
import Link from "next/link";
import { Lightning, ShieldCheck, Truck, CaretRight, Clock, MapPin, CreditCard, Headset, Globe } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

export default function ServicesPage() {
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
          <div className="badge badge-accent" style={{ margin: '0 auto 16px' }}>PRO-MOBILITY STACK</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>
            Pan-African Service Tiers
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Three specialized mobility segments optimized for Africa's economic corridors.
          </p>
        </div>
      </section>

      {/* Service Tiers */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
            {[
              {
                icon: <Lightning size={28} weight="duotone" />, badge: "Eco-Gig", badgeColor: 'var(--success)',
                title: "Gig Economy & Daily", price: "Starting at $30/day",
                desc: "High-utilization assets for professional drivers and daily commuters. Optimized for Uber, Bolt, and regional ride-hailing services.",
                features: ["Innoson IVM EX02", "Toyota Corolla (Classic/Modern)", "Wuling Bingo EV", "Saglev S5 EV", "VW Polo Vivo"],
                perks: ["EV options in Lagos/Nairobi", "Insurance included", "Mobile Wallet integration", "Real-time earning telemetry"],
              },
              {
                icon: <ShieldCheck size={28} weight="duotone" />, badge: "Elite", badgeColor: 'var(--gold)',
                title: "Exotic & Executive", price: "Starting at $250/day",
                desc: "Premium SUVs and elite EVs for business executives, diplomatic missions, and luxury travel across the continent.",
                features: ["Mercedes G-Wagon G63", "Toyota Land Cruiser V8", "BMW 7-Series", "Porsche 911 Carrera", "Tesla Model 3"],
                perks: ["White-glove delivery", "Safe-Halt™ Shield Active", "Chauffeur on demand", "Airport VIP pickup"],
              },
              {
                icon: <Truck size={28} weight="duotone" />, badge: "Haulage", badgeColor: 'var(--accent)',
                title: "Logistics & Heavy-Haul", price: "Starting at $150/day",
                desc: "Strategic haulage for cross-border trade. Supporting last-mile delivery and heavy industrial logistics.",
                features: ["Jet Motor Mover EV Van", "Mack Granite", "Sinotruk Howo", "Isuzu Forward FRR", "Mercedes Actros"],
                perks: ["Transit corridor planning", "Customs clearance stubs", "Payload up to 40 tons", "GPS Route optimization"],
              },
            ].map((svc, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="card" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {svc.icon}
                    </div>
                    <div>
                      <span className="badge" style={{ background: svc.badgeColor, color: svc.badgeColor === 'var(--gold)' ? '#1a1a1a' : 'white', borderColor: 'transparent', fontSize: 10 }}>{svc.badge}</span>
                    </div>
                  </div>

                  <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{svc.title}</h2>
                  <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', marginBottom: 12 }}>{svc.price}</p>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{svc.desc}</p>

                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>Flagship Fleet</h4>
                  <div style={{ marginBottom: 20 }}>
                    {svc.features.map((f, j) => (
                      <p key={j} style={{ fontSize: 13, color: 'var(--text-primary)', padding: '6px 0', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} /> {f}
                      </p>
                    ))}
                  </div>

                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>Tier Perks</h4>
                  <div style={{ marginBottom: 24 }}>
                    {svc.perks.map((p, j) => (
                      <p key={j} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Lightning size={14} weight="fill" style={{ color: 'var(--success)' }} /> {p}
                      </p>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <Link href="/fleet" className="btn btn-accent" style={{ width: '100%', height: 48, fontSize: 14, fontWeight: 700 }}>
                      Browse {svc.badge} Segment <CaretRight size={14} weight="bold" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 0', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-primary)' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 16 }}>Regional Deployment</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Book and deploy a vehicle in minutes across Africa's major cities.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
            {[
              { step: "01", icon: <Globe size={24} weight="bold" />, title: "Select Hub", desc: "Choose from Lagos, Nairobi, Joburg, Accra, or Cairo." },
              { step: "02", icon: <Clock size={24} weight="bold" />, title: "Lease Duration", desc: "From 30-min gig shifts up to multi-year enterprise leases." },
              { step: "03", icon: <CreditCard size={24} weight="bold" />, title: "Wallet Payment", desc: "Secure digital payments via localized gateways." },
              { step: "04", icon: <Headset size={24} weight="bold" />, title: "Live Ops", desc: "24/7 monitoring and roadside assistance via Safe-Halt™." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--accent)', margin: '0 auto 20px', border: '1px solid var(--border-primary)' }}>
                  {s.icon}
                </div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>PHASE {s.step}</p>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '120px 0', textAlign: 'center' }}>
        <div className="container-wide">
          <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 24 }}>
            Start your journey today.
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Join thousands of professional drivers and enterprises scaling with CarKid0.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link href="/fleet" className="btn btn-accent" style={{ height: 56, padding: '0 40px', fontSize: 16, fontWeight: 700 }}>
              Browse Fleet <CaretRight size={18} weight="bold" />
            </Link>
            <Link href="/partners" className="btn btn-outline" style={{ height: 56, padding: '0 40px', fontSize: 16, fontWeight: 700 }}>
              Partner with Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
