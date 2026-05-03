"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  MapPin, 
  Clock, 
  ClockCounterClockwise, 
  Wallet, 
  UserCircle, 
  SignOut,
  CaretUpDown,
  Buildings,
  SteeringWheel,
  ShieldCheck,
  Stack,
  Database
} from "@phosphor-icons/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/logo";

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
      { href: "/dashboard/customer/history", label: "Rentals", icon: <ClockCounterClockwise size={18} /> },
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
    <aside className="w-full md:w-80 border-r border-border bg-surface shrink-0 flex flex-col md:h-screen sticky top-0 z-40 shadow-sm">
      {/* Brand & Context Switcher */}
      <div className="p-8 border-b border-border flex flex-col gap-8">
        <Logo />

        {/* Enterprise Role Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-background border border-border rounded-2xl text-[11px] font-bold hover:bg-surface/50 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-accent">{currentRole.icon}</div>
              <span className="text-foreground uppercase tracking-widest">{currentRole.label}</span>
            </div>
            <CaretUpDown size={14} weight="bold" className="text-muted" />
          </button>

          <AnimatePresence>
            {isSwitcherOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full mt-3 left-0 w-full bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
              >
                {roles.map((r) => (
                  <Link
                    key={r.id}
                    href={`/dashboard/${r.id}`}
                    onClick={() => setIsSwitcherOpen(false)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      role === r.id ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-surface text-muted hover:text-foreground"
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
      <div className="flex-1 overflow-y-auto py-10 px-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-4 px-4 hidden md:block">Operational Hub</p>
        {navItems[role].map((item) => (
          <NavLink 
            key={item.href}
            href={item.href} 
            icon={item.icon} 
            label={item.label} 
            active={pathname === item.href} 
          />
        ))}
        
        <div className="mt-auto hidden md:block border-t border-border pt-10">
          <div className="bg-background border border-border rounded-[32px] p-6 mb-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center text-accent">
                   <UserCircle size={28} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground leading-none">Security ID</p>
                  <p className="text-[9px] font-bold text-success uppercase mt-1.5 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    KYC Level 2 Validated
                  </p>
                </div>
             </div>
          </div>
          <button className="flex items-center gap-3 w-full px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
            <SignOut size={18} weight="bold" /> De-authenticate
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
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
        active 
          ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20" 
          : "text-muted border-transparent hover:text-foreground hover:bg-surface"
      }`}
    >
      <div className={active ? "text-primary-foreground" : "text-accent"}>{icon}</div>
      {label}
    </Link>
  );
}
