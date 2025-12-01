import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { DatePickerInput, TimePickerInput } from './DateTimePicker';
import TimezonePicker from './TimezonePicker';
import HistoryList from './HistoryList';
import TargetDisplay from './TargetDisplay';
import TimestampList from './TimestampList';

const ThemeLayout = ({
    selectedDate,
    setSelectedDate,
    selectedTimezone,
    setSelectedTimezone,
    history,
    setHistory,
    getUnixTimestamp,
    longFormDate,
    formatPreview,
    addToHistory
}) => {
    const { theme } = useTheme();

    const loadHistoryItem = (timestamp) => {
        const date = new Date(timestamp * 1000);
        setSelectedDate(date.toISOString().slice(0, 16));
    };

    // --- Layouts ---

    // 1. Cyberpunk (Original Dashboard)
    const CyberpunkLayout = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            <motion.div
                className="lg:col-span-5 space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
            >
                <div className="cyber-card p-6 h-full flex flex-col">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>

                    <div className="space-y-8 flex-1">
                        <TargetDisplay longFormDate={longFormDate} />

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            </div>

                            <HistoryList history={history} setHistory={setHistory} onLoad={loadHistoryItem} />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="lg:col-span-7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <TimestampList
                    getUnixTimestamp={getUnixTimestamp}
                    formatPreview={formatPreview}
                    addToHistory={addToHistory}
                />
            </motion.div>
        </div>
    );

    // 2. Midnight (Centered Glass Stack)
    const MidnightLayout = () => (
        <div className="max-w-3xl mx-auto relative">
            {/* Ambient Glows */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-700"></div>

            <motion.div
                className="cyber-card backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-light text-white mb-2 tracking-widest font-sans">TEMPORAL LOCUS</h2>
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                    <p className="text-primary/80 mt-2 font-sans text-sm tracking-wide">{longFormDate}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <DatePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        <TimePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        <TimezonePicker selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} />
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <HistoryList history={history} setHistory={setHistory} onLoad={loadHistoryItem} />
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                    <TimestampList
                        getUnixTimestamp={getUnixTimestamp}
                        formatPreview={formatPreview}
                        addToHistory={addToHistory}
                    />
                </div>
            </motion.div>
        </div>
    );

    // 3. Light (Professional Dashboard)
    const LightLayout = () => (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                    <div className="w-full md:w-64">
                        <DatePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </div>
                    <div className="w-full md:w-48">
                        <TimePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </div>
                </div>
                <div className="w-full md:w-64">
                    <TimezonePicker selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Generated Timestamps</h2>
                        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            {longFormDate}
                        </span>
                    </div>
                    <TimestampList
                        getUnixTimestamp={getUnixTimestamp}
                        formatPreview={formatPreview}
                        addToHistory={addToHistory}
                    />
                </div>

                {/* Sidebar */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <HistoryList history={history} setHistory={setHistory} onLoad={loadHistoryItem} />
                </div>
            </div>
        </div>
    );

    // Switcher
    switch (theme) {
        case 'midnight':
            return <MidnightLayout />;
        case 'light':
            return <LightLayout />;
        case 'cyberpunk':
        default:
            return <CyberpunkLayout />;
    }
};

export default ThemeLayout;
