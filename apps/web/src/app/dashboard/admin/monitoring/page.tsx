"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ActiveRental {
  id: string;
  vehicleId: string;
  userId: string;
  state: string;
  speed: number;
  distanceFromBoundary: number;
  timeRemaining: string;
  lastPing: string;
}

export default function AdminMonitoringPage() {
  const [rentals, setRentals] = useState<ActiveRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await fetch("/api/v1/admin/active-rentals", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setRentals(data);
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
    const interval = setInterval(fetchRentals, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredRentals = rentals.filter((r) => 
    filter === "ALL" || r.state === filter
  );

  const stats = {
    total: rentals.length,
    normal: rentals.filter((r) => r.state === "NORMAL").length,
    warning: rentals.filter((r) => r.state === "WARNING").length,
    critical: rentals.filter((r) => r.state.includes("LIMP") || r.state === "IMMOBILIZED").length,
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Active Rental Monitoring</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Active</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-600">Normal</p>
          <p className="text-3xl font-bold text-green-700">{stats.normal}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-600">Warning</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.warning}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <p className="text-sm text-red-600">Critical</p>
          <p className="text-3xl font-bold text-red-700">{stats.critical}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["ALL", "NORMAL", "WARNING", "LIMP_MODE_1", "LIMP_MODE_2", "IMMOBILIZED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Speed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Left</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Ping</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRentals.map((rental) => (
              <tr key={rental.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{rental.vehicleId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rental.state === "NORMAL" ? "bg-green-100 text-green-800" :
                    rental.state === "WARNING" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {rental.state}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{rental.speed.toFixed(1)} km/h</td>
                <td className="px-6 py-4 whitespace-nowrap">{rental.distanceFromBoundary.toFixed(2)} km</td>
                <td className="px-6 py-4 whitespace-nowrap">{rental.timeRemaining}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.lastPing}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/rental/${rental.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
