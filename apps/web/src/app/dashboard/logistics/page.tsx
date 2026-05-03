"use client";

import { useStore } from "@/store/use-store";
import { Logo } from "@/components/ui/logo";
import { 
  Truck, 
  MapTrifold, 
  Warning, 
  ArrowsDownUp, 
  Clock, 
  MapPin, 
  CaretRight,
  User,
  ChartBar,
  DotsThreeVertical,
  Lightning,
  Globe
} from "@phosphor-icons/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LogisticsDashboard() {
  const { hub, country } = useStore();

  const activeAssets = [
    { id: "HH-204", model: "Scania R450", status: "transit", load: "24.5 / 35 Tons", destination: "Kano", battery: null, fuel: "65%" },
    { id: "HH-109", model: "Ford F-150 Lightning", status: "loading", load: "0.2 / 0.9 Tons", destination: "Abuja", battery: "92%", fuel: null },
  ];

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="badge badge-accent" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
              LOGISTICS COMMAND
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} weight="duotone" />
            </div>
          </div>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 112, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
          
          {/* Main Fleet View */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>Active Logistics Assets</h1>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" style={{ fontSize: 13 }}><ChartBar size={18} /> Reports</button>
                <Link href="/fleet" className="btn btn-accent" style={{ fontSize: 13, height: 40, padding: '0 16px' }}>Enlist Vehicle</Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeAssets.map((asset, i) => (
                <motion.div 
                  key={asset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <Truck size={24} weight="duotone" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{asset.model}</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Asset ID: {asset.id} • {hub} HUB</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase',
                        background: asset.status === 'transit' ? 'rgba(48,209,88,0.1)' : 'rgba(255,159,10,0.1)',
                        color: asset.status === 'transit' ? 'var(--success)' : 'var(--accent)'
                      }}>
                        {asset.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>CURRENT LOAD</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ArrowsDownUp size={14} color="var(--accent)" />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{asset.load}</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>DESTINATION</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={14} color="var(--accent)" />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{asset.destination}</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>POWER</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {asset.battery ? <Lightning size={14} color="var(--accent)" weight="fill" /> : <Clock size={14} color="var(--accent)" />}
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{asset.battery || asset.fuel}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ height: 40, width: 40, padding: 0 }}>
                        <DotsThreeVertical size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Alerts & Maps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapTrifold size={20} weight="duotone" color="var(--accent)" />
                Route Health
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: 12, background: 'rgba(255,69,58,0.1)', borderRadius: 12, border: '1px solid var(--error)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Warning size={16} color="var(--error)" weight="fill" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--error)' }}>Bridge Clearance Alert</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>HH-204 route (Kano) has 3.5m limit at Mile 12. Auto-rerouting...</p>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <MapPin size={16} color="var(--accent)" weight="fill" />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>Optimal Path Active</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>All other assets are on weight-approved transit corridors.</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24, background: 'var(--gold-soft)', border: '1px solid var(--gold)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={20} weight="duotone" />
                Cross-Border Corridor
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Route Corridor</span>
                  <span style={{ fontWeight: 700 }}>Lagos → Accra</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Border Status</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>Green (1.2h delay)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Est. ECOWAS Tolls</span>
                  <span style={{ fontWeight: 700 }}>₦42,500</span>
                </div>
                <div style={{ height: 1, background: 'rgba(212, 175, 55, 0.2)', margin: '4px 0' }} />
                <button className="btn" style={{ background: 'var(--gold)', color: '#1a1a1a', height: 40, fontSize: 12, fontWeight: 700 }}>
                  Pre-pay Customs
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: 24, background: 'var(--accent)', color: 'white' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Escrow Coverage</h3>
              <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 20 }}>Your corporate logistics account has ₦4.2M in active transit insurance holds.</p>
              <button className="btn" style={{ background: 'white', color: 'var(--accent)', width: '100%', fontSize: 13, fontWeight: 700 }}>Top Up Escrow</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
