// netlify/functions/fetch-news/fetch-news.js

// Import the 'node-fetch' library to make HTTP requests
const fetch = require('node-fetch');

// This handler receives the request from your React app
exports.handler = async (event, context) => {
  // 1. Get the API Key securely from Netlify Environment Variables
  const API_KEY = process.env.VITE_NEWS_API_KEY; 

  // 2. Extract query parameters passed from the frontend (q, category, etc.)
  // event.queryStringParameters contains what the client sends after the '?'
  const { endpoint, q, category } = event.queryStringParameters;
  
  if (!API_KEY) {
      return {
          statusCode: 500,
          body: JSON.stringify({ message: 'API Key not configured.' })
      };
  }

  // 3. Construct the NewsAPI URL using the gathered parameters
  let newsUrl = `https://newsapi.org/v2/${endpoint}?apiKey=${API_KEY}&country=us`;

  if (category && endpoint === 'top-headlines') {
      newsUrl += `&category=${category}`;
  } else if (q && endpoint === 'everything') {
      newsUrl += `&q=${q}`;
  } else {
      // Default fallback
      newsUrl += `&category=general`;
  }
  
  try {
    // 4. Make the request from the Netlify server (this satisfies NewsAPI)
    const response = await fetch(newsUrl);
    const data = await response.json();

    // 5. Check for API errors and return the data or error back to the client
    if (!response.ok) {
        return {
            statusCode: response.status,
            body: JSON.stringify({ message: data.message || "NewsAPI error" })
        };
    }
    
    // Success: Return the NewsAPI data
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
    
  } catch (error) {
    console.error("Netlify Function Fetch Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to connect to NewsAPI via proxy." })
    };
  }
};