import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Globe, Search, History, Save, Trash2 } from 'lucide-react';
import { DatePickerInput, TimePickerInput } from './DateTimePicker';
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';

const TimezonePicker = ({ selectedTimezone, setSelectedTimezone, currentTheme }) => {
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
      <label className="flex items-center text-sm font-medium mb-2">
        <Globe className="w-4 h-4 mr-2 text-discord" />
        Timezone
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between border"
      >
        <span className="text-sm truncate">{`${selectedTimezone} (${getTimezoneAbbreviation(selectedTimezone)})`}</span>
        <Search className="w-4 h-4 opacity-50" />
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto scrollbar-hide bg-card rounded-lg border shadow-lg"
        >
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search timezones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring border"
                autoFocus
              />
            </div>
          </div>
          <div className="border-t">
            {filteredTimezones.map((tz) => (
              <div
                onClick={() => {
                  setSelectedTimezone(tz);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm w-full"
              >
                {tz} <span className="text-xs opacity-70">{getTimezoneAbbreviation(tz)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryPanel = ({ history, setHistory, setSelectedDate, getUnixTimestamp, currentTheme, selectedDate }) => {
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
        <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium">
                    <History className="w-4 h-4 mr-2 text-discord" />
                    History
                </label>
                {history.length > 0 && (
                    <motion.button 
                      onClick={clearAllHistory} 
                      className="flex items-center text-xs text-destructive hover:underline"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear All
                    </motion.button>
                )}
            </div>

            <div className="bg-card p-4 rounded-lg shadow-inner">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Name for current timestamp..."
                        value={historyName}
                        onChange={(e) => setHistoryName(e.target.value)}
                        className="w-full bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring border"
                    />
                    <motion.button 
                        onClick={saveToHistory} 
                        className="bg-discord hover:bg-discord-darker text-white px-4 rounded-md text-sm font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Save className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {history.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 -mr-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                    {history.map((item) => {
                        const isSelected = new Date(item.timestamp * 1000).toISOString().slice(0, 16) === selectedDate;
                        return (
                            <motion.div
                                key={item.id}
                                className={`group relative rounded-lg p-3 border ${isSelected ? 'bg-secondary border-discord' : 'bg-background hover:shadow-lg hover:border-discord'}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow mb-2">
                                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-discord' : ''}`}>{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(item.timestamp * 1000).toLocaleString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: 'numeric', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-auto">
                                        <motion.button 
                                            onClick={() => {
                                                const date = new Date(item.timestamp * 1000);
                                                setSelectedDate(date.toISOString().slice(0, 16));
                                            }}
                                            className="text-xs bg-secondary text-discord font-semibold px-3 py-1 rounded-md hover:bg-accent"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Use
                                        </motion.button>
                                        <motion.button 
                                            onClick={() => deleteHistoryItem(item.id)} 
                                            className="text-red-500 opacity-50 hover:opacity-100"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <div className="text-center py-8">
                    <History className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        No saved history yet.
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-1">
                        Use the input above to save a timestamp.
                    </p>
                </div>
            )}
        </div>
    );
};

const Controls = ({ selectedDate, setSelectedDate, selectedTimezone, setSelectedTimezone, history, setHistory, getUnixTimestamp, longFormDate, theme }) => {
  return (
    <motion.div
      className="bg-card rounded-lg p-6 border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-8">
        <motion.div 
          className="p-4 bg-background rounded-lg border text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className="font-semibold text-discord mb-1">Selected Time</p>
          <div className="text-center font-medium text-base">{longFormDate}</div>
        </motion.div>

        <div className="space-y-4">
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
    </motion.div>
  );
};

export default Controls;
