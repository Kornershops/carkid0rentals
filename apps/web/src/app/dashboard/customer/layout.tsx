import DashboardSidebar from "@/components/dashboard/sidebar";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-inter antialiased">
      <DashboardSidebar role="customer" />
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-80px)] md:h-screen">
        {children}
      </main>
    </div>
  );
}
