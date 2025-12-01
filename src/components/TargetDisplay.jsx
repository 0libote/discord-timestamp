import React from 'react';
import { motion } from 'framer-motion';

const TargetDisplay = ({ longFormDate }) => {
    return (
        <motion.div
            className="p-4 border border-primary/20 bg-primary/5 relative overflow-hidden group rounded-md"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

            <p className="font-mono text-primary mb-2 text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-primary animate-pulse"></span>
                Target Coordinates
            </p>
            <div className="text-center font-display font-bold text-sm md:text-lg text-white tracking-wide uppercase text-glow-primary">
                {longFormDate}
            </div>
        </motion.div>
    );
};

export default TargetDisplay;
