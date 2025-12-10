const router = require('express').Router();
const HealthProfile = require('../models/HealthProfile');

// GET Profile
router.get('/:userId', async (req, res) => {
    try {
        const profile = await HealthProfile.findOne({ userId: req.params.userId });
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREATE or UPDATE Profile
router.post('/', async (req, res) => {
    try {
        const { userId, ...data } = req.body;

        // Check if profile exists
        let profile = await HealthProfile.findOne({ userId });

        if (profile) {
            // Update
            profile = await HealthProfile.findOneAndUpdate(
                { userId },
                { $set: { ...data, updatedAt: Date.now() } },
                { new: true }
            );
        } else {
            // Create
            profile = new HealthProfile({ userId, ...data });
            await profile.save();
        }

        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
