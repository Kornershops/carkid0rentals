import DashboardSidebar from "@/components/dashboard/sidebar";

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-inter antialiased">
      <DashboardSidebar role="company" />
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto h-[calc(100vh-80px)] md:h-screen">
        {children}
      </main>
    </div>
  );
}
