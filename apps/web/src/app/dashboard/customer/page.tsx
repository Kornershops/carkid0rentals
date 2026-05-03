"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/use-store";
import { useOfflineRental } from "@/hooks/use-offline-rental";
import { 
  CaretRight, 
  Clock, 
  MapPin, 
  Crown, 
  CalendarBlank, 
  Receipt, 
  User, 
  Sparkle,
  ChatCircleText,
  ThermometerHot,
  MusicNotes,
  ShieldCheck,
  WifiSlash
} from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";

export default function CustomerDashboard() {
  const [tab, setTab] = useState<"active" | "history">("active");
  const { isOffline } = useOfflineRental();

  const mockRentals = [
    { id: "EL-902", vehicle: "Mercedes G-Wagon G63", duration: "48 Hours", date: "May 4, 2026", price: "₦850,000", status: "active", hub: "Lagos", stage: "Vehicle in Prep" },
    { id: "EL-002", vehicle: "Porsche Taycan Turbo S", duration: "24 Hours", date: "Apr 28, 2026", price: "₦580,000", status: "completed", hub: "Abuja" },
  ];

  const active = mockRentals.filter(r => r.status === "active");
  const history = mockRentals.filter(r => r.status === "completed");

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="badge badge-accent" style={{ background: 'var(--gold-soft)', color: 'var(--gold)', border: '1px solid var(--gold)' }}>
              ELITE MEMBER
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} weight="duotone" />
            </div>
          </div>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {isOffline && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="card" 
            style={{ marginBottom: 32, background: 'rgba(255,69,58,0.1)', border: '1px solid var(--error)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <WifiSlash size={20} color="var(--error)" weight="bold" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--error)' }}>OFFLINE SHIELD ACTIVE: Using locally cached lease data. Some concierge features limited.</span>
          </motion.div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
          
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>Elite Concierge</h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 40 }}>Manage your luxury fleet and active concierge services.</p>

            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', borderRadius: 12, padding: 4, marginBottom: 32, border: '1px solid var(--border-primary)', maxWidth: 400 }}>
              {(["active", "history"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: tab === t ? 'var(--accent)' : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-tertiary)', transition: 'all 0.2s',
                }}>
                  {t === "active" ? `Active (${active.length})` : `History (${history.length})`}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(tab === "active" ? active : history).map(r => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={r.id} className="card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.id} • {r.hub} HUB</p>
                      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{r.vehicle}</h3>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> {r.duration}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalendarBlank size={16} /> {r.date}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent)' }}>{r.price}</p>
                      {r.status === 'active' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                          {r.stage}
                        </div>
                      )}
                    </div>
                  </div>

                  {r.status === 'active' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 20, borderTop: '1px solid var(--border-primary)' }}>
                      <button className="btn btn-outline" style={{ height: 44, fontSize: 12, gap: 8 }}>
                        <ThermometerHot size={16} /> Temp
                      </button>
                      <button className="btn btn-outline" style={{ height: 44, fontSize: 12, gap: 8 }}>
                        <MusicNotes size={16} /> Cabin
                      </button>
                      <button className="btn btn-accent" style={{ height: 44, fontSize: 12, gap: 8 }}>
                        Track Delivery
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="card" style={{ padding: 24, background: 'var(--gold-soft)', border: '1px solid var(--gold)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gold)', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <ChatCircleText size={24} weight="fill" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)', marginBottom: 8 }}>Private Concierge</h3>
              <p style={{ fontSize: 13, color: 'rgba(212, 175, 55, 0.8)', lineHeight: 1.5, marginBottom: 20 }}>
                Your dedicated agent "Amara" is available 24/7 for custom requests and itinerary planning.
              </p>
              <button className="btn" style={{ width: '100%', height: 44, background: 'var(--gold)', color: '#1a1a1a', fontWeight: 700, fontSize: 13 }}>
                Start Live Chat
              </button>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Elite Benefits</h3>
              {[
                { icon: <Sparkle />, label: "Complimentary Airport Pickup" },
                { icon: <Crown />, label: "360° Inspection Guard" },
                { icon: <ShieldCheck />, label: "Full Insurance Waiver" },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ color: 'var(--gold)' }}>{b.icon}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
