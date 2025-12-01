import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import { DatePickerInput, TimePickerInput } from './components/DateTimePicker';
import TimezonePicker from './components/TimezonePicker';
import HistoryList from './components/HistoryList';
import TimestampList from './components/TimestampList';
import { Clock, Calendar, MapPin } from 'lucide-react';

const DiscordTimestampGenerator = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 16));
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('timestampHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const addToHistory = (name, timestamp) => {
    setHistory(prev => {
      const newHistory = [{ id: Date.now(), name, timestamp }, ...prev];
      return newHistory.slice(0, 10);
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
      case 'R': return '2 minutes ago';
      default: return '';
    }
  };

  const loadHistoryItem = (timestamp) => {
    const date = new Date(timestamp * 1000);
    setSelectedDate(date.toISOString().slice(0, 16));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Controls */}
          <motion.div
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Calendar size={20} />
                <h2 className="font-semibold tracking-wide uppercase text-xs">Date & Time</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground ml-1 mb-1.5 block">Select Date</label>
                  <DatePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground ml-1 mb-1.5 block">Select Time</label>
                  <TimePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-2 text-primary mb-2">
                <MapPin size={20} />
                <h2 className="font-semibold tracking-wide uppercase text-xs">Location</h2>
              </div>

              <div>
                <label className="text-xs text-muted-foreground ml-1 mb-1.5 block">Timezone</label>
                <TimezonePicker selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} />
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Clock size={20} />
                <h2 className="font-semibold tracking-wide uppercase text-xs">History</h2>
              </div>
              <HistoryList history={history} setHistory={setHistory} onLoad={loadHistoryItem} />
            </div>
          </motion.div>

          {/* Right Column: Output */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass-card p-8 rounded-3xl h-full border-t-4 border-t-primary/50">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {new Date(getUnixTimestamp() * 1000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-primary font-mono text-lg">
                  {new Date(getUnixTimestamp() * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                </p>
              </div>

              <TimestampList
                getUnixTimestamp={getUnixTimestamp}
                formatPreview={formatPreview}
                addToHistory={addToHistory}
              />
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiscordTimestampGenerator;