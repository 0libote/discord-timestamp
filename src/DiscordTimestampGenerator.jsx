import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Header from './components/Header';
import Controls from './components/Controls';
import TimestampList from './components/TimestampList';
import Footer from './components/Footer';

const DiscordTimestampGenerator = () => {
  const getDefaultTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const [selectedDate, setSelectedDate] = useState(getDefaultTime());
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('timestampHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('timestampHistory', JSON.stringify(history));
  }, [history]);

  const getUnixTimestamp = () => {
    try {
      const d = new Date(selectedDate);
      // Create a date object that represents the selected time in the selected timezone
      // We use the Intl.DateTimeFormat to get the parts of the date in the target timezone
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }).formatToParts(d);

      // This part is tricky without a library like date-fns-tz.
      // The previous logic was flawed. 
      // Correct native approach:
      // 1. Treat selectedDate as if it were in the selectedTimezone.
      // 2. Find the offset of that timezone at that time.
      // 3. Adjust the timestamp.

      // However, since we can't easily parse "2023-10-27T10:00" AS a specific timezone natively without libraries,
      // we will use a trick:
      // We construct a string that includes the offset if possible, OR we rely on the fact that
      // users pick a "Wall Time" and a "Timezone".

      // Let's try a different approach:
      // Create a date object from the input (which interprets it as local time).
      // Then shift the time by the difference between Local Offset and Target Offset.

      const targetDateStr = new Date(selectedDate).toLocaleString('en-US', { timeZone: selectedTimezone });
      const targetDate = new Date(targetDateStr);
      const localDate = new Date(selectedDate);

      // The difference between the "Local interpretation of the date" and "Target timezone interpretation of the date"
      // This is still not quite right because toLocaleString converts TO the timezone.

      // Let's use the "hacky" but effective way for native JS:
      // We want to find a UTC timestamp X such that X in selectedTimezone equals selectedDate.

      // We can use the fact that `new Date(string)` parses as local.
      // If we append the offset, we can parse it correctly.
      // But getting the offset for a future date in a specific timezone is hard natively.

      // Alternative:
      // We will stick to the previous logic but refine it, or accept that without date-fns-tz, 
      // edge cases around DST transitions might be slightly off.
      // But actually, we can do better.

      // We can iterate to find the offset? No, too expensive.

      // Let's use the "inverse" approach.
      // We have Wall Time (selectedDate) and Timezone.
      // We want Absolute Time (Unix).

      // 1. Get the offset of the selectedTimezone at the approximate time.
      // This is hard.

      // Let's go with a simplified approach that works for most cases:
      // We treat the selectedDate as UTC, then subtract the offset of the target timezone? No.

      // Let's use the logic: 
      // 1. Parse selectedDate as UTC.
      // 2. Get the offset of the target timezone relative to UTC.
      // 3. Apply offset.

      // Actually, let's try to use the `toLocaleString` to find the offset difference.
      const d_local = new Date(selectedDate);
      const d_tz = new Date(d_local.toLocaleString('en-US', { timeZone: selectedTimezone }));
      const diff = d_tz.getTime() - d_local.getTime();

      // This diff is (Target Time - Local Time).
      // So if we want the Unix timestamp that corresponds to "Local Time" being in "Target Timezone",
      // We need to shift the Local Time by -diff?

      // Example: 
      // Local: 12:00 UTC. Target: EST (-5). 
      // d_tz (12:00 UTC in EST) -> 07:00.
      // diff = 07:00 - 12:00 = -5 hours.
      // We want 12:00 EST. That is 17:00 UTC.
      // So we take 12:00 UTC (d_local) and subtract diff (-5h)? 
      // 12 - (-5) = 17. Correct.

      return Math.floor((d_local.getTime() - diff) / 1000);

    } catch (e) {
      console.error("Error in getUnixTimestamp:", e);
      return Math.floor(Date.now() / 1000);
    }
  };

  const formatPreview = (type) => {
    const unixTimestamp = getUnixTimestamp();
    const date = new Date(unixTimestamp * 1000);
    const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

    switch (type) {
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
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      import React, { useState, useEffect } from 'react';
      import { motion } from 'framer-motion';

      import Header from './components/Header';
      import Controls from './components/Controls';
      import TimestampList from './components/TimestampList';
      import Footer from './components/Footer';

      const DiscordTimestampGenerator = () => {
        const getDefaultTime = () => {
          const now = new Date();
          now.setHours(now.getHours() + 1);
          return now.toISOString().slice(0, 16);
        };

        const [selectedDate, setSelectedDate] = useState(getDefaultTime());
        const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
        const [theme, setTheme] = useState(() => {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme) return savedTheme;
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        });
        const [history, setHistory] = useState(() => {
          const savedHistory = localStorage.getItem('timestampHistory');
          return savedHistory ? JSON.parse(savedHistory) : [];
        });

        useEffect(() => {
          localStorage.setItem('timestampHistory', JSON.stringify(history));
        }, [history]);

        const getUnixTimestamp = () => {
          try {
            const d = new Date(selectedDate);
            // Create a date object that represents the selected time in the selected timezone
            // We use the Intl.DateTimeFormat to get the parts of the date in the target timezone
            const parts = new Intl.DateTimeFormat('en-US', {
              timeZone: selectedTimezone,
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false
            }).formatToParts(d);

            // This part is tricky without a library like date-fns-tz.
            // The previous logic was flawed. 
            // Correct native approach:
            // 1. Treat selectedDate as if it were in the selectedTimezone.
            // 2. Find the offset of that timezone at that time.
            // 3. Adjust the timestamp.

            // However, since we can't easily parse "2023-10-27T10:00" AS a specific timezone natively without libraries,
            // we will use a trick:
            // We construct a string that includes the offset if possible, OR we rely on the fact that
            // users pick a "Wall Time" and a "Timezone".

            // Let's try a different approach:
            // Create a date object from the input (which interprets it as local time).
            // Then shift the time by the difference between Local Offset and Target Offset.

            const targetDateStr = new Date(selectedDate).toLocaleString('en-US', { timeZone: selectedTimezone });
            const targetDate = new Date(targetDateStr);
            const localDate = new Date(selectedDate);

            // The difference between the "Local interpretation of the date" and "Target timezone interpretation of the date"
            // This is still not quite right because toLocaleString converts TO the timezone.

            // Let's use the "hacky" but effective way for native JS:
            // We want to find a UTC timestamp X such that X in selectedTimezone equals selectedDate.

            // We can use the fact that `new Date(string)` parses as local.
            // If we append the offset, we can parse it correctly.
            // But getting the offset for a future date in a specific timezone is hard natively.

            // Alternative:
            // We will stick to the previous logic but refine it, or accept that without date-fns-tz, 
            // edge cases around DST transitions might be slightly off.
            // But actually, we can do better.

            // We can iterate to find the offset? No, too expensive.

            // Let's use the "inverse" approach.
            // We have Wall Time (selectedDate) and Timezone.
            // We want Absolute Time (Unix).

            // 1. Get the offset of the selectedTimezone at the approximate time.
            // This is hard.

            // Let's go with a simplified approach that works for most cases:
            // We treat the selectedDate as UTC, then subtract the offset of the target timezone? No.

            // Let's use the logic: 
            // 1. Parse selectedDate as UTC.
            // 2. Get the offset of the target timezone relative to UTC.
            // 3. Apply offset.

            // Actually, let's try to use the `toLocaleString` to find the offset difference.
            const d_local = new Date(selectedDate);
            const d_tz = new Date(d_local.toLocaleString('en-US', { timeZone: selectedTimezone }));
            const diff = d_tz.getTime() - d_local.getTime();

            // This diff is (Target Time - Local Time).
            // So if we want the Unix timestamp that corresponds to "Local Time" being in "Target Timezone",
            // We need to shift the Local Time by -diff?

            // Example: 
            // Local: 12:00 UTC. Target: EST (-5). 
            // d_tz (12:00 UTC in EST) -> 07:00.
            // diff = 07:00 - 12:00 = -5 hours.
            // We want 12:00 EST. That is 17:00 UTC.
            // So we take 12:00 UTC (d_local) and subtract diff (-5h)? 
            // 12 - (-5) = 17. Correct.

            return Math.floor((d_local.getTime() - diff) / 1000);

          } catch (e) {
            console.error("Error in getUnixTimestamp:", e);
            return Math.floor(Date.now() / 1000);
          }
        };

        const formatPreview = (type) => {
          const unixTimestamp = getUnixTimestamp();
          const date = new Date(unixTimestamp * 1000);
          const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

          switch (type) {
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
          setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
        };

        useEffect(() => {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
        }, [theme]);

        return (
          <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 transition-colors duration-500 ease-in-out">
            <Header theme={theme} toggleTheme={toggleTheme} />

            <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2
                    }
                  }
                }}
              >
                <motion.div
                  className="text-center mb-12 md:mb-16"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                    Discord Timestamp Generator
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    Create dynamic timestamps for your Discord messages that automatically adjust to every user's timezone.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  <motion.div
                    className="lg:col-span-5 xl:col-span-4"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                  >
                    <Controls
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      selectedTimezone={selectedTimezone}
                      setSelectedTimezone={setSelectedTimezone}
                      history={history}
                      setHistory={setHistory}
                      getUnixTimestamp={getUnixTimestamp}
                      longFormDate={longFormDate}
                    />
                  </motion.div>

                  <motion.div
                    className="lg:col-span-7 xl:col-span-8"
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                  >
                    <TimestampList
                      getUnixTimestamp={getUnixTimestamp}
                      formatPreview={formatPreview}
                    />
                  </motion.div>
                </div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.5 } }
                  }}
                >
                  <Footer />
                </motion.div>
              </motion.div>
            </main>
          </div>
        );
      };

      export default DiscordTimestampGenerator;