import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const DatePickerInput = ({ selectedDate, setSelectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const dateObj = new Date(selectedDate);
  const [currentMonth, setCurrentMonth] = useState(dateObj.getMonth());
  const [currentYear, setCurrentYear] = useState(dateObj.getFullYear());

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

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const handleDayClick = (day) => {
    if (day === null) return;
    const newDate = new Date(selectedDate);
    newDate.setFullYear(currentYear, currentMonth, day);
    setSelectedDate(newDate.toISOString().slice(0, 16));
    setIsOpen(false);
  };

  const formattedDateDisplay = new Date(selectedDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="relative" ref={pickerRef}>
      <label className="flex items-center text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
        <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
        Date
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-card/50 backdrop-blur-sm text-foreground rounded-xl border border-white/10 hover:border-primary/50 hover:bg-card/80 px-4 py-3 flex items-center justify-between transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-medium text-lg">{formattedDateDisplay}</span>
        <CalendarIcon className="w-5 h-5 text-primary" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 w-full bg-popover/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-4 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
            transition={{ duration: 0.3, ease: "anticipate" }}
          >
            <div className="flex justify-between items-center mb-4">
              <motion.button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span className="font-bold text-primary text-lg">
                {months[currentMonth]} {currentYear}
              </span>
              <motion.button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {generateCalendarDays().map((day, index) => {
                const isSelected = day === new Date(selectedDate).getDate() &&
                  currentMonth === new Date(selectedDate).getMonth() &&
                  currentYear === new Date(selectedDate).getFullYear();

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`p-2 rounded-lg font-medium transition-all relative z-10
                      ${day === null ? 'invisible' : ''}
                      ${isSelected ? 'text-white shadow-lg shadow-primary/30' : 'text-foreground hover:bg-white/10'}
                    `}
                    disabled={day === null}
                    whileHover={day !== null ? { scale: 1.1, zIndex: 20 } : {}}
                    whileTap={day !== null ? { scale: 0.95 } : {}}
                  >
                    {day}
                    {isSelected && (
                      <motion.div
                        layoutId="selectedDay"
                        className="absolute inset-0 bg-primary rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
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
  const dateObj = new Date(selectedDate);
  const [selectedHour, setSelectedHour] = useState(dateObj.getHours());
  const [selectedMinute, setSelectedMinute] = useState(dateObj.getMinutes());

  useEffect(() => {
    const newDate = new Date(selectedDate);
    newDate.setHours(selectedHour, selectedMinute);
    setSelectedDate(newDate.toISOString().slice(0, 16));
  }, [selectedHour, selectedMinute]);

  // Handlers for inputs...
  const handleHourChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
      setSelectedHour(value === '' ? '' : parseInt(value, 10));
    }
  };

  const handleMinuteChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
      setSelectedMinute(value === '' ? '' : parseInt(value, 10));
    }
  };

  const handleBlur = (setter, value, max) => {
    if (value === '') setter(0);
  };

  const adjustTime = (setter, current, max, increment) => {
    setter(prev => {
      let next = prev + increment;
      if (next > max) next = 0;
      if (next < 0) next = max;
      return next;
    });
  };

  return (
    <div className="relative">
      <label className="flex items-center text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
        <Clock className="w-4 h-4 mr-2 text-primary" />
        Time
      </label>
      <div className="flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-2 hover:border-primary/50 transition-all shadow-lg group">

        {/* Hour */}
        <div className="flex flex-col items-center">
          <motion.button
            onClick={() => adjustTime(setSelectedHour, selectedHour, 23, 1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4 rotate-90" />
          </motion.button>
          <input
            type="text"
            value={selectedHour === '' ? '' : String(selectedHour).padStart(2, '0')}
            onChange={handleHourChange}
            onBlur={() => handleBlur(setSelectedHour, selectedHour, 23)}
            className="w-16 text-center bg-transparent text-3xl font-bold focus:outline-none font-mono text-foreground group-hover:text-primary transition-colors"
          />
          <motion.button
            onClick={() => adjustTime(setSelectedHour, selectedHour, 23, -1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.2, y: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4 rotate-90" />
          </motion.button>
        </div>

        <span className="text-3xl font-bold text-muted-foreground/50 mx-2 pb-2 animate-pulse">:</span>

        {/* Minute */}
        <div className="flex flex-col items-center">
          <motion.button
            onClick={() => adjustTime(setSelectedMinute, selectedMinute, 59, 1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4 rotate-90" />
          </motion.button>
          <input
            type="text"
            value={selectedMinute === '' ? '' : String(selectedMinute).padStart(2, '0')}
            onChange={handleMinuteChange}
            onBlur={() => handleBlur(setSelectedMinute, selectedMinute, 59)}
            className="w-16 text-center bg-transparent text-3xl font-bold focus:outline-none font-mono text-foreground group-hover:text-primary transition-colors"
          />
          <motion.button
            onClick={() => adjustTime(setSelectedMinute, selectedMinute, 59, -1)}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.2, y: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4 rotate-90" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };