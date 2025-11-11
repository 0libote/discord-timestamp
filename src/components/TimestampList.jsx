import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const TimestampList = ({ getUnixTimestamp, formatPreview, currentTheme }) => {
  const [copiedTimestamp, setCopiedTimestamp] = useState(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState(null);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {timestampTypes.map((type) => {
        const timestampCode = `<t:${getUnixTimestamp()}:${type.id}>`;
        const preview = formatPreview(type.id);
        
        return (
          <motion.div 
            key={type.id} 
            className="bg-white/50 dark:bg-gray-900/50 rounded-2xl p-4 md:p-5 shadow-lg border border-gray-200/50 dark:border-gray-800/50 transition-all duration-200 discord"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{type.name}</h3>
              
              <div className="text-center">
                <div className="text-xl font-medium text-gray-700 dark:text-gray-300">{preview}</div>
              </div>
              
                            <div className="flex justify-center md:justify-end relative">
                              <motion.button
                                onMouseEnter={() => setHoveredTimestamp(type.id)}
                                onMouseLeave={() => setHoveredTimestamp(null)}
                                onClick={() => copyToClipboard(timestampCode, type.id)}
                                className="flex items-center justify-center gap-2 bg-discord-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm min-w-[110px] shadow-md hover:bg-discord-700"
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
                              {hoveredTimestamp === type.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap z-10 shadow-lg"
                                >
                                  {timestampCode}
                                </motion.div>
                              )}
                            </div>            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TimestampList;
