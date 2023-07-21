const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const requestTimeout = 2000; // milliseconds (increased from 500ms)

// Helper function to fetch data from a URL with a timeout
async function fetchData(url) {
  try {
    const response = await axios.get(url, { timeout: requestTimeout });
    return response.data.numbers || [];
  } catch (error) {
    console.error(`Error fetching data from URL: ${url}`);
    console.error(error.stack); // Log the full error stack trace
    return [];
  }
}

// Main API endpoint
app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'At least one URL is required.' });
  }

  const urls = Array.isArray(url) ? url : [url];

  // Fetch data from all provided URLs concurrently
  const promises = urls.map(fetchData);
  const allResponses = await Promise.all(promises);

  // Merge and sort unique integers
  const mergedNumbers = Array.from(new Set(allResponses.flat())).sort((a, b) => a - b);

  return res.json({ numbers: mergedNumbers });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
