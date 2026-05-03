"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  ShieldWarning, 
  Key, 
  Camera, 
  CheckCircle, 
  Warning, 
  WifiSlash, 
  MapTrifold, 
  Car,
  CaretRight,
  Broadcast
} from "@phosphor-icons/react";

export default function CustomerActiveTripPage() {
  const [tripState, setTripState] = useState<"pending_walkaround" | "recording" | "active" | "offline">("pending_walkaround");
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (tripState === "active") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [tripState]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const startCamera = async () => {
    setTripState("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable. Simulating stream.");
    }
  };

  const completeWalkaround = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
    }
    setTripState("active");
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-background font-inter antialiased overflow-hidden">
      
      {/* --- OFFLINE TOLERANCE UI --- */}
      <AnimatePresence>
        {tripState === "offline" && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center justify-between z-50"
          >
            <div className="flex items-center gap-3 text-amber-600">
              <WifiSlash size={20} weight="bold" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Signal Integrity Compromised</p>
                <p className="text-[9px] font-bold opacity-80 uppercase tracking-tighter mt-0.5">Operating from Local Telemetry Buffer.</p>
              </div>
            </div>
            <button 
              onClick={() => setTripState("active")} 
              className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-white border border-amber-500/30 text-amber-600 rounded-lg shadow-sm"
            >
              Force Sync
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT MAP AREA --- */}
      <div className="flex-1 relative overflow-hidden bg-surface">
         {/* Map Placeholder */}
         <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')] bg-cover bg-center grayscale contrast-125" />
         <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/50 pointer-events-none" />
         
         {/* Active Map UI */}
         {tripState === "active" && (
           <>
             {/* Center Marker */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute -inset-2" />
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-background relative z-10">
                  <Car size={24} weight="bold" />
                </div>
             </div>

             {/* Geofence Boundary Visual */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-4 border-dashed border-red-500/20 rounded-full bg-red-500/5 pointer-events-none animate-[spin_60s_linear_infinite]" />
             
             {/* Telemetry Stats Overlay */}
             <div className="absolute top-6 left-6 z-40 space-y-3">
               <div className="bg-background/90 backdrop-blur border border-border p-4 rounded-2xl shadow-xl min-w-[200px]">
                  <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <Broadcast size={14} weight="bold" className="text-primary" /> Core Telemetry
                  </p>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted uppercase">Engine Status</p>
                      <p className="text-sm font-black uppercase text-green-500">IGNITION_ON</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-bold text-muted uppercase">Load</p>
                      <p className="text-sm font-black uppercase">12.4%</p>
                    </div>
                  </div>
               </div>
             </div>
           </>
         )}

         {/* --- PENDING WALKAROUND OVERLAY --- */}
         <AnimatePresence>
           {tripState === "pending_walkaround" && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex items-center justify-center z-20 bg-background/90 backdrop-blur-sm p-6"
             >
               <div className="bg-surface border border-border rounded-[40px] p-12 max-w-lg w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] text-center">
                 <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10">
                   <Key size={40} weight="duotone" className="text-primary" />
                 </div>
                 <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Initial Access Granted</h2>
                 <p className="text-muted text-[11px] font-bold uppercase tracking-widest leading-loose mb-12 max-w-xs mx-auto">
                   Escrow funds verified. Execute 360° visual documentation to authorize engine ignition.
                 </p>
                 <button 
                   onClick={startCamera}
                   className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm shadow-2xl shadow-primary/30"
                 >
                   <Camera size={24} weight="bold" /> Start Pre-Trip Inspection
                 </button>
               </div>
             </motion.div>
           )}

           {/* --- RECORDING OVERLAY --- */}
           {tripState === "recording" && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex items-center justify-center z-30 bg-black p-6"
             >
               <div className="relative w-full max-w-xl aspect-[3/4] md:aspect-video rounded-[40px] overflow-hidden bg-background border border-white/10 shadow-2xl">
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted 
                   className="w-full h-full object-cover grayscale opacity-80"
                 />
                 
                 <div className="absolute inset-0 border-2 border-white/10 m-6 rounded-[32px] pointer-events-none" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                 
                 <div className="absolute top-10 left-10 flex items-center gap-4">
                   <div className="bg-red-600 px-4 py-2 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg">
                     <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> REC 00:08
                   </div>
                   <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] border border-white/10">
                     SATELLITE_LINK: ACTIVE
                   </div>
                 </div>
                 
                 <div className="absolute bottom-10 left-0 w-full flex justify-center px-10">
                   <button 
                     onClick={completeWalkaround}
                     className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-white/90 transition-all"
                   >
                     <CheckCircle size={24} weight="bold" /> Authorize Engine Unlock
                   </button>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* --- PERSISTENT COMMAND CENTER BAR --- */}
      <AnimatePresence>
        {tripState === "active" && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-40"
          >
            <div className="bg-background border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] rounded-[32px] p-6 flex flex-col md:flex-row items-center gap-8 justify-between">
              
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                  <Clock size={28} weight="duotone" className="text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Asset Time Remaining</p>
                  <p className="font-mono text-3xl font-black tracking-tighter text-foreground leading-none">{formatTime(timeLeft)}</p>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-border" />

              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center shadow-inner">
                  <MapPin size={28} weight="duotone" className="text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Geofence Perimeter</p>
                  <p className="font-mono text-xl font-black tracking-tighter uppercase leading-none text-foreground">4.2 KM TO EDGE</p>
                </div>
              </div>

              <button className="w-full md:w-auto px-8 py-5 bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95">
                Deactivate Asset
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev Toggle */}
      {tripState === "active" && (
        <button 
          onClick={() => setTripState("offline")}
          className="absolute top-6 right-6 z-50 text-[10px] font-black uppercase tracking-widest px-3 py-2 bg-surface/80 backdrop-blur border border-border rounded-xl text-muted hover:text-foreground transition-all"
        >
          SIM_SIGNAL_LOSS
        </button>
      )}

    </div>
  );
}
