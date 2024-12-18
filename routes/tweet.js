const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const verifyToken = require('../middleware/verifyToken');

// Create a Tweet (Authenticated users only)
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const newTweet = new Tweet({
            user: req.userId,  // Assuming the userId is decoded and attached by verifyToken middleware
            content
        });

        await newTweet.save();
        res.status(201).json(newTweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
