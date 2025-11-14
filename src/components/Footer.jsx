import React, { useState } from 'react';
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
    <footer
      className="mt-12 pt-8 border-t text-center"
    >
      <div className="flex justify-center items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-github text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium border border-github hover:bg-github-darker"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </TooltipTrigger>
          <TooltipContent className="px-3 py-2 bg-gray-800 dark:bg-black text-white text-xs font-mono rounded-lg shadow-lg whitespace-nowrap">
            <p>{githubLink}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <button
              onClick={copyLink}
              className="inline-flex items-center justify-center gap-2 bg-discord text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium border border-discord hover:bg-discord-darker min-w-[180px]"
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
            </button>
          </TooltipTrigger>
          <TooltipContent className="px-3 py-2 bg-gray-800 dark:bg-black text-white text-xs font-mono rounded-lg shadow-lg whitespace-nowrap">
            <p>{webappLink}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Made with ❤️ by <a href="https://github.com/0libote" target="_blank" rel="noopener noreferrer" className="text-discord hover:underline">0libote</a>
      </p>
    </footer>
  );
};

export default Footer;
