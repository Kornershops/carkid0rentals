"use client";

import { useState, useEffect } from "react";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react";

interface FlexibleDatesCalendarProps {
  listingId: string;
  targetDate: string;
  onDateSelect: (date: string) => void;
}

interface DateOption {
  date: string;
  price: number;
  available: boolean;
  savings?: number;
}

export default function FlexibleDatesCalendar({
  listingId,
  targetDate,
  onDateSelect,
}: FlexibleDatesCalendarProps) {
  const [dates, setDates] = useState<DateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(targetDate);

  useEffect(() => {
    fetchFlexibleDates();
  }, [targetDate]);

  const fetchFlexibleDates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/flexible-dates?listingId=${listingId}&date=${targetDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      // Mock pricing data (in production, this would come from API)
      const basePrice = 50000;
      const dateOptions: DateOption[] = data.dates.map((date: string, idx: number) => {
        const offset = idx - 3;
        const priceVariation = Math.random() * 10000 - 5000;
        const price = Math.round(basePrice + priceVariation);
        const savings = basePrice - price;

        return {
          date,
          price,
          available: Math.random() > 0.2, // 80% availability
          savings: savings > 0 ? savings : undefined,
        };
      });

      setDates(dateOptions);
    } catch (error) {
      console.error("Failed to fetch flexible dates:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDayOffset = (dateStr: string) => {
    const target = new Date(targetDate);
    const current = new Date(dateStr);
    const diff = Math.round((current.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Your date";
    if (diff > 0) return `+${diff} day${diff > 1 ? "s" : ""}`;
    return `${diff} day${diff < -1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Flexible Dates</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Save money by choosing dates within ±3 days of your target date
      </p>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {dates.map((dateOption) => {
          const isTarget = dateOption.date === targetDate;
          const isSelected = dateOption.date === selectedDate;
          const isAvailable = dateOption.available;

          return (
            <button
              key={dateOption.date}
              onClick={() => {
                if (isAvailable) {
                  setSelectedDate(dateOption.date);
                  onDateSelect(dateOption.date);
                }
              }}
              disabled={!isAvailable}
              className={`p-4 rounded-lg border-2 transition text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isTarget
                  ? "border-purple-300 bg-purple-50"
                  : isAvailable
                  ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">{getDayOffset(dateOption.date)}</div>
              <div className="font-semibold text-gray-900 mb-2">{formatDate(dateOption.date)}</div>

              {isAvailable ? (
                <>
                  <div className="text-lg font-bold text-gray-900">
                    ₦{dateOption.price.toLocaleString()}
                  </div>
                  {dateOption.savings && dateOption.savings > 0 && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-semibold mt-1">
                      <TrendingDown className="w-3 h-3" />
                      Save ₦{dateOption.savings.toLocaleString()}
                    </div>
                  )}
                  {dateOption.savings && dateOption.savings < 0 && (
                    <div className="flex items-center gap-1 text-red-600 text-xs font-semibold mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +₦{Math.abs(dateOption.savings).toLocaleString()}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-400 font-semibold">Not available</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Flexible Date Tips</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Weekday bookings are typically cheaper than weekends</li>
          <li>• Prices shown are per day</li>
          <li>• Purple border = Your original target date</li>
          <li>• Blue border = Currently selected date</li>
        </ul>
      </div>
    </div>
  );
}
