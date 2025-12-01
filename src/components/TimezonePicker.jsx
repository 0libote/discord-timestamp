import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const TimezonePicker = ({ selectedTimezone, setSelectedTimezone }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const timezones = Intl.supportedValuesOf('timeZone').map(tz => {
        try {
            const offset = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'longOffset'
            }).formatToParts(new Date())
                .find(part => part.type === 'timeZoneName').value;
            return { value: tz, label: `(${offset}) ${tz.replace(/_/g, ' ')}`, offset };
        } catch (e) {
            return { value: tz, label: tz.replace(/_/g, ' '), offset: '' };
        }
    });

    const filteredTimezones = timezones.filter(tz =>
        tz.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedTzLabel = timezones.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone;

    return (
        <div className="relative group">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="cyber-input cursor-pointer flex items-center justify-between"
            >
                <span className="truncate mr-2">{selectedTzLabel}</span>
                <ChevronDown size={16} className={`text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-1 bg-black border border-gray-800 shadow-xl max-h-60 flex flex-col rounded-md overflow-hidden"
                    >
                        <div className="p-2 border-b border-gray-800 sticky top-0 bg-black z-10">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search timezone..."
                                className="w-full bg-white/5 border border-gray-800 text-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary placeholder:text-gray-600 rounded-sm"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {filteredTimezones.length > 0 ? (
                                filteredTimezones.map((tz) => (
                                    <div
                                        key={tz.value}
                                        onClick={() => {
                                            setSelectedTimezone(tz.value);
                                            setIsOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className={`px-4 py-2 text-sm cursor-pointer transition-colors font-mono hover:bg-primary/20 hover:text-primary ${selectedTimezone === tz.value ? 'bg-primary/10 text-primary' : 'text-gray-400'
                                            }`}
                                    >
                                        {tz.label}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 font-mono text-center">
                                    No results found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimezonePicker;
