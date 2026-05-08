"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  ClockCounterClockwise,
  SignOut,
  User,
  House,
} from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { useStore } from "@/store/use-store";

const navItems = [
  { href: "/dashboard/customer", label: "My Bookings", icon: Car },
  { href: "/listings", label: "Browse Vehicles", icon: House },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setAuthenticated } = useStore();

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={20} weight={active ? "fill" : "regular"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={18} weight="bold" className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Customer</p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAuthenticated(false);
              document.cookie = "carkid0_auth=; path=/; max-age=0";
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <SignOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <Link href="/listings" className="text-sm font-medium text-gray-600">Browse</Link>
      </div>

      {/* Content */}
      <main className="flex-1 md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
