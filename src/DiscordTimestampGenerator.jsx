import React, { useState, useEffect } from 'react';
import { Copy, Calendar, Globe, Search, Sun, Moon, Check, Github, Link, History, Save, Trash2 } from 'lucide-react';

const DiscordTimestampGenerator = () => {
  // Set default time to 1 hour from now
  const getDefaultTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const [selectedDate, setSelectedDate] = useState(getDefaultTime());
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTimezones, setShowTimezones] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [copiedTimestamp, setCopiedTimestamp] = useState(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState(null);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('timestampHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [historyName, setHistoryName] = useState('');
  const [showHistorySave, setShowHistorySave] = useState(false);
  
  const timezones = Intl.supportedValuesOf('timeZone').sort();
  const filteredTimezones = timezones.filter(tz => 
    tz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const themes = {
    dark: {
      name: 'Dark',
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      header: 'bg-gray-800',
      input: 'bg-gray-700 border-gray-600',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      hover: 'hover:bg-gray-700',
      selected: 'bg-indigo-600',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      border: 'border-gray-700',
      shadow: 'shadow-lg',
      focus: 'focus:ring-indigo-500',
      scrollbarThumb: '#4b5563',
      scrollbarTrack: '#1f2937',
      scrollbarHover: '#6b7280'
    },
    light: {
      name: 'Light',
      bg: 'bg-gray-50',
      card: 'bg-white',
      header: 'bg-white',
      input: 'bg-white border-gray-300',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      hover: 'hover:bg-gray-100',
      selected: 'bg-blue-50 text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-gray-200',
      shadow: 'shadow-md',
      focus: 'focus:ring-blue-500',
      scrollbarThumb: '#d1d5db',
      scrollbarTrack: '#f3f4f6',
      scrollbarHover: '#9ca3af'
    }
  };

  const currentTheme = themes[theme];

  const timestampTypes = [
    { id: 't', name: 'Short Time' },
    { id: 'T', name: 'Long Time' },
    { id: 'd', name: 'Short Date' },
    { id: 'D', name: 'Long Date' },
    { id: 'f', name: 'Short Date/Time' },
    { id: 'F', name: 'Long Date/Time' },
    { id: 'R', name: 'Relative Time' }
  ];

  const getUnixTimestamp = () => {
    try {
      // This function correctly interprets the local datetime string as being in the selected timezone.
      // It does this by creating a date string with a specific ISO 8601 offset.
      const d = new Date(selectedDate); // Create a date to get a reference point.

      // Get the offset string (e.g., "GMT-5") for the target timezone at the time of the selected date.
      const offsetString = new Intl.DateTimeFormat('en', {
        timeZone: selectedTimezone,
        timeZoneName: 'longOffset',
      }).format(d);

      // Extract the numerical offset from the string.
      const offsetMatch = offsetString.match(/GMT([+-]\d+)/);

      if (offsetMatch) {
        const offsetHours = parseInt(offsetMatch[1], 10);
        // Format to "YYYY-MM-DDTHH:mm:ss.sss[+/-]HH:00"
        const dateWithOffset = `${selectedDate}:00.000${offsetHours < 0 ? '-' : '+'}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`;
        return Math.floor(new Date(dateWithOffset).getTime() / 1000);
      }

      // Fallback for rare cases where the offset can't be parsed.
      return Math.floor(new Date(selectedDate).getTime() / 1000);
    } catch (e) {
      console.error("Error in getUnixTimestamp:", e);
      return Math.floor(Date.now() / 1000);
    }
  };

  const formatPreview = (type) => {
    const unixTimestamp = getUnixTimestamp();
    const date = new Date(unixTimestamp * 1000);
    const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

    switch(type) {
      case 't': return date.toLocaleTimeString(undefined, { ...options, hour: 'numeric', minute: '2-digit' });
      case 'T': return date.toLocaleTimeString(undefined, { ...options, hour: 'numeric', minute: '2-digit', second: '2-digit' });
      case 'd': return date.toLocaleDateString(undefined, { ...options, day: '2-digit', month: '2-digit', year: 'numeric' });
      case 'D': return date.toLocaleDateString(undefined, { ...options, year: 'numeric', month: 'long', day: 'numeric' });
      case 'f': return date.toLocaleString(undefined, { ...options, year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      case 'F': return date.toLocaleString(undefined, { ...options, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      case 'R': {
        const now = new Date();
        const diff = Math.floor((date.getTime() - now.getTime()) / 1000);
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
        if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
        if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
        return rtf.format(Math.round(diff / 86400), 'day');
      }
      default: return date.toLocaleString(undefined, options);
    }
  };

  useEffect(() => {
    localStorage.setItem('timestampHistory', JSON.stringify(history));
  }, [history]);

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

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedTimestamp(type);
    setTimeout(() => setCopiedTimestamp(null), 2000);
  };

  const getTimezoneAbbreviation = (timezone) => {
    try {
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'short'
      });
      const parts = formatter.formatToParts(new Date());
      const timeZoneName = parts.find(part => part.type === 'timeZoneName');
      return timeZoneName ? timeZoneName.value : '';
    } catch {
      return '';
    }
  };

  const getTimezoneDisplay = (timezone) => {
    const abbreviation = getTimezoneAbbreviation(timezone);
    return `${timezone} (${abbreviation})`;
  };

  const longFormDate = new Date(getUnixTimestamp() * 1000).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    document.body.classList.remove(themes.dark.bg, themes.light.bg);
    document.body.classList.add(currentTheme.bg);
  }, [currentTheme, themes]);

  // Close timezone picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTimezones && !event.target.closest('.timezone-picker')) {
        setShowTimezones(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimezones]);

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${currentTheme.scrollbarTrack};
        }
        ::-webkit-scrollbar-thumb {
          background: ${currentTheme.scrollbarThumb};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.scrollbarHover};
        }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
      
      {/* Header */}
      <header className={`sticky top-0 z-40 ${currentTheme.header} border-b ${currentTheme.border} backdrop-blur-sm bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-indigo-500">Discord</span> Timestamp Generator
          </h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${currentTheme.input} ${currentTheme.text} hover:opacity-90 transition-opacity flex items-center justify-center`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <div className={`text-base md:text-lg max-w-3xl mx-auto ${currentTheme.textSecondary} space-y-2`}>
            <p>
              A simple tool to create dynamic timestamps for Discord. These timestamps appear in each user's local timezone.
            </p>
            <p>Select a date, time, and timezone, then copy the code for your desired format.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className={`${currentTheme.card} rounded-xl p-6 ${currentTheme.shadow} border ${currentTheme.border}`}>
            <div className="space-y-6">
              <div className={`p-4 ${currentTheme.input} rounded-lg border ${currentTheme.border}`}>
                <div className="text-center font-medium text-sm">{longFormDate}</div>
              </div>
              
              <div>
                <label className={`flex items-center text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Date & Time
                </label>
                <div className={`group relative rounded-lg ${currentTheme.input} border ${currentTheme.border} overflow-hidden`}>
                  <input
                    type="datetime-local"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`w-full pl-4 pr-10 py-3 ${currentTheme.text} bg-transparent focus:outline-none`}
                    style={{ colorScheme: theme }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                  </div>
                </div>
              </div>

              <div className="timezone-picker">
                <label className={`flex items-center text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
                  <Globe className="w-4 h-4 mr-2" />
                  Timezone
                </label>
                <div className="relative">
                  <div 
                    className={`w-full ${currentTheme.input} rounded-lg px-4 py-3 ${currentTheme.text} cursor-pointer flex items-center justify-between border ${currentTheme.border} hover:opacity-90 transition-opacity`}
                    onClick={() => setShowTimezones(!showTimezones)}
                  >
                    <span className="text-sm truncate">{getTimezoneDisplay(selectedTimezone)}</span>
                    <Search className="w-4 h-4 opacity-70" />
                  </div>
                  
                  {showTimezones && (
                    <div className={`absolute z-10 mt-2 w-full max-h-80 overflow-y-auto ${currentTheme.card} rounded-lg border ${currentTheme.border} ${currentTheme.shadow} transition-all duration-200`}>
                      <div className="p-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Search timezones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full ${currentTheme.input} rounded px-10 py-2 text-sm ${currentTheme.text} focus:outline-none focus:ring-1 ${currentTheme.focus} border ${currentTheme.border}`}
                            autoFocus
                          />
                        </div>
                      </div>
                      
                      <div className={`border-t ${currentTheme.border}`}>
                        <div 
                          key={selectedTimezone}
                          onClick={() => setShowTimezones(false)}
                          className={`px-4 py-3 ${currentTheme.selected} cursor-pointer rounded-t-lg`}
                        >
                          <div className="font-medium text-sm">{selectedTimezone}</div>
                          <div className="text-xs opacity-80">
                            {getTimezoneAbbreviation(selectedTimezone)}
                          </div>
                        </div>
                        
                        {filteredTimezones.filter(tz => tz !== selectedTimezone).map((tz) => (
                          <div
                            key={tz}
                            onClick={() => {
                              setSelectedTimezone(tz);
                              setShowTimezones(false);
                              setSearchTerm('');
                            }}
                            className={`px-4 py-3 ${currentTheme.hover} cursor-pointer border-b ${currentTheme.border} last:border-b-0`}
                          >
                            <div className="font-medium text-sm">{tz}</div>
                            <div className="text-xs opacity-70">
                              {getTimezoneAbbreviation(tz)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`flex items-center justify-between text-sm font-medium ${currentTheme.textSecondary} mb-2`}>
                  <span className="flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </span>
                  <button onClick={() => setShowHistorySave(!showHistorySave)} className={`text-sm ${currentTheme.button} text-white p-1 rounded-md`}>
                    <Save className="w-4 h-4" />
                  </button>
                </label>

                {showHistorySave && (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Name for timestamp..."
                      value={historyName}
                      onChange={(e) => setHistoryName(e.target.value)}
                      className={`w-full ${currentTheme.input} rounded px-3 py-2 text-sm ${currentTheme.text} focus:outline-none focus:ring-1 ${currentTheme.focus} border ${currentTheme.border}`}
                    />
                    <button onClick={saveToHistory} className={`${currentTheme.button} text-white px-3 rounded-md`}>Save</button>
                  </div>
                )}

                {history.length > 0 ? (
                  <div className={`space-y-2 max-h-48 overflow-y-auto pr-2`}>
                    {history.map((item) => (
                      <div key={item.id} className={`group w-full flex items-center justify-between ${currentTheme.input} rounded-lg px-4 py-2 cursor-pointer border ${currentTheme.border} ${currentTheme.hover} transition-all`}>
                        <div
                          className="flex-grow"
                          onClick={() => {
                            const date = new Date(item.timestamp * 1000);
                            setSelectedDate(date.toISOString().slice(0, 16));
                          }}
                        >
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className={`text-xs ${currentTheme.textSecondary}`}>
                            {new Date(item.timestamp * 1000).toLocaleString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: 'numeric', minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <button onClick={() => deleteHistoryItem(item.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button onClick={clearAllHistory} className="text-xs text-red-500 hover:underline w-full text-center mt-2">
                      Clear All History
                    </button>
                  </div>
                ) : (
                  <p className={`text-sm ${currentTheme.textSecondary} text-center py-4`}>No saved history.</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {timestampTypes.map((type) => {
              const timestampCode = `<t:${getUnixTimestamp()}:${type.id}>`;
              const preview = formatPreview(type.id);
              
              return (
                <div key={type.id} className={`${currentTheme.card} rounded-xl p-4 md:p-5 ${currentTheme.shadow} border ${currentTheme.border} transition-all duration-200 hover:border-indigo-500`}>
                  <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 w-full">
                    <h3 className="text-lg font-semibold">{type.name}</h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="text-center">
                        <div className={`text-xs ${currentTheme.textSecondary} uppercase tracking-wide mb-1 hidden md:block`}>Preview</div>
                        <div className="text-xl font-medium text-indigo-400">{preview}</div>
                      </div>
                      
                      <button
                        onMouseEnter={() => setHoveredTimestamp(type.id)}
                        onMouseLeave={() => setHoveredTimestamp(null)}
                        onClick={() => copyToClipboard(timestampCode, type.id)}
                        className={`flex items-center justify-center gap-2 ${currentTheme.button} text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm min-w-[110px] relative`}
                      >
                        {copiedTimestamp === type.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                        {hoveredTimestamp === type.id && (
                          <div className={`absolute bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 ${currentTheme.card} ${currentTheme.border} ${currentTheme.text} border rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap z-10 shadow-lg`}>
                            {timestampCode}
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer className={`mt-12 pt-6 border-t ${currentTheme.border} text-center`}>
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://github.com/0libote/discord-timestamp"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${currentTheme.button} text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm`}
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <button
              onClick={() => copyToClipboard("0liman.top/timestamp", "siteLink")}
              className={`inline-flex items-center gap-2 ${currentTheme.button} text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm`}
            >
              {copiedTimestamp === "siteLink" ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  <span>Copy WebApp Link</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DiscordTimestampGenerator;