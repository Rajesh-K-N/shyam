import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Mobile menu state
    const navigate = useNavigate();

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

        // Listen for storage events to update state (e.g. after login/logout)
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
        setIsOpen(false);
    };

    const handleSOS = () => {
        navigate('/coming-soon');
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-md border-b border-krishna-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl font-bold text-peacock-blue hover:text-peacock-green transition-colors flex items-center gap-2">
                            <span className="text-4xl">🦚</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-peacock-blue to-peacock-green">Shyam</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {/* SOS Button - Prominent */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSOS}
                            className="bg-red-600 text-white px-5 py-2 rounded-full font-bold shadow-lg hover:bg-red-700 flex items-center gap-2 animate-pulse"
                        >
                            <span>🆘</span> SOS
                        </motion.button>

                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="text-deep-blue font-medium">Hello, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-gray-600 hover:text-peacock-blue transition-colors border border-gray-300 px-4 py-2 rounded-lg hover:border-peacock-blue"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-deep-blue hover:text-peacock-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-peacock-blue text-white hover:bg-peacock-green px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        {/* Mobile SOS */}
                        <button
                            onClick={handleSOS}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-md"
                        >
                            SOS
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-deep-blue hover:text-peacock-blue focus:outline-none"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-krishna-gold/20 overflow-hidden shadow-xl"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col items-center">
                            {user ? (
                                <>
                                    <span className="block px-3 py-2 text-deep-blue font-medium text-lg">Hello, {user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center px-3 py-3 text-gray-600 hover:text-peacock-blue hover:bg-gray-50 rounded-md font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-3 py-3 text-deep-blue hover:text-peacock-blue hover:bg-gray-50 rounded-md font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block w-full text-center px-3 py-3 bg-peacock-blue text-white rounded-md font-medium hover:bg-peacock-green"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
