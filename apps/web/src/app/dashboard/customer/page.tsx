"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ShieldAlert, Key, Camera, CheckCircle2, AlertTriangle, WifiOff, Map as MapIcon } from "lucide-react";

export default function CustomerActiveTripPage() {
  const [tripState, setTripState] = useState<"pending_walkaround" | "recording" | "active" | "offline">("pending_walkaround");
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer simulation
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
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
    }
    setTripState("active");
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-surface/10">
      
      {/* --- OFFLINE TOLERANCE UI --- */}
      <AnimatePresence>
        {tripState === "offline" && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-orange-500/10 border-b border-orange-500/20 px-6 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-orange-500">
              <WifiOff className="w-5 h-5" />
              <div>
                <p className="text-sm font-bold">Signal Lost (Offline Mode)</p>
                <p className="text-xs">Geofence and Timer are running from local vehicle hardware.</p>
              </div>
            </div>
            <button onClick={() => setTripState("active")} className="text-xs font-semibold px-3 py-1.5 bg-surface rounded-lg">Reconnect</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT MAP AREA --- */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e24]">
         {/* Map Placeholder (MapLibre GL goes here) */}
         <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')] bg-cover bg-center grayscale" />
         
         {/* Active Map UI */}
         {tripState === "active" && (
           <>
             {/* Center Marker */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping absolute -inset-2" />
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] border-2 border-white relative z-10">
                  <Car className="w-4 h-4" />
                </div>
             </div>

             {/* Geofence Boundary Visual (Mock) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-dashed border-red-500/50 rounded-full bg-red-500/5 pointer-events-none" />
           </>
         )}

         {/* --- PENDING WALKAROUND OVERLAY --- */}
         <AnimatePresence>
           {tripState === "pending_walkaround" && (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="absolute inset-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-md p-6"
             >
               <div className="bg-surface border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
                 <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <Key className="w-8 h-8 text-blue-500" />
                 </div>
                 <h2 className="text-2xl font-bold mb-2">Escrow Funded</h2>
                 <p className="text-muted text-sm mb-8">
                   Your booking is confirmed. To unlock the vehicle and start the timer, please record a 10-second condition walk-around.
                 </p>
                 <button 
                   onClick={startCamera}
                   className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                 >
                   <Camera className="w-5 h-5" /> Start Pre-Trip Check
                 </button>
               </div>
             </motion.div>
           )}

           {/* --- RECORDING OVERLAY --- */}
           {tripState === "recording" && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="absolute inset-0 flex items-center justify-center z-30 bg-black p-6"
             >
               <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden bg-surface border border-white/10">
                 {/* Video Stream */}
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted 
                   className="w-full h-full object-cover"
                 />
                 
                 {/* Camera Overlay UI */}
                 <div className="absolute inset-0 border-4 border-red-500/50 m-4 rounded-2xl pointer-events-none" />
                 <div className="absolute top-8 left-8 bg-black/50 backdrop-blur px-3 py-1.5 rounded-lg text-white font-mono text-sm flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC 00:08
                 </div>
                 
                 <div className="absolute bottom-8 left-0 w-full flex justify-center px-8">
                   <button 
                     onClick={completeWalkaround}
                     className="w-full py-4 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                   >
                     <CheckCircle2 className="w-5 h-5" /> Verify Condition & Unlock Engine
                   </button>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* --- PERSISTENT FLOATING ACTION BAR (FAB) FOR ACTIVE TRIP --- */}
      <AnimatePresence>
        {tripState === "active" && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-40"
          >
            <div className="glass border border-white/10 shadow-2xl rounded-3xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between bg-surface/80 backdrop-blur-xl">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-semibold">Time Remaining</p>
                  <p className="font-mono text-2xl font-bold tracking-tight text-foreground">{formatTime(timeLeft)}</p>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-border" />

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-semibold">Geofence Boundary</p>
                  <p className="font-mono text-lg font-bold tracking-tight">4.2 km away</p>
                </div>
              </div>

              <button className="w-full md:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                End Trip & Return
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev Toggle for Offline Mode Simulation */}
      {tripState === "active" && (
        <button 
          onClick={() => setTripState("offline")}
          className="absolute top-4 right-4 z-50 text-xs px-2 py-1 bg-surface border border-border rounded text-muted"
        >
          Simulate Offline
        </button>
      )}

    </div>
  );
}
