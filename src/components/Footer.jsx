import React from 'react';

const Footer = () => {
  return (
    <footer className="theme-footer">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-theme-muted">
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
