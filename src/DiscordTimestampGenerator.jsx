import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import DateTimePicker from './components/DateTimePicker';
import Controls from './components/Controls';
import TimestampList from './components/TimestampList';
import Tooltip from './components/Tooltip';

const DiscordTimestampGenerator = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 16));
  const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [theme, setTheme] = useState('dark');
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('timestampHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    localStorage.setItem('timestampHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const getUnixTimestamp = () => {
    try {
      // Create a date object from the selected date string
      // We treat the selected date as if it's in the selected timezone
      // This is a simplification. Ideally we'd use a library like date-fns-tz
      const date = new Date(selectedDate);
      const timeZoneDate = new Date(date.toLocaleString('en-US', { timeZone: selectedTimezone }));
      const offset = timeZoneDate.getTime() - date.getTime();

      // Adjust the timestamp
      return Math.floor((date.getTime() - offset) / 1000);
    } catch (e) {
      return Math.floor(new Date(selectedDate).getTime() / 1000);
    }
  };

  const formatPreview = (format) => {
    const timestamp = getUnixTimestamp();
    const date = new Date(timestamp * 1000);

    switch (format) {
      case 't': return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      case 'T': return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      case 'd': return date.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
      case 'D': return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
      case 'f': return `${date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      case 'F': return `${date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      case 'R': return '2 minutes ago'; // Dynamic relative time is hard to preview statically without a lib
      default: return '';
    }
  };

  const longFormDate = new Date(selectedDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    animate={{ opacity: 1, x: 0 }}
transition = {{ delay: 0.2, duration: 0.6 }}
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
          </motion.div >

  <motion.div
    className="lg:col-span-7"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4, duration: 0.6 }}
  >
    <TimestampList
      getUnixTimestamp={getUnixTimestamp}
      formatPreview={formatPreview}
    />
  </motion.div>
        </div >
      </main >

  <Footer />
    </div >
  );
};

export default DiscordTimestampGenerator;