"use client";
import Link from "next/link";
import { CaretRight, Users, MapPin, Car, ShieldCheck, Clock, Handshake } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ height: 36, padding: '0 14px', fontSize: 12 }}>← Home</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 0 48px' }}>
        <div className="container-wide" style={{ maxWidth: 720 }}>
          <div className="section-divider" style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.1 }}>
            Building Nigeria's Vehicle<br /><span style={{ color: 'var(--accent)' }}>Rental Infrastructure</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            CarKid0 was founded to solve a simple problem: accessing reliable, well-maintained vehicles in Nigeria shouldn't be difficult or expensive.
            We connect drivers, businesses, and individuals with verified vehicles across 7 major cities — whether you need a compact sedan for gig work or a 35-ton truck for interstate freight.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 0', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[
              { value: "50+", label: "Vehicles" },
              { value: "7", label: "Cities" },
              { value: "3", label: "Vehicle Tiers" },
              { value: "24/7", label: "Support" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--accent)' }}>{s.value}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section style={{ padding: '80px 0' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>What We Stand For</h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Our values guide every decision — from vehicle selection to customer service.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: <ShieldCheck size={24} weight="duotone" />, title: "Safety First", desc: "Every vehicle is inspected, insured, and GPS-tracked. We maintain strict safety standards for all tiers including routine maintenance schedules." },
              { icon: <Users size={24} weight="duotone" />, title: "Accessibility", desc: "Vehicle rental shouldn't be a luxury. Our economy tier starts at ₦13,000/day — making reliable transport accessible to gig workers and small businesses." },
              { icon: <Handshake size={24} weight="duotone" />, title: "Trust & Transparency", desc: "No hidden fees. The price you see is the price you pay. Clear rental terms, easy extensions, and straightforward insurance policies." },
              { icon: <Clock size={24} weight="duotone" />, title: "Flexibility", desc: "Rent for 30 minutes or 7 days. Need more time? Our auto-renewal feature extends your rental seamlessly without paperwork." },
              { icon: <MapPin size={24} weight="duotone" />, title: "Nationwide Reach", desc: "From Lagos to Kano, Port Harcourt to Kaduna. We're expanding across Nigeria's major economic corridors to serve more communities." },
              { icon: <Car size={24} weight="duotone" />, title: "Quality Fleet", desc: "We partner with certified dealers and fleet owners to maintain vehicles from 2020 onwards. No aging fleet, no compromises." },
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-soft)', color: 'var(--accent)', marginBottom: 16 }}>
                    {v.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-primary)' }}>
        <div className="container-wide">
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Start your journey with us
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 32px' }}>
            Browse our fleet and book your next vehicle in under 2 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/fleet" className="btn btn-accent" style={{ height: 48, padding: '0 28px', fontSize: 14, fontWeight: 700 }}>
              Browse Fleet <CaretRight size={16} weight="bold" />
            </Link>
            <Link href="/locations" className="btn btn-outline" style={{ height: 48, padding: '0 28px', fontSize: 14 }}>
              View Locations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
