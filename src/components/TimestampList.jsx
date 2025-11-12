import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

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
                                className="bg-card-light dark:bg-card-dark rounded-2xl p-4 md:p-5 shadow-lg border border-gray-200 dark:border-gray-700"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, borderColor: '#5865F2' }}
                                transition={{ type: 'tween', duration: 0.2, borderColor: { type: 'tween', duration: 0 } }}
                              >                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
                        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">{type.name}</h3>
          
                        <div className="text-center">
                          <div className="text-xl font-medium text-discord">{preview}</div>
                        </div>
          
                                      <div className="flex justify-center md:justify-end">
                                        <Tooltip text={timestampCode}>
                                          <motion.button
                                            onClick={() => copyToClipboard(timestampCode, type.id)}
                                            className="flex items-center justify-center gap-2 bg-discord text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm min-w-[110px] shadow-md hover:bg-discord-darker"
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
                                        </Tooltip>
                                      </div>            </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          };
          
          export default TimestampList;
