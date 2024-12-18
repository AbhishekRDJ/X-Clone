const express = require('express');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});
// User Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id }, // Payload (e.g., user data)
            process.env.JWT_SECRET, // Secret key (ensure this matches your environment variable)
            { expiresIn: '1h' } // Token expiration time (optional)
        );

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});


module.exports = router;
