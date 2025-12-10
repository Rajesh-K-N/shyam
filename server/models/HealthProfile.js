const mongoose = require('mongoose');

const HealthProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    mode: { type: String, enum: ['period', 'pregnancy'], default: 'period' },

    // Period Mode Data
    lastPeriodStart: { type: Date },
    cycleLength: { type: Number, default: 28 }, // Average cycle length
    periodLength: { type: Number, default: 5 }, // Average period duration

    // Pregnancy Mode Data
    pregnancyStartDate: { type: Date }, // Usually LMP (Last Menstrual Period)
    dueDate: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthProfile', HealthProfileSchema);
