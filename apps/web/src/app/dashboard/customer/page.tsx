"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Car,
  CalendarBlank,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Receipt,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { api, Booking } from "@/lib/api-client";

// Fallback mock bookings for static/dev mode
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-20260501", listingId: "listing-1", listingTitle: "Mercedes-Benz GLE Coupe AMG",
    listerRole: "admin", startDate: "2026-05-10", endDate: "2026-05-13",
    status: "confirmed", days: 3, pricePerDay: 450, subtotal: 1350, serviceFee: 135,
    total: 1485, currency: "NGN", paymentRef: "", createdAt: "2026-05-01",
  },
  {
    id: "BK-20260428", listingId: "listing-17", listingTitle: "Saglev S5 EV",
    listerRole: "admin", startDate: "2026-05-05", endDate: "2026-05-07",
    status: "completed", days: 2, pricePerDay: 45, subtotal: 90, serviceFee: 9,
    total: 99, currency: "NGN", paymentRef: "", createdAt: "2026-04-28",
  },
  {
    id: "BK-20260507", listingId: "listing-9", listingTitle: "Jet Mover EV (White)",
    listerRole: "lister", startDate: "2026-05-15", endDate: "2026-05-18",
    status: "pending", days: 3, pricePerDay: 180, subtotal: 540, serviceFee: 54,
    total: 594, currency: "NGN", paymentRef: "", createdAt: "2026-05-07",
  },
];

function formatCurrency(price: number, currency: string) {
  switch (currency) {
    case "NGN": return `₦${price.toLocaleString()}`;
    case "KES": return `KSh ${price.toLocaleString()}`;
    case "ZAR": return `R${price.toLocaleString()}`;
    default: return `$${price.toLocaleString()}`;
  }
}

function getStatusBadge(status: Booking["status"]) {
  const map: Record<string, { label: string; className: string }> = {
    confirmed: { label: "Confirmed", className: "bg-green-100 text-green-700" },
    paid: { label: "Paid", className: "bg-blue-100 text-blue-700" },
    active: { label: "Active", className: "bg-indigo-100 text-indigo-700" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    completed: { label: "Completed", className: "bg-gray-100 text-gray-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
  };
  return map[status] || { label: status, className: "bg-gray-100 text-gray-600" };
}

export default function CustomerDashboard() {
  const [tab, setTab] = useState<"active" | "history">("active");
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyBookings()
      .then((data) => { if (data.length > 0) setBookings(data); })
      .catch(() => {}) // Use mock fallback
      .finally(() => setLoading(false));
  }, []);

  const activeBookings = bookings.filter(b => ["confirmed", "paid", "active", "pending"].includes(b.status));
  const historyBookings = bookings.filter(b => ["completed", "cancelled"].includes(b.status));
  const currentBookings = tab === "active" ? activeBookings : historyBookings;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track your active rentals and booking history.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-gray-900">{activeBookings.length}</p>
            <p className="text-xs text-gray-600 font-medium">Active</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-gray-900">{historyBookings.length}</p>
            <p className="text-xs text-gray-600 font-medium">Completed</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
            <p className="text-xs text-gray-600 font-medium">Total Trips</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(bookings.reduce((sum, b) => sum + b.total, 0), "NGN")}
            </p>
            <p className="text-xs text-gray-600 font-medium">Total Spent</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 max-w-xs">
          <button onClick={() => setTab("active")} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${tab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            Active ({activeBookings.length})
          </button>
          <button onClick={() => setTab("history")} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${tab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            History ({historyBookings.length})
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Loading bookings...</div>
        ) : currentBookings.length === 0 ? (
          <div className="text-center py-16">
            <Car size={48} weight="duotone" className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No bookings yet.</p>
            <Link href="/listings">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
                <MagnifyingGlass size={16} weight="bold" /> Browse Vehicles
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {currentBookings.map((booking) => {
              const listing = MOCK_LISTINGS.find(l => l.id === booking.listingId);
              const badge = getStatusBadge(booking.status);
              const isAdmin = booking.listerRole === "admin";

              return (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 md:w-32 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {listing && <Image src={listing.images[0]} alt={booking.listingTitle} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{booking.listingTitle}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {isAdmin ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900">
                                <ShieldCheck size={12} weight="fill" /> CarKid0 Official
                              </span>
                            ) : (
                              <span className="text-xs text-gray-600">Third-party lister</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${badge.className}`}>{badge.label}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarBlank size={14} />
                          {new Date(booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {" → "}
                          {new Date(booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        {listing && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> {listing.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Receipt size={14} /> {formatCurrency(booking.total, booking.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Need another vehicle?</h3>
            <p className="text-sm text-gray-600">Browse our fleet across all tiers.</p>
          </div>
          <Link href="/listings">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
              Browse <ArrowRight size={16} weight="bold" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
