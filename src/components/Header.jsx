import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ theme, toggleTheme }) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="28" height="28" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path fill="#5865F2" d="M215.782 35.844c-20.24-23.625-48.332-35.844-79.782-35.844-29.212 0-55.84 10.37-75.92 29.934-2.83 2.75-3.89 6.96-2.58 10.8l10.84 31.58c1.4 4.1 5.44 6.7 9.76 6.23 25.7-2.8 50.1 2.2 71.4 14.4 15.1 8.6 27.8 21.2 37.2 36.5 9.3 15.2 14.9 32.5 16.4 50.8 0.5 6.3 5.3 11.2 11.5 11.5 1.2 0 2.4-0.2 3.6-0.5l31.5-10.8c3.8-1.3 6.5-5 6.2-9.2-2.8-25.7-8.2-50.1-19.7-71.4-8.6-15-21.2-27.8-36.5-37.2Z"/>
              <path fill="#FFFFFF" d="M128 72a56 56 0 1 0 0 112a56 56 0 0 0 0-112Z"/>
            </svg>
          </motion.div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            <span className="discord">Discord</span> Timestamp
          </h1>
        </div>
        
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-discord-500"
          aria-label="Toggle theme"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
