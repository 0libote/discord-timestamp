import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Clock } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-discord-blurple"
          >
            <Clock className="w-7 h-7" strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-discord-blurple to-blue-500 bg-clip-text text-transparent">Discord</span> Timestamp
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Dynamic timestamp generator</p>
          </div>
        </div>
        
        <motion.button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg bg-secondary/80 text-secondary-foreground hover:bg-accent/20 hover:text-discord-blurple border border-border/50 transition-colors"
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
