const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAMtLxgEAAAAATltkUWe%2BkYvzl93YQRSCmHYcmiw%3Df6w5ogNej35vduZeelLH2rhEqIY1DgqWDsmYy62afBhIEExsuy"; // Replace with your actual Bearer Token

// Fetch the User ID by username
async function getUserId(username) {
    const endpoint = `https://api.twitter.com/2/users/by/username/${username}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        console.log(response)
        if (!response.ok) {
            const errorDetails = await response.text(); // Get error details from the response
            console.error(`Error fetching user ID: ${response.status} - ${response.statusText}`);
            console.error('Error Details:', errorDetails);  // Log the error response
            throw new Error('Failed to fetch User ID');
        }

        const data = await response.json();
        return data.data.id; // Return the numeric User ID
    } catch (error) {
        console.error('Error in getUserId:', error);
        throw new Error('Failed to fetch User ID');
    }
}

// Fetch tweets by User ID
router.get('/tweets', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const userId = await getUserId(username);
        console.log('Fetched User ID:', userId);  // Log the user ID for debugging

        const tweetsEndpoint = `https://api.twitter.com/2/users/${userId}/tweets?max_results=5`; // Adjust as needed
        const response = await fetch(tweetsEndpoint, {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        });

        if (!response.ok) {
            console.error(`Twitter API Error: ${response.status} - ${response.statusText}`);
            const errorDetails = await response.text();  // Capture the response text for debugging
            console.error('Error Details from Twitter API:', errorDetails);
            return res.status(response.status).json({ error: 'Failed to fetch tweets from Twitter API' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in server-side fetch:', error);  // Log the full error
        res.status(500).json({ error: 'Failed to fetch tweets. Please try again later.' });
    }
});

module.exports = router;
