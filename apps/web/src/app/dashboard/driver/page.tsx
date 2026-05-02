"use client";

import { motion } from "framer-motion";
import { Zap, DollarSign, Target, TrendingUp, Car, BatteryCharging } from "lucide-react";

export default function DriverDashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Driver Workspace</h1>
        <p className="text-muted">Track your daily shift revenue and rent-to-own progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Vehicle Info */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-surface border border-border flex flex-col sm:flex-row items-center gap-8">
          <div className="w-full sm:w-1/2 aspect-video bg-background rounded-2xl relative overflow-hidden border border-border">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590362891991-f766f28d8212?w=800&q=80')] bg-cover bg-center" />
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-yellow-500 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Active Shift
            </div>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Toyota Corolla Hybrid</h2>
              <p className="text-muted">License: EKY-123-AB</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <BatteryCharging className="w-4 h-4 text-yellow-500" />
                <span className="font-mono">22 km/L</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="w-4 h-4 text-muted" />
                <span className="font-mono">Sedan</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
               <p className="text-xs text-muted uppercase tracking-wider mb-1">Time Remaining in Shift</p>
               <p className="text-xl font-mono font-bold">06:45:30</p>
            </div>
          </div>
        </div>

        {/* Financial Quick View */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <p className="text-sm font-semibold text-muted mb-1">Today's Net Revenue</p>
            <h3 className="text-4xl font-bold text-foreground">₦12,500</h3>
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Rental cost covered
            </p>
          </div>
          
          <button className="w-full py-3 mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-yellow-500/20">
            Log Bolt/Uber Earnings
          </button>
        </div>
      </div>

      {/* Rent-to-Own Tracker */}
      <div className="p-8 rounded-3xl bg-surface border border-border">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Rent-to-Own Pathway
            </h2>
            <p className="text-muted text-sm">You are on track to own this vehicle in 4 months.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-muted">Total Paid</p>
            <p className="text-2xl font-bold">₦1,250,000</p>
          </div>
        </div>

        <div className="relative pt-6 pb-2">
          {/* Milestone markers */}
          <div className="absolute top-0 left-0 w-full flex justify-between px-2">
            <span className="text-[10px] text-muted font-mono">0%</span>
            <span className="text-[10px] text-muted font-mono">25%</span>
            <span className="text-[10px] text-muted font-mono">50%</span>
            <span className="text-[10px] text-muted font-mono">75%</span>
            <span className="text-[10px] text-primary font-bold font-mono">100% (Own)</span>
          </div>
          
          <div className="w-full h-4 bg-background rounded-full overflow-hidden border border-border relative">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "65%" }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 relative"
             >
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-50" />
             </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}
