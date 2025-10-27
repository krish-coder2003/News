import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; 
import styles from './Header.module.css'; // Import styles

function Header() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>
          React News Feed
        </h1>
        <button 
          onClick={toggleDarkMode}
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
}

export default Header;