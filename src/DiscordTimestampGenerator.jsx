import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Controls from './components/Controls';
import TimestampList from './components/TimestampList';
import ThemeBackground from './components/ThemeBackground';

const DiscordTimestampGenerator = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 16));
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('timestampHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const containerRef = useRef(null);

  const addToHistory = (name, timestamp) => {
    setHistory(prev => {
      const newHistory = [{ id: Date.now(), name, timestamp }, ...prev];
      return newHistory.slice(0, 10); // Keep last 10 items
    });
  };

  useEffect(() => {
    localStorage.setItem('timestampHistory', JSON.stringify(history));
  }, [history]);

  const getUnixTimestamp = () => {
    try {
      const date = new Date(selectedDate);
      const timeZoneDate = new Date(date.toLocaleString('en-US', { timeZone: selectedTimezone }));
      const offset = timeZoneDate.getTime() - date.getTime();
      return Math.floor((date.getTime() - offset) / 1000);
    } catch (e) {
      return Math.floor(new Date(selectedDate).getTime() / 1000);
    }
  };

  const formatPreview = (format) => {
    const timestamp = getUnixTimestamp();
    const date = new Date(timestamp * 1000);

    switch (format) {
      case 't': return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      case 'T': return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      case 'd': return date.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
      case 'D': return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
      case 'f': return `${date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      case 'F': return `${date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      case 'R': return '2 minutes ago'; // Dynamic relative time is hard to preview statically without a lib
      default: return '';
    }
  };

  const longFormDate = new Date(selectedDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden relative transition-colors duration-500"
    >
      <ThemeBackground />

      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 relative"
        >
          <div className="inline-block border border-primary/30 bg-black/40 backdrop-blur-sm px-4 py-1 mb-4 rounded-none">
            <span className="text-primary font-mono text-sm tracking-widest uppercase">System: Online</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-wider mb-4 text-white uppercase cyber-glitch-text" data-text="Timestamp Generator">
            Timestamp Generator
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            <span className="text-accent">&gt;</span> Initialize temporal coordinates for Discord communication protocols.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
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
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <TimestampList
              getUnixTimestamp={getUnixTimestamp}
              formatPreview={formatPreview}
              addToHistory={addToHistory}
            />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiscordTimestampGenerator;