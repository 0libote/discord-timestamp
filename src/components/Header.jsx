import React from 'react';
import { Terminal, Github } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Terminal size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-none">
            Discord<span className="text-primary">.TS</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono tracking-wider mt-0.5">PROTOCOL_V2</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-white/5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">System Online</span>
        </div>

        <a
          href="https://github.com/0libote/discord-timestamp"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button-secondary !h-9 !px-4 gap-2 !rounded-lg"
        >
          <Github size={16} />
          <span className="hidden sm:inline">Source</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
