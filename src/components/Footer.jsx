import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-white/5 bg-background/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          Built with <span className="text-red-500 animate-pulse">❤️</span> for the Discord community.
        </p>
        <p className="mt-2 text-xs opacity-60">
          Not affiliated with Discord Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
