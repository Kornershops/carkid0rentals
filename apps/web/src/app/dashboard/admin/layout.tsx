import { ShieldAlert, Users, Database, Server, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardLayout({
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
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
              <ShieldAlert className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">CarKid0<span className="text-red-500">Admin</span></span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2 hidden md:block">Super Admin</p>
          <NavLink href="/dashboard/admin" icon={<Database className="w-4 h-4" />} label="Platform Health" />
          <NavLink href="/dashboard/admin/verifications" icon={<Users className="w-4 h-4" />} label="KYC Fallbacks" />
          <NavLink href="/dashboard/admin/shadow-pilot" icon={<Server className="w-4 h-4" />} label="Shadow Pilot Engine" active />
          
          <div className="mt-auto hidden md:block">
            <div className="bg-surface border border-border rounded-xl p-4 mb-4">
               <p className="text-sm font-bold mb-1">System Owner</p>
               <p className="text-xs text-red-500 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Production
               </p>
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
          ? "bg-red-500/10 text-red-500 border border-red-500/20" 
          : "text-muted hover:text-foreground hover:bg-surface border border-transparent"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
