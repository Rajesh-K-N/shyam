const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, default: 'Untitled' },
    content: { type: String, default: '' },
    mood: { type: String, default: 'Neutral' },
    isPinned: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', JournalSchema);
