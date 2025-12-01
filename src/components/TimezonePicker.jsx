import React from 'react';

const TimezonePicker = ({ selectedTimezone, setSelectedTimezone }) => {
    const timezones = Intl.supportedValuesOf('timeZone');

    return (
        <div className="relative">
            <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="glass-input appearance-none cursor-pointer"
            >
                {timezones.map((tz) => (
                    <option key={tz} value={tz} className="bg-zinc-900 text-white">
                        {tz.replace(/_/g, ' ')}
                    </option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
};

export default TimezonePicker;
