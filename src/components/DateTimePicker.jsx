import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DateTimePicker = ({ selectedDate, setSelectedDate, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const dateObj = new Date(selectedDate);
  const [currentMonth, setCurrentMonth] = useState(dateObj.getMonth());
  const [currentYear, setCurrentYear] = useState(dateObj.getFullYear());
  const [selectedHour, setSelectedHour] = useState(dateObj.getHours());
  const [selectedMinute, setSelectedMinute] = useState(dateObj.getMinutes());

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
    const newDate = new Date(currentYear, currentMonth, day, selectedHour, selectedMinute);
    setSelectedDate(newDate.toISOString().slice(0, 16));
    // setIsOpen(false); // Keep open to allow time selection
  };

  const handleHourChange = (e) => {
    const hour = parseInt(e.target.value);
    setSelectedHour(hour);
    const newDate = new Date(currentYear, currentMonth, dateObj.getDate(), hour, selectedMinute);
    setSelectedDate(newDate.toISOString().slice(0, 16));
  };

  const handleMinuteChange = (e) => {
    const minute = parseInt(e.target.value);
    setSelectedMinute(minute);
    const newDate = new Date(currentYear, currentMonth, dateObj.getDate(), selectedHour, minute);
    setSelectedDate(newDate.toISOString().slice(0, 16));
  };

  const formattedDate = new Date(selectedDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="relative" ref={pickerRef}>
      <label className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        <Calendar className="w-4 h-4 mr-2" />
        Date & Time
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-discord-500 transition-colors px-4 py-3 flex items-center justify-between"
        whileTap={{ scale: 0.98 }}
      >
        <span>{formattedDate}</span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-4"
          >
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <motion.button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" whileTap={{ scale: 0.9 }}>
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span className="font-semibold text-lg">
                {months[currentMonth]} {currentYear}
              </span>
              <motion.button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" whileTap={{ scale: 0.9 }}>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
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
                    ${day === dateObj.getDate() && currentMonth === dateObj.getMonth() && currentYear === dateObj.getFullYear()
                      ? 'bg-discord-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    ${day !== null ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-600'}
                  `}
                  whileTap={{ scale: day !== null ? 0.9 : 1 }}
                  disabled={day === null}
                >
                  {day}
                </motion.button>
              ))}
            </div>

            {/* Time Picker */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <select
                value={selectedHour}
                onChange={handleHourChange}
                className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-discord-500"
              >
                {[...Array(24).keys()].map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="text-lg font-semibold">:</span>
              <select
                value={selectedMinute}
                onChange={handleMinuteChange}
                className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-discord-500"
              >
                {[...Array(60).keys()].map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateTimePicker;