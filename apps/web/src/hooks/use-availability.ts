"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "@/data/mock-fleet";

/**
 * Institutional-grade availability simulator.
 * In a production environment, this would hit the /api/fleet/availability endpoint.
 * Currently simulates real-time inventory checks with a slight delay for premium feel.
 */
export function useAvailability(vehicleId?: string) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (id: string, date: string) => {
    if (!id || !date) return;
    
    setIsChecking(true);
    setError(null);

    // Simulate network latency for institutional reliability check
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulation logic: Some IDs are "maintenance" units
    // e.g. Jet Mover in Lagos is highly utilized
    const busyModels = ['jet-mover-1', 'land-cruiser-armored'];
    const isModelBusy = busyModels.includes(id);
    
    // 15% random busy factor for simulation
    const randomBusy = Math.random() < 0.15;

    setIsAvailable(!isModelBusy && !randomBusy);
    setIsChecking(false);
  };

  return {
    isChecking,
    isAvailable,
    error,
    checkAvailability
  };
}
