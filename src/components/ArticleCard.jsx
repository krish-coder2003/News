import React from 'react';
import styles from './ArticleCard.module.css'; // Import styles

function ArticleCard({ article }) {
  const { title, urlToImage, description, url, source, publishedAt } = article;
  
  const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'N/A';
  const sourceName = source?.name || 'Unknown Source';
  const imageUrl = urlToImage || 'https://via.placeholder.com/600x400?text=Image+Not+Available';

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={title}
          className={styles.image}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Image+Error'; }}
        />
        <span className={styles.sourceTag}>
            {sourceName}
        </span>
      </div>
      
      <div className={styles.content}>
        <h2 className={styles.title}>
          {title}
        </h2>
        
        <p className={styles.description}>
          {description || 'Description not available. Click to read full article.'}
        </p>
        
        <div className={styles.footer}>
          <span>{date}</span>
          <span className={styles.readMore}>Read More &rarr;</span>
        </div>
      </div>
    </a>
  );
}

export default ArticleCard;