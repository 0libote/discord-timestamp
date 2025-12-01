import React from 'react';

export const DatePickerInput = ({ selectedDate, setSelectedDate }) => {
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (!newDate) return;

    // Preserve time from current selection
    const currentTime = selectedDate.split('T')[1];
    setSelectedDate(`${newDate}T${currentTime}`);
  };

  return (
    <input
      type="date"
      value={selectedDate.split('T')[0]}
      onChange={handleDateChange}
      className="glass-input"
    />
  );
};

export const TimePickerInput = ({ selectedDate, setSelectedDate }) => {
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    if (!newTime) return;

    // Preserve date from current selection
    const currentDate = selectedDate.split('T')[0];
    setSelectedDate(`${currentDate}T${newTime}`);
  };

  return (
    <input
      type="time"
      value={selectedDate.split('T')[1]}
      onChange={handleTimeChange}
      className="glass-input"
    />
  );
};