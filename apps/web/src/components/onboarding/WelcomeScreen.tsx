"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/onboarding/store";

export default function WelcomeScreen() {
  const router = useRouter();
  const { completeStep, skipOnboarding, markWelcomeSeen } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to CarKid0 Rentals",
      description: "Rent vehicles with confidence using our Safe-Halt anti-theft system",
      icon: "🚗",
      color: "bg-blue-50",
    },
    {
      title: "Book in Minutes",
      description: "Browse, select dates, and book your perfect vehicle instantly",
      icon: "⚡",
      color: "bg-green-50",
    },
    {
      title: "Stay Safe with Safe-Halt",
      description: "GPS tracking and smart boundaries keep you and the vehicle protected",
      icon: "🛡️",
      color: "bg-purple-50",
    },
    {
      title: "Drive with Peace of Mind",
      description: "24/7 support, insurance included, and transparent pricing",
      icon: "✨",
      color: "bg-orange-50",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    markWelcomeSeen();
    router.push("/listings");
  };

  const handleGetStarted = () => {
    completeStep("welcome");
    markWelcomeSeen();
    router.push("/auth/register");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-8">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-blue-600"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Slide Content */}
      <div className={`max-w-md w-full ${slides[currentSlide].color} rounded-3xl p-8 shadow-xl transition-all duration-500`}>
        <div className="text-center">
          {/* Icon */}
          <div className="text-8xl mb-6 animate-bounce">
            {slides[currentSlide].icon}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            {slides[currentSlide].description}
          </p>

          {/* Slide Counter */}
          <p className="text-sm text-gray-500 mb-6">
            {currentSlide + 1} of {slides.length}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8 max-w-md w-full">
        <button
          onClick={handleSkip}
          className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Skip
        </button>
        <button
          onClick={handleNext}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-lg"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>

      {/* Features Preview */}
      <div className="mt-12 grid grid-cols-3 gap-4 max-w-md w-full">
        <div className="text-center">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-xs text-gray-600">Secure</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-xs text-gray-600">Fast</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">💯</div>
          <p className="text-xs text-gray-600">Trusted</p>
        </div>
      </div>
    </div>
  );
}
