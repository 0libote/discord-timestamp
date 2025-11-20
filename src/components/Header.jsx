import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Github } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <motion.header
      className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20">
          <span className="text-2xl">⏰</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight hidden md:block">
          Discord <span className="text-primary">Timestamps</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://github.com/0libote/discord-timestamp"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label="View on GitHub"
        >
          <Github size={20} />
        </a>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Toggle theme"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.div>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
