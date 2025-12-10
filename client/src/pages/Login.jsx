import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
            console.log('Login success:', response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.dispatchEvent(new Event('storage')); // Trigger update for Navbar
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border border-krishna-gold/20">

                {/* Left Side - Illustration */}
                <div className="md:w-1/2 bg-peacock-blue/10 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-peacock-blue/5 to-peacock-green/5 z-0"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="z-10"
                    >
                        <div className="text-9xl mb-4">🦚</div>
                        <h2 className="text-2xl font-bold text-deep-blue">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Your safe space is waiting for you.</p>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-deep-blue">Sign In</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or <Link to="/signup" className="font-medium text-peacock-blue hover:text-peacock-green">create a new account</Link>
                        </p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-peacock-blue focus:border-peacock-blue sm:text-sm"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-peacock-blue focus:border-peacock-blue sm:text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-peacock-blue hover:bg-peacock-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peacock-blue"
                            >
                                Sign In
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
