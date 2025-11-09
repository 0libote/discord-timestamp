import React, { useState, useEffect } from 'react';
import { Copy, Calendar, Globe, Search, Sun, Moon, Check, Github } from 'lucide-react';

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
    // selectedDate is a string like "YYYY-MM-DDTHH:mm"
    // We need to treat it as a date/time in the selectedTimezone.
    // We can't just use `new Date(selectedDate)` as that will be in the user's local time.
    // Instead, we format it into a string that includes timezone info, then parse.
    // A reliable way is to get the UTC equivalent time and work from there.
    const dateInSelectedTz = new Date(new Date(selectedDate).toLocaleString('en-US', { timeZone: selectedTimezone }));
    const localDate = new Date(selectedDate);
    const diff = localDate.getTime() - dateInSelectedTz.getTime();
    return Math.floor((localDate.getTime() - diff) / 1000);
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
      case 'R': return formatRelativeTime(date);
      default: return date.toLocaleString(undefined, options);
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

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = Math.floor((date.getTime() - now.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
    if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    return rtf.format(Math.round(diff / 86400), 'day');
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
              className={`p-2 rounded-lg ${currentTheme.input} ${currentTheme.text} hover:opacity-90 transition-opacity`}
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
          <p className={`text-lg max-w-3xl mx-auto ${currentTheme.textSecondary}`}>
            Create Discord timestamps that automatically display in each user's local timezone.
          </p>
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
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-lg ${currentTheme.input} border ${currentTheme.border} overflow-hidden`}>
                    <input
                      type="date"
                      value={selectedDate.split('T')[0]}
                      onChange={(e) => setSelectedDate(`${e.target.value}T${selectedDate.split('T')[1] || '00:00'}`)}
                      className={`w-full px-3 py-2 ${currentTheme.text} bg-transparent focus:outline-none text-center`}
                    />
                  </div>
                  <div className={`rounded-lg ${currentTheme.input} border ${currentTheme.border} overflow-hidden`}>
                    <input
                      type="time"
                      value={selectedDate.split('T')[1] || '00:00'}
                      onChange={(e) => setSelectedDate(`${selectedDate.split('T')[0]}T${e.target.value}`)}
                      className={`w-full px-3 py-2 ${currentTheme.text} bg-transparent focus:outline-none text-center`}
                    />
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
                    <div className={`absolute z-10 mt-2 w-full max-h-80 overflow-y-auto ${currentTheme.card} rounded-lg border ${currentTheme.border} ${currentTheme.shadow}`}>
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
                          className={`px-4 py-3 ${currentTheme.selected} cursor-pointer rounded-b-lg`}
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
            </div>
          </div>

          {/* Timestamp Results */}
          <div className="lg:col-span-2 space-y-4">
            {timestampTypes.map((type) => {
              const timestampCode = `<t:${getUnixTimestamp()}:${type.id}>`;
              const preview = formatPreview(type.id);
              
              return (
                <div key={type.id} className={`${currentTheme.card} rounded-xl p-6 ${currentTheme.shadow} border ${currentTheme.border} transition-all duration-200 hover:border-indigo-500`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="md:w-1/4">
                      <h3 className="text-lg font-semibold">{type.name}</h3>
                    </div>
                    
                    <div className="flex-1 md:text-center">
                      <div className="inline-block">
                        <div className={`text-xs ${currentTheme.textSecondary} uppercase tracking-wide mb-1`}>Preview</div>
                        <div className="text-xl font-medium text-indigo-500">{preview}</div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/4 flex justify-end">
                      <button
                        onMouseEnter={() => setHoveredTimestamp(type.id)}
                        onMouseLeave={() => setHoveredTimestamp(null)}
                        onClick={() => copyToClipboard(timestampCode, type.id)}
                        className={`flex items-center justify-center gap-2 ${currentTheme.button} text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm min-w-[100px] relative`}
                      >
                        {copiedTimestamp === type.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                        {hoveredTimestamp === type.id && (
                          <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 ${currentTheme.card} ${currentTheme.border} border rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap z-10 shadow-lg`}>
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
          <a
            href="https://github.com/0libote/discord-timestamp"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 ${currentTheme.button} text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm`}
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
};

export default DiscordTimestampGenerator;