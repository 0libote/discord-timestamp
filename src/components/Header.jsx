import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Github, Palette, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { theme, setTheme, themes } = useTheme();

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <motion.header
      className="theme-header mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="relative w-12 h-12 flex items-center justify-center theme-card text-primary group-hover:text-foreground transition-all duration-300">
          <Terminal size={24} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-theme-foreground uppercase flex flex-col leading-none">
            <span className="text-xs text-primary font-mono tracking-[0.2em] mb-1">Protocol</span>
            <span>Discord<span className="text-primary">.TS</span></span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Picker */}
        <div className="relative">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="flex items-center gap-2 px-3 py-2 theme-input hover:border-primary/50 transition-all text-sm font-mono text-theme-muted hover:text-primary"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <Palette size={16} />
            <span className="hidden sm:inline">{currentTheme?.name}</span>
            <ChevronDown size={14} className={`transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isThemeOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 theme-card z-50"
                style={{ borderRadius: 'var(--radius)' }}
              >
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsThemeOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-mono transition-colors ${theme === t.id
                      ? 'bg-primary/20 text-primary'
                      : 'text-theme-muted hover:bg-primary/10 hover:text-theme-foreground'
                      }`}
                  >
                    {t.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 theme-card" style={{ borderRadius: 'var(--radius)' }}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-mono text-theme-muted uppercase">Sys.Stable</span>
        </div>

        <a
          href="https://github.com/0libote/discord-timestamp"
          target="_blank"
          rel="noopener noreferrer"
          className="cyber-button-secondary text-xs flex items-center gap-2 !px-4 !py-2"
          aria-label="View on GitHub"
          style={{ borderRadius: 'var(--radius)' }}
        >
          <Github size={16} />
          <span className="hidden sm:inline">Source</span>
        </a>
      </div>
    </motion.header>
  );
};

export default Header;
