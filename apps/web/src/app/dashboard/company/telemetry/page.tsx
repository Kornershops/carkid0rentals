"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, ShieldAlert, Zap, Truck, AlertOctagon, Volume2, PowerOff, Filter, Search } from "lucide-react";

export default function TelemetryGodViewPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Mock active telemetry data
  const activeVehicles = [
    { id: "v-003", title: "Mercedes G63 AMG", tier: "elite", speed: 120, status: "active", lat: 6.5244, lng: 3.3792 },
    { id: "v-005", title: "Actros 2645", tier: "heavy-haul", speed: 65, status: "warning", alert: "Approaching Route Restriction", lat: 6.4654, lng: 3.4064 },
    { id: "v-001", title: "Corolla Hybrid", tier: "eco-gig", speed: 45, status: "active", lat: 6.5000, lng: 3.3500 },
  ];

  const selectedData = activeVehicles.find(v => v.id === selectedVehicle);

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-screen w-full bg-[#1a1a20] relative overflow-hidden">
      
      {/* Map Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=2000&q=80')] bg-cover bg-center opacity-30 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a20] via-transparent to-transparent" />
      </div>

      {/* Floating Header */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-background/80 backdrop-blur-md border border-border px-4 py-2 rounded-xl flex items-center gap-3 pointer-events-auto shadow-lg">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold tracking-tight">Live Telemetry (God View)</span>
        </div>

        <div className="bg-background/80 backdrop-blur-md border border-border rounded-xl flex items-center pointer-events-auto shadow-lg overflow-hidden">
          <div className="px-3 py-2 border-r border-border hover:bg-surface cursor-pointer"><Search className="w-4 h-4 text-muted" /></div>
          <div className="px-3 py-2 hover:bg-surface cursor-pointer flex items-center gap-2 text-sm text-muted"><Filter className="w-4 h-4" /> Filter</div>
        </div>
      </div>

      {/* Mock Map Markers */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        {activeVehicles.map((vehicle, idx) => (
          <motion.div
            key={vehicle.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            className={`absolute pointer-events-auto cursor-pointer transition-transform hover:scale-110 ${
              idx === 0 ? "top-1/4 left-1/3" : idx === 1 ? "top-1/2 right-1/3" : "bottom-1/3 left-1/2"
            }`}
            onClick={() => setSelectedVehicle(vehicle.id)}
          >
            {/* Pulse effect for warning state */}
            {vehicle.status === "warning" && (
              <div className="absolute -inset-4 bg-orange-500/30 rounded-full animate-ping" />
            )}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-xl relative z-10 ${
              vehicle.status === "warning" ? "bg-orange-500" : "bg-primary"
            }`}>
              {vehicle.tier === "heavy-haul" ? <Truck className="w-4 h-4 text-white" /> : 
               vehicle.tier === "eco-gig" ? <Zap className="w-4 h-4 text-white" /> : 
               <ShieldAlert className="w-4 h-4 text-white" />}
            </div>
            {/* Speed Label */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-white whitespace-nowrap">
              {vehicle.speed} km/h
            </div>
          </motion.div>
        ))}
      </div>

      {/* Side Panel Controls */}
      <AnimatePresence>
        {selectedVehicle && selectedData && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-background/95 backdrop-blur-xl border-l border-white/10 z-20 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedData.title}</h2>
                <p className="text-sm text-muted capitalize">Tier: {selectedData.tier.replace("-", " ")}</p>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="w-8 h-8 flex items-center justify-center bg-surface rounded-full hover:bg-border transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              
              {/* Telemetry Stats */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Live Telemetry</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface rounded-xl border border-border">
                    <p className="text-xs text-muted mb-1">Current Speed</p>
                    <p className="font-mono text-2xl font-bold">{selectedData.speed} <span className="text-sm font-normal text-muted">km/h</span></p>
                  </div>
                  <div className="p-4 bg-surface rounded-xl border border-border">
                    <p className="text-xs text-muted mb-1">Engine Status</p>
                    <p className="text-green-500 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Running
                    </p>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {selectedData.status === "warning" && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex gap-3 text-orange-500">
                  <AlertOctagon className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold mb-1">Geofence / Route Warning</p>
                    <p className="text-xs opacity-80">{selectedData.alert}</p>
                  </div>
                </div>
              )}

              {/* Safe-Halt Overrides */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Safe-Halt Remote Overrides
                </h3>
                <div className="space-y-3">
                  <button className="w-full p-4 bg-surface hover:bg-border/50 border border-border rounded-xl flex items-center justify-between transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Trigger Internal Buzzer</p>
                        <p className="text-xs text-muted">Send warning chime to cabin</p>
                      </div>
                    </div>
                  </button>

                  <button className="w-full p-4 bg-surface hover:bg-orange-500/10 hover:border-orange-500/30 border border-border rounded-xl flex items-center justify-between transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                        <AlertOctagon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-orange-500">Engage Limp Mode</p>
                        <p className="text-xs text-muted">Cap speed to 40 km/h via CAN-bus</p>
                      </div>
                    </div>
                  </button>

                  <button className="w-full p-4 bg-surface hover:bg-red-500/10 hover:border-red-500/30 border border-border rounded-xl flex items-center justify-between transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                        <PowerOff className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-red-500">Immobilize Engine</p>
                        <p className="text-xs text-muted">Cut starter relay (Only active if &lt; 5km/h)</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
