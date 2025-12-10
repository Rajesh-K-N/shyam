const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Health Details
    lastPeriodDate: { type: Date },
    isPregnant: { type: Boolean, default: false },
    cycleDays: { type: Number }, // Average cycle length
    flowDays: { type: Number }, // Average flow length
    pregnancyDays: { type: Number }, // Days pregnant if applicable

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
