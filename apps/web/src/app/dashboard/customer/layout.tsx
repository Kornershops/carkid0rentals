import { Car, Map, Clock, History, Wallet, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Sidebar / Bottom Nav (Mobile) */}
      <aside className="w-full md:w-64 border-r border-border bg-surface/30 shrink-0 flex flex-col md:h-screen sticky top-0">
        <div className="p-6 border-b border-border hidden md:block">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-premium-gradient rounded-lg flex items-center justify-center">
              <Car className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">CarKid0</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2 hidden md:block">Overview</p>
          <NavLink href="/dashboard/customer" icon={<Map className="w-4 h-4" />} label="Active Trip" active />
          <NavLink href="/dashboard/customer/history" icon={<History className="w-4 h-4" />} label="Rental History" />
          <NavLink href="/dashboard/customer/wallet" icon={<Wallet className="w-4 h-4" />} label="Wallet & Escrow" />
          
          <div className="mt-auto hidden md:block">
            <div className="bg-surface border border-border rounded-xl p-4 mb-4">
               <div className="flex items-center gap-3 mb-3">
                  <UserCircle className="w-10 h-10 text-muted" />
                  <div>
                    <p className="text-sm font-bold">Verified User</p>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> KYC Passed
                    </p>
                  </div>
               </div>
            </div>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-80px)] md:h-screen">
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
          ? "bg-primary/10 text-primary border border-primary/20" 
          : "text-muted hover:text-foreground hover:bg-surface border border-transparent"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
