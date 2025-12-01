import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

const HistoryList = ({ history, setHistory, onLoad }) => {
    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground text-sm">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>No history yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent</span>
                <button
                    onClick={() => setHistory([])}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                >
                    <Trash2 size={12} />
                    Clear
                </button>
            </div>

            <div className="space-y-2">
                {history.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onLoad(item.timestamp)}
                        className="group flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-800/50 hover:border-primary/30 cursor-pointer transition-all duration-200"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                {new Date(item.timestamp * 1000).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                                {new Date(item.timestamp * 1000).toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all">
                            <Clock size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;
