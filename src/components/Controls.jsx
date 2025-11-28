import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, History, X, ChevronDown } from 'lucide-react';
import { DatePickerInput, TimePickerInput } from './DateTimePicker';

const TimezonePicker = ({ selectedTimezone, setSelectedTimezone }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const timezones = Intl.supportedValuesOf('timeZone').map(tz => {
    try {
      const offset = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'longOffset'
      }).formatToParts(new Date())
        .find(part => part.type === 'timeZoneName').value;
      return { value: tz, label: `(${offset}) ${tz.replace(/_/g, ' ')}`, offset };
    } catch (e) {
      return { value: tz, label: tz.replace(/_/g, ' '), offset: '' };
    }
  });

  const filteredTimezones = timezones.filter(tz =>
    tz.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTzLabel = timezones.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone;

  return (
    <div className="relative group">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/50 border border-gray-800 text-accent font-mono rounded-none px-4 py-3 cursor-pointer hover:border-accent/50 transition-all flex items-center justify-between"
      >
        <span className="truncate mr-2">{selectedTzLabel}</span>
        <ChevronDown size={16} className={`text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-accent group-hover:w-full transition-all duration-500"></div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-black border border-gray-800 shadow-xl max-h-60 flex flex-col"
          >
            <div className="p-2 border-b border-gray-800 sticky top-0 bg-black z-10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search timezone..."
                className="w-full bg-white/5 border border-gray-800 text-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary placeholder:text-gray-600"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {filteredTimezones.length > 0 ? (
                filteredTimezones.map((tz) => (
                  <div
                    key={tz.value}
                    onClick={() => {
                      setSelectedTimezone(tz.value);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors font-mono hover:bg-primary/20 hover:text-primary ${selectedTimezone === tz.value ? 'bg-primary/10 text-primary' : 'text-gray-400'
                      }`}
                  >
                    {tz.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 font-mono text-center">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HistoryItem = ({ item, onLoad, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group relative border-l-2 border-gray-800 hover:border-primary bg-white/5 hover:bg-white/10 p-3 transition-all duration-300"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="min-w-0 flex-1 mr-3">
          <p className="font-mono text-xs text-primary truncate group-hover:text-white transition-colors">
            <span className="text-gray-500 mr-2">ID:</span>{item.name}
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-mono">
            <Clock className="w-3 h-3" />
            {new Date(item.timestamp * 1000).toLocaleString(undefined, {
              month: 'numeric', day: 'numeric',
              hour: 'numeric', minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onLoad(item.timestamp)}
            className="text-[10px] uppercase font-bold text-primary hover:text-white border border-primary hover:bg-primary px-2 py-1 transition-colors"
          >
            Load
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-500 hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
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
    <div className="cyber-card p-6 h-full flex flex-col">
      <div className="absolute top-0 right-0 p-2 opacity-20">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75"></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      <div className="space-y-8 flex-1">
        <motion.div
          className="p-4 border border-primary/20 bg-primary/5 relative overflow-hidden group"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

          <p className="font-mono text-primary mb-2 text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-primary animate-pulse"></span>
            Target Coordinates
          </p>
          <div className="text-center font-display font-bold text-sm md:text-lg text-white tracking-wide uppercase text-glow-primary">
            {longFormDate}
          </div>
        </motion.div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <TimePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-primary uppercase tracking-widest mb-2">
              > Select Timezone
            </label>
            <TimezonePicker
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <History size={14} />
                Log Data
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-destructive hover:text-white hover:bg-destructive px-2 py-1 transition-colors uppercase font-mono tracking-wider border border-transparent hover:border-destructive"
                >
                  Purge Logs
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence mode="popLayout">
                {history.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-muted-foreground/50 font-mono text-xs border border-dashed border-white/10"
                  >
                    // NO DATA LOGGED
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
