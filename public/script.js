async function fetchTweets(username) {
    try {
        const response = await fetch(`/api/tweets?username=${encodeURIComponent(username)}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch tweets');
        }

        const data = await response.json();
        displayTweets(data);  // Replace with your function to display the tweets
    } catch (error) {
        console.error('Error fetching tweets:', error);
        alert(`Error: ${error.message}`);  // Display detailed error message to user
    }
}
