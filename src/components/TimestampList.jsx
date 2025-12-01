import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const TimestampList = ({ getUnixTimestamp, formatPreview, addToHistory }) => {
  const [copiedId, setCopiedId] = useState(null);

  const formats = [
    { id: 't', label: 'Short Time', desc: '16:20' },
    { id: 'T', label: 'Long Time', desc: '16:20:30' },
    { id: 'd', label: 'Short Date', desc: '20/04/2021' },
    { id: 'D', label: 'Long Date', desc: '20 April 2021' },
    { id: 'f', label: 'Short Date/Time', desc: '20 April 2021 16:20' },
    { id: 'F', label: 'Long Date/Time', desc: 'Tuesday, 20 April 2021 16:20' },
    { id: 'R', label: 'Relative Time', desc: '2 months ago' },
  ];

  const handleCopy = (formatId, formatLabel) => {
    const timestamp = getUnixTimestamp();
    const code = `<t:${timestamp}:${formatId}>`;

    navigator.clipboard.writeText(code);
    setCopiedId(formatId);
    addToHistory(formatLabel, timestamp);

    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {formats.map((format) => (
        <div
          key={format.id}
          onClick={() => handleCopy(format.id, format.label)}
          className="group relative p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800/50 hover:border-primary/50 cursor-pointer transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-medium text-zinc-400 group-hover:text-primary transition-colors">
                {format.label}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format.desc}
              </p>
            </div>
            <div className={`
              w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200
              ${copiedId === format.id
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-white/5 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}
            `}>
              {copiedId === format.id ? <Check size={16} /> : <Copy size={16} />}
            </div>
          </div>

          <div className="bg-black/40 rounded-lg p-2 font-mono text-sm text-zinc-300 group-hover:text-white border border-white/5 group-hover:border-primary/20 transition-colors truncate">
            {`<t:${getUnixTimestamp()}:${format.id}>`}
          </div>

          <div className="mt-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors truncate">
            Preview: <span className="text-zinc-300">{formatPreview(format.id)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimestampList;
