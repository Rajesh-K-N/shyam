import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const ComingSoon = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex flex-col">

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="text-6xl">🚨</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            SOS Feature
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-6">
                            Coming Soon
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto"
                    >
                        We are working hard to build a robust and reliable emergency alert system to keep you safe. This feature will be available in the next update.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link to="/">
                            <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                Return Home
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
