const router = require('express').Router();
const User = require('../models/User');
const HealthProfile = require('../models/HealthProfile');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        // Check if email already exists
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json("Email is already in use.");
        }

        // Check if password already exists (Unique Password Requirement)
        const existingPassword = await User.findOne({ password: req.body.password });
        if (existingPassword) {
            return res.status(400).json("Password must be unique. This password is already used by another account.");
        }

        const newUser = new User({
            name: req.body.name,
            age: req.body.age,
            contact: req.body.contact,
            email: req.body.email,
            password: req.body.password,
            // emergencyContact: req.body.emergencyContact // Removed as it's not in User schema currently
        });

        const savedUser = await newUser.save();

        // Create Health Profile
        const { isPregnant, lastPeriodDate, cycleDays, flowDays, pregnancyDays } = req.body;

        let healthData = {
            userId: savedUser._id,
            mode: isPregnant ? 'pregnancy' : 'period',
            cycleLength: cycleDays ? parseInt(cycleDays) : 28,
            periodLength: flowDays ? parseInt(flowDays) : 5
        };

        if (lastPeriodDate) {
            healthData.lastPeriodStart = new Date(lastPeriodDate);
        }

        if (isPregnant && pregnancyDays) {
            const start = new Date();
            start.setDate(start.getDate() - parseInt(pregnancyDays));
            healthData.pregnancyStartDate = start;

            const due = new Date(start);
            due.setDate(due.getDate() + 280);
            healthData.dueDate = due;
        }

        const newHealthProfile = new HealthProfile(healthData);
        await newHealthProfile.save();

        res.status(201).json(savedUser);
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json(err.message || "Internal Server Error");
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found");

        if (user.password !== req.body.password) {
            return res.status(400).json("Wrong password");
        }

        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
