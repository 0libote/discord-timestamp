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
      className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
    >
      <div className="flex justify-center items-center gap-2">
        <div className="relative">
          <motion.a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-github text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium border border-github hover:bg-github-darker flex-1"
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 bg-github-darker text-white border border-github rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap z-10 shadow-lg"
            >
              {githubLink}
            </motion.div>
          )}
        </div>
        <div className="relative">
          <motion.button
            onClick={copyLink}
            className="inline-flex items-center justify-center gap-2 bg-discord text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium border border-discord hover:bg-discord-darker flex-1"
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 bg-discord-darker text-white border border-discord rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap z-10 shadow-lg"
            >
              {webappLink}
            </motion.div>
                    )}
                  </div>
      </div>
      <p className="mt-6 text-sm text-text-light/60 dark:text-text-dark/60">
        Made with ❤️ by <a href="https://github.com/0libote" target="_blank" rel="noopener noreferrer" className="text-discord hover:underline">0libote</a>
      </p>
    </motion.footer>
  );
};

export default Footer;
