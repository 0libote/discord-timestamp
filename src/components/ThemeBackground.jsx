import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeBackground = () => {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Cyberpunk Background */}
            {theme === 'cyberpunk' && (
                <>
                    <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                    <div className="absolute inset-0 scanline-overlay"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
                </>
            )}

            {/* Midnight Background */}
            {theme === 'midnight' && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0f] to-black"></div>
                    <div className="absolute inset-0 opacity-30">
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-white rounded-full"
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight,
                                    scale: Math.random() * 0.5 + 0.5,
                                    opacity: Math.random() * 0.7 + 0.3,
                                }}
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                    scale: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    width: Math.random() * 3 + 1 + 'px',
                                    height: Math.random() * 3 + 1 + 'px',
                                }}
                            />
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent blur-3xl"></div>
                </>
            )}

            {/* Cute Background */}
            {theme === 'cute' && (
                <>
                    <div className="absolute inset-0 bg-[#fef5fb]"></div>
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(#ff9de2 2px, transparent 2px)',
                        backgroundSize: '30px 30px'
                    }}></div>
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-4xl opacity-20"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: window.innerHeight + 100,
                                rotate: 0
                            }}
                            animate={{
                                y: -100,
                                rotate: 360,
                                x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 50}px)`
                            }}
                            transition={{
                                duration: Math.random() * 10 + 15,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 10
                            }}
                        >
                            {['🌸', '✨', '💖', '☁️', '🍬'][i % 5]}
                        </motion.div>
                    ))}
                </>
            )}

            {/* Discord Dark/Light Background */}
            {(theme === 'discord-dark' || theme === 'discord-light') && (
                <div className="absolute inset-0 bg-background"></div>
            )}

            {/* Light Background */}
            {theme === 'light' && (
                <div className="absolute inset-0 bg-gray-50">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-50"></div>
                </div>
            )}
        </div>
    );
};

export default ThemeBackground;
