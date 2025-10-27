import React from 'react';
import styles from './CategoryFilter.module.css'; // Import styles

const categories = ['General', 'Technology', 'Sports', 'Business', 'Health', 'Science', 'Entertainment'];

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className={styles.filterContainer}>
      {categories.map((cat) => {
        const catSlug = cat.toLowerCase();
        const isActive = activeCategory === catSlug;
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(catSlug)}
            className={`${styles.categoryButton} ${isActive ? styles.active : styles.inactive}`}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;