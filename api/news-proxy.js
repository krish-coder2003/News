// api/news-proxy.js

const fetch = require('node-fetch');

// Vercel exports a standard Node.js handler for API Routes
export default async function handler(req, res) {
  
  // 1. Get API Key securely from Vercel Environment Variables
  const API_KEY = process.env.VITE_NEWS_API_KEY; 
  
  // 2. Extract parameters from the request query (req.query)
  const { endpoint, q, category } = req.query;
  const DEFAULT_COUNTRY = 'us';

  if (!API_KEY) {
    return res.status(500).json({ message: 'Internal Error: API Key not configured in Vercel Environment.' });
  }

  // 3. Construct the NewsAPI URL
  let newsUrl = `https://newsapi.org/v2/${endpoint}?apiKey=${API_KEY}`;

  if (endpoint === 'top-headlines') {
      newsUrl += `&country=${DEFAULT_COUNTRY}&category=${category}`;
  } else if (endpoint === 'everything' && q) {
      newsUrl += `&q=${q}`;
  }
  
  try {
    // 4. Make the request from the Vercel serverless function
    const response = await fetch(newsUrl);
    const data = await response.json();

    if (!response.ok) {
        // Return NewsAPI error status and message
        return res.status(response.status).json({ 
            message: data.message || "NewsAPI error encountered." 
        });
    }
    
    // Success: Return data (Vercel automatically handles CORS)
    return res.status(200).json(data);
    
  } catch (error) {
    console.error("Vercel API Route Fetch Error:", error);
    return res.status(500).json({ message: "Internal Vercel execution failed." });
  }
}
