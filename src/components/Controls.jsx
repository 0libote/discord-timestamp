import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, History, Save, Trash2, X, Clock } from 'lucide-react';
import { DatePickerInput, TimePickerInput } from './DateTimePicker';

const TimezonePicker = ({ selectedTimezone, setSelectedTimezone }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const timezones = Intl.supportedValuesOf('timeZone').sort();
  const pickerRef = useRef(null);

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

  const filteredTimezones = timezones.filter(tz =>
    tz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimezoneAbbreviation = (timezone) => {
    try {
      const formatter = new Intl.DateTimeFormat('en', { timeZone: timezone, timeZoneName: 'short' });
      return formatter.formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || '';
    } catch { return ''; }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
        Timezone
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-card/50 backdrop-blur-sm text-foreground rounded-xl border border-white/10 hover:border-primary/50 hover:bg-card/80 px-4 py-3 flex items-center justify-between transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm truncate font-medium flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          {selectedTimezone}
          <span className="text-muted-foreground text-xs bg-white/10 px-2 py-0.5 rounded-md ml-auto">
            {getTimezoneAbbreviation(selectedTimezone)}
          </span>
        </span>
        <Search className="w-4 h-4 text-muted-foreground" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 w-full max-h-60 overflow-hidden bg-popover/95 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl flex flex-col"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 border-b border-white/10 bg-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search timezones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 border border-white/10 text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {filteredTimezones.map((tz) => (
                <motion.button
                  key={tz}
                  onClick={() => {
                    setSelectedTimezone(tz);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group
                    ${selectedTimezone === tz ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-white/10 text-foreground'}
                  `}
                  whileHover={{ x: 4 }}
                >
                  <span>{tz}</span>
                  <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                    {getTimezoneAbbreviation(tz)}
                  </span>
                </motion.button>
              ))}
              {filteredTimezones.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No timezones found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HistoryPanel = ({ history, setHistory, setSelectedDate, getUnixTimestamp }) => {
  const [historyName, setHistoryName] = useState('');

  const saveToHistory = () => {
    if (!historyName) return;
    const newHistoryItem = {
      id: Date.now(),
      name: historyName,
      timestamp: getUnixTimestamp(),
    };
    setHistory([newHistoryItem, ...history]);
    setHistoryName('');
  };

  const deleteHistoryItem = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="space-y-4 border-t border-white/10 pt-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
          <History className="w-4 h-4 text-primary" />
          History
        </label>
        {history.length > 0 && (
          <motion.button
            onClick={clearAllHistory}
            className="text-xs font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 px-3 py-1.5 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear All
          </motion.button>
        )}
      </div>

      <div className="bg-card/30 p-1.5 rounded-xl border border-white/10 flex gap-2 backdrop-blur-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <input
          type="text"
          placeholder="Label this timestamp..."
          value={historyName}
          onChange={(e) => setHistoryName(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none placeholder:text-muted-foreground/50 text-foreground"
          onKeyDown={(e) => e.key === 'Enter' && saveToHistory()}
        />
        <motion.button
          onClick={saveToHistory}
          className="bg-primary text-primary-foreground px-4 rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!historyName}
        >
          <Save className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence mode='popLayout'>
        {history.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar"
            layout
          >
            {history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-card/40 hover:bg-card/60 rounded-xl p-3 border border-white/5 hover:border-primary/30 transition-all flex items-center justify-between shadow-sm backdrop-blur-sm"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="font-medium text-sm truncate text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp * 1000).toLocaleString(undefined, {
                      month: 'short', day: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    onClick={() => {
                      const date = new Date(item.timestamp * 1000);
                      setSelectedDate(date.toISOString().slice(0, 16));
                    }}
                    className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Load
                  </motion.button>
                  <motion.button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl bg-white/5"
          >
            <History className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No history yet</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Controls = ({ selectedDate, setSelectedDate, selectedTimezone, setSelectedTimezone, history, setHistory, getUnixTimestamp, longFormDate }) => {
  return (
    <div
      className="glass-card rounded-2xl p-6 h-full flex flex-col relative overflow-hidden"
    >
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

        <div className="space-y-5">
          <DatePickerInput
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <TimePickerInput
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <TimezonePicker
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
          />
        </div>

        <HistoryPanel
          selectedDate={selectedDate}
          history={history}
          setHistory={setHistory}
          setSelectedDate={setSelectedDate}
          getUnixTimestamp={getUnixTimestamp}
        />
      </div>
    </div>
  );
};

export default Controls;
