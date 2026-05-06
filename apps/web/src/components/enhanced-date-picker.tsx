"use client";

import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarBlank, CaretLeft, CaretRight, X } from "@phosphor-icons/react";

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

  // Close on outside click
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
    <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-white/5">
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); setCurrentMonth(subMonths(currentMonth, 1)); }} 
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-slate-400 transition-colors"
      >
        <CaretLeft size={16} weight="bold" />
      </button>
      <span className="text-xs font-black uppercase tracking-widest text-white">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); setCurrentMonth(addMonths(currentMonth, 1)); }} 
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-slate-400 transition-colors"
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 px-3 py-2 border-b border-white/5">
        {days.map(day => (
          <div key={day} className="text-[9px] font-black text-slate-500 text-center uppercase tracking-tighter">
            {day}
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
              relative h-10 flex items-center justify-center text-xs font-bold rounded-lg transition-all
              ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
              ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : ''}
              ${!isCurrentMonth && !isSelected ? 'text-slate-600' : 'text-slate-200'}
            `}
          >
            <span className="relative z-10">{format(day, "d")}</span>
            {isToday && !isSelected && (
              <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-indigo-500" />
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
    return <div className="p-3 space-y-1">{rows}</div>;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-4 bg-white/5 border rounded-2xl px-5 py-4 cursor-pointer transition-all
          ${isOpen ? 'border-indigo-500/50 bg-white/10 shadow-lg shadow-indigo-500/10' : 'border-white/10 hover:border-white/20'}
        `}
      >
        <CalendarBlank size={20} className={isOpen ? 'text-indigo-400' : 'text-slate-400'} />
        <span className={`text-sm font-bold flex-1 ${selectedDate ? 'text-white' : 'text-slate-500'}`}>
          {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[calc(100%+12px)] left-0 z-[100] w-[320px] glass bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
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
