"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  showArrow?: boolean;
  maxWidth?: number;
}

export function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  showArrow = true,
  maxWidth = 300,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              transform: getTransform(position),
              maxWidth: `${maxWidth}px`,
            }}
          >
            <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              {content}
              {showArrow && (
                <div
                  className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
                  style={getArrowStyle(position)}
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function getTransform(position: string): string {
  switch (position) {
    case "top":
      return "translate(-50%, calc(-100% - 8px))";
    case "bottom":
      return "translate(-50%, 8px)";
    case "left":
      return "translate(calc(-100% - 8px), -50%)";
    case "right":
      return "translate(8px, -50%)";
    default:
      return "translate(-50%, calc(-100% - 8px))";
  }
}

function getArrowStyle(position: string): React.CSSProperties {
  switch (position) {
    case "top":
      return { bottom: "-4px", left: "50%", transform: "translateX(-50%)" };
    case "bottom":
      return { top: "-4px", left: "50%", transform: "translateX(-50%)" };
    case "left":
      return { right: "-4px", top: "50%", transform: "translateY(-50%)" };
    case "right":
      return { left: "-4px", top: "50%", transform: "translateY(-50%)" };
    default:
      return { bottom: "-4px", left: "50%", transform: "translateX(-50%)" };
  }
}

// Feature Highlight Component
interface FeatureHighlightProps {
  title: string;
  description: string;
  targetId: string;
  onNext?: () => void;
  onSkip?: () => void;
  step?: number;
  totalSteps?: number;
}

export function FeatureHighlight({
  title,
  description,
  targetId,
  onNext,
  onSkip,
  step = 1,
  totalSteps = 1,
}: FeatureHighlightProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const element = document.getElementById(targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setCoords({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [targetId]);

  return createPortal(
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in duration-300" />

      {/* Spotlight */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          width: `${coords.width}px`,
          height: `${coords.height}px`,
        }}
      >
        <div className="absolute inset-0 ring-4 ring-blue-500 rounded-lg animate-pulse" />
      </div>

      {/* Tooltip Card */}
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm animate-in slide-in-from-bottom-4 duration-300"
        style={{
          left: `${coords.x + coords.width / 2}px`,
          top: `${coords.y + coords.height + 16}px`,
          transform: "translateX(-50%)",
        }}
      >
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {step} of {totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip Tour
          </button>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        {/* Actions */}
        <div className="flex gap-3">
          {step < totalSteps ? (
            <button
              onClick={onNext}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Got It!
            </button>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

// Help Icon with Tooltip
interface HelpIconProps {
  content: string | React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function HelpIcon({ content, size = "md" }: HelpIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-sm",
    lg: "w-6 h-6 text-base",
  };

  return (
    <Tooltip content={content} position="top">
      <button
        className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors`}
        aria-label="Help"
      >
        ?
      </button>
    </Tooltip>
  );
}

// Info Badge with Tooltip
interface InfoBadgeProps {
  label: string;
  tooltip: string;
  variant?: "info" | "warning" | "success" | "error";
}

export function InfoBadge({ label, tooltip, variant = "info" }: InfoBadgeProps) {
  const variantClasses = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Tooltip content={tooltip}>
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]} cursor-help`}
      >
        {label}
        <span className="text-xs">ⓘ</span>
      </span>
    </Tooltip>
  );
}
