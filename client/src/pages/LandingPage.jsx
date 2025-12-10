import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getDailyQuote } from '../data/gitaQuotes';

const LandingPage = () => {
    const [user, setUser] = useState(null);
    const [showQuote, setShowQuote] = useState(false);
    const [dailyQuote, setDailyQuote] = useState(null);

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        setDailyQuote(getDailyQuote());
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-warm-cream via-white to-blue-50 overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-peacock-blue/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-krishna-gold/10 blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl tracking-tight font-extrabold text-deep-blue sm:text-6xl md:text-7xl mb-6">
                                <span className="block mb-2">Empowering Women With</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-peacock-blue to-peacock-green">
                                    Safety, Health & Support
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl md:mt-8 leading-relaxed"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                        >
                            Your secure sanctuary for wellbeing. Track your health, journal your thoughts, and stay safe with our integrated SOS system. Inspired by grace and strength.
                        </motion.p>

                        <motion.div
                            className="mt-10 max-w-md mx-auto sm:flex sm:justify-center gap-4"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.3 }}
                        >
                            {user ? (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setShowQuote(true)}
                                    className="cursor-pointer rounded-full shadow-lg bg-gradient-to-r from-peacock-blue to-peacock-green p-[2px] group"
                                >
                                    <div className="bg-white rounded-full px-10 py-4 text-lg font-bold text-peacock-blue group-hover:bg-peacock-blue group-hover:text-white transition-all duration-300 flex items-center justify-center min-w-[280px]">
                                        <span className="group-hover:hidden">Welcome back, {user.name}! 🦚</span>
                                        <span className="hidden group-hover:block">Click Me ✨</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <Link to="/signup">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-gradient-to-r from-peacock-blue to-peacock-green hover:shadow-xl transition-all"
                                        >
                                            Get Started
                                        </motion.button>
                                    </Link>
                                    <Link to="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full mt-4 sm:mt-0 flex items-center justify-center px-8 py-4 border-2 border-peacock-blue text-lg font-bold rounded-full text-peacock-blue bg-transparent hover:bg-peacock-blue/5 transition-all"
                                        >
                                            Login
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white/60 backdrop-blur-lg border-t border-krishna-gold/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-deep-blue sm:text-4xl">Features Designed for You</h2>
                        <p className="mt-4 text-gray-600">Everything you need for your safety and wellness journey.</p>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {/* Feature 1 - Journal */}
                        <Link to="/journal" className="block h-full">
                            <motion.div
                                variants={fadeInUp}
                                whileHover={{ y: -10, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                className="h-full p-8 bg-gradient-to-br from-peacock-green/5 to-peacock-green/10 rounded-3xl border border-peacock-green/20 cursor-pointer relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-9xl">📔</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-peacock-green/20 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        📔
                                    </div>
                                    <h3 className="text-2xl font-bold text-deep-blue mb-3">Wellness Journal</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Your private space to reflect. Track your mood, write your daily thoughts, and organize your life with our secure, pin-protected journaling system.
                                    </p>
                                    <div className="mt-6 flex items-center text-peacock-green font-semibold">
                                        Start Writing <span className="ml-2">→</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Feature 2 - Health Tracking */}
                        <Link to="/health" className="block h-full">
                            <motion.div
                                variants={fadeInUp}
                                whileHover={{ y: -10, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                className="h-full p-8 bg-gradient-to-br from-krishna-gold/5 to-krishna-gold/10 rounded-3xl border border-krishna-gold/20 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-9xl">📅</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-krishna-gold/20 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        📅
                                    </div>
                                    <h3 className="text-2xl font-bold text-deep-blue mb-3">Health Tracking</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Stay on top of your health. Monitor your cycle, pregnancy milestones, and vital health metrics with our intuitive tracking tools.
                                    </p>
                                    <div className="mt-6 flex items-center text-krishna-gold font-semibold">
                                        View Dashboard <span className="ml-2">→</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Feature 3 - AI Companion */}
                        <a href="https://www.chatbase.co/HTf91uUFDWsSecNYSzPMZ/help" target="_blank" rel="noopener noreferrer" className="block h-full md:col-span-2 lg:col-span-2">
                            <motion.div
                                variants={fadeInUp}
                                whileHover={{ y: -10, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                className="h-full p-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border border-pink-200 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-9xl">🤖</span>
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                                            S
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-deep-blue mb-3">Meet Sakhi: Your AI Companion</h3>
                                        <p className="text-gray-600 leading-relaxed max-w-2xl">
                                            Need a friend to talk to? Sakhi is here 24/7. Chat about your mood, ask pregnancy questions, or just vent. Powered by advanced AI to provide compassionate, non-judgmental support.
                                        </p>
                                        <div className="mt-6 flex items-center justify-center md:justify-start text-pink-600 font-semibold">
                                            Start Chatting <span className="ml-2">→</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Gita Quote Modal */}
            <AnimatePresence>
                {showQuote && dailyQuote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowQuote(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border-2 border-krishna-gold relative overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-peacock-blue/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-krishna-gold/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                            <div className="relative z-10 text-center">
                                <div className="w-16 h-16 bg-krishna-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                    🕉️
                                </div>
                                <h3 className="text-2xl font-bold text-deep-blue mb-2">Wisdom of the Day</h3>
                                <p className="text-sm text-peacock-blue font-medium mb-6">{dailyQuote.source}</p>

                                <blockquote className="text-xl font-serif italic text-gray-800 mb-6 leading-relaxed">
                                    "{dailyQuote.quote}"
                                </blockquote>

                                <div className="bg-warm-cream/50 p-4 rounded-xl border border-krishna-gold/20">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        <span className="font-bold text-deep-blue block mb-1">Insight:</span>
                                        {dailyQuote.explanation}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowQuote(false)}
                                    className="mt-8 px-6 py-2 bg-peacock-blue text-white rounded-full font-medium hover:bg-peacock-green transition-colors"
                                >
                                    Reflect & Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;
