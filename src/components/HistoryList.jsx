import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, History } from 'lucide-react';

const HistoryItem = ({ item, onLoad, onDelete }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="group relative border-l-2 border-gray-800 hover:border-primary bg-white/5 hover:bg-white/10 p-3 transition-all duration-300 rounded-r-md"
        >
            <div className="flex items-center justify-between relative z-10">
                <div className="min-w-0 flex-1 mr-3">
                    <p className="font-mono text-xs text-primary truncate group-hover:text-white transition-colors">
                        <span className="text-gray-500 mr-2">ID:</span>{item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp * 1000).toLocaleString(undefined, {
                            month: 'numeric', day: 'numeric',
                            hour: 'numeric', minute: '2-digit'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onLoad(item.timestamp)}
                        className="text-[10px] uppercase font-bold text-primary hover:text-white border border-primary hover:bg-primary px-2 py-1 transition-colors rounded-sm"
                    >
                        Load
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="text-gray-500 hover:text-destructive transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const HistoryList = ({ history, setHistory, onLoad }) => {
    const deleteHistoryItem = (id) => {
        setHistory(history.filter(item => item.id !== id));
    };

    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear all history?')) {
            setHistory([]);
        }
    };

    return (
        <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <History size={14} />
                    Log Data
                </h3>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="text-[10px] text-destructive hover:text-white hover:bg-destructive px-2 py-1 transition-colors uppercase font-mono tracking-wider border border-transparent hover:border-destructive rounded-sm"
                    >
                        Purge Logs
                    </button>
                )}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                    {history.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8 text-muted-foreground/50 font-mono text-xs border border-dashed border-white/10 rounded-md"
                        >
              // NO DATA LOGGED
                        </motion.div>
                    ) : (
                        history.map((item) => (
                            <HistoryItem
                                key={item.id}
                                item={item}
                                onLoad={onLoad}
                                onDelete={deleteHistoryItem}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HistoryList;
