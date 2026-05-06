"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/use-store";
import { MOCK_FLEET } from "@/data/mock-fleet";
import { X, ArrowsLeftRight, CaretRight } from "@phosphor-icons/react";
import { BlurImage } from "@/components/ui/blur-image";
import { useState } from "react";
import dynamic from "next/dynamic";

const VehicleComparisonModal = dynamic(() => import("./vehicle-comparison-modal"), {
  ssr: false
});

export default function ComparisonBar() {
  const { comparisonIds, removeFromCompare, clearComparison } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const vehicles = MOCK_FLEET.filter(v => comparisonIds.includes(v.id));

  return (
    <>
      <AnimatePresence>
        {vehicles.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[50] w-[calc(100%-2rem)] max-w-2xl"
          >
            <div className="glass bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-2xl flex items-center justify-between gap-6">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
                {vehicles.map(v => (
                  <div key={v.id} className="relative group shrink-0">
                    <div className="w-14 h-10 rounded-xl overflow-hidden border border-white/10 relative">
                      <BlurImage src={v.images[0].path} alt="" fill className="object-cover" shimmer={false} />
                    </div>
                    <button 
                      onClick={() => removeFromCompare(v.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} weight="bold" />
                    </button>
                  </div>
                ))}
                
                {Array.from({ length: 3 - vehicles.length }).map((_, i) => (
                  <div key={i} className="w-14 h-10 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-white/10">
                    <ArrowsLeftRight size={14} />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white">Compare Matrix</div>
                  <div className="text-[9px] font-bold text-slate-500">{vehicles.length} of 3 assets</div>
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-accent h-12 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                >
                  {vehicles.length > 1 ? 'Contrast Assets' : 'Selection Active'}
                  <CaretRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VehicleComparisonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
