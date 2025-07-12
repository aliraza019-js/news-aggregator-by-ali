/**
 * Filter utility functions
 * @author Ali Raza
 */

import { Article, FilterOptions, UserPreferences } from '../types';
import { CATEGORY_VARIATIONS } from '../constants';

export const applyFilters = (articles: Article[], filters: FilterOptions): Article[] => {
  let filtered = [...articles];

  if (filters.keyword) {
    filtered = filterByKeyword(filtered, filters.keyword);
  }

  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category);
  }

  if (filters.source) {
    filtered = filterBySource(filtered, filters.source);
  }

  if (filters.dateFrom) {
    filtered = filterByDateFrom(filtered, filters.dateFrom);
  }

  if (filters.dateTo) {
    filtered = filterByDateTo(filtered, filters.dateTo);
  }

  return sortArticles(filtered, filters.sortBy);
};

const filterByKeyword = (articles: Article[], keyword: string): Article[] => {
  const searchTerm = keyword.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm) ||
    (article.author && article.author.toLowerCase().includes(searchTerm))
  );
};

const filterByCategory = (articles: Article[], category: string): Article[] => {
  const searchCategory = category.toLowerCase();
  
  return articles.filter(article => {
    if (!article.category) return false;
    
    const articleCategory = article.category.toLowerCase();
    
    if (articleCategory === searchCategory) return true;
    if (articleCategory.includes(searchCategory) || searchCategory.includes(articleCategory)) return true;
    
    const variations = CATEGORY_VARIATIONS[searchCategory as keyof typeof CATEGORY_VARIATIONS];
    if (variations) {
      return variations.some(variation => articleCategory.includes(variation));
    }
    
    return false;
  });
};

const filterBySource = (articles: Article[], source: string): Article[] => {
  return articles.filter(article => article.source.name === source);
};

const filterByDateFrom = (articles: Article[], dateFrom: string): Article[] => {
  const fromDate = new Date(dateFrom);
  return articles.filter(article => new Date(article.publishedAt) >= fromDate);
};

const filterByDateTo = (articles: Article[], dateTo: string): Article[] => {
  const toDate = new Date(dateTo);
  return articles.filter(article => new Date(article.publishedAt) <= toDate);
};

const sortArticles = (articles: Article[], sortBy: string): Article[] => {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    
    switch (sortBy) {
      case 'publishedAt':
        return dateB - dateA;
      case 'popularity':
      case 'relevancy':
      default:
        return dateB - dateA;
    }
  });
};

export const applyUserPreferences = (articles: Article[], preferences: UserPreferences): Article[] => {
  const hasPreferences = preferences.preferredSources.length > 0 || 
                        preferences.preferredCategories.length > 0 || 
                        preferences.preferredAuthors.length > 0;

  if (!hasPreferences) {
    return articles;
  }

  return articles.filter(article => {
    // Only check a preference if it is set (non-empty)
    if (preferences.preferredSources.length > 0 && !preferences.preferredSources.includes(article.source.name)) {
      return false;
    }
    if (preferences.preferredCategories.length > 0 && (!article.category || !preferences.preferredCategories.includes(article.category.toLowerCase()))) {
      return false;
    }
    if (preferences.preferredAuthors.length > 0 && (!article.author || !preferences.preferredAuthors.some(author => article.author?.toLowerCase().includes(author.toLowerCase())))) {
      return false;
    }
    return true;
  });
}; 