import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Code2 } from 'lucide-react';

const TimestampItem = ({ format, description, code, preview }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {format}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              {description}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-base md:text-lg font-medium text-foreground">
              {preview}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-auto w-full">
          <div className="flex-1 md:flex-none bg-secondary/30 rounded-lg px-3 py-2 font-mono text-sm text-muted-foreground border border-border/50 select-all">
            {code}
          </div>

          <motion.button
            onClick={handleCopy}
            className={`p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 ${copied
              ? 'bg-green-500 text-white shadow-green-500/20 shadow-lg'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode='wait'>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const TimestampList = ({ getUnixTimestamp, formatPreview }) => {
  const unixTimestamp = getUnixTimestamp();

  const formats = [
    { type: 'R', label: 'Relative Time', desc: 'Shows how long ago or until' },
    { type: 't', label: 'Short Time', desc: '12/24hr based on locale' },
    { type: 'T', label: 'Long Time', desc: 'With seconds' },
    { type: 'd', label: 'Short Date', desc: 'Numeric date' },
    { type: 'D', label: 'Long Date', desc: 'Month name' },
    { type: 'f', label: 'Short Date/Time', desc: 'Date and time' },
    { type: 'F', label: 'Long Date/Time', desc: 'Weekday, date, and time' },
  ];

  return (
    <div className="space-y-4 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Generated Codes</h3>
      </div>

      <div className="grid gap-3">
        {formats.map((fmt, index) => (
          <motion.div
            key={fmt.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <TimestampItem
              format={fmt.type}
              description={fmt.desc}
              code={`<t:${unixTimestamp}:${fmt.type}>`}
              preview={formatPreview(fmt.type)}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 p-4 bg-secondary/50 border border-border rounded-lg text-sm text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>Paste the code directly into your Discord message to display the timestamp.</p>
      </motion.div>
    </div>
  );
};

export default TimestampList;
