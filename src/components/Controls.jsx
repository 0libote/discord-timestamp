import React, { useState } from 'react';
import { Calendar, Globe, Search, History, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DateTimePicker from './DateTimePicker';

const TimezonePicker = ({ selectedTimezone, setSelectedTimezone, currentTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const timezones = Intl.supportedValuesOf('timeZone').sort();

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
    <div className="relative">
      <label className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        <Globe className="w-4 h-4 mr-2" />
        Timezone
      </label>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-discord-50 dark:bg-discord-900 rounded-lg px-4 py-3 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between border border-discord-200 dark:border-discord-800 hover:border-discord-500 dark:hover:border-discord-500 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm truncate">{`${selectedTimezone} (${getTimezoneAbbreviation(selectedTimezone)})`}</span>
        <Search className="w-4 h-4 opacity-50" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg"
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search timezones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-discord-100 dark:bg-discord-950 rounded px-10 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-discord-500 border border-transparent focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              {filteredTimezones.map((tz) => (
                <div
                  key={tz}
                  onClick={() => {
                    setSelectedTimezone(tz);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 hover:bg-discord-500 hover:text-white dark:hover:bg-discord-500 cursor-pointer text-sm"
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

const HistoryPanel = ({ history, setHistory, setSelectedDate, getUnixTimestamp, currentTheme }) => {
    const [historyName, setHistoryName] = useState('');
    const [showHistorySave, setShowHistorySave] = useState(false);

    const saveToHistory = () => {
        if (!historyName) return;
        const newHistoryItem = {
            id: Date.now(),
            name: historyName,
            timestamp: getUnixTimestamp(),
        };
        setHistory([newHistoryItem, ...history]);
        setHistoryName('');
        setShowHistorySave(false);
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
        <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <span className="flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    History
                </span>
                <motion.button onClick={() => setShowHistorySave(!showHistorySave)} className="text-sm bg-discord-600 hover:bg-discord-700 text-white p-1.5 rounded-md" whileTap={{scale: 0.9}}>
                    <Save className="w-4 h-4" />
                </motion.button>
            </label>

            <AnimatePresence>
            {showHistorySave && (
                <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="flex gap-2 mb-2 overflow-hidden">
                    <input
                        type="text"
                        placeholder="Name for timestamp..."
                        value={historyName}
                        onChange={(e) => setHistoryName(e.target.value)}
                        className="w-full bg-discord-50 dark:bg-discord-900 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-discord-500 border border-discord-200 dark:border-discord-800"
                    />
                    <motion.button onClick={saveToHistory} className="bg-discord-600 hover:bg-discord-700 text-white px-4 rounded-md text-sm" whileTap={{scale: 0.95}}>Save</motion.button>
                </motion.div>
            )}
            </AnimatePresence>

            {history.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 -mr-2">
                    {history.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="group w-full flex items-center justify-between bg-discord-50 dark:bg-discord-900 rounded-lg px-3 py-2 border border-discord-200 dark:border-discord-800"
                        >
                            <div
                                className="flex-grow cursor-pointer"
                                onClick={() => {
                                    const date = new Date(item.timestamp * 1000);
                                    setSelectedDate(date.toISOString().slice(0, 16));
                                }}
                            >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(item.timestamp * 1000).toLocaleString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                        hour: 'numeric', minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            <motion.button onClick={() => deleteHistoryItem(item.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700" whileTap={{scale: 0.9}}>
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    ))}
                    <button onClick={clearAllHistory} className="text-xs text-red-500 hover:underline w-full text-center mt-2 pt-2">
                      Clear All History
                    </button>
                </div>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No saved history.</p>
            )}
        </div>
    );
};


const Controls = ({ selectedDate, setSelectedDate, selectedTimezone, setSelectedTimezone, history, setHistory, getUnixTimestamp, longFormDate, theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100/50 dark:bg-gray-900/50 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md"
    >
      <div className="space-y-6">
        <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-gray-200/50 dark:border-gray-800/50 text-center">
          <p className="font-semibold text-discord-500 dark:text-discord-400">Selected Time</p>
          <div className="text-center font-medium text-sm text-gray-800 dark:text-gray-200">{longFormDate}</div>
        </div>

        <DateTimePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          theme={theme}
        />

        <TimezonePicker
          selectedTimezone={selectedTimezone}
          setSelectedTimezone={setSelectedTimezone}
          currentTheme={theme}
        />

        <div className="border-t border-gray-200 dark:border-gray-700/50"></div>

        <HistoryPanel
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
