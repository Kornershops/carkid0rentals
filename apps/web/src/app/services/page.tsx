"use client";
import Link from "next/link";
import { Lightning, ShieldCheck, Truck, CaretRight, Clock, MapPin, CreditCard, Headset } from "@phosphor-icons/react";
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
          <div className="section-divider" style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Our Services
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Three rental tiers to match every need — from budget gig driving to executive transport and interstate logistics.
          </p>
        </div>
      </section>

      {/* Service Tiers */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
            {[
              {
                icon: <Lightning size={28} weight="duotone" />, badge: "Economy", badgeColor: 'var(--success)',
                title: "Gig & Daily Rentals", price: "From ₦13,000/day",
                desc: "Fuel-efficient sedans optimized for ride-hailing platforms like Uber, Bolt, and InDrive. Perfect for daily commuters and gig drivers who need reliable, affordable wheels.",
                features: ["Toyota Corolla, Camry, Yaris", "Honda Civic, Accord", "Hyundai Elantra, Sonata", "Kia Rio, Cerato", "Nissan Sentra, Almera"],
                perks: ["Fuel-efficient (16–26 km/L)", "Insurance included", "24/7 roadside assistance", "Weekly & monthly rates available"],
              },
              {
                icon: <ShieldCheck size={28} weight="duotone" />, badge: "Premium", badgeColor: 'var(--gold)',
                title: "Luxury & Executive", price: "From ₦250,000/day",
                desc: "Premium SUVs and luxury sedans for business executives, VIP events, weddings, and diplomatic transport. White-glove delivery to your door.",
                features: ["Mercedes G-Wagon, S-Class, Maybach", "Range Rover Autobiography", "Lexus LX 600, Toyota Land Cruiser", "BMW X7, Porsche Cayenne", "Bentley Bentayga"],
                perks: ["Professional chauffeur optional", "Airport pickup & drop-off", "Event & wedding packages", "Armored vehicles available"],
              },
              {
                icon: <Truck size={28} weight="duotone" />, badge: "Logistics", badgeColor: 'var(--accent)',
                title: "Haulage & Logistics", price: "From ₦40,000/day",
                desc: "Trucks and pickups for last-mile delivery, interstate freight, and construction logistics. GPS tracking and payload monitoring included.",
                features: ["Toyota Hilux, Ford Ranger", "Isuzu NPR, Mitsubishi Canter", "Mercedes Actros, Volvo FH", "MAN TGS, DAF CF, Scania R450", "Hino 500, Tata LPT"],
                perks: ["GPS fleet tracking", "Payload up to 35 tons", "Interstate route planning", "Refrigerated units available"],
              },
            ].map((svc, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="card" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {svc.icon}
                    </div>
                    <div>
                      <span className="badge" style={{ background: svc.badgeColor, color: svc.badgeColor === 'var(--gold)' ? '#1a1a1a' : 'white', borderColor: 'transparent', fontSize: 10 }}>{svc.badge}</span>
                    </div>
                  </div>

                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{svc.title}</h2>
                  <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', marginBottom: 12 }}>{svc.price}</p>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{svc.desc}</p>

                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Available Vehicles</h4>
                  <div style={{ marginBottom: 16 }}>
                    {svc.features.map((f, j) => (
                      <p key={j} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border-primary)' }}>• {f}</p>
                    ))}
                  </div>

                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Included</h4>
                  <div style={{ marginBottom: 20 }}>
                    {svc.perks.map((p, j) => (
                      <p key={j} style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '4px 0' }}>✓ {p}</p>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <Link href="/fleet" className="btn btn-accent" style={{ width: '100%', height: 44, fontSize: 13 }}>
                      Browse {svc.badge} Vehicles <CaretRight size={14} weight="bold" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 0', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>How It Works</h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Book a vehicle in under 2 minutes.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { step: "01", icon: <MapPin size={24} weight="bold" />, title: "Pick Your City", desc: "Select from Lagos, Abuja, Port Harcourt, and 4 more cities." },
              { step: "02", icon: <Clock size={24} weight="bold" />, title: "Choose Duration", desc: "Rent from 30 minutes up to 7 days. Auto-renewal available." },
              { step: "03", icon: <CreditCard size={24} weight="bold" />, title: "Pay & Go", desc: "Secure payment via card or transfer. Keys delivered to you." },
              { step: "04", icon: <Headset size={24} weight="bold" />, title: "24/7 Support", desc: "Roadside assistance and live chat support during your rental." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-soft)', color: 'var(--accent)', margin: '0 auto 16px' }}>
                  {s.icon}
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>Step {s.step}</p>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container-wide">
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
            Browse our fleet of 50+ vehicles across Nigeria.
          </p>
          <Link href="/fleet" className="btn btn-accent" style={{ height: 48, padding: '0 32px', fontSize: 14, fontWeight: 700 }}>
            Browse Fleet <CaretRight size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
