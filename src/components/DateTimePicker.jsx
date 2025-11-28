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
    <div className="relative group" ref={pickerRef}>
      <label className="block text-xs font-mono text-primary uppercase tracking-widest mb-2">
        > Select Date
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/50 border border-gray-800 text-accent font-mono rounded-none px-4 py-3 flex items-center justify-between transition-all hover:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-sm font-medium flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
          {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <div className="w-2 h-2 bg-primary animate-pulse"></div>
      </motion.button>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-accent group-hover:w-full transition-all duration-500"></div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 p-4 w-72 cyber-card shadow-2xl"
            initial={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-display font-bold text-lg text-white uppercase tracking-wider">
                {new Date(viewYear, viewMonth).toLocaleString('default', { month: 'short', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary">
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
                      p-2 text-sm transition-all relative font-mono
                      ${isSelected
                        ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(0,255,157,0.5)]'
                        : 'hover:bg-white/10 text-gray-300 hover:text-white'}
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
    <div className="group">
      <label className="block text-xs font-mono text-primary uppercase tracking-widest mb-2">
        > Select Time
      </label>
      <div className="bg-black/50 border border-gray-800 p-4 flex items-center justify-center gap-4 transition-all group-hover:border-accent/50 relative overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none"></div>

        <div className="flex flex-col items-center z-10">
          <motion.button
            whileHover={{ y: -2, color: "#00ff9d" }}
            onClick={() => updateTime('hour', 1)}
            className="p-1 text-muted-foreground transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>
          <input
            type="number"
            min="0"
            max="23"
            value={date.getHours().toString().padStart(2, '0')}
            onChange={(e) => handleInputChange('hour', e.target.value)}
            className="w-16 text-center bg-transparent text-3xl font-display font-bold focus:outline-none text-white group-hover:text-glow-primary transition-colors"
          />
          <motion.button
            whileHover={{ y: 2, color: "#00ff9d" }}
            onClick={() => updateTime('hour', -1)}
            className="p-1 text-muted-foreground transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </div>

        <span className="text-3xl font-bold text-primary pb-2 animate-pulse">:</span>

        <div className="flex flex-col items-center z-10">
          <motion.button
            whileHover={{ y: -2, color: "#00ff9d" }}
            onClick={() => updateTime('minute', 1)}
            className="p-1 text-muted-foreground transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>
          <input
            type="number"
            min="0"
            max="59"
            value={date.getMinutes().toString().padStart(2, '0')}
            onChange={(e) => handleInputChange('minute', e.target.value)}
            className="w-16 text-center bg-transparent text-3xl font-display font-bold focus:outline-none text-white group-hover:text-glow-primary transition-colors"
          />
          <motion.button
            whileHover={{ y: 2, color: "#00ff9d" }}
            onClick={() => updateTime('minute', -1)}
            className="p-1 text-muted-foreground transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };