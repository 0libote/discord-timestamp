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
        className="w-full bg-card-light dark:bg-card-dark rounded-lg px-4 py-3 text-text-light dark:text-text-dark cursor-pointer flex items-center justify-between border border-discord transition-colors shadow-xl"
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
            className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto scrollbar-hide bg-card-light dark:bg-card-dark rounded-lg border border-discord shadow-lg"
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search timezones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-light dark:bg-background-dark rounded px-10 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-discord border border-transparent focus:border-discord"
                  autoFocus
                />
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              {filteredTimezones.map((tz) => (
                <Tooltip key={tz} placement="right">
                  <TooltipTrigger
                    asChild
                    onClick={() => {
                      setSelectedTimezone(tz);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div
                      className="px-4 py-2 hover:bg-discord hover:text-white dark:hover:bg-discord cursor-pointer text-sm truncate transition-colors"
                    >
                      {tz} <span className="text-xs opacity-70">{getTimezoneAbbreviation(tz)}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="px-3 py-2 bg-gray-800 dark:bg-black text-white text-xs font-mono rounded-lg shadow-lg whitespace-nowrap z-10">
                    <p>{tz}</p>
                  </TooltipContent>
                </Tooltip>
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

            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.3}} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Name for timestamp..."
                    value={historyName}
                    onChange={(e) => setHistoryName(e.target.value)}
                    className="w-full bg-card-light dark:bg-card-dark rounded-md px-3 py-2 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-discord border border-discord shadow-md"
                />
                <motion.button onClick={saveToHistory} className="bg-discord hover:bg-discord-darker text-white px-4 rounded-md text-sm transition-colors" whileTap={{scale: 0.95}}>Save</motion.button>
            </motion.div>

            {history.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 -mr-2 scrollbar-thin-discord">
                    {history.map((item) => {
                        const isSelected = new Date(item.timestamp * 1000).toISOString().slice(0, 16) === selectedDate;
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={`group w-full flex items-center justify-between rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700/50 transition-colors ${isSelected ? 'border-discord bg-discord/10' : 'hover:border-discord hover:bg-discord/5'}`}
                                
                            >
                                <div
                                    className="flex-grow cursor-pointer"
                                    onClick={() => {
                                        const date = new Date(item.timestamp * 1000);
                                        setSelectedDate(date.toISOString().slice(0, 16));
                                    }}
                                >
                                    <div className={`text-sm font-medium ${isSelected ? 'text-discord' : 'text-text-light dark:text-text-dark'}`}>{item.name}</div>
                                    <div className="text-xs text-text-light/70 dark:text-text-dark/70">
                                        {new Date(item.timestamp * 1000).toLocaleString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                            hour: 'numeric', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                                                 <motion.button onClick={() => deleteHistoryItem(item.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700" whileTap={{scale: 0.9}}>                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-text-light/70 dark:text-text-dark/70 text-center py-4">No saved history.</p>
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
      className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <div className="space-y-6">
        <div className="p-4 bg-card-light dark:bg-card-dark rounded-lg border border-discord text-center shadow-xl">
          <p className="font-semibold text-discord mb-1">Selected Time</p>
          <div className="text-center font-medium text-base text-text-light dark:text-text-dark">{longFormDate}</div>
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
