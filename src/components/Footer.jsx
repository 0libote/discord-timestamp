import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Link, Check } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';

const Footer = ({ currentTheme }) => {
  const [copied, setCopied] = useState(false);

  const webappLink = "https://0libote.github.io/discord-timestamp";
  const githubLink = "https://github.com/0libote/discord-timestamp";

  const copyLink = () => {
    navigator.clipboard.writeText(webappLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.footer
      className="mt-12 pt-8 border-t text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-center items-center gap-3 flex-wrap">
        <Tooltip>
          <TooltipTrigger>
            <motion.a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-github text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md whitespace-nowrap text-sm font-semibold border border-github/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </motion.a>
          </TooltipTrigger>
          <TooltipContent className="px-3 py-2 bg-gray-800 dark:bg-black text-white text-xs font-mono rounded-lg shadow-lg whitespace-nowrap">
            <p>{githubLink}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <motion.button
              onClick={copyLink}
              className="inline-flex items-center justify-center gap-2 bg-discord-blurple text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md whitespace-nowrap text-sm font-semibold border border-discord-blurple/80 min-w-[180px]"
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
          </TooltipTrigger>
          <TooltipContent className="px-3 py-2 bg-gray-800 dark:bg-black text-white text-xs font-mono rounded-lg shadow-lg whitespace-nowrap">
            <p>{webappLink}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Made with ❤️ by <a href="https://github.com/0libote" target="_blank" rel="noopener noreferrer" className="text-discord hover:underline">0libote</a>
      </p>
    </motion.footer>
  );
};

export default Footer;
