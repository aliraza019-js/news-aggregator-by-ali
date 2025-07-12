/**
 * Storage utility functions
 * @author Ali Raza
 */

import { STORAGE_KEYS } from '../constants';
import { UserPreferences } from '../types';

export const storageUtils = {
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
    }
  },

  getUserPreferences: (): UserPreferences => {
    return storageUtils.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      preferredSources: [],
      preferredCategories: [],
      preferredAuthors: [],
    });
  },

  setUserPreferences: (preferences: UserPreferences): void => {
    storageUtils.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  getSavedArticles: (): string[] => {
    return storageUtils.getItem(STORAGE_KEYS.SAVED_ARTICLES, []);
  },

  setSavedArticles: (articles: string[]): void => {
    storageUtils.setItem(STORAGE_KEYS.SAVED_ARTICLES, articles);
  },
}; 