"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/use-store";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { X, CaretRight, Gauge, Package, Lightning, ShieldCheck, Coins } from "@phosphor-icons/react";
import { BlurImage } from "@/components/ui/blur-image";
import { formatPrice, getCurrencyForCountry } from "@/lib/currency";

export default function VehicleComparisonModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { comparisonIds, removeFromCompare, clearComparison, country } = useStore();
  const vehicles = MOCK_FLEET.filter(v => comparisonIds.includes(v.id));
  const currency = getCurrencyForCountry(country);

  if (vehicles.length === 0 && isOpen) {
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 inset-y-10 md:inset-20 glass bg-[#0a0a0a]/90 rounded-[3rem] z-[70] flex flex-col overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Fleet Comparison Matrix</h2>
                <p className="text-slate-500 text-sm mt-1">Side-by-side technical evaluation of selected assets.</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={clearComparison} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  Reset Matrix
                </button>
                <button onClick={onClose} className="w-12 h-12 rounded-full glass hover:bg-white hover:text-black transition-all flex items-center justify-center">
                  <X size={20} weight="bold" />
                </button>
              </div>
            </div>

            {/* Matrix Body */}
            <div className="flex-1 overflow-x-auto p-8 md:p-12 scrollbar-hide">
              <div className="min-w-[800px] grid grid-cols-[200px_repeat(3,1fr)] gap-8">
                {/* Labels Column */}
                <div className="space-y-12 pt-[220px]">
                  <MatrixLabel icon={<Coins />} label="Base Rate" />
                  <MatrixLabel icon={<Gauge />} label="Performance" />
                  <MatrixLabel icon={<Lightning />} label="Propulsion" />
                  <MatrixLabel icon={<Package />} label="Capacity" />
                  <MatrixLabel icon={<ShieldCheck />} label="Security" />
                </div>

                {/* Vehicle Columns */}
                {vehicles.map(v => (
                  <div key={v.id} className="space-y-12 relative group">
                    <button 
                      onClick={() => removeFromCompare(v.id)}
                      className="absolute top-0 right-0 p-2 text-slate-500 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} weight="bold" />
                    </button>

                    {/* Image & Header */}
                    <div className="space-y-4">
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 shadow-xl bg-white/5">
                        <BlurImage src={v.images[0].path} alt={v.model} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">{v.brand}</div>
                        <div className="text-xl font-bold">{v.model}</div>
                      </div>
                    </div>

                    {/* Data Points */}
                    <MatrixValue value={formatPrice(v.pricePerDay, currency)} subValue="Per 24 Hours" />
                    <MatrixValue value={v.zeroToSixty ? `${v.zeroToSixty}s` : "Standard"} subValue="0-60 MPH" />
                    <MatrixValue value={v.isEV ? "Full Electric" : "Combustion"} subValue="Source" />
                    <MatrixValue value={v.payloadKg ? `${v.payloadKg.toLocaleString()}kg` : "Variable"} subValue="Max Payload" />
                    <MatrixValue value={v.tier === 'elite' ? "High-Security" : "Standard"} subValue="Tiering" />

                    <div className="pt-4">
                      <a href={`/fleet/${v.id}`} className="btn btn-accent w-full h-14 rounded-2xl text-xs">
                        Configure Deployment <CaretRight size={16} weight="bold" />
                      </a>
                    </div>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: 3 - vehicles.length }).map((_, i) => (
                  <div key={i} className="rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center text-slate-700 p-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                      Add vehicle to<br />contrast assets
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MatrixLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-500 h-16">
      <div className="text-indigo-500">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function MatrixValue({ value, subValue }: { value: string; subValue: string }) {
  return (
    <div className="h-16 flex flex-col justify-center border-l border-white/5 pl-6">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-tighter text-slate-500">{subValue}</div>
    </div>
  );
}
