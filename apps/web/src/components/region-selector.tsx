"use client";

import { useStore, OperatingCountry } from "@/store/use-store";
import { MapPin, Globe, CaretDown, Check } from "@phosphor-icons/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HUB_DATA } from "@/lib/constants";

export function RegionSelector() {
  const { country, hub, setCountry, setHub } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"country" | "city">("country");

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 h-10 rounded-full bg-neutral-50 hover:bg-neutral-100 transition-all text-[13px] font-semibold text-black"
      >
        <Globe size={18} weight="bold" className="text-blue-600" />
        <span>{country} • {hub}</span>
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
              className="absolute top-full mt-3 right-0 z-[120] w-72 bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden"
            >
              <div className="flex p-1 bg-neutral-50 rounded-full m-3">
                <button 
                  onClick={() => setActiveTab("country")}
                  className={`flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all ${activeTab === "country" ? "bg-white shadow-sm text-blue-600" : "text-neutral-400"}`}
                >
                  COUNTRY
                </button>
                <button 
                  onClick={() => setActiveTab("city")}
                  className={`flex-1 py-1.5 rounded-full text-[11px] font-bold transition-all ${activeTab === "city" ? "bg-white shadow-sm text-blue-600" : "text-neutral-400"}`}
                >
                  CITY
                </button>
              </div>

              <div className="p-2 max-h-[300px] overflow-y-auto">
                {activeTab === "country" ? (
                  Object.keys(HUB_DATA).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCountry(c as OperatingCountry);
                        setHub(HUB_DATA[c as OperatingCountry][0]);
                        setActiveTab("city");
                      }}
                      className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-colors ${country === c ? "bg-blue-50/50 text-blue-600" : "hover:bg-neutral-50 text-neutral-600"}`}
                    >
                      <span className="text-sm font-semibold">{c}</span>
                      {country === c && <Check size={16} weight="bold" />}
                    </button>
                  ))
                ) : (
                  HUB_DATA[country].map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        setHub(h);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-colors ${hub === h ? "bg-blue-50/50 text-blue-600" : "hover:bg-neutral-50 text-neutral-600"}`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={16} weight={hub === h ? "bold" : "regular"} />
                        <span className="text-sm font-semibold">{h}</span>
                      </div>
                      {hub === h && <Check size={16} weight="bold" />}
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
