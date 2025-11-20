import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          Built with <span className="text-red-500">❤️</span> for the Discord community.
        </p>
        <p className="mt-2">
          Not affiliated with Discord Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
