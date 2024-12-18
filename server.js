const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const tweetRoutes = require('./routes/tweet');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
dotenv.config();
const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(cors());
app.use(express.json());  // To parse JSON data
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);
app.use('/api/tweet', tweetRoutes);  // For tweet-related routes
app.use('/api/auth', authRoutes);  

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB: ", err));

    
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
