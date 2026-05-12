"use client";

import { useEffect, useRef } from "react";

interface GeofenceMapProps {
  vehicleLat: number;
  vehicleLng: number;
  centerLat: number;
  centerLng: number;
  radiusKm: number;
  state?: string;
}

export default function GeofenceMap({
  vehicleLat,
  vehicleLng,
  centerLat,
  centerLng,
  radiusKm,
  state = "NORMAL",
}: GeofenceMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (radiusKm * 2.5);

    ctx.clearRect(0, 0, width, height);

    const latDiff = (vehicleLat - centerLat) * 111;
    const lngDiff = (vehicleLng - centerLng) * 111 * Math.cos((centerLat * Math.PI) / 180);
    const vehicleX = centerX + lngDiff * scale;
    const vehicleY = centerY - latDiff * scale;

    ctx.strokeStyle = state === "NORMAL" ? "#10b981" : "#ef4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusKm * scale, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = state === "NORMAL" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)";
    ctx.fill();

    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(vehicleX, vehicleY, 8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#6b7280";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fill();
  }, [vehicleLat, vehicleLng, centerLat, centerLng, radiusKm, state]);

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} width={600} height={400} className="w-full h-full" />
      <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded shadow text-sm">
        {state}
      </div>
    </div>
  );
}
