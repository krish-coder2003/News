import React, { useState, useEffect, useCallback } from 'react';
import ArticleCard from './components/ArticleCard';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import './App.css'; 

// 🚨 WARNING: This version uses direct API access and will ONLY work on localhost 
// due to NewsAPI Developer Plan restrictions.
const API_KEY = '047b6fad3ed94b7098a1e0639f8253ee'; // Your actual API Key
const BASE_URL = 'https://newsapi.org/v2/';
const DEFAULT_CATEGORY = 'general';
const DEFAULT_COUNTRY = 'us';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const fetchNews = useCallback(async (query, cat) => {
    setLoading(true);
    setError(null);
    
    let endpoint = 'top-headlines';
    // Reverting to direct URL construction with hardcoded API key
    let params = `country=${DEFAULT_COUNTRY}&category=${cat}&apiKey=${API_KEY}`;
    
    if (query) {
      endpoint = 'everything';
      params = `q=${query}&sortBy=relevancy&apiKey=${API_KEY}`;
    }

    const url = `${BASE_URL}${endpoint}?${params}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Attempt to parse API-specific error message
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      
      const filteredArticles = data.articles.filter(article => article.title !== "[Removed]");
      setArticles(filteredArticles);
      
    } catch (err) {
      console.error("Fetch error:", err.message);
      // This will now show the "Requests from the browser are not allowed..." error 
      // if deployed, but will work on localhost.
      setError(`Failed to fetch news: ${err.message}. Check API key and network.`);
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
