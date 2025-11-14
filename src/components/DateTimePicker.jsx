import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

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
      <label className="flex items-center text-sm font-medium mb-2">
        <Calendar className="w-4 h-4 mr-2 text-discord-blurple" />
        Date
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background text-foreground rounded-lg border border-border/60 hover:border-discord-blurple/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-discord-blurple/30 px-4 py-3 flex items-center justify-between transition-all"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="font-medium">{formattedDateDisplay}</span>
        <Calendar className="w-4 h-4 text-discord-blurple" />
      </motion.button>

      {isOpen && (
        <motion.div
          className="absolute z-20 mt-2 w-full bg-card rounded-lg shadow-lg border border-border/50 p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <motion.button 
              onClick={handlePrevMonth} 
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <span className="font-semibold text-lg text-discord-blurple">
              {months[currentMonth]} {currentYear}
            </span>
            <motion.button 
              onClick={handleNextMonth} 
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground mb-2">
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
                className={`p-2 rounded-lg font-medium transition-colors
                  ${day === null ? 'cursor-default' : ''}
                  ${day === new Date(selectedDate).getDate() && currentMonth === new Date(selectedDate).getMonth() && currentYear === new Date(selectedDate).getFullYear()
                    ? 'bg-discord-blurple text-white'
                    : 'hover:bg-accent/50'
                  }
                  ${day !== null ? '' : 'text-muted-foreground'}
                `}
                disabled={day === null}
                whileHover={day !== null ? { scale: 1.1 } : {}}
                whileTap={day !== null ? { scale: 0.95 } : {}}
              >
                {day}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
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

  const handleHourBlur = () => {
    if (selectedHour === '') {
      setSelectedHour(0);
    }
  };

  const handleMinuteBlur = () => {
    if (selectedMinute === '') {
      setSelectedMinute(0);
    }
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
      <label className="flex items-center text-sm font-medium mb-2">
        <Clock className="w-4 h-4 mr-2 text-discord-blurple" />
        Time
      </label>
      <div className="flex items-center justify-around bg-background rounded-lg border border-border/60 px-2 py-2 hover:border-discord-blurple/40 transition-all">
        {/* Hour Input */}
        <div className="flex items-center">
          <motion.button
            onClick={decrementHour}
            className="p-1 rounded-lg hover:bg-accent/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <input
            type="text"
            value={selectedHour === '' ? '' : String(selectedHour).padStart(2, '0')}
            onChange={handleHourChange}
            onBlur={handleHourBlur}
            className="w-12 text-center bg-transparent text-lg font-semibold focus:outline-none"
            aria-label="Selected Hour"
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                incrementHour();
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                decrementHour();
              }
            }}
          />
          <motion.button
            onClick={incrementHour}
            className="p-1 rounded-lg hover:bg-accent/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <span className="text-xl font-bold text-discord-blurple">:</span>

        {/* Minute Input */}
        <div className="flex items-center">
          <motion.button
            onClick={decrementMinute}
            className="p-1 rounded-lg hover:bg-accent/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <input
            type="text"
            value={selectedMinute === '' ? '' : String(selectedMinute).padStart(2, '0')}
            onChange={handleMinuteChange}
            onBlur={handleMinuteBlur}
            className="w-12 text-center bg-transparent text-lg font-semibold focus:outline-none"
            aria-label="Selected Minute"
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                incrementMinute();
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                decrementMinute();
              }
            }}
          />
          <motion.button
            onClick={incrementMinute}
            className="p-1 rounded-lg hover:bg-accent/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };