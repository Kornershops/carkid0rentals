import { Car, Zap, DollarSign, Wallet, MapPin, Target, LogOut } from "lucide-react";
import Link from "next/link";

export default function DriverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-border bg-surface/30 shrink-0 flex flex-col md:h-screen sticky top-0">
        <div className="p-6 border-b border-border hidden md:block">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Zap className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">Eco-Gig<span className="text-yellow-500">Driver</span></span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2 hidden md:block">Workspace</p>
          <NavLink href="/dashboard/driver" icon={<Car className="w-4 h-4" />} label="Active Vehicle" active />
          <NavLink href="/dashboard/driver/earnings" icon={<DollarSign className="w-4 h-4" />} label="Revenue Tracker" />
          <NavLink href="/dashboard/driver/payouts" icon={<Wallet className="w-4 h-4" />} label="Wallet & Rent-to-Own" />
          
          <div className="mt-auto hidden md:block">
            <div className="bg-surface border border-border rounded-xl p-4 mb-4">
               <p className="text-sm font-bold mb-1">Driver: John Doe</p>
               <p className="text-xs text-muted">Tier: Eco-Gig</p>
               <div className="mt-3 w-full h-1.5 bg-background rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-500 w-[65%]" />
               </div>
               <p className="text-[10px] text-muted mt-1 uppercase">Rent-to-Own: 65%</p>
            </div>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto h-[calc(100vh-80px)] md:h-screen">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
        active 
          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20" 
          : "text-muted hover:text-foreground hover:bg-surface border border-transparent"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
