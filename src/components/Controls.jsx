import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, History, Save, Trash2, X } from 'lucide-react';
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
      <label className="block text-sm font-medium mb-2 text-foreground">
        Timezone
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background rounded-xl px-4 py-3 cursor-pointer flex items-center justify-between border border-input hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <span className="text-sm truncate font-medium flex items-center gap-2">
          {selectedTimezone}
          <span className="text-muted-foreground text-xs bg-secondary px-2 py-0.5 rounded-md">
            {getTimezoneAbbreviation(selectedTimezone)}
          </span>
        </span>
        <Search className="w-4 h-4 text-muted-foreground" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 w-full max-h-60 overflow-hidden bg-popover/95 backdrop-blur-xl rounded-xl border border-border shadow-2xl flex flex-col"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 border-b border-border/50 bg-accent/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search timezones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background/80 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border/50"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-1">
              {filteredTimezones.map((tz) => (
                <motion.button
                  key={tz}
                  onClick={() => {
                    setSelectedTimezone(tz);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group
                    ${selectedTimezone === tz ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50 text-foreground'}
                  `}
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
    <div className="space-y-4 border-t border-border/50 pt-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          History
        </label>
        {history.length > 0 && (
          <motion.button
            onClick={clearAllHistory}
            className="text-xs font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 px-3 py-1.5 rounded-lg transition-colors theme-transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear All
          </motion.button>
        )}
      </div>

      <div className="bg-secondary/30 p-1.5 rounded-xl border border-border/50 flex gap-2 theme-transition">
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
          className="bg-primary text-primary-foreground px-4 rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors theme-transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!historyName}
        >
          Save
        </motion.button>
      </div>

      <AnimatePresence mode='popLayout'>
        {history.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1"
            layout
          >
            {history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-card/50 hover:bg-card rounded-xl p-3 border border-border/50 hover:border-primary/30 transition-all theme-transition flex items-center justify-between shadow-sm"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="font-medium text-sm truncate text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
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
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl bg-secondary/10"
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
      className="bg-card rounded-xl p-6 border border-border/50 shadow-sm h-full flex flex-col"
    >
      <div className="space-y-6 flex-1">
        <motion.div
          className="p-4 bg-secondary/30 rounded-xl border border-border/50 text-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <p className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider">Preview Time</p>
          <div className="text-center font-semibold text-sm md:text-base text-foreground">{longFormDate}</div>
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
