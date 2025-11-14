import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Clock } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-discord"
          >
            <Clock className="w-7 h-7" />
          </motion.div>
          <h1 className="text-xl font-bold">
            <span className="text-primary">Discord</span> Timestamp Generator
          </h1>
        </div>
        
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent"
          aria-label="Toggle theme"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
