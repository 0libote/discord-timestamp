import React, { useState, useEffect, useRef } from 'react';
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
        <Calendar className="w-4 h-4 mr-2 text-discord" />
        Date
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background text-foreground rounded-lg border focus:outline-none focus:ring-2 focus:ring-ring px-4 py-3 flex items-center justify-between"
      >
        <span>{formattedDateDisplay}</span>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div
          className="absolute z-20 mt-2 w-full bg-card rounded-lg shadow-lg border p-4"
        >
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-accent">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-lg">
              {months[currentMonth]} {currentYear}
            </span>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-accent">
              <ChevronRight className="w-5 h-5" />
            </button>
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
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                className={`p-2 rounded-full
                  ${day === null ? 'cursor-default' : ''}
                  ${day === new Date(selectedDate).getDate() && currentMonth === new Date(selectedDate).getMonth() && currentYear === new Date(selectedDate).getFullYear()
                    ? 'bg-discord text-white'
                    : 'hover:bg-accent'
                  }
                  ${day !== null ? '' : 'text-muted-foreground'}
                `}
                disabled={day === null}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
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
        <Clock className="w-4 h-4 mr-2 text-discord" />
        Time
      </label>
      <div className="flex items-center justify-around bg-background rounded-lg border px-2 py-2">
        {/* Hour Input */}
        <div className="flex items-center">
          <button
            onClick={decrementHour}
            className="p-1 rounded-full hover:bg-accent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
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
          <button
            onClick={incrementHour}
            className="p-1 rounded-full hover:bg-accent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xl font-bold">:</span>

        {/* Minute Input */}
        <div className="flex items-center">
          <button
            onClick={decrementMinute}
            className="p-1 rounded-full hover:bg-accent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
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
          <button
            onClick={incrementMinute}
            className="p-1 rounded-full hover:bg-accent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { DatePickerInput, TimePickerInput };