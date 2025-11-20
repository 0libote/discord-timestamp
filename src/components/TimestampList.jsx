import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Code2, Sparkles } from 'lucide-react';

const TimestampItem = ({ format, description, code, preview }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="group relative glass-card rounded-xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">
              {description}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-base md:text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {preview}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-auto w-full">
          <div className="flex-1 md:flex-none bg-black/20 rounded-lg px-3 py-2 font-mono text-sm text-muted-foreground border border-white/5 select-all group-hover:border-primary/20 transition-colors">
            {code}
          </div>

          <motion.button
            onClick={handleCopy}
            className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg ${copied
              ? 'bg-green-500 text-white shadow-green-500/20'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode='wait'>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                >
                  <Check size={18} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
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

const TimestampList = ({ getUnixTimestamp, formatPreview }) => {
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
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-xl font-bold text-foreground tracking-tight">Generated Codes</h3>
      </div>

      <div className="grid gap-4">
        {formats.map((fmt, index) => (
          <motion.div
            key={fmt.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
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
        className="mt-8 p-6 glass-panel rounded-xl text-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <p className="text-muted-foreground font-medium">
          Paste the code directly into your Discord message to display the timestamp.
        </p>
      </motion.div>
    </div>
  );
};

export default TimestampList;
