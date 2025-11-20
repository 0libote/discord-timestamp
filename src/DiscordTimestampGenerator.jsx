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
      const d_local = new Date(selectedDate);
      const d_tz = new Date(d_local.toLocaleString('en-US', { timeZone: selectedTimezone }));
      const diff = d_tz.getTime() - d_local.getTime();
      return Math.floor((d_local.getTime() - diff) / 1000);
    } catch (e) {
      console.error("Error in getUnixTimestamp:", e);
      return Math.floor(Date.now() / 1000);
    }
  };

  const formatPreview = (type) => {
    const unixTimestamp = getUnixTimestamp();
    const date = new Date(unixTimestamp * 1000);
    const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

    switch (type) {
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 transition-colors duration-500 ease-in-out overflow-x-hidden">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            className="text-center mb-12 md:mb-16 relative"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-foreground to-primary bg-[length:200%_auto] animate-pulse-glow">
              Discord Timestamp Generator
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create dynamic timestamps for your Discord messages that automatically adjust to every user's timezone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <motion.div
              className="lg:col-span-5 xl:col-span-4"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
              <Controls
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTimezone={selectedTimezone}
                setSelectedTimezone={setSelectedTimezone}
                history={history}
                setHistory={setHistory}
                getUnixTimestamp={getUnixTimestamp}
                longFormDate={longFormDate}
              />
            </motion.div>

            <motion.div
              className="lg:col-span-7 xl:col-span-8"
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            >
              <TimestampList
                getUnixTimestamp={getUnixTimestamp}
                formatPreview={formatPreview}
              />
            </motion.div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5 } }
            }}
            className="mt-16"
          >
            <Footer />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DiscordTimestampGenerator;