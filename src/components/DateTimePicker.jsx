import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

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
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-bold mb-2 text-foreground uppercase tracking-wider">
        Date
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass-panel text-foreground rounded-xl px-4 py-3 flex items-center justify-between transition-all shadow-lg hover:shadow-primary/10 hover:border-primary/30 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-sm font-medium flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
          {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 p-4 w-72 glass-card rounded-2xl shadow-2xl border border-white/10"
            initial={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-bold text-lg text-foreground">
                {new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-xs font-bold text-muted-foreground uppercase tracking-wider py-1">
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
                      p-2 text-sm rounded-lg transition-all relative
                      ${isSelected
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold'
                        : 'hover:bg-white/10 text-foreground'}
                      ${isToday && !isSelected ? 'text-primary font-bold' : ''}
                    `}
                  >
                    {day}
                    {isToday && !isSelected && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
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
      <label className="block text-sm font-bold mb-2 text-foreground uppercase tracking-wider">
        Time
      </label>
      <div className="glass-panel rounded-xl p-4 flex items-center justify-center gap-4 shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all group-hover:border-primary/30">
        <div className="flex flex-col items-center">
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => updateTime('hour', 1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rotate-90" />
          </motion.button>
          <input
            type="number"
            min="0"
            max="23"
            value={date.getHours().toString().padStart(2, '0')}
            onChange={(e) => handleInputChange('hour', e.target.value)}
            className="w-16 text-center bg-transparent text-3xl font-mono font-bold focus:outline-none text-foreground group-hover:text-primary transition-colors"
          />
          <motion.button
            whileHover={{ y: 2 }}
            onClick={() => updateTime('hour', -1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.button>
        </div>

        <span className="text-3xl font-bold text-muted-foreground/50 pb-2 animate-pulse">:</span>

        <div className="flex flex-col items-center">
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => updateTime('minute', 1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rotate-90" />
          </motion.button>
          <input
            type="number"
            min="0"
            max="59"
            value={date.getMinutes().toString().padStart(2, '0')}
            onChange={(e) => handleInputChange('minute', e.target.value)}
            className="w-16 text-center bg-transparent text-3xl font-mono font-bold focus:outline-none text-foreground group-hover:text-primary transition-colors"
          />
          <motion.button
            whileHover={{ y: 2 }}
            onClick={() => updateTime('minute', -1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };