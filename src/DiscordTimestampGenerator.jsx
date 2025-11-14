import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Header from './components/Header';
import Controls from './components/Controls';
import TimestampList from './components/TimestampList';
import Footer from './components/Footer';

const DiscordTimestampGenerator = () => {
  const getDefaultTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const [selectedDate, setSelectedDate] = useState(getDefaultTime());
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('timestampHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('timestampHistory', JSON.stringify(history));
  }, [history]);

  const getUnixTimestamp = () => {
    try {
      const d = new Date(selectedDate);
      // Note: The logic for timezone offset calculation can be complex.
      // This is a simplified approach and might not cover all edge cases.
      // For robust timezone handling, a library like `date-fns-tz` would be recommended.
      const dateWithOffset = new Date(d.toLocaleString('en-US', { timeZone: selectedTimezone }));
      const localDate = new Date(d.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
      const diff = localDate.getTime() - dateWithOffset.getTime();
      
      return Math.floor((d.getTime() - diff) / 1000);
    } catch (e) {
      console.error("Error in getUnixTimestamp:", e);
      return Math.floor(Date.now() / 1000);
    }
  };

  const formatPreview = (type) => {
    const unixTimestamp = getUnixTimestamp();
    const date = new Date(unixTimestamp * 1000);
    const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

    switch(type) {
      case 't': return date.toLocaleTimeString(undefined, { ...options, hour: 'numeric', minute: '2-digit' });
      case 'T': return date.toLocaleTimeString(undefined, { ...options, hour: 'numeric', minute: '2-digit', second: '2-digit' });
      case 'd': return date.toLocaleDateString(undefined, { ...options, day: '2-digit', month: '2-digit', year: 'numeric' });
      case 'D': return date.toLocaleDateString(undefined, { ...options, year: 'numeric', month: 'long', day: 'numeric' });
      case 'f': return date.toLocaleString(undefined, { ...options, year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      case 'F': return date.toLocaleString(undefined, { ...options, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      case 'R': {
        const now = new Date();
        const diff = Math.floor((date.getTime() - now.getTime()) / 1000);
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
        if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
        if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
        return rtf.format(Math.round(diff / 86400), 'day');
      }
      default: return date.toLocaleString(undefined, options);
    }
  };

  const longFormDate = new Date(getUnixTimestamp() * 1000).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-discord dark:text-discord mb-2">
            Create Dynamic Discord Timestamps
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto text-text-light/80 dark:text-text-dark/80">
            Select a date, time, and timezone, then copy the code for your desired format. These timestamps appear in each user's local timezone.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="lg:w-96 lg:flex-shrink-0">
            <Controls 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
              history={history}
              setHistory={setHistory}
              getUnixTimestamp={getUnixTimestamp}
              longFormDate={longFormDate}
              theme={theme}
            />
          </div>
          
          <div className="flex-1">
            <TimestampList 
              getUnixTimestamp={getUnixTimestamp}
              formatPreview={formatPreview}
              currentTheme={theme}
            />
          </div>
        </div>

        <Footer currentTheme={theme} />
      </main>
    </div>
  );
};

export default DiscordTimestampGenerator;