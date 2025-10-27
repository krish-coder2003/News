// api/news-proxy.js
// This code runs on the Vercel server (Node.js environment)

const fetch = require('node-fetch');

// This is the standard handler for Vercel Serverless Functions
export default async function handler(req, res) {
  
  // Get API Key securely from Vercel Environment Variables
  // The environment variable name MUST be VITE_NEWS_API_KEY
  const API_KEY = process.env.VITE_NEWS_API_KEY; 
  
  // Extract parameters from the client request (req.query)
  const { endpoint, q, category } = req.query;
  const DEFAULT_COUNTRY = 'us';

  if (!API_KEY) {
    // This catches the error if you forget to set the variable on Vercel
    return res.status(500).json({ message: 'Internal Error: API Key not configured in Vercel Environment.' });
  }

  // Construct the external NewsAPI URL
  let newsUrl = `https://newsapi.org/v2/${endpoint}?apiKey=${API_KEY}`;

  if (endpoint === 'top-headlines') {
      newsUrl += `&country=${DEFAULT_COUNTRY}&category=${category}`;
  } else if (endpoint === 'everything' && q) {
      newsUrl += `&q=${q}`;
  }
  
  try {
    // Make the request from the Vercel server (bypasses the browser block)
    const response = await fetch(newsUrl);
    const data = await response.json();

    if (!response.ok) {
        // Return the specific NewsAPI error status and message
        return res.status(response.status).json({ 
            message: data.message || "NewsAPI error encountered." 
        });
    }
    
    // Success: Return data 
    return res.status(200).json(data);
    
  } catch (error) {
    console.error("Vercel API Route Fetch Error:", error);
    return res.status(500).json({ message: "Internal Vercel execution failed." });
  }
}