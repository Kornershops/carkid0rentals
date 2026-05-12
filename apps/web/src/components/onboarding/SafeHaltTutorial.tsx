"use client";

import { useState } from "react";
import { useOnboarding } from "@/lib/onboarding/store";

export default function SafeHaltTutorial() {
  const { completeStep, markSafeHaltIntroSeen } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "What is Safe-Halt?",
      description: "Our smart anti-theft system that keeps you and the vehicle safe",
      visual: <SafeHaltOverview />,
    },
    {
      title: "Geofence Boundary",
      description: "You'll have a designated area where you can drive",
      visual: <GeofenceBoundary />,
    },
    {
      title: "4-Stage Warning System",
      description: "Progressive alerts if you approach the boundary or time expires",
      visual: <FourStageSystem />,
    },
    {
      title: "Stay Within Bounds",
      description: "Keep an eye on the map and time to avoid any issues",
      visual: <StayWithinBounds />,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    completeStep("safe-halt-intro");
    markSafeHaltIntroSeen();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 justify-center">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-purple-600"
                    : index < currentSlide
                    ? "w-2 bg-purple-400"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg text-gray-600">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Visual */}
          <div className="mb-8">
            {slides[currentSlide].visual}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            {currentSlide > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium transition-colors shadow-lg"
            >
              {currentSlide === slides.length - 1 ? "Got It!" : "Next"}
            </button>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow">
            <div className="text-2xl mb-2">🛡️</div>
            <p className="text-xs text-gray-600">Protected</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow">
            <div className="text-2xl mb-2">📍</div>
            <p className="text-xs text-gray-600">GPS Tracked</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-xs text-gray-600">Real-Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SafeHaltOverview() {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg mb-3">
            🚗
          </div>
          <p className="text-sm font-medium text-gray-700">Your Vehicle</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-purple-400"></div>
            <span className="text-xs text-purple-600">GPS Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-400"></div>
            <span className="text-xs text-blue-600">Geofence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-400"></div>
            <span className="text-xs text-green-600">Time Limit</span>
          </div>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg mb-3">
            🛡️
          </div>
          <p className="text-sm font-medium text-gray-700">Safe-Halt</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-4">
        <p className="text-sm text-gray-700 text-center">
          Safe-Halt monitors your location and rental time to ensure the vehicle stays safe
        </p>
      </div>
    </div>
  );
}

function GeofenceBoundary() {
  return (
    <div className="bg-gray-100 rounded-2xl p-8 relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>

      {/* Geofence Circle */}
      <div className="relative z-10 flex items-center justify-center h-64">
        <div className="relative">
          {/* Outer boundary (danger zone) */}
          <div className="absolute inset-0 w-64 h-64 rounded-full border-4 border-red-300 border-dashed animate-pulse"></div>
          
          {/* Warning zone */}
          <div className="absolute inset-8 w-48 h-48 rounded-full border-4 border-yellow-300 border-dashed"></div>
          
          {/* Safe zone */}
          <div className="absolute inset-16 w-32 h-32 rounded-full bg-green-100 border-4 border-green-400"></div>
          
          {/* Vehicle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-bounce">🚗</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 mt-6 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-400"></div>
          <span className="text-sm text-gray-700">Safe Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
          <span className="text-sm text-gray-700">Warning (500m)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-300"></div>
          <span className="text-sm text-gray-700">Boundary</span>
        </div>
      </div>
    </div>
  );
}

function FourStageSystem() {
  const stages = [
    {
      stage: "Stage 1",
      name: "Warning",
      icon: "🔔",
      color: "bg-yellow-100 border-yellow-400",
      textColor: "text-yellow-800",
      trigger: "Within 500m of boundary",
      action: "Buzzer sounds",
      speed: "No limit",
    },
    {
      stage: "Stage 2",
      name: "Limp Mode 1",
      icon: "⚠️",
      color: "bg-orange-100 border-orange-400",
      textColor: "text-orange-800",
      trigger: "Crossed boundary",
      action: "Hazard lights flash",
      speed: "40 km/h max",
    },
    {
      stage: "Stage 3",
      name: "Limp Mode 2",
      icon: "🚨",
      color: "bg-red-100 border-red-400",
      textColor: "text-red-800",
      trigger: "200m past boundary",
      action: "Continuous buzzer",
      speed: "15 km/h max",
    },
    {
      stage: "Stage 4",
      name: "Immobilized",
      icon: "🛑",
      color: "bg-gray-900 border-gray-900",
      textColor: "text-white",
      trigger: "Speed < 5 km/h",
      action: "Engine cannot restart",
      speed: "0 km/h",
    },
  ];

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div
          key={index}
          className={`${stage.color} border-2 rounded-xl p-4 transition-all hover:scale-105`}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">{stage.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-bold ${stage.textColor}`}>
                  {stage.stage}: {stage.name}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 text-xs mb-1">Trigger</p>
                  <p className={`font-medium ${stage.textColor}`}>{stage.trigger}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">Action</p>
                  <p className={`font-medium ${stage.textColor}`}>{stage.action}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">Speed Limit</p>
                  <p className={`font-medium ${stage.textColor}`}>{stage.speed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-blue-50 rounded-xl p-4 mt-6">
        <p className="text-sm text-blue-800 text-center">
          <strong>💡 Pro Tip:</strong> Turn around immediately when you hear the warning buzzer to avoid escalation
        </p>
      </div>
    </div>
  );
}

function StayWithinBounds() {
  return (
    <div className="space-y-6">
      {/* Do's */}
      <div className="bg-green-50 rounded-2xl p-6">
        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          Do's
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-green-800">Check the map regularly to see your location</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-green-800">Watch the countdown timer for remaining time</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-green-800">Turn around immediately if you hear warnings</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 mt-1">•</span>
            <span className="text-green-800">Extend your rental if you need more time</span>
          </li>
        </ul>
      </div>

      {/* Don'ts */}
      <div className="bg-red-50 rounded-2xl p-6">
        <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">❌</span>
          Don'ts
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-red-800">Don't ignore warning alerts</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-red-800">Don't drive outside the allowed area</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-red-800">Don't exceed your rental time without extending</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 mt-1">•</span>
            <span className="text-red-800">Don't attempt to disable GPS tracking</span>
          </li>
        </ul>
      </div>

      {/* Help */}
      <div className="bg-purple-50 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">💬</div>
        <h3 className="font-bold text-purple-900 mb-2">Need Help?</h3>
        <p className="text-sm text-purple-800 mb-4">
          Our 24/7 support team is here to assist you
        </p>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
