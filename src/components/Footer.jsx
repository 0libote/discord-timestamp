import React, { useState } from 'react';
import { Github, Link, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ currentTheme }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText("0liman.top/timestamp");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
    >
      <div className="flex justify-center items-center gap-4">
        <motion.a
          href="https://github.com/0libote/discord-timestamp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Github className="w-4 h-4" />
          View on GitHub
        </motion.a>
        <motion.button
          onClick={copyLink}
          className="relative inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium hover:bg-indigo-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
      </div>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Made with ❤️ by <a href="https://github.com/0libote" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">0libote</a>
      </p>
    </motion.footer>
  );
};

export default Footer;
