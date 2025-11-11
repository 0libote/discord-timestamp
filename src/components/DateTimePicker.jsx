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
      <label className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        <Calendar className="w-4 h-4 mr-2" />
        Date
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-discord-50 dark:bg-discord-900 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-discord transition-colors px-4 py-3 flex items-center justify-between"
        whileTap={{ scale: 0.98 }}
      >

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
              <motion.button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-discord-50 dark:hover:bg-discord-darker" whileTap={{ scale: 0.9 }}>
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span className="font-semibold text-lg">
                {months[currentMonth]} {currentYear}
              </span>
              <motion.button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-discord-50 dark:hover:bg-discord-darker" whileTap={{ scale: 0.9 }}>
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
                    ${day === new Date(selectedDate).getDate() && currentMonth === new Date(selectedDate).getMonth() && currentYear === new Date(selectedDate).getFullYear()
                      ? 'bg-discord-500 text-white'
                      : 'hover:bg-discord-50 dark:hover:bg-discord-darker'
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimePickerInput = ({ selectedDate, setSelectedDate, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const dateObj = new Date(selectedDate);
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

  useEffect(() => {
    const newDate = new Date(selectedDate);
    newDate.setHours(selectedHour, selectedMinute);
    setSelectedDate(newDate.toISOString().slice(0, 16));
  }, [selectedHour, selectedMinute, selectedDate]);

  const handleTimeClick = (hour, minute) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setIsOpen(false);
  };

  const formattedTimeDisplay = new Date(selectedDate).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="relative" ref={pickerRef}>
      <label className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        <Clock className="w-4 h-4 mr-2" />
        Time
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-discord-50 dark:bg-discord-900 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-discord transition-colors px-4 py-3 flex items-center justify-between"
        whileTap={{ scale: 0.98 }}
      >
        <span>{formattedTimeDisplay}</span>
        <Clock className="w-5 h-5 text-gray-400" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-4 flex"
          >
            <div className="flex-1 pr-2 border-r border-gray-200 dark:border-gray-700">
              <h4 className="text-center font-semibold mb-2">Hour</h4>
              <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto pr-1">
                {hours.map((h) => (
                  <motion.button
                    key={h}
                    onClick={() => handleTimeClick(h, selectedMinute)}
                    className={`p-2 rounded-full transition-colors text-sm
                      ${h === selectedHour ? 'bg-discord-500 text-white' : 'hover:bg-discord-50 dark:hover:bg-discord-darker'}
                      text-gray-900 dark:text-white
                    `}
                    whileTap={{ scale: 0.9 }}
                  >
                    {String(h).padStart(2, '0')}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex-1 pl-2">
              <h4 className="text-center font-semibold mb-2">Minute</h4>
              <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto pl-1">
                {minutes.map((m) => (
                  <motion.button
                    key={m}
                    onClick={() => handleTimeClick(selectedHour, m)}
                    className={`p-2 rounded-full transition-colors text-sm
                      ${m === selectedMinute ? 'bg-discord-500 text-white' : 'hover:bg-discord-50 dark:hover:bg-discord-darker'}
                      text-gray-900 dark:text-white
                    `}
                    whileTap={{ scale: 0.9 }}
                  >
                    {String(m).padStart(2, '0')}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };