import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';

const TimestampList = ({ getUnixTimestamp, formatPreview, currentTheme }) => {
  const [copiedTimestamp, setCopiedTimestamp] = useState(null);

  const timestampTypes = [
    { id: 't', name: 'Short Time' },
    { id: 'T', name: 'Long Time' },
    { id: 'd', name: 'Short Date' },
    { id: 'D', name: 'Long Date' },
    { id: 'f', name: 'Short Date/Time' },
    { id: 'F', name: 'Long Date/Time' },
    { id: 'R', name: 'Relative Time' }
  ];

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedTimestamp(type);
    setTimeout(() => setCopiedTimestamp(null), 2000);
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
    >
      {timestampTypes.map((type) => {
        const timestampCode = `<t:${getUnixTimestamp()}:${type.id}>`;
        const preview = formatPreview(type.id);
        
        return (
          <motion.div
            key={type.id}
            className="bg-card rounded-lg p-4 md:p-5 border hover:border-discord"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 md:flex-initial">
                <h3 className="text-lg font-semibold">{type.name}</h3>
              </div>

              <div className="flex-1 text-center">
                <div className="text-lg md:text-xl font-medium text-discord whitespace-normal break-words">{preview}</div>
              </div>

              <div className="flex-1 md:flex-initial flex justify-center md:justify-end">
                <Tooltip>
                  <TooltipTrigger>
                    <motion.button
                      onClick={() => copyToClipboard(timestampCode, type.id)}
                      className="flex items-center justify-center gap-2 bg-discord text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm min-w-[110px] hover:bg-discord-darker"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {copiedTimestamp === type.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent className="px-3 py-2 bg-gray-800 dark:bg-black text-white text-xs font-mono rounded-lg shadow-lg whitespace-nowrap">
                    <p>{timestampCode}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TimestampList;
