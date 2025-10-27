import React, { useState, useEffect, useCallback } from 'react';
import ArticleCard from './components/ArticleCard';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import './App.css'; 

// 🚨 PROXY PATH: Calls the Vercel API Route: /api/news-proxy
const PROXY_URL = '/api/news-proxy'; 
const DEFAULT_CATEGORY = 'general';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const fetchNews = useCallback(async (query, cat) => {
    setLoading(true);
    setError(null);
    
    // Parameters prepared for the Vercel API Route (endpoint, q, category)
    let params = new URLSearchParams();
    
    if (query) {
      params.append('endpoint', 'everything');
      params.append('q', query);
    } else {
      params.append('endpoint', 'top-headlines');
      params.append('category', cat);
    }

    const url = `${PROXY_URL}?${params.toString()}`;

    try {
      // Fetch from the local proxy endpoint
      const response = await fetch(url);
      
      if (!response.ok) {
        // Handle error response from the Vercel function
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const filteredArticles = data.articles.filter(article => article.title !== "[Removed]");
      setArticles(filteredArticles);
      
    } catch (err) {
      console.error("Fetch error:", err.message);
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