"use client";

import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react";

interface EnhancedDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function EnhancedDatePicker({ value, onChange, label, placeholder = "Select date" }: EnhancedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const today = startOfToday();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-4 border-b border-black/[0.03]">
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); setCurrentMonth(subMonths(currentMonth, 1)); }} 
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
      >
        <CaretLeft size={16} weight="bold" />
      </button>
      <span className="text-sm font-bold text-black tracking-tight">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); setCurrentMonth(addMonths(currentMonth, 1)); }} 
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 px-4 py-2">
        {days.map(day => (
          <div key={day} className="text-[10px] font-bold text-neutral-400 text-center uppercase">
            {day.charAt(0)}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = isBefore(day, today);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, today);

        days.push(
          <button
            key={day.toString()}
            type="button"
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) {
                onChange(format(cloneDay, "yyyy-MM-dd"));
                setIsOpen(false);
              }
            }}
            className={`
              relative h-10 flex items-center justify-center text-sm font-semibold rounded-xl transition-all
              ${isDisabled ? 'opacity-10 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
              ${isSelected ? 'bg-blue-600 text-white shadow-md' : isCurrentMonth ? 'text-black' : 'text-neutral-300'}
            `}
          >
            <span className="relative z-10">{format(day, "d")}</span>
            {isToday && !isSelected && (
              <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-blue-600" />
            )}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="p-3 pt-0">{rows}</div>;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="text-[11px] font-semibold text-neutral-400 mb-3 block uppercase tracking-tight">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-4 bg-white border rounded-2xl px-5 py-4 cursor-pointer transition-all
          ${isOpen ? 'border-blue-500 shadow-md ring-4 ring-blue-500/5' : 'border-black/[0.05] hover:border-black/10 shadow-sm'}
        `}
      >
        <CalendarBlank size={20} className={isOpen ? 'text-blue-600' : 'text-neutral-400'} />
        <span className={`text-sm font-semibold flex-1 ${selectedDate ? 'text-black' : 'text-neutral-400'}`}>
          {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="absolute top-[calc(100%+12px)] left-0 z-[120] w-[320px] bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden"
          >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
