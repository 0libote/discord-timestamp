import React, { useState } from 'react';
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
    <div className="space-y-4">
      {timestampTypes.map((type) => {
        const timestampCode = `<t:${getUnixTimestamp()}:${type.id}>`;
        const preview = formatPreview(type.id);
        
        return (
          <div
            key={type.id}
            className="bg-card rounded-lg p-4 md:p-5 border hover:border-discord"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
              <h3 className="text-lg font-semibold">{type.name}</h3>

              <div className="text-center">
                <div className="text-xl md:text-2xl font-medium text-discord">{preview}</div>
              </div>

              <div className="flex justify-center md:justify-end">
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      onClick={() => copyToClipboard(timestampCode, type.id)}
                      className="flex items-center justify-center gap-2 bg-discord text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm min-w-[110px] hover:bg-discord-darker"
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
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-3 py-2 bg-gray-800 dark:bg-black text-white text-xs font-mono rounded-lg shadow-lg whitespace-nowrap">
                    <p>{timestampCode}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimestampList;
