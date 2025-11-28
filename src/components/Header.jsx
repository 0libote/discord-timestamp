import React from 'react';
import { motion } from 'framer-motion';
import { Github, Terminal, Cpu } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/5 mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="relative w-12 h-12 flex items-center justify-center bg-black border border-primary/50 text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,255,157,0.2)] clip-path-polygon">
          <Terminal size={24} className="group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-white uppercase flex flex-col leading-none">
            <span className="text-xs text-primary font-mono tracking-[0.2em] mb-1">Protocol</span>
            <span>Discord<span className="text-primary">.TS</span></span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/10 rounded-none">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-mono text-muted-foreground uppercase">Sys.Stable</span>
        </div>

        <a
          href="https://github.com/0libote/discord-timestamp"
          target="_blank"
          rel="noopener noreferrer"
          className="cyber-button-secondary text-xs flex items-center gap-2 !px-4 !py-2"
          aria-label="View on GitHub"
        >
          <Github size={16} />
          <span className="hidden sm:inline">Source</span>
        </a>
      </div>
    </motion.header>
  );
};

export default Header;
