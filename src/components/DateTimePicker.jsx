import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DatePickerInput = ({ selectedDate, setSelectedDate, theme }) => {
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
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday

  const generateCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null); // Placeholder for days before the 1st
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

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="relative" ref={pickerRef}>
      <label className="flex items-center text-sm font-medium text-text-light dark:text-text-dark mb-2">
        <Calendar className="w-4 h-4 mr-2 text-discord" />
        Date
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-discord/10 dark:bg-discord/20 text-text-light dark:text-text-dark rounded-lg border border-discord focus:outline-none focus:ring-2 focus:ring-discord transition-colors px-4 py-3 flex items-center justify-between"
        whileTap={{ scale: 0.98 }}
      >
        <span>{formattedDateDisplay}</span>
        <Calendar className="w-5 h-5 text-text-light/70 dark:text-text-dark/70" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-20 mt-2 w-full bg-card-light dark:bg-card-dark rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-4"
          >
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <motion.button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-discord/20 dark:hover:bg-discord/20" whileTap={{ scale: 0.9 }}>
                <ChevronLeft className="w-5 h-5 text-text-light dark:text-text-dark" />
              </motion.button>
              <span className="font-semibold text-lg text-text-light dark:text-text-dark">
                {months[currentMonth]} {currentYear}
              </span>
              <motion.button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-discord/20 dark:hover:bg-discord/20" whileTap={{ scale: 0.9 }}>
                <ChevronRight className="w-5 h-5 text-text-light dark:text-text-dark" />
              </motion.button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-sm font-medium text-text-light/70 dark:text-text-dark/70 mb-2">
              {weekdays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {generateCalendarDays().map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`p-2 rounded-full transition-colors
                    ${day === null ? 'cursor-default' : ''}
                    ${day === new Date(selectedDate).getDate() && currentMonth === new Date(selectedDate).getMonth() && currentYear === new Date(selectedDate).getFullYear()
                      ? 'bg-discord text-white'
                      : 'hover:bg-discord/20 dark:hover:bg-discord/20'
                    }
                    ${day !== null ? 'text-text-light dark:text-text-dark' : 'text-gray-300 dark:text-gray-600'}
                  `}
                  whileTap={{ scale: day !== null ? 0.9 : 1 }}
                  disabled={day === null}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimePickerInput = ({ selectedDate, setSelectedDate, theme }) => {
  const dateObj = new Date(selectedDate);
  const [selectedHour, setSelectedHour] = useState(dateObj.getHours());
  const [selectedMinute, setSelectedMinute] = useState(dateObj.getMinutes());

  useEffect(() => {
    const newDate = new Date(selectedDate);
    newDate.setHours(selectedHour, selectedMinute);
    setSelectedDate(newDate.toISOString().slice(0, 16));
  }, [selectedHour, selectedMinute, selectedDate]);

  const handleHourChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 23;
    if (value > 23) value = 0;
    setSelectedHour(value);
  };

  const handleMinuteChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 59;
    if (value > 59) value = 0;
    setSelectedMinute(value);
  };

  const incrementHour = () => {
    setSelectedHour((prev) => (prev === 23 ? 0 : prev + 1));
  };

  const decrementHour = () => {
    setSelectedHour((prev) => (prev === 0 ? 23 : prev - 1));
  };

  const incrementMinute = () => {
    setSelectedMinute((prev) => (prev === 59 ? 0 : prev + 1));
  };

  const decrementMinute = () => {
    setSelectedMinute((prev) => (prev === 0 ? 59 : prev - 1));
  };

  return (
    <div className="relative">
      <label className="flex items-center text-sm font-medium text-text-light dark:text-text-dark mb-2">
        <Clock className="w-4 h-4 mr-2 text-discord" />
        Time
      </label>
      <div className="flex items-center justify-center gap-2">
        {/* Hour Input */}
        <div className="flex items-center bg-discord/10 dark:bg-discord/20 rounded-lg border border-discord px-2 py-1">
          <motion.button
            onClick={decrementHour}
            className="p-1 rounded-full hover:bg-discord/20 dark:hover:bg-discord/20 text-text-light dark:text-text-dark"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <input
            type="number"
            value={String(selectedHour).padStart(2, '0')}
            onChange={handleHourChange}
            onBlur={handleHourChange} // Ensure value is formatted on blur
            className="w-12 text-center bg-transparent text-text-light dark:text-text-dark text-lg font-semibold focus:outline-none"
            min="0"
            max="23"
            aria-label="Hour"
          />
          <motion.button
            onClick={incrementHour}
            className="p-1 rounded-full hover:bg-discord/20 dark:hover:bg-discord/20 text-text-light dark:text-text-dark"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <span className="text-xl font-bold text-text-light dark:text-text-dark">:</span>

        {/* Minute Input */}
        <div className="flex items-center bg-discord/10 dark:bg-discord/20 rounded-lg border border-discord px-2 py-1">
          <motion.button
            onClick={decrementMinute}
            className="p-1 rounded-full hover:bg-discord/20 dark:hover:bg-discord/20 text-text-light dark:text-text-dark"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <input
            type="number"
            value={String(selectedMinute).padStart(2, '0')}
            onChange={handleMinuteChange}
            onBlur={handleMinuteChange} // Ensure value is formatted on blur
            className="w-12 text-center bg-transparent text-text-light dark:text-text-dark text-lg font-semibold focus:outline-none"
            min="0"
            max="59"
            aria-label="Minute"
          />
          <motion.button
            onClick={incrementMinute}
            className="p-1 rounded-full hover:bg-discord/20 dark:hover:bg-discord/20 text-text-light dark:text-text-dark"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };