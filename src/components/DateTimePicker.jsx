import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ChevronUp, ChevronDown } from 'lucide-react';

const DatePickerInput = ({ selectedDate, setSelectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const date = new Date(selectedDate);
  const [viewMonth, setViewMonth] = useState(date.getMonth());
  const [viewYear, setViewYear] = useState(date.getFullYear());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const handleDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(viewYear);
    newDate.setMonth(viewMonth);
    newDate.setDate(day);
    setSelectedDate(newDate.toISOString().slice(0, 16));
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    let newMonth = viewMonth + offset;
    let newYear = viewYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  return (
    <div className="relative group w-full" ref={pickerRef}>
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
        Select Date
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-input h-[88px] flex flex-col justify-center relative overflow-hidden text-left group-hover:border-primary/50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <CalendarIcon className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Date_Input</span>
        </div>
        <span className="text-xl font-display font-bold text-foreground tracking-wider">
          {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 p-4 w-72 theme-card shadow-2xl left-0 md:left-auto md:right-0 lg:left-0"
            initial={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-display font-bold text-lg text-foreground uppercase tracking-wider">
                {new Date(viewYear, viewMonth).toLocaleString('default', { month: 'short', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = day === date.getDate() && viewMonth === date.getMonth() && viewYear === date.getFullYear();
                const isToday = day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      p-2 text-sm transition-all relative font-mono rounded-md
                      ${isSelected
                        ? 'bg-primary text-primary-foreground font-bold shadow-lg'
                        : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'}
                      ${isToday && !isSelected ? 'text-accent border border-accent/30' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimePickerInput = ({ selectedDate, setSelectedDate }) => {
  const date = new Date(selectedDate);

  const updateTime = (type, increment) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') {
      newDate.setHours(newDate.getHours() + increment);
    } else {
      newDate.setMinutes(newDate.getMinutes() + increment);
    }
    setSelectedDate(newDate.toISOString().slice(0, 16));
  };

  const handleInputChange = (type, value) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') {
      newDate.setHours(parseInt(value) || 0);
    } else {
      newDate.setMinutes(parseInt(value) || 0);
    }
    setSelectedDate(newDate.toISOString().slice(0, 16));
  };

  return (
    <div className="group w-full">
      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
        Select Time
      </label>
      <div className="theme-input h-[88px] flex items-center justify-center gap-2 relative overflow-hidden group-hover:border-primary/50">

        <div className="flex flex-col items-center z-10">
          <motion.button
            whileHover={{ y: -2, color: "var(--primary)" }}
            onClick={() => updateTime('hour', 1)}
            className="p-0.5 text-muted-foreground transition-colors"
          >
            <ChevronUp className="w-3 h-3" />
          </motion.button>
          <input
            type="number"
            min="0"
            max="23"
            value={date.getHours().toString().padStart(2, '0')}
            onChange={(e) => handleInputChange('hour', e.target.value)}
            className="w-12 text-center bg-transparent text-2xl font-display font-bold focus:outline-none text-foreground group-hover:text-primary transition-colors"
          />
          <motion.button
            whileHover={{ y: 2, color: "var(--primary)" }}
            onClick={() => updateTime('hour', -1)}
            className="p-0.5 text-muted-foreground transition-colors"
          >
            <ChevronDown className="w-3 h-3" />
          </motion.button>
        </div>

        <span className="text-xl font-bold text-primary pb-1 animate-pulse">:</span>

        <div className="flex flex-col items-center z-10">
          <motion.button
            whileHover={{ y: -2, color: "var(--primary)" }}
            onClick={() => updateTime('minute', 1)}
            className="p-0.5 text-muted-foreground transition-colors"
          >
            <ChevronUp className="w-3 h-3" />
          </motion.button>
          <input
            type="number"
            min="0"
            max="59"
            value={date.getMinutes().toString().padStart(2, '0')}
            onChange={(e) => handleInputChange('minute', e.target.value)}
            className="w-12 text-center bg-transparent text-2xl font-display font-bold focus:outline-none text-foreground group-hover:text-primary transition-colors"
          />
          <motion.button
            whileHover={{ y: 2, color: "var(--primary)" }}
            onClick={() => updateTime('minute', -1)}
            className="p-0.5 text-muted-foreground transition-colors"
          >
            <ChevronDown className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };