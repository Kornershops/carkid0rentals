"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CountdownTimer from "@/components/rental/CountdownTimer";
import GeofenceMap from "@/components/map/GeofenceMap";

interface RentalSession {
  id: string;
  vehicleId: string;
  state: string;
  currentLat: number;
  currentLng: number;
  speed: number;
  geofenceCenterLat: number;
  geofenceCenterLng: number;
  geofenceRadius: number;
  rentalEndTime: string;
  distanceFromBoundary: number;
}

export default function RentalSessionPage() {
  const params = useParams();
  const [session, setSession] = useState<RentalSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/v1/rental/session/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setSession(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 5000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!session) return <div className="p-8">Session not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Active Rental Session</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Vehicle ID</p>
            <p className="text-lg font-semibold">{session.vehicleId}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            session.state === "NORMAL" ? "bg-green-100 text-green-800" :
            session.state === "WARNING" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {session.state}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Time Remaining</p>
          <CountdownTimer endTime={session.rentalEndTime} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Speed</p>
            <p className="text-xl font-bold">{session.speed.toFixed(1)} km/h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Distance to Boundary</p>
            <p className="text-xl font-bold">{session.distanceFromBoundary.toFixed(2)} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Geofence Radius</p>
            <p className="text-xl font-bold">{session.geofenceRadius.toFixed(1)} km</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Live Location</h2>
        <GeofenceMap
          vehicleLat={session.currentLat}
          vehicleLng={session.currentLng}
          centerLat={session.geofenceCenterLat}
          centerLng={session.geofenceCenterLng}
          radiusKm={session.geofenceRadius}
          state={session.state}
        />
      </div>
    </div>
  );
}
