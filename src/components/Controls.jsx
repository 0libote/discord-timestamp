import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, History, X } from 'lucide-react';
import { DatePickerInput, TimePickerInput } from './DateTimePicker';

const TimezonePicker = ({ selectedTimezone, setSelectedTimezone }) => {
  const timezones = Intl.supportedValuesOf('timeZone');

  return (
    <select
      value={selectedTimezone}
      onChange={(e) => setSelectedTimezone(e.target.value)}
      className="w-full bg-card/50 backdrop-blur-sm text-foreground rounded-xl border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:bg-card/80 transition-colors shadow-sm"
    >
      {timezones.map((tz) => (
        <option key={tz} value={tz} className="bg-card text-foreground">
          {tz.replace(/_/g, ' ')}
        </option>
      ))}
    </select>
  );
};

const HistoryItem = ({ item, onLoad, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative glass-card rounded-xl p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.01 }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />

      <div className="flex items-center justify-between relative z-10">
        <div className="min-w-0 flex-1 mr-3">
          <p className="font-bold text-sm truncate text-foreground group-hover:text-primary transition-colors">{item.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {new Date(item.timestamp * 1000).toLocaleString(undefined, {
              month: 'short', day: 'numeric',
              hour: 'numeric', minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={() => onLoad(item.timestamp)}
            className="text-xs bg-primary text-primary-foreground font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load
          </motion.button>
          <motion.button
            onClick={() => onDelete(item.id)}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Controls = ({ selectedDate, setSelectedDate, selectedTimezone, setSelectedTimezone, history, setHistory, getUnixTimestamp, longFormDate }) => {

  const loadHistoryItem = (timestamp) => {
    const date = new Date(timestamp * 1000);
    setSelectedDate(date.toISOString().slice(0, 16));
  };

  const deleteHistoryItem = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 h-full flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="space-y-6 flex-1">
        <motion.div
          className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center relative overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          <p className="font-bold text-primary mb-1 text-xs uppercase tracking-wider">Preview Time</p>
          <div className="text-center font-bold text-sm md:text-base text-foreground">{longFormDate}</div>
        </motion.div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DatePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <TimePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold mb-2 text-foreground uppercase tracking-wider">
              Timezone
            </label>
            <TimezonePicker
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                History
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-destructive-foreground bg-destructive hover:bg-destructive/90 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-destructive/20 active:scale-95 text-xs font-bold uppercase tracking-wide"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 -mx-1 px-1">
              <AnimatePresence mode="popLayout">
                {history.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-muted-foreground italic bg-card/30 rounded-xl border border-white/5"
                  >
                    No history yet
                  </motion.div>
                ) : (
                  history.map((item) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      onLoad={loadHistoryItem}
                      onDelete={deleteHistoryItem}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
