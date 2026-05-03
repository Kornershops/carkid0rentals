"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/use-store";

interface OfflineRentalData {
  rentalId: string;
  vehicleId: string;
  expiryTime: number;
  geofencePolygon: [number, number][];
  unlockKey: string;
}

export function useOfflineRental() {
  const [offlineData, setOfflineData] = useState<OfflineRentalData | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem("carkid0_active_rental");
    if (saved) {
      setOfflineData(JSON.parse(saved));
    }

    // Handle online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveRentalLocally = (data: OfflineRentalData) => {
    localStorage.setItem("carkid0_active_rental", JSON.stringify(data));
    setOfflineData(data);
  };

  const clearOfflineData = () => {
    localStorage.removeItem("carkid0_active_rental");
    setOfflineData(null);
  };

  return {
    offlineData,
    isOffline,
    saveRentalLocally,
    clearOfflineData
  };
}
