"use client";

import { useStore, UserRole } from "@/store/use-store";
import { SteeringWheel, Crown, Truck, User, CaretDown, Check } from "@phosphor-icons/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES: { id: UserRole; label: string; icon: any; desc: string }[] = [
  { id: "customer", label: "Exotic & Elite", icon: Crown, desc: "Luxury rentals & premium concierge" },
  { id: "driver", label: "Eco-Gig Driver", icon: SteeringWheel, desc: "Gig work rentals (Bolt, Uber)" },
  { id: "logistics", label: "Heavy-Haul", icon: Truck, desc: "Enterprise logistics & hauling" },
];

export function RoleSelector() {
  const { role, setRole } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeRole = ROLES.find(r => r.id === role) || ROLES[0];
  const Icon = activeRole.icon;

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost" 
        style={{ 
          height: 44, 
          padding: '0 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent)',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--accent)'
        }}
      >
        <Icon size={18} weight="duotone" />
        <span>{activeRole.label}</span>
        <CaretDown size={14} style={{ opacity: 0.5 }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{ 
                position: 'absolute', 
                top: 'calc(100% + 12px)', 
                left: 0, 
                zIndex: 101, 
                width: 280,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 16,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                padding: 8
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-tertiary)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SELECT YOUR PROFILE
              </p>
              {ROLES.map((r) => {
                const RIcon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setIsOpen(false);
                    }}
                    style={{ 
                      width: '100%', padding: '12px', display: 'flex', alignItems: 'center', gap: 12,
                      borderRadius: 12, textAlign: 'left',
                      background: role === r.id ? 'var(--accent-soft)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ 
                      width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: role === r.id ? 'var(--accent)' : 'var(--bg-elevated)',
                      color: role === r.id ? 'white' : 'var(--accent)'
                    }}>
                      <RIcon size={20} weight="duotone" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: role === r.id ? 'var(--accent)' : 'var(--text-primary)' }}>{r.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.desc}</p>
                    </div>
                    {role === r.id && <Check size={16} weight="bold" color="var(--accent)" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
