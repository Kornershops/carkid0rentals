"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Logo } from "@/components/ui/logo";
import { 
  ShieldCheck, 
  Lightning, 
  MapTrifold, 
  Broadcast, 
  DeviceMobile,
  HardDrive,
  CaretRight,
  Warning,
  CircleNotch
} from "@phosphor-icons/react";
import Link from "next/link";

const ESCALATION_STAGES = [
  { 
    stage: "Stage 1: Warning", 
    trigger: "Boundary/Time Violation", 
    action: "In-App & SMS Alerts", 
    desc: "The system detects a minor infraction. Driver receives immediate haptic and audio warnings.",
    color: "var(--success)"
  },
  { 
    stage: "Stage 2: Limp Mode 1", 
    trigger: "Persistent Violation (+5 mins)", 
    action: "Speed Capped at 40km/h", 
    desc: "The Go backend sends an MQTT command to the IoT module to restrict throttle response.",
    color: "var(--accent)"
  },
  { 
    stage: "Stage 3: Limp Mode 2", 
    trigger: "Critical Escalation", 
    action: "Speed Capped at 10km/h", 
    desc: "Maximum safety enforcement before complete immobilization. Hazard lights activated automatically.",
    color: "#FF9F0A"
  },
  { 
    stage: "Stage 4: Immobilize", 
    trigger: "Theft/Safety Override", 
    action: "Full Starter Relay Cut", 
    desc: "Total immobilization. The vehicle cannot be restarted until authorized by the hub controller.",
    color: "var(--error)"
  },
];

export default function TechShowcasePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <main ref={containerRef} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <Link href="/" className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>Back to Home</Link>
        </div>
      </nav>

      {/* Hero: The Handshake */}
      <section style={{ height: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div className="container-wide" style={{ zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="badge badge-accent" style={{ marginBottom: 24 }}>CORE TECHNOLOGY</div>
            <h1 style={{ fontSize: 'clamp(44px, 8vw, 88px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, marginBottom: 32 }}>
              Safe-Halt™ <br />
              <span style={{ color: 'var(--accent)' }}>Hardware Handshake.</span>
            </h1>
            <p style={{ fontSize: 20, color: 'var(--text-secondary)', maxWidth: 600, lineHeight: 1.6 }}>
              Where the Go (Fiber v3) backend meets the vehicle's electrical heart. A sub-second security loop protecting assets across Africa.
            </p>
          </motion.div>
        </div>

        {/* Abstract Hardware Viz */}
        <motion.div 
          style={{ position: 'absolute', right: '-10%', top: '20%', width: '50%', height: '60%', opacity: 0.4, y: y1 }}
          className="hidden lg:block"
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--accent)', borderRadius: '40px', transform: 'rotate(-15deg)' }} />
            <div style={{ position: 'absolute', inset: '40px', border: '1px solid var(--border-primary)', borderRadius: '30px', transform: 'rotate(-10deg)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <CircleNotch size={200} weight="thin" className="animate-spin-slow" color="var(--accent)" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* The Stack Section */}
      <section style={{ padding: '120px 0', background: 'var(--bg-elevated)' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em' }}>The Digital-to-Drive Stack</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { icon: <DeviceMobile />, title: "The Client", desc: "Next.js 15 PWA with offline geofence caching and biometric unlocking via WebAuthn." },
              { icon: <Broadcast />, title: "The Relay", desc: "Go (Fiber) backend communicating via MQTT over encrypted TLS to Wialon-integrated IoT modules." },
              { icon: <HardDrive />, title: "The Edge", desc: "Hardware-level Safe-Halt relay installed on the vehicle's starter circuit for signal-independent safety." },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="card" 
                style={{ padding: 40, textAlign: 'center', background: 'var(--bg-primary)' }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                  {cloneElement(s.icon, { size: 48, weight: "duotone" })}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Escalation Sequence */}
      <section style={{ padding: '120px 0' }}>
        <div className="container-wide">
          <div style={{ maxWidth: 800, marginBottom: 80 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 24 }}>The Safe-Stop Escalation</h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Our proprietary logic ensures that vehicle recovery is safe for both the driver and the asset, avoiding abrupt stops in high-traffic zones.</p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '23px', top: 0, bottom: 0, width: 2, background: 'var(--border-primary)' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
              {ESCALATION_STAGES.map((s, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  style={{ display: 'flex', gap: 48, position: 'relative' }}
                >
                  <div style={{ 
                    width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-primary)', border: `2px solid ${s.color}`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, color: s.color, fontWeight: 900,
                    boxShadow: `0 0 20px ${s.color}44`
                  }}>
                    {i + 1}
                  </div>
                  <div className="card" style={{ flex: 1, padding: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.stage}</h3>
                      <div className="badge" style={{ background: 'var(--bg-surface)', fontSize: 11, fontWeight: 700 }}>TRIGGER: {s.trigger}</div>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>ACTION: {s.action}</p>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Geofence Interactive Stub */}
      <section style={{ padding: '120px 0', background: 'var(--bg-elevated)' }}>
        <div className="container-wide">
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
            <div style={{ padding: 64 }}>
              <MapTrifold size={48} weight="duotone" color="var(--accent)" style={{ marginBottom: 24 }} />
              <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 24, letterSpacing: '-0.03em' }}>S2 Geometry Geofencing</h2>
              <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
                We utilize Google’s S2 Geometry library to partition African cities into hyper-accurate cells. This allows for boundary detection with <span style={{ color: 'white', fontWeight: 700 }}>50cm precision</span>, even with GPS drift.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ padding: '16px 24px', borderRadius: 16, background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', marginBottom: 4 }}>LATENCY</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: 'var(--success)' }}>&lt;140ms</p>
                </div>
                <div style={{ padding: '16px 24px', borderRadius: 16, background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', marginBottom: 4 }}>UPTIME</p>
                  <p style={{ fontSize: 24, fontWeight: 900 }}>99.98%</p>
                </div>
              </div>
            </div>
            <div style={{ background: '#000', minHeight: 400, position: 'relative' }}>
              {/* Mock Map with glowing boundary */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <Lightning size={64} weight="fill" color="var(--accent)" className="animate-pulse" />
                <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', marginTop: 16, color: 'var(--accent)' }}>ENFORCEMENT ACTIVE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 40 }}>Ready to secure your fleet?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Link href="/partners" className="btn btn-accent" style={{ height: 56, padding: '0 40px', fontSize: 16 }}>Partner with Us</Link>
          <Link href="/about" className="btn btn-outline" style={{ height: 56, padding: '0 40px', fontSize: 16 }}>About the Mission</Link>
        </div>
      </section>
    </main>
  );
}

function cloneElement(element: any, props: any) {
  return <element.type {...element.props} {...props} />;
}
