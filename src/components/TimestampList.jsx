import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Terminal, Sparkles } from 'lucide-react';

const TimestampItem = ({ format, description, code, preview, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="group relative theme-card p-4 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
              {description}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-base md:text-lg font-display font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {preview}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-auto w-full">
          <div className="flex-1 md:flex-none bg-black/20 border border-white/10 rounded-md px-3 py-2 font-mono text-sm text-primary select-all group-hover:border-primary/30 transition-colors min-w-[180px] text-center">
            {code}
          </div>

          <motion.button
            onClick={handleCopy}
            className={`p-2.5 transition-all duration-200 flex-shrink-0 border rounded-md ${copied
              ? 'bg-green-500/20 border-green-500 text-green-500'
              : 'bg-transparent border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground'
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
                  <Check size={18} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy size={18} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const TimestampList = ({ getUnixTimestamp, formatPreview, addToHistory }) => {
  const unixTimestamp = getUnixTimestamp();

  const formats = [
    { type: 'R', label: 'Relative', desc: 'Relative Time' },
    { type: 't', label: 'Short Time', desc: 'Time (Short)' },
    { type: 'T', label: 'Long Time', desc: 'Time (Long)' },
    { type: 'd', label: 'Short Date', desc: 'Date (Short)' },
    { type: 'D', label: 'Long Date', desc: 'Date (Long)' },
    { type: 'f', label: 'Short Date/Time', desc: 'Date & Time (Short)' },
    { type: 'F', label: 'Long Date/Time', desc: 'Date & Time (Long)' },
  ];

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
        <Terminal className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-display font-bold text-white tracking-widest uppercase">Output_Stream</h3>
      </div>

      <div className="grid gap-3">
        {formats.map((fmt, index) => (
          <motion.div
            key={fmt.type}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
          >
            <TimestampItem
              format={fmt.type}
              description={fmt.desc}
              code={`<t:${unixTimestamp}:${fmt.type}>`}
              preview={formatPreview(fmt.type)}
              onCopy={() => {
                const date = new Date(unixTimestamp * 1000);
                const readableDate = date.toLocaleString(undefined, {
                  month: 'short', day: 'numeric',
                  hour: 'numeric', minute: '2-digit'
                });
                addToHistory(readableDate, unixTimestamp);
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 p-4 border border-dashed border-white/10 text-center relative overflow-hidden bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-muted-foreground font-mono text-xs">
          <span className="text-primary">INFO:</span> Copy sequence and inject into Discord interface.
        </p>
      </motion.div>
    </div>
  );
};

export default TimestampList;
