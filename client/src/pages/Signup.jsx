import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        contact: '',
        email: '',
        password: '',
        confirmPassword: '',
        lastPeriodDate: '',
        isPregnant: false,
        cycleDays: '',
        flowDays: '',
        pregnancyDays: ''
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
            console.log('Signup success:', response.data);
            alert('Account Created Successfully!');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('Signup Failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 border border-krishna-gold/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-deep-blue">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join our community. <Link to="/login" className="font-medium text-peacock-blue hover:text-peacock-green">Already have an account?</Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-deep-blue border-b border-krishna-gold/30 pb-2">Personal Details</h3>
                            <input name="name" type="text" placeholder="Full Name" required className="input-field" onChange={handleChange} />
                            <input name="age" type="number" placeholder="Age" required className="input-field" onChange={handleChange} />
                            <input name="contact" type="tel" placeholder="Contact Number" required className="input-field" onChange={handleChange} />
                            <input name="email" type="email" placeholder="Email Address" required className="input-field" onChange={handleChange} />
                        </div>

                        {/* Health Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-deep-blue border-b border-krishna-gold/30 pb-2">Health Profile</h3>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Last Period Date</label>
                                <input name="lastPeriodDate" type="date" className="input-field" onChange={handleChange} />
                            </div>

                            <div className="flex items-center space-x-2 my-2">
                                <input
                                    id="isPregnant"
                                    name="isPregnant"
                                    type="checkbox"
                                    className="h-4 w-4 text-peacock-blue focus:ring-peacock-blue border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                                <label htmlFor="isPregnant" className="text-sm text-gray-700">Are you pregnant?</label>
                            </div>

                            {formData.isPregnant ? (
                                <input name="pregnancyDays" type="number" placeholder="Days Pregnant" className="input-field" onChange={handleChange} />
                            ) : (
                                <>
                                    <input name="cycleDays" type="number" placeholder="Cycle Length (days)" className="input-field" onChange={handleChange} />
                                    <input name="flowDays" type="number" placeholder="Period Flow Length (days)" className="input-field" onChange={handleChange} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Security */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <input name="password" type="password" placeholder="Password" required className="input-field" onChange={handleChange} />
                        <input name="confirmPassword" type="password" placeholder="Confirm Password" required className="input-field" onChange={handleChange} />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-peacock-blue hover:bg-peacock-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peacock-blue mt-6"
                    >
                        Create Account
                    </motion.button>
                </form>
            </div>

            <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          outline: none;
        }
        .input-field:focus {
          border-color: #004F98;
          ring: 2px solid #004F98;
        }
      `}</style>
        </div>
    );
};

export default Signup;
