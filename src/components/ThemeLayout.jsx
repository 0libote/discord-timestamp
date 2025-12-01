import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { DatePickerInput, TimePickerInput } from './DateTimePicker';
import TimezonePicker from './TimezonePicker';
import HistoryList from './HistoryList';
import TargetDisplay from './TargetDisplay';
import TimestampList from './TimestampList';
import { History, Settings, Hash, Menu } from 'lucide-react';

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

    // 2. Discord (Sidebar + Chat View)
    const DiscordLayout = () => (
        <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] max-w-7xl mx-auto bg-card rounded-lg overflow-hidden shadow-2xl border border-border">
            {/* Sidebar (Controls) */}
            <div className="w-full md:w-80 bg-secondary/30 p-4 flex flex-col border-r border-border overflow-y-auto">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wide">Configuration</h3>
                    <Settings size={14} className="text-muted-foreground" />
                </div>

                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Date & Time</label>
                        <DatePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        <div className="h-2"></div>
                        <TimePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Timezone</label>
                        <TimezonePicker selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} />
                    </div>

                    <div className="pt-4 border-t border-border">
                        <HistoryList history={history} setHistory={setHistory} onLoad={loadHistoryItem} />
                    </div>
                </div>
            </div>

            {/* Main Content (Chat View) */}
            <div className="flex-1 bg-background flex flex-col">
                <div className="h-12 border-b border-border flex items-center px-4 shadow-sm">
                    <Hash size={20} className="text-muted-foreground mr-2" />
                    <span className="font-bold text-foreground">timestamp-output</span>
                    <div className="h-6 w-[1px] bg-border mx-4"></div>
                    <span className="text-xs text-muted-foreground truncate">{longFormDate}</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <TimestampList
                        getUnixTimestamp={getUnixTimestamp}
                        formatPreview={formatPreview}
                        addToHistory={addToHistory}
                    />
                </div>
            </div>
        </div>
    );

    // 3. Midnight (Centered Glass Stack)
    const MidnightLayout = () => (
        <div className="max-w-3xl mx-auto relative">
            <motion.div
                className="cyber-card backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-light text-white mb-2 tracking-widest">TEMPORAL LOCUS</h2>
                    <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
                    <p className="text-primary/80 mt-2 font-mono text-sm">{longFormDate}</p>
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

    // 4. Cute (Masonry / Floating Cards)
    const CuteLayout = () => (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left Column: Controls */}
                <div className="w-full md:w-1/3 space-y-6">
                    <motion.div
                        className="cyber-card bg-white p-6 rounded-3xl shadow-lg border-4 border-white transform -rotate-2"
                        whileHover={{ rotate: 0, scale: 1.02 }}
                    >
                        <h3 className="text-xl font-bold text-primary mb-4 text-center">💖 Pick a Date!</h3>
                        <DatePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </motion.div>

                    <motion.div
                        className="cyber-card bg-white p-6 rounded-3xl shadow-lg border-4 border-white transform rotate-1"
                        whileHover={{ rotate: 0, scale: 1.02 }}
                    >
                        <h3 className="text-xl font-bold text-secondary mb-4 text-center">⏰ What Time?</h3>
                        <TimePickerInput selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </motion.div>

                    <motion.div
                        className="cyber-card bg-white p-6 rounded-3xl shadow-lg border-4 border-white transform -rotate-1"
                        whileHover={{ rotate: 0, scale: 1.02 }}
                    >
                        <h3 className="text-xl font-bold text-accent mb-4 text-center">🌍 Where are you?</h3>
                        <TimezonePicker selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} />
                    </motion.div>
                </div>

                {/* Right Column: Results */}
                <div className="w-full md:w-2/3 space-y-6">
                    <motion.div
                        className="cyber-card bg-white/80 backdrop-blur-sm p-8 rounded-[40px] shadow-xl border-4 border-white"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="text-center mb-6">
                            <span className="inline-block px-4 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-md mb-2">
                                Current Selection
                            </span>
                            <h2 className="text-2xl font-bold text-gray-700">{longFormDate}</h2>
                        </div>

                        <TimestampList
                            getUnixTimestamp={getUnixTimestamp}
                            formatPreview={formatPreview}
                            addToHistory={addToHistory}
                        />
                    </motion.div>

                    <div className="bg-white/60 p-6 rounded-3xl border-4 border-white/50">
                        <HistoryList history={history} setHistory={setHistory} onLoad={loadHistoryItem} />
                    </div>
                </div>
            </div>
        </div>
    );

    // 5. Light (Professional Dashboard)
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
        case 'discord-dark':
        case 'discord-light':
            return <DiscordLayout />;
        case 'midnight':
            return <MidnightLayout />;
        case 'cute':
            return <CuteLayout />;
        case 'light':
            return <LightLayout />;
        case 'cyberpunk':
        default:
            return <CyberpunkLayout />;
    }
};

export default ThemeLayout;
