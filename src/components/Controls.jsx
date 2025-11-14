import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Globe, Search, History, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <label className="flex items-center text-sm font-medium text-text-light dark:text-text-dark mb-2">
        <Globe className="w-4 h-4 mr-2 text-discord" />
        Timezone
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background-light dark:bg-background-dark rounded-lg px-4 py-3 text-text-light dark:text-text-dark cursor-pointer flex items-center justify-between border border-discord transition-colors shadow-xl"
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm truncate">{`${selectedTimezone} (${getTimezoneAbbreviation(selectedTimezone)})`}</span>
        <Search className="w-4 h-4 opacity-50 text-text-light dark:text-text-dark" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto scrollbar-hide bg-card-light dark:bg-card-dark rounded-lg border border-discord shadow-lg transition-colors duration-1000"
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search timezones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-light dark:bg-background-dark rounded px-10 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-discord border border-transparent focus:border-discord transition-colors duration-1000"
                  autoFocus
                />
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              {filteredTimezones.map((tz) => (
                <div
                      onClick={() => {
                        setSelectedTimezone(tz);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 hover:bg-discord hover:text-white dark:hover:bg-discord cursor-pointer text-sm w-full transition-colors"
                    >
                      {tz} <span className="text-xs opacity-70">{getTimezoneAbbreviation(tz)}</span>
                    </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700/50 pt-6">
            <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-text-light dark:text-text-dark">
                    <History className="w-4 h-4 mr-2 text-discord" />
                    History
                </label>
                {history.length > 0 && (
                    <button onClick={clearAllHistory} className="flex items-center text-xs text-red-500 hover:underline transition-all">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear All
                    </button>
                )}
            </div>

            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-inner">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Name for current timestamp..."
                        value={historyName}
                        onChange={(e) => setHistoryName(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 rounded-md px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-discord border border-gray-300 dark:border-gray-600 transition-all duration-300"
                    />
                    <motion.button 
                        onClick={saveToHistory} 
                        className="bg-discord hover:bg-discord-darker text-white px-4 rounded-md text-sm font-semibold transition-colors" 
                        whileTap={{scale: 0.95}}
                    >
                        <Save className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 -mr-2 scrollbar-thin-discord">
                    {history.map((item) => {
                        const isSelected = new Date(item.timestamp * 1000).toISOString().slice(0, 16) === selectedDate;
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`group relative rounded-lg p-3 border transition-all duration-300 ${isSelected ? 'bg-discord/10 border-discord' : 'bg-background-light dark:bg-background-dark border-gray-200 dark:border-gray-700/50 hover:shadow-lg hover:border-discord'}`}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow mb-2">
                                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-discord' : 'text-text-light dark:text-text-dark'}`}>{item.name}</p>
                                        <p className="text-xs text-text-light/70 dark:text-text-dark/70">
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
                                            className="text-xs bg-discord/20 text-discord font-semibold px-3 py-1 rounded-md hover:bg-discord/30 transition-colors"
                                            whileTap={{scale: 0.95}}
                                        >
                                            Use
                                        </motion.button>
                                        <motion.button 
                                            onClick={() => deleteHistoryItem(item.id)} 
                                            className="text-red-500 opacity-50 hover:opacity-100 transition-opacity"
                                            whileTap={{scale: 0.9}}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <History className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-4 text-sm text-text-light/70 dark:text-text-dark/70">
                        No saved history yet.
                    </p>
                    <p className="text-xs text-text-light/50 dark:text-text-dark/50 mt-1">
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-1000"
    >
      <div className="space-y-8">
        <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg border border-discord text-center shadow-xl transition-colors duration-1000">
          <p className="font-semibold text-discord mb-1">Selected Time</p>
          <div className="text-center font-medium text-base text-text-light dark:text-text-dark transition-colors duration-1000">{longFormDate}</div>
        </div>

        <div className="space-y-4">
          <DatePickerInput
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            theme={theme}
          />
          <TimePickerInput
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            theme={theme}
          />
          <TimezonePicker
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
            currentTheme={theme}
          />
        </div>



        <HistoryPanel
            selectedDate={selectedDate}
            history={history}
            setHistory={setHistory}
            setSelectedDate={setSelectedDate}
            getUnixTimestamp={getUnixTimestamp}
            currentTheme={theme}
        />
      </div>
    </motion.div>
  );
};

export default Controls;
