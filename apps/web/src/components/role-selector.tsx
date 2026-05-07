"use client";

import { useStore, UserRole } from "@/store/use-store";
import { SteeringWheel, Crown, Truck, CaretDown, Check } from "@phosphor-icons/react";
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
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 h-10 rounded-full bg-blue-50/50 hover:bg-blue-50 transition-all text-[13px] font-semibold text-blue-600 border border-blue-100"
      >
        <Icon size={18} weight="bold" />
        <span>{activeRole.label}</span>
        <CaretDown size={14} className="opacity-40" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[110]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-full mt-3 left-0 z-[120] w-72 bg-white rounded-3xl shadow-xl border border-black/5 p-2 overflow-hidden"
            >
              <p className="text-[10px] font-bold text-neutral-400 px-3 py-2 uppercase tracking-tight">Profile Mode</p>
              {ROLES.map((r) => {
                const RIcon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center gap-4 transition-all ${role === r.id ? "bg-blue-50/50" : "hover:bg-neutral-50"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${role === r.id ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-500"}`}>
                      <RIcon size={20} weight="bold" />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`text-sm font-semibold ${role === r.id ? "text-blue-600" : "text-black"}`}>{r.label}</p>
                      <p className="text-[11px] text-neutral-400 font-medium leading-tight">{r.desc}</p>
                    </div>
                    {role === r.id && <Check size={16} weight="bold" className="text-blue-600" />}
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
