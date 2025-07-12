/**
 * Category utility functions
 * @author Ali Raza
 */

import { CATEGORY_KEYWORDS, CATEGORY_MAPPING } from '../constants';

export const mapCategoryForAPI = (category: string, apiType: 'newsapi' | 'guardian' | 'nytimes'): string => {
  const categoryKey = category.toLowerCase() as keyof typeof CATEGORY_MAPPING;
  const mapped = CATEGORY_MAPPING[categoryKey];
  
  if (mapped) {
    return mapped[apiType];
  }
  
  return category;
};

export const detectCategoryFromContent = (title: string, description: string, content: string): string => {
  const text = `${title} ${description} ${content}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
};

export const isValidCategory = (category: string): boolean => {
  return Object.keys(CATEGORY_KEYWORDS).includes(category.toLowerCase());
};

export const getCategoryDisplayName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
}; 