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

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-primary)' }}>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-icon">
          <CaretLeft size={16} weight="bold" />
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-icon">
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '8px 12px' }}>
        {days.map(day => (
          <div key={day} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
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
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isDisabled = isBefore(day, today);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            onClick={() => {
              if (!isDisabled) {
                onChange(format(cloneDay, "yyyy-MM-dd"));
                setIsOpen(false);
              }
            }}
            style={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isDisabled ? 'default' : 'pointer',
              fontSize: 13,
              fontWeight: isSelected ? 700 : 500,
              borderRadius: 8,
              transition: 'all 0.2s',
              color: isDisabled 
                ? 'var(--text-tertiary)' 
                : !isCurrentMonth 
                  ? 'var(--text-tertiary)' 
                  : isSelected 
                    ? 'white' 
                    : 'var(--text-primary)',
              background: isSelected ? 'var(--accent)' : 'transparent',
              opacity: isDisabled ? 0.3 : 1,
              position: 'relative'
            }}
            className={!isDisabled ? "hover-bg" : ""}
          >
            <span>{formattedDate}</span>
            {isSameDay(day, today) && !isSelected && (
              <div style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div style={{ padding: '0 12px 12px' }}>{rows}</div>;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, display: 'block' }}>
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bg-surface)', border: '1px solid var(--border-primary)',
          borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={isOpen ? "border-accent shadow-sm" : ""}
      >
        <CalendarBlank size={18} weight="bold" style={{ color: isOpen ? 'var(--accent)' : 'var(--text-tertiary)' }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: selectedDate ? 'var(--text-primary)' : 'var(--text-tertiary)', flex: 1 }}>
          {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              zIndex: 100,
              width: 300,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 16,
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden'
            }}
          >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .btn-icon {
          width: 32, height: 32, borderRadius: 8, display: flex, alignItems: center, justifyContent: center,
          background: transparent, border: none, color: var(--text-secondary), cursor: pointer, transition: all 0.2s;
        }
        .btn-icon:hover { background: var(--bg-surface); color: var(--accent); }
        .hover-bg:hover { background: var(--bg-surface); }
        .border-accent { border-color: var(--accent) !important; }
      `}</style>
    </div>
  );
}
