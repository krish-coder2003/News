import React, { useState, useEffect, useCallback } from 'react';
import ArticleCard from './components/ArticleCard';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import './App.css'; 

// 🚨 REMOVED: API_KEY and BASE_URL are no longer needed here. 
// They are now handled securely by the Netlify serverless function.
const PROXY_URL = '/.netlify/functions/fetch-news'; // The new serverless function endpoint
const DEFAULT_CATEGORY = 'general';
// DEFAULT_COUNTRY is now handled on the server side in fetch-news.js

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const fetchNews = useCallback(async (query, cat) => {
    setLoading(true);
    setError(null);
    
    // Use URLSearchParams to easily build the query string for the proxy function
    let params = new URLSearchParams();
    
    if (query) {
      params.append('endpoint', 'everything');
      params.append('q', query);
    } else {
      params.append('endpoint', 'top-headlines');
      params.append('category', cat);
    }

    // Construct the new URL pointing to your Netlify function
    const url = `${PROXY_URL}?${params.toString()}`;

    try {
      // 1. Request the data from the secure serverless proxy
      const response = await fetch(url);
      
      if (!response.ok) {
        // 2. The error message now comes from the Netlify function
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const filteredArticles = data.articles.filter(article => article.title !== "[Removed]");
      setArticles(filteredArticles);
      
    } catch (err) {
      console.error("Fetch error:", err.message);
      // Display the friendly message if it's a known error
      setError(`Failed to fetch news: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchNews(searchTerm, ''); 
    } else {
      fetchNews('', category);
    }
  }, [category, searchTerm, fetchNews]);


  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    if (!newSearchTerm) {
      setCategory(DEFAULT_CATEGORY);
    }
  };
  
  const handleCategoryChange = (newCategory) => {
    setSearchTerm(''); 
    setCategory(newCategory);
  };
  
  // --- Render Logic ---
  
  const currentFilterText = searchTerm 
    ? `Results for: "${searchTerm}"` 
    : `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Headlines`;

  return (
    <>
      <Header />
      <div className="container">
        
        {/* Controls Section */}
        <div style={{marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter 
            activeCategory={category} 
            onCategoryChange={handleCategoryChange} 
          />
        </div>

        {/* Status Indicators */}
        <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>{currentFilterText}</h2>
        
        {loading && (
          <div style={{textAlign: 'center', padding: '3rem', fontSize: '1.25rem', color: '#4f46e5'}}>
            <div className="spinner"></div> 
            Loading news articles...
          </div>
        )}
        
        {error && (
          <div style={{textAlign: 'center', padding: '2rem', color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            🚨 Error: {error}
          </div>
        )}

        {/* Display Articles */}
        {!loading && !error && articles.length === 0 && (
          <div style={{textAlign: 'center', padding: '3rem', fontSize: '1.5rem', color: '#6b7280'}}>
            No articles found. Try a different search term or category.
          </div>
        )}

        <div className="grid">
          {articles.map((article, index) => (
            <ArticleCard key={article.url || index} article={article} /> 
          ))}
        </div>
        
        <footer style={{marginTop: '4rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', paddingTop: '2rem', borderTop: '1px solid #e5e7eb'}}>
            Data provided by NewsAPI.org
        </footer>
      </div>
    </>
  );
}

export default App;