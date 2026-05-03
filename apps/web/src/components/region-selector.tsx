"use client";

import { useStore, OperatingCountry, OperatingHub } from "@/store/use-store";
import { MapPin, Globe, CaretDown, Check } from "@phosphor-icons/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES: Record<OperatingCountry, OperatingHub[]> = {
  Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna", "Enugu", "Warri"],
  Kenya: ["Nairobi"],
  "South Africa": ["Johannesburg"],
  Egypt: ["Cairo"],
  Ghana: ["Accra"],
};

export function RegionSelector() {
  const { country, hub, setCountry, setHub } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"country" | "city">("country");

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={toggle}
        className="btn btn-ghost" 
        style={{ 
          height: 44, 
          padding: '0 16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}
      >
        <Globe size={18} weight="duotone" />
        <span>{country} • {hub}</span>
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
                right: 0, 
                zIndex: 101, 
                width: 320,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 16,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)' }}>
                <button 
                  onClick={() => setActiveTab("country")}
                  style={{ 
                    flex: 1, padding: '14px', fontSize: 12, fontWeight: 700, 
                    color: activeTab === "country" ? 'var(--accent)' : 'var(--text-tertiary)',
                    borderBottom: activeTab === "country" ? '2px solid var(--accent)' : 'none'
                  }}
                >
                  SELECT COUNTRY
                </button>
                <button 
                  onClick={() => setActiveTab("city")}
                  style={{ 
                    flex: 1, padding: '14px', fontSize: 12, fontWeight: 700, 
                    color: activeTab === "city" ? 'var(--accent)' : 'var(--text-tertiary)',
                    borderBottom: activeTab === "city" ? '2px solid var(--accent)' : 'none'
                  }}
                >
                  SELECT CITY
                </button>
              </div>

              <div style={{ padding: 8, maxHeight: 300, overflowY: 'auto' }}>
                {activeTab === "country" ? (
                  Object.keys(COUNTRIES).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCountry(c as OperatingCountry);
                        setHub(COUNTRIES[c as OperatingCountry][0]);
                        setActiveTab("city");
                      }}
                      style={{ 
                        width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderRadius: 8, textAlign: 'left', fontSize: 14, color: 'var(--text-secondary)',
                        background: country === c ? 'var(--accent-soft)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: country === c ? 'var(--accent)' : 'var(--border-primary)' }} />
                        {c}
                      </div>
                      {country === c && <Check size={16} weight="bold" color="var(--accent)" />}
                    </button>
                  ))
                ) : (
                  COUNTRIES[country].map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        setHub(h);
                        setIsOpen(false);
                      }}
                      style={{ 
                        width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderRadius: 8, textAlign: 'left', fontSize: 14, color: 'var(--text-secondary)',
                        background: hub === h ? 'var(--accent-soft)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <MapPin size={16} color={hub === h ? 'var(--accent)' : 'var(--text-tertiary)'} />
                        {h}
                      </div>
                      {hub === h && <Check size={16} weight="bold" color="var(--accent)" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
