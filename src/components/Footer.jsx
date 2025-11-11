import React, { useState } from 'react';
import { Github, Link, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ currentTheme }) => {
  const [copied, setCopied] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const webappLink = "0liman.top/timestamp";
  const githubLink = "https://github.com/0libote/discord-timestamp";

  const copyLink = () => {
    navigator.clipboard.writeText(webappLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 pt-8 border-t border-discord-200 dark:border-discord-800 text-center"
    >
      <div className="flex justify-center items-center gap-4">
        <div className="relative inline-block w-full">
          <motion.a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary-light text-white dark:bg-primary-dark dark:text-text-dark px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium border border-primary-light dark:border-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light w-48"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredLink('github')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </motion.a>
          {hoveredLink === 'github' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 bg-card-dark text-white border border-primary-dark rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap z-10 shadow-lg"
            >
              {githubLink}
            </motion.div>
          )}
        </div>
        <div className="relative inline-block w-full">
          <motion.button
            onClick={copyLink}
            className="inline-flex items-center justify-center gap-2 bg-secondary-light text-white dark:bg-secondary-dark dark:text-text-dark px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium hover:bg-secondary-dark dark:hover:bg-secondary-light w-48"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredLink('webapp')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Link className="w-4 h-4" />
                <span>Copy WebApp Link</span>
              </>
            )}
          </motion.button>
          {hoveredLink === 'webapp' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 bg-card-dark text-white border border-secondary-dark rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap z-10 shadow-lg"
            >
              {webappLink}
            </motion.div>
                    )}
                  </div>      <p className="mt-6 text-sm text-text-light/60 dark:text-text-dark/60">
        Made with ❤️ by <a href="https://github.com/0libote" target="_blank" rel="noopener noreferrer" className="text-primary-light dark:text-primary-dark hover:underline">0libote</a>
      </p>
    </motion.footer>
  );
};

export default Footer;
