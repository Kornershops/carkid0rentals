"use client";

import { motion } from "framer-motion";
import { TrendingUp, Car, Activity, AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react";
import { MOCK_FLEET } from "@/data/mock-fleet";

export default function CompanyDashboardPage() {
  const companyFleet = MOCK_FLEET; // In reality, filter by ownerId
  
  const activeCount = companyFleet.filter(v => v.status === "rented").length;
  const idleCount = companyFleet.filter(v => v.status === "available").length;
  const maintenanceCount = companyFleet.filter(v => v.status === "maintenance").length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics & Fleet Ledger</h1>
        <p className="text-muted">Manage your assets and track engine hours.</p>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard 
          title="Monthly Revenue" 
          value="₦4,250,000" 
          trend="+12.5%" 
          icon={<TrendingUp className="w-5 h-5 text-green-500" />} 
        />
        <KPICard 
          title="Active Rentals" 
          value={activeCount.toString()} 
          subtitle="Vehicles currently on trip"
          icon={<Activity className="w-5 h-5 text-primary" />} 
        />
        <KPICard 
          title="Idle Fleet" 
          value={idleCount.toString()} 
          subtitle="Ready to book"
          icon={<Car className="w-5 h-5 text-blue-500" />} 
        />
        <KPICard 
          title="Maintenance Alerts" 
          value={maintenanceCount.toString()} 
          subtitle="Engine hours exceeded"
          icon={<AlertTriangle className="w-5 h-5 text-orange-500" />} 
          alert
        />
      </div>

      {/* Fleet Ledger Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Vehicle Ledger</h2>
          <button className="text-sm px-4 py-2 bg-background border border-border rounded-lg hover:bg-border/50">Export CSV</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-muted uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Vehicle</th>
                <th className="px-6 py-4 font-semibold">Tier</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Engine Hours</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {companyFleet.map((v, i) => {
                // Mocking engine hours logic specifically for Heavy Haul
                const mockEngineHours = v.tier === "heavy-haul" ? 450 + (i * 120) : "N/A";
                const needsMaintenance = typeof mockEngineHours === 'number' && mockEngineHours > 500;
                
                return (
                  <tr key={v.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">{v.brand} {v.model}</div>
                      <div className="text-xs text-muted">ID: {v.id}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-background border border-border">
                        {v.tier.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {v.status === "available" && <span className="text-green-500 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Idle</span>}
                      {v.status === "rented" && <span className="text-primary flex items-center gap-1.5"><Activity className="w-4 h-4 animate-pulse"/> Active</span>}
                      {v.status === "maintenance" && <span className="text-orange-500 flex items-center gap-1.5"><Wrench className="w-4 h-4"/> Maintenance</span>}
                    </td>
                    <td className="px-6 py-4">
                      {v.tier === "heavy-haul" ? (
                        <div className={`flex items-center gap-2 font-mono ${needsMaintenance ? 'text-orange-500 font-bold' : ''}`}>
                          <Clock className="w-4 h-4 opacity-50" />
                          {mockEngineHours} hrs
                          {needsMaintenance && <span className="text-xs px-2 py-0.5 bg-orange-500/10 rounded">Service Due</span>}
                        </div>
                      ) : (
                        <span className="text-muted">Mileage Tracked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline font-medium">Manage</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, subtitle, trend, icon, alert }: any) {
  return (
    <div className={`p-6 rounded-2xl bg-surface border ${alert ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-border'}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-semibold text-muted">{title}</p>
        <div className="p-2 bg-background rounded-lg border border-border">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold tracking-tight mb-1">{value}</h3>
      {trend && <p className="text-sm font-medium text-green-500">{trend} vs last month</p>}
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
    </div>
  );
}
