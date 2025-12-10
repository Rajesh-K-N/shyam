import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const Journal = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [journals, setJournals] = useState([]);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('Neutral');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchJournals(parsedUser._id);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchJournals = async (userId) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/journals/${userId}`);
            setJournals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateNew = () => {
        setSelectedJournal(null);
        setIsEditing(true);
        setTitle('');
        setContent('');
        setMood('Neutral');
    };

    const handleSelectJournal = (journal) => {
        setSelectedJournal(journal);
        setIsEditing(false);
        setTitle(journal.title);
        setContent(journal.content);
        setMood(journal.mood);
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return alert("Title and Content are required!");

        try {
            if (selectedJournal) {
                // Update
                await axios.put(`${import.meta.env.VITE_API_URL}/api/journals/${selectedJournal._id}`, {
                    title, content, mood
                });
            } else {
                // Create
                await axios.post(`${import.meta.env.VITE_API_URL}/api/journals`, {
                    userId: user._id,
                    title,
                    content,
                    mood
                });
            }
            fetchJournals(user._id);
            setIsEditing(false);
            setSelectedJournal(null);
            alert("Journal Saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to save journal.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/journals/${id}`);
            fetchJournals(user._id);
            if (selectedJournal && selectedJournal._id === id) {
                setSelectedJournal(null);
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePin = async (e, journal) => {
        e.stopPropagation();
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/journals/${journal._id}`, {
                isPinned: !journal.isPinned
            });
            fetchJournals(user._id);
        } catch (err) {
            console.error(err);
        }
    };

    // Separate journals into pinned and unpinned
    const pinnedJournals = journals.filter(j => j.isPinned);
    const unpinnedJournals = journals.filter(j => !j.isPinned);

    const handleReorder = async (newUnpinnedOrder) => {
        // Construct the full new list: Pinned items stay as they are, Unpinned items get new order
        const newJournals = [...pinnedJournals, ...newUnpinnedOrder];
        setJournals(newJournals);

        // Prepare payload for backend
        // We only really need to update the order of the unpinned ones relative to themselves, 
        // but to be safe and simple, let's update the order of everything based on their new index in the full list.
        const updates = newJournals.map((j, index) => ({
            _id: j._id,
            order: index
        }));

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/journals/reorder/${user._id}`, { journals: updates });
        } catch (err) {
            console.error("Failed to save order", err);
        }
    };

    return (
        <div className="min-h-screen bg-warm-cream flex">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-krishna-gold/20 flex flex-col h-screen sticky top-0 shadow-lg z-10">
                <div className="p-6 border-b border-krishna-gold/10 bg-gradient-to-b from-warm-cream/50 to-white">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-peacock-blue transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                            ← Back Home
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-deep-blue flex items-center gap-2">
                        <span>📔</span> My Journal
                    </h2>
                    <button
                        onClick={handleCreateNew}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-gradient-to-r from-peacock-blue to-peacock-green hover:from-peacock-green hover:to-peacock-blue transition-all transform hover:scale-[1.02]"
                    >
                        + New Entry
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Pinned Section */}
                    {pinnedJournals.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Pinned</h3>
                            <div className="space-y-2">
                                {pinnedJournals.map((journal) => (
                                    <motion.div
                                        key={journal._id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleSelectJournal(journal)}
                                        className={`p-4 rounded-lg cursor-pointer border transition-colors relative group ${selectedJournal && selectedJournal._id === journal._id
                                            ? 'bg-peacock-blue/10 border-peacock-blue'
                                            : 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-deep-blue truncate flex-1">{journal.title}</h3>
                                            <button
                                                onClick={(e) => handlePin(e, journal)}
                                                className="ml-2 p-1 rounded-full text-peacock-blue hover:bg-yellow-200 transition-colors"
                                                title="Unpin"
                                            >
                                                📌
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(journal.createdAt).toLocaleDateString()}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unpinned / All Notes Section */}
                    <div>
                        {pinnedJournals.length > 0 && (
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 mt-4">All Notes</h3>
                        )}
                        <Reorder.Group axis="y" values={unpinnedJournals} onReorder={handleReorder} className="space-y-2">
                            {unpinnedJournals.map((journal) => (
                                <Reorder.Item
                                    key={journal._id}
                                    value={journal}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleSelectJournal(journal)}
                                    className={`p-4 rounded-lg cursor-pointer border transition-colors relative group ${selectedJournal && selectedJournal._id === journal._id
                                        ? 'bg-peacock-blue/10 border-peacock-blue'
                                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-deep-blue truncate flex-1">{journal.title}</h3>
                                        <button
                                            onClick={(e) => handlePin(e, journal)}
                                            className="ml-2 p-1 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-colors hover:text-peacock-blue"
                                            title="Pin"
                                        >
                                            📌
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(journal.createdAt).toLocaleDateString()}
                                    </p>
                                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 mt-2 inline-block">
                                        {journal.mood}
                                    </span>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>

                    {journals.length === 0 && (
                        <p className="text-center text-gray-400 mt-10">No journals yet. Start writing!</p>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto h-screen">
                <AnimatePresence mode='wait'>
                    {isEditing || selectedJournal ? (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-krishna-gold/10 p-8 min-h-[80vh]"
                        >
                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                    <select
                                        value={mood}
                                        onChange={(e) => setMood(e.target.value)}
                                        disabled={!isEditing && selectedJournal}
                                        className="border-gray-300 rounded-md text-sm focus:ring-peacock-blue focus:border-peacock-blue"
                                    >
                                        <option>Neutral</option>
                                        <option>Happy</option>
                                        <option>Sad</option>
                                        <option>Anxious</option>
                                        <option>Excited</option>
                                        <option>Calm</option>
                                    </select>
                                    <span className="text-sm text-gray-400">
                                        {selectedJournal ? new Date(selectedJournal.updatedAt).toLocaleString() : new Date().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {!isEditing && (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-peacock-blue hover:text-peacock-green px-3 py-1 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(selectedJournal._id)}
                                                className="text-red-500 hover:text-red-700 px-3 py-1 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {isEditing && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    if (!selectedJournal) setSelectedJournal(null); // Cancel creation
                                                }}
                                                className="text-gray-500 hover:text-gray-700 px-3 py-1 text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="bg-peacock-blue text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-peacock-green"
                                            >
                                                Save
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Editor Fields */}
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full text-3xl font-bold text-deep-blue placeholder-gray-300 border-none focus:ring-0 mb-4 p-0"
                                    />
                                    <textarea
                                        placeholder="Write your thoughts..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-[60vh] text-gray-700 text-lg leading-relaxed border-none focus:ring-0 resize-none p-0"
                                    />
                                </>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-deep-blue mb-6">{selectedJournal.title}</h1>
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                        {selectedJournal.content}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-gray-400"
                        >
                            <div className="text-6xl mb-4">📔</div>
                            <p className="text-xl">Select a journal or create a new one</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Journal;
