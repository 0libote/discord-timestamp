import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p className="flex items-center justify-center gap-2">
          Built with <span className="text-red-500">❤️</span> for the Discord community.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
