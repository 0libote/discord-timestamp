import React, { useState, useEffect, useRef } from 'react';
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
                    <History className="w-4 h-4 mr-2 text-primary" />
                    History
                </label>
                {history.length > 0 && (
                    <button onClick={clearAllHistory} className="flex items-center text-xs text-destructive hover:underline">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear All
                    </button>
                )}
            </div>

            <div className="bg-background p-4 rounded-lg shadow-inner">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Name for current timestamp..."
                        value={historyName}
                        onChange={(e) => setHistoryName(e.target.value)}
                        className="w-full bg-card rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring border"
                    />
                    <button 
                        onClick={saveToHistory} 
                        className="bg-discord hover:bg-discord-darker text-white px-4 rounded-md text-sm font-semibold"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 -mr-2 scrollbar-thin-discord">
                    {history.map((item) => {
                        const isSelected = new Date(item.timestamp * 1000).toISOString().slice(0, 16) === selectedDate;
                        return (
                            <div
                                key={item.id}
                                className={`group relative rounded-lg p-3 border ${isSelected ? 'bg-primary/10 border-primary' : 'bg-background hover:shadow-lg hover:border-primary'}`}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow mb-2">
                                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-primary' : ''}`}>{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(item.timestamp * 1000).toLocaleString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: 'numeric', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-auto">
                                        <button 
                                            onClick={() => {
                                                const date = new Date(item.timestamp * 1000);
                                                setSelectedDate(date.toISOString().slice(0, 16));
                                            }}
                                            className="text-xs bg-primary/20 text-primary font-semibold px-3 py-1 rounded-md hover:bg-primary/30"
                                        >
                                            Use
                                        </button>
                                        <button 
                                            onClick={() => deleteHistoryItem(item.id)} 
                                            className="text-red-500 opacity-50 hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
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
    <div
      className="bg-card rounded-lg p-6 border"
    >
      <div className="space-y-8">
        <div className="p-4 bg-background rounded-lg border text-center">
          <p className="font-semibold text-primary mb-1">Selected Time</p>
          <div className="text-center font-medium text-base">{longFormDate}</div>
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
