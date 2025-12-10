import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: "Namaste! I am Sakhi, your AI health companion. I'm here to listen and help you with questions about your mood, cycle, or pregnancy. How are you feeling today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, { message: input });
            const botMessage = { text: res.data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = { text: "I'm having a little trouble connecting right now. Please try again in a moment.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestions = [
        "I'm feeling anxious today",
        "What should I eat during my period?",
        "Is it normal to have cramps?",
        "Tell me a pregnancy tip"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col h-[calc(100vh-80px)]">
                {/* Header */}
                <div className="bg-white rounded-t-2xl p-4 shadow-sm border-b border-pink-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                        S
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Sakhi AI Companion</h1>
                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online & Ready to Help
                        </p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pink-200">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none border border-gray-200 flex gap-2 items-center">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white rounded-b-2xl p-4 shadow-lg border-t border-pink-100">
                    {messages.length === 1 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(s); }}
                                    className="whitespace-nowrap px-3 py-1 bg-pink-50 text-pink-600 text-xs rounded-full border border-pink-200 hover:bg-pink-100 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2 items-end">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none min-h-[50px] max-h-[120px]"
                            rows="1"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`p-3 rounded-xl transition-all duration-200 ${!input.trim() || isLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
