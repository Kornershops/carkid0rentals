"use client";
import { useStore } from "@/store/use-store";
import { useOfflineRental } from "@/hooks/use-offline-rental";
import { Logo } from "@/components/ui/logo";
import { 
  SteeringWheel, 
  Wallet, 
  Clock, 
  MapPin, 
  TrendUp, 
  Lightning,
  User,
  Gear,
  SignOut,
  CaretRight,
  WifiSlash
} from "@phosphor-icons/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DriverDashboard() {
  const { hub, country } = useStore();
  const { isOffline } = useOfflineRental();

  return (
    <main style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Sidebar / Nav */}
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className="container-wide" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Active in {hub}</span>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} weight="duotone" />
            </div>
          </div>
        </div>
      </nav>

      <div className="container-wide" style={{ paddingTop: 112, paddingBottom: 80 }}>
        {isOffline && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="card" 
            style={{ marginBottom: 32, background: 'rgba(255,69,58,0.1)', border: '1px solid var(--error)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <WifiSlash size={20} color="var(--error)" weight="bold" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--error)' }}>OFFLINE PROTECTION ACTIVE: Starter relay logic is running locally. Avoid crossing hub boundaries.</span>
          </motion.div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          
          {/* Left Column: Earnings & Wallet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card" 
              style={{ padding: 28, background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-primary) 100%)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Wallet</p>
                  <h2 style={{ fontSize: 32, fontWeight: 900, marginTop: 4 }}>₦142,500</h2>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={24} weight="duotone" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-accent" style={{ flex: 1, height: 44, fontSize: 13 }}>Withdraw</button>
                <button className="btn btn-outline" style={{ flex: 1, height: 44, fontSize: 13 }}>Remittance</button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card" 
              style={{ padding: 28 }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Earning Goal</h3>
              <div style={{ position: 'relative', height: 8, background: 'var(--bg-surface)', borderRadius: 4, marginBottom: 12 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '65%', background: 'var(--accent)', borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>₦162k / ₦250k goal</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>65%</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Active Vehicle / Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card" 
              style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--accent)' }}
            >
              <div style={{ padding: 24, background: 'var(--accent-soft)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lightning size={24} weight="fill" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800 }}>Wuling Bingo EV</h3>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>ACTIVE RENTAL</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div style={{ padding: 12, background: 'var(--bg-surface)', borderRadius: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>BATTERY</p>
                    <p style={{ fontSize: 16, fontWeight: 800 }}>82%</p>
                  </div>
                  <div style={{ padding: 12, background: 'var(--bg-surface)', borderRadius: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>RANGE</p>
                    <p style={{ fontSize: 16, fontWeight: 800 }}>240km</p>
                  </div>
                </div>
                <Link href="/dashboard/driver/telemetry" className="btn btn-accent" style={{ width: '100%', height: 48, fontSize: 14 }}>
                  Open Remote Controls <CaretRight size={16} weight="bold" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', paddingLeft: 8 }}>Quick Actions</h3>
              {[
                { icon: <Clock />, label: "Shift Logs", color: 'var(--text-primary)' },
                { icon: <TrendUp />, label: "InDrive/Bolt Stats", color: 'var(--text-primary)' },
                { icon: <Gear />, label: "Vehicle Settings", color: 'var(--text-primary)' },
                { icon: <SignOut />, label: "End Shift", color: 'var(--error)' },
              ].map((action, i) => (
                <button key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', cursor: 'pointer' }}>
                  <div style={{ color: action.color }}>{action.icon}</div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: action.color }}>{action.label}</span>
                  <CaretRight size={14} weight="bold" style={{ opacity: 0.3 }} />
                </button>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
