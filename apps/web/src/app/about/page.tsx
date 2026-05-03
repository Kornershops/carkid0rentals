"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { 
  Globe, 
  Lightbulb, 
  ShieldCheck, 
  Truck, 
  SteeringWheel, 
  Handshake,
  CaretRight
} from "@phosphor-icons/react";
import Link from "next/link";

const stagger = { visible: { transition: { staggerChildren: 0.15 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } } };

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>Back to Home</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: 160, paddingBottom: 100, textAlign: 'center' }}>
        <div className="container-wide" style={{ maxWidth: 800 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="badge badge-accent" style={{ margin: '0 auto 24px' }}>
              OUR NARRATIVE
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 32 }}>
              Powering Africa's <br />
              <span style={{ color: 'var(--accent)' }}>Mobility Revolution.</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 48 }}>
              CarKid0 is not just a rental platform. We are the vehicle infrastructure layer for the next generation of African gig workers, enterprises, and elite travelers.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section style={{ paddingBottom: 120 }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card" style={{ padding: 48, background: 'var(--bg-elevated)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Lightbulb size={32} weight="duotone" />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Our Vision</h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                To be the singular pulse of African transit—where every major city from Lagos to Cairo is connected by a fleet of intelligent, sustainable, and accessible vehicle assets.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card" style={{ padding: 48, border: '1px solid var(--accent)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Globe size={32} weight="duotone" />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                To democratize vehicle ownership by providing flexible, IoT-enabled access to assets that foster economic growth for drivers and operational excellence for businesses.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ background: 'var(--bg-elevated)', padding: '100px 0' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em' }}>The Three Pillars of CarKid0</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
            {[
              { icon: <SteeringWheel />, title: "Economic Empowerment", desc: "Equipping gig drivers with the tools and vehicles they need to thrive in the digital economy." },
              { icon: <Truck />, title: "Logistics Resilience", desc: "Building the backbone for cross-border African trade with heavy-duty, IoT-monitored assets." },
              { icon: <ShieldCheck />, title: "Technological Trust", desc: "Our Safe-Halt™ technology ensures that both drivers and assets are protected across every mile." },
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners CTA */}
      <section style={{ padding: '120px 0' }}>
        <div className="container-wide">
          <div className="card" style={{ padding: 64, textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-primary) 100%)', border: '1px solid var(--border-primary)' }}>
            <Handshake size={64} weight="duotone" color="var(--accent)" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>Build the Future with Us.</h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px' }}>
              Whether you are a fleet owner, a professional driver, or a logistics enterprise, there is a place for you in the CarKid0 ecosystem.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Link href="/partners" className="btn btn-accent" style={{ height: 56, padding: '0 32px', fontSize: 15 }}>Become a Partner</Link>
              <Link href="/fleet" className="btn btn-outline" style={{ height: 56, padding: '0 32px', fontSize: 15 }}>Browse the Fleet</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
