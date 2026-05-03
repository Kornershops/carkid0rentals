"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  MapPin, 
  Clock, 
  History, 
  Wallet, 
  UserCircle, 
  SignOut,
  CaretUpDown,
  Buildings,
  SteeringWheel,
  ShieldCheck,
  Stack
} from "@phosphor-icons/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  role: "customer" | "company" | "admin" | "driver";
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const roles = [
    { id: "customer", label: "Personal Account", icon: <UserCircle size={18} weight="duotone" /> },
    { id: "company", label: "Fleet Business", icon: <Buildings size={18} weight="duotone" /> },
    { id: "driver", label: "Driver Portal", icon: <SteeringWheel size={18} weight="duotone" /> },
    { id: "admin", label: "Control Center", icon: <ShieldCheck size={18} weight="duotone" /> },
  ];

  const currentRole = roles.find(r => r.id === role) || roles[0];

  const navItems = {
    customer: [
      { href: "/dashboard/customer", label: "Active Trip", icon: <MapPin size={18} /> },
      { href: "/dashboard/customer/history", label: "Rentals", icon: <History size={18} /> },
      { href: "/dashboard/customer/wallet", label: "Wallet", icon: <Wallet size={18} /> },
    ],
    company: [
      { href: "/dashboard/company", label: "Fleet Monitor", icon: <Car size={18} /> },
      { href: "/dashboard/company/telemetry", label: "IoT Data", icon: <Stack size={18} /> },
      { href: "/dashboard/company/wallet", label: "Revenue", icon: <Wallet size={18} /> },
    ],
    driver: [
      { href: "/dashboard/driver", label: "My Gigs", icon: <SteeringWheel size={18} /> },
      { href: "/dashboard/driver/earnings", label: "Earnings", icon: <Wallet size={18} /> },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Global Fleet", icon: <Car size={18} /> },
      { href: "/dashboard/admin/shadow-pilot", label: "Shadow Pilot", icon: <ShieldCheck size={18} /> },
    ],
  };

  return (
    <aside className="w-full md:w-64 border-r border-border bg-surface shrink-0 flex flex-col md:h-screen sticky top-0 z-40 shadow-sm">
      {/* Brand & Context Switcher */}
      <div className="p-4 border-b border-border flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car size={18} weight="bold" className="text-white" />
          </div>
          <span className="text-sm font-black tracking-tighter uppercase text-foreground">CarKid<span className="text-primary">0</span> Dashboard</span>
        </Link>

        {/* Enterprise Role Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-background border border-border rounded-xl text-xs font-bold hover:bg-surface/50 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="text-primary">{currentRole.icon}</div>
              <span className="text-foreground uppercase tracking-tight">{currentRole.label}</span>
            </div>
            <CaretUpDown size={14} weight="bold" className="text-muted" />
          </button>

          <AnimatePresence>
            {isSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full mt-2 left-0 w-full bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50 p-1"
              >
                {roles.map((r) => (
                  <Link
                    key={r.id}
                    href={`/dashboard/${r.id}`}
                    onClick={() => setIsSwitcherOpen(false)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      role === r.id ? "bg-primary text-white" : "hover:bg-surface text-muted hover:text-foreground"
                    }`}
                  >
                    {r.icon}
                    {r.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-hidden">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2 px-3 hidden md:block">Main Menu</p>
        {navItems[role].map((item) => (
          <NavLink 
            key={item.href}
            href={item.href} 
            icon={item.icon} 
            label={item.label} 
            active={pathname === item.href} 
          />
        ))}
        
        <div className="mt-auto hidden md:block border-t border-border pt-6">
          <div className="bg-background border border-border rounded-xl p-4 mb-4">
             <div className="flex items-center gap-3">
                <UserCircle size={32} weight="duotone" className="text-primary" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-foreground leading-none">Verified Asset</p>
                  <p className="text-[9px] font-bold text-green-500 uppercase mt-1">KYC LEVEL 2</p>
                </div>
             </div>
          </div>
          <button className="flex items-center gap-3 w-full px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
            <SignOut size={18} weight="bold" /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
        active 
          ? "bg-primary text-white shadow-md shadow-primary/20" 
          : "text-muted hover:text-foreground hover:bg-surface border border-transparent"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
