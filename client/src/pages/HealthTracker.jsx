import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { getPhaseDetails, getPregnancyChance } from '../data/cyclePhases';
import { trimesterData, getWeeklyInsights } from '../data/pregnancyData';

const HealthTracker = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [mode, setMode] = useState('period');
    const [lastPeriodStart, setLastPeriodStart] = useState('');
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);
    const [pregnancyStartDate, setPregnancyStartDate] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchProfile(parsedUser._id);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchProfile = async (userId) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/health/${userId}`);
            if (res.data) {
                setProfile(res.data);
                setMode(res.data.mode);
                setLastPeriodStart(res.data.lastPeriodStart ? res.data.lastPeriodStart.split('T')[0] : '');
                setCycleLength(res.data.cycleLength);
                setPeriodLength(res.data.periodLength);
                setPregnancyStartDate(res.data.pregnancyStartDate ? res.data.pregnancyStartDate.split('T')[0] : '');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                userId: user._id,
                mode,
                lastPeriodStart: mode === 'period' ? lastPeriodStart : null,
                cycleLength: mode === 'period' ? cycleLength : null,
                periodLength: mode === 'period' ? periodLength : null,
                pregnancyStartDate: mode === 'pregnancy' ? pregnancyStartDate : null,
                dueDate: mode === 'pregnancy' ? calculateDueDate(pregnancyStartDate) : null
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/health`, payload);
            setProfile(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message || "Failed to save profile.";
            alert(`Error: ${errorMsg}`);
        }
    };

    const calculateDueDate = (startDate) => {
        if (!startDate) return null;
        const date = new Date(startDate);
        date.setDate(date.getDate() + 280); // +40 weeks
        return date;
    };

    const [viewDate, setViewDate] = useState(new Date());

    // --- CALENDAR LOGIC ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        if (!profile || !profile.lastPeriodStart) return null;

        const currentMonth = viewDate.getMonth();
        const currentYear = viewDate.getFullYear();
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

        const lastPeriod = new Date(profile.lastPeriodStart);
        const cycle = profile.cycleLength;
        const period = profile.periodLength;

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);

            // Calculate days difference from the original last period start
            // We use Math.floor to be consistent with day boundaries
            const diffTime = date.getTime() - lastPeriod.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Normalize negative days (if viewing past months)
            let dayInCycle = diffDays % cycle;
            if (dayInCycle < 0) dayInCycle += cycle;

            let bgColor = 'bg-white';
            let textColor = 'text-gray-700';
            let tooltip = '';

            if (dayInCycle < period) {
                // Period Days
                bgColor = 'bg-red-200';
                textColor = 'text-red-800';
                tooltip = 'Period';
            } else if (dayInCycle >= cycle - 14 - 2 && dayInCycle <= cycle - 14 + 2) {
                // Ovulation Window (approx 14 days before next period)
                bgColor = 'bg-purple-200';
                textColor = 'text-purple-800';
                tooltip = 'Ovulation Window';
            } else if (dayInCycle > period && dayInCycle < cycle - 14 - 2) {
                // Follicular Phase (after period, before ovulation)
                bgColor = 'bg-blue-50';
                tooltip = 'Follicular Phase';
            } else {
                // Luteal Phase (after ovulation)
                bgColor = 'bg-yellow-50';
                tooltip = 'Luteal Phase';
            }

            // Highlight Today
            const isToday = day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear();

            // Calculate Pregnancy Chance
            const chance = getPregnancyChance(dayInCycle, cycle);

            days.push(
                <div key={day} className={`h-10 flex items-center justify-center rounded-full text-sm font-medium cursor-help relative group ${bgColor} ${textColor} ${isToday ? 'ring-2 ring-peacock-blue font-bold' : ''}`}>
                    {day}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-lg z-20 w-32 text-center pointer-events-none">
                        <div className="font-bold mb-1">{tooltip}</div>
                        <div className="text-gray-300">Pregnancy Chance:</div>
                        <div className={`font-bold ${chance.color === 'text-gray-500' ? 'text-white' : 'text-pink-300'}`}>{chance.label} ({chance.percent})</div>
                    </div>
                </div>
            );
        }
        return days;
    };

    // --- PREGNANCY LOGIC ---
    const renderPregnancyStats = () => {
        if (!profile || !profile.pregnancyStartDate) return null;

        const start = new Date(profile.pregnancyStartDate);
        const now = new Date();
        const due = new Date(profile.dueDate);

        // Conceived Date (approx 14 days after LMP)
        const conceived = new Date(start);
        conceived.setDate(start.getDate() + 14);

        const diffTime = Math.abs(now - start);
        const daysPregnant = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeksPregnant = Math.floor(daysPregnant / 7);
        const remainingDays = daysPregnant % 7;

        const totalDays = 280;
        const progress = Math.min((daysPregnant / totalDays) * 100, 100);

        // Months Calculation (approx 4.3 weeks per month)
        const monthsPassed = Math.floor(weeksPregnant / 4.3);
        const monthsLeft = 9 - monthsPassed;

        // Trimester Calculation
        let currentTrimester = 1;
        if (weeksPregnant >= 13 && weeksPregnant < 27) currentTrimester = 2;
        if (weeksPregnant >= 27) currentTrimester = 3;

        const trimesterInfo = trimesterData[currentTrimester];
        const weeklyInfo = getWeeklyInsights(weeksPregnant);

        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-2xl border border-pink-200">
                    <h3 className="text-2xl font-bold text-pink-800 mb-2">Baby is on the way! 👶</h3>
                    <p className="text-pink-600">You are <span className="font-bold text-xl">{weeksPregnant} Weeks, {remainingDays} Days</span> along.</p>
                </div>

                {/* Key Dates & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Conceived Date</p>
                        <p className="text-lg font-bold text-deep-blue">{conceived.toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">(Approximate)</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Months Passed</p>
                        <p className="text-3xl font-bold text-peacock-blue">{monthsPassed}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Months Left</p>
                        <p className="text-3xl font-bold text-pink-500">{Math.max(0, monthsLeft)}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                        <span>Start: {start.toLocaleDateString()}</span>
                        <span>Due: {due.toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-peacock-blue to-peacock-green h-4 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-center mt-4 text-gray-600 text-sm">
                        {Math.max(0, 280 - daysPregnant)} days to go!
                    </p>
                </div>

                {/* Trimester Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20">
                    <h3 className="text-xl font-bold text-deep-blue mb-4 flex items-center gap-2">
                        <span>🤰</span> {trimesterInfo.title} <span className="text-sm font-normal text-gray-500">({trimesterInfo.range})</span>
                    </h3>
                    <p className="text-gray-700 mb-4">{trimesterInfo.description}</p>

                    <div className="bg-blue-50 p-4 rounded-xl mb-4">
                        <h4 className="font-bold text-blue-800 mb-2">What to Expect</h4>
                        <p className="text-blue-700 text-sm">{trimesterInfo.whatToExpect}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-xl border text-center ${currentTrimester === 1 ? 'bg-peacock-blue/10 border-peacock-blue ring-2 ring-peacock-blue' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                            <h4 className="font-bold text-deep-blue">1st Trimester</h4>
                        </div>
                        <div className={`p-4 rounded-xl border text-center ${currentTrimester === 2 ? 'bg-peacock-blue/10 border-peacock-blue ring-2 ring-peacock-blue' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                            <h4 className="font-bold text-deep-blue">2nd Trimester</h4>
                        </div>
                        <div className={`p-4 rounded-xl border text-center ${currentTrimester === 3 ? 'bg-peacock-blue/10 border-peacock-blue ring-2 ring-peacock-blue' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                            <h4 className="font-bold text-deep-blue">3rd Trimester</h4>
                        </div>
                    </div>
                </div>

                {/* Baby Development & Best Practices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20">
                        <h3 className="text-lg font-bold text-deep-blue mb-4 flex items-center gap-2">
                            <span>👶</span> Baby's Development
                        </h3>
                        <div className="bg-yellow-50 p-4 rounded-xl mb-4 text-center">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Current Size</p>
                            <p className="text-2xl font-bold text-yellow-700">{weeklyInfo.size}</p>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {weeklyInfo.development}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20">
                        <h3 className="text-lg font-bold text-deep-blue mb-4 flex items-center gap-2">
                            <span>🧘‍♀️</span> Best Practices
                        </h3>
                        <ul className="space-y-3">
                            {trimesterInfo.bestPractices.map((practice, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-peacock-green flex-shrink-0"></span>
                                    {practice}
                                </li>
                            ))}
                            <li className="flex items-start gap-2 text-peacock-blue font-medium text-sm mt-4 pt-4 border-t border-gray-100">
                                <span className="mt-1 w-4">💡</span>
                                Tip: {weeklyInfo.tip}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-warm-cream p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-peacock-blue transition-colors flex items-center gap-1 font-medium"
                    >
                        ← Back Home
                    </button>
                    <h1 className="text-3xl font-bold text-deep-blue">Health Tracker</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-peacock-blue hover:text-peacock-green font-medium"
                    >
                        {isEditing ? 'Cancel' : 'Settings'}
                    </button>
                </div>

                {/* Onboarding / Settings Form */}
                <AnimatePresence>
                    {(!profile || isEditing) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20 mb-8 overflow-hidden"
                        >
                            <h2 className="text-xl font-bold text-deep-blue mb-4">Setup Your Profile</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">I want to track:</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setMode('period')}
                                        className={`px-4 py-2 rounded-full border ${mode === 'period' ? 'bg-peacock-blue text-white border-peacock-blue' : 'bg-white text-gray-600 border-gray-300'}`}
                                    >
                                        Period Cycle
                                    </button>
                                    <button
                                        onClick={() => setMode('pregnancy')}
                                        className={`px-4 py-2 rounded-full border ${mode === 'pregnancy' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-600 border-gray-300'}`}
                                    >
                                        Pregnancy
                                    </button>
                                </div>
                            </div>

                            {mode === 'period' ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Period Start</label>
                                        <input
                                            type="date"
                                            value={lastPeriodStart}
                                            onChange={(e) => setLastPeriodStart(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-peacock-blue focus:ring-peacock-blue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Length (Days)</label>
                                        <input
                                            type="number"
                                            value={cycleLength}
                                            onChange={(e) => setCycleLength(Number(e.target.value))}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-peacock-blue focus:ring-peacock-blue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Period Duration (Days)</label>
                                        <input
                                            type="number"
                                            value={periodLength}
                                            onChange={(e) => setPeriodLength(Number(e.target.value))}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-peacock-blue focus:ring-peacock-blue"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy Start Date (LMP)</label>
                                    <input
                                        type="date"
                                        value={pregnancyStartDate}
                                        onChange={(e) => setPregnancyStartDate(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                className="mt-6 w-full bg-gradient-to-r from-peacock-blue to-peacock-green text-white py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                            >
                                Save Profile
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dashboard */}
                {profile && !isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {profile.mode === 'period' ? (
                            <>
                                {/* Cycle Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20 flex flex-col justify-center">
                                        <h2 className="text-lg font-bold text-deep-blue mb-1">Cycle Status</h2>
                                        <p className="text-sm text-gray-500 mb-4">Next period in:</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-bold text-peacock-blue">
                                                {(() => {
                                                    const last = new Date(profile.lastPeriodStart);
                                                    const next = new Date(last);
                                                    next.setDate(last.getDate() + profile.cycleLength);
                                                    while (next < new Date()) {
                                                        next.setDate(next.getDate() + profile.cycleLength);
                                                    }
                                                    const diff = Math.ceil((next - new Date()) / (1000 * 60 * 60 * 24));
                                                    return diff;
                                                })()}
                                            </span>
                                            <span className="text-sm font-bold text-gray-400 mb-1">DAYS</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20 flex flex-col justify-center">
                                        <h2 className="text-lg font-bold text-deep-blue mb-1">Current Phase</h2>
                                        <div className="mt-2">
                                            {(() => {
                                                const last = new Date(profile.lastPeriodStart);
                                                const now = new Date();
                                                const cycle = profile.cycleLength;
                                                const period = profile.periodLength;

                                                const diffTime = Math.abs(now - last);
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                const dayInCycle = diffDays % cycle;

                                                let phase = '';
                                                let color = '';

                                                if (dayInCycle < period) {
                                                    phase = 'Menstrual Phase';
                                                    color = 'text-red-600';
                                                } else if (dayInCycle >= cycle - 14 - 2 && dayInCycle <= cycle - 14 + 2) {
                                                    phase = 'Ovulation Phase';
                                                    color = 'text-purple-600';
                                                } else if (dayInCycle > period && dayInCycle < cycle - 14 - 2) {
                                                    phase = 'Follicular Phase';
                                                    color = 'text-blue-600';
                                                } else {
                                                    phase = 'Luteal Phase';
                                                    color = 'text-yellow-600';
                                                }
                                                return <span className={`text-2xl font-bold ${color}`}>{phase}</span>;
                                            })()}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Based on your last period</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20 flex flex-col justify-center">
                                        <h2 className="text-lg font-bold text-deep-blue mb-1">Last Period</h2>
                                        <div className="mt-2">
                                            <span className="text-2xl font-bold text-gray-700">
                                                {new Date(profile.lastPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Cycle Day {(() => {
                                            const last = new Date(profile.lastPeriodStart);
                                            const now = new Date();
                                            const diffTime = Math.abs(now - last);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            return (diffDays % profile.cycleLength) + 1;
                                        })()}</p>
                                    </div>
                                </div>

                                {/* Calendar */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-krishna-gold/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-deep-blue flex items-center gap-2">
                                            <span>📅</span> {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                                                className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={() => setViewDate(new Date())}
                                                className="px-3 py-1 text-xs font-bold text-peacock-blue bg-peacock-blue/10 rounded-full hover:bg-peacock-blue/20"
                                            >
                                                Today
                                            </button>
                                            <button
                                                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                                                className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                                            >
                                                →
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                            <div key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {renderCalendar()}
                                    </div>
                                    <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600 justify-center border-t border-gray-100 pt-4">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-200 rounded-full"></div> Period</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-50 rounded-full"></div> Follicular</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-200 rounded-full"></div> Ovulation</div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-50 rounded-full"></div> Luteal</div>
                                    </div>
                                </div>

                                {/* Phase Insights Box */}
                                {(() => {
                                    const last = new Date(profile.lastPeriodStart);
                                    const now = new Date();
                                    const diffTime = Math.abs(now - last);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    const dayInCycle = diffDays % profile.cycleLength;

                                    const phase = getPhaseDetails(dayInCycle, profile.cycleLength, profile.periodLength);
                                    const chance = getPregnancyChance(dayInCycle, profile.cycleLength);

                                    return (
                                        <div className={`p-8 rounded-2xl border ${phase.bgColor} ${phase.borderColor} shadow-sm`}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">✨</span>
                                                    <h3 className={`text-2xl font-bold ${phase.color}`}>{phase.title} Insights</h3>
                                                </div>
                                                <div className="bg-white/80 px-4 py-2 rounded-lg border border-pink-100 shadow-sm flex items-center gap-2">
                                                    <span className="text-xl">👶</span>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-bold uppercase">Pregnancy Chance</p>
                                                        <p className={`font-bold ${chance.color === 'text-gray-500' ? 'text-gray-700' : 'text-pink-600'}`}>
                                                            {chance.label} ({chance.percent})
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                                {phase.description}
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-white/60 p-6 rounded-xl backdrop-blur-sm">
                                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <span>🌡️</span> Symptoms to Watch
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {phase.symptoms.map((symptom, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                {symptom}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-white/60 p-6 rounded-xl backdrop-blur-sm">
                                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        <span>🧘‍♀️</span> Best Practices
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {phase.bestPractices.map((practice, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-peacock-green"></span>
                                                                {practice}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </>
                        ) : (
                            renderPregnancyStats()
                        )
                        }
                    </motion.div >
                )}
            </div >
        </div >
    );
};

export default HealthTracker;
