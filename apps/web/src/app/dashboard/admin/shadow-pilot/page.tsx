"use client";

import { useState } from "react";
import { Server, Activity, ShieldAlert, CheckCircle2, Play, Square, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function ShadowPilotPage() {
  const [isSimulating, setIsSimulating] = useState(true);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-red-500 flex items-center gap-3">
            <Server className="w-8 h-8" />
            Shadow Pilot Engine
          </h1>
          <p className="text-muted">Simulate Safe-Halt logic on live vehicles without cutting engine power.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            PHASE: 7-DAY STRESS TEST
          </span>
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${
              isSimulating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSimulating ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isSimulating ? "Stop Simulation" : "Start Simulation"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* PulseSRE Health Monitor */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#1e1e24] border border-border shadow-2xl relative overflow-hidden">
          {/* Mock PulseSRE Graph */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,100 L0,50 Q10,20 20,50 T40,60 T60,30 T80,80 T100,40 L100,100 Z" fill="rgba(239,68,68,0.3)" />
              <path d="M0,50 Q10,20 20,50 T40,60 T60,30 T80,80 T100,40" fill="none" stroke="rgb(239,68,68)" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-red-500" /> PulseSRE Telemetry Health
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-muted mb-1 uppercase">Go Backend Latency</p>
                <p className="font-mono text-2xl font-bold text-white">12<span className="text-sm font-normal text-muted">ms</span></p>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[10%]" /></div>
              </div>
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-muted mb-1 uppercase">MQTT Ping Rate</p>
                <p className="font-mono text-2xl font-bold text-white">5<span className="text-sm font-normal text-muted">s</span></p>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[100%]" /></div>
              </div>
              <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-muted mb-1 uppercase">Dropped Packets</p>
                <p className="font-mono text-2xl font-bold text-white">0.01<span className="text-sm font-normal text-muted">%</span></p>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[5%]" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Shadow Pilot Active Vehicles */}
        <div className="p-6 rounded-3xl bg-surface border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" /> Shadow Vehicles
          </h2>
          <div className="space-y-4">
            <VehicleRow id="v-shadow-1" type="Eco-Gig" status="In Boundary" />
            <VehicleRow id="v-shadow-2" type="Elite" status="Simulated Kill" warning />
            <VehicleRow id="v-shadow-3" type="Heavy Haul" status="In Boundary" />
          </div>
        </div>
      </div>

      {/* Live Simulation Log */}
      <div className="p-6 rounded-3xl bg-black border border-white/10 shadow-2xl font-mono text-sm h-64 overflow-y-auto">
        <h3 className="text-xs font-sans font-bold text-muted uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
          Simulation Output Log (Read-Only)
        </h3>
        {isSimulating ? (
          <div className="space-y-2 opacity-80 text-green-400">
            <p>[14:02:01] <span className="text-blue-400">INFO</span> - PING Received from v-shadow-1 (Lat: 6.52, Lng: 3.37)</p>
            <p>[14:02:05] <span className="text-blue-400">INFO</span> - PING Received from v-shadow-3 (Lat: 6.46, Lng: 3.40)</p>
            <p>[14:02:06] <span className="text-yellow-400">WARN</span> - v-shadow-2 crossed boundary. Triggering Stage 1 Warning.</p>
            <p>[14:02:06] <span className="text-purple-400">SIMULATION</span> - Sent API Request -&gt; Wialon: TRIGGER_BUZZER (v-shadow-2)</p>
            <p className="animate-pulse">[14:02:11] <span className="text-red-500 font-bold">CRITICAL</span> - v-shadow-2 speed &lt; 5km/h out of bounds. SIMULATING FULL ENGINE CUT.</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted">Simulation Paused</div>
        )}
      </div>

    </div>
  );
}

function VehicleRow({ id, type, status, warning }: any) {
  return (
    <div className={`p-3 rounded-xl border ${warning ? 'bg-red-500/10 border-red-500/30' : 'bg-background border-border'} flex items-center justify-between`}>
      <div>
        <p className="font-bold text-sm">{id}</p>
        <p className="text-xs text-muted">{type}</p>
      </div>
      <div className={`text-xs font-bold px-2 py-1 rounded-md ${warning ? 'bg-red-500 text-white' : 'bg-green-500/10 text-green-500'}`}>
        {status}
      </div>
    </div>
  );
}
