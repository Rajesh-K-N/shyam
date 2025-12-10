const router = require('express').Router();
const Journal = require('../models/Journal');

// CREATE
router.post('/', async (req, res) => {
    try {
        // Get current count to set order
        const count = await Journal.countDocuments({ userId: req.body.userId });
        const newJournal = new Journal({ ...req.body, order: count });
        const savedJournal = await newJournal.save();
        res.status(200).json(savedJournal);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL FOR USER
router.get('/:userId', async (req, res) => {
    try {
        const journals = await Journal.find({ userId: req.params.userId }).sort({ isPinned: -1, order: 1, createdAt: -1 });
        res.status(200).json(journals);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE (Content, Pin, etc.)
router.put('/:id', async (req, res) => {
    try {
        const updatedJournal = await Journal.findByIdAndUpdate(
            req.params.id,
            { $set: { ...req.body, updatedAt: Date.now() } },
            { new: true }
        );
        res.status(200).json(updatedJournal);
    } catch (err) {
        res.status(500).json(err);
    }
});

// BATCH UPDATE ORDER
router.put('/reorder/:userId', async (req, res) => {
    try {
        const { journals } = req.body; // Expects array of { _id, order }
        const bulkOps = journals.map(j => ({
            updateOne: {
                filter: { _id: j._id },
                update: { $set: { order: j.order } }
            }
        }));
        await Journal.bulkWrite(bulkOps);
        res.status(200).json("Order updated");
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Journal.findByIdAndDelete(req.params.id);
        res.status(200).json("Journal has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
