/**
 * News Page Component
 * @author Ali Raza
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { ArticleList } from '../components/ArticleList';
import { PreferencesPanel } from '../components/PreferencesPanel';
import { combinedNewsService } from '../services/combinedNewsService';
import { Article, FilterOptions } from '../types';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { applyFilters, applyUserPreferences } from '../utils/filterUtils';
import { storageUtils } from '../utils/storageUtils';
import { DEFAULT_FILTERS } from '../constants';

export const NewsPage: React.FC = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showPreferences, setShowPreferences] = useState(false);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const saved = storageUtils.getSavedArticles();
    setSavedArticles(saved);
  }, []);

  useEffect(() => {
    storageUtils.setSavedArticles(savedArticles);
  }, [savedArticles]);

  const handleSearch = async (filters: FilterOptions) => {
    setCurrentFilters(filters);
    
    if (allArticles.length > 0) {
      let articlesToShow = applyUserPreferences(allArticles, preferences);
      const filtered = applyFilters(articlesToShow, filters);
      setFilteredArticles(filtered);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const results = await combinedNewsService.getTopHeadlines();
      setAllArticles(results);
      
      let articlesToShow = applyUserPreferences(results, preferences);
      const filtered = applyFilters(articlesToShow, filters);
      setFilteredArticles(filtered);
    } catch (err) {
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTopHeadlines = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const results = await combinedNewsService.getTopHeadlines();
      setAllArticles(results);
      
      let articlesToShow = applyUserPreferences(results, preferences);
      const filtered = applyFilters(articlesToShow, currentFilters);
      setFilteredArticles(filtered);
    } catch (err) {
      setError('Failed to load top headlines. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentFilters, preferences]);

  const handleSaveToPreferences = (article: Article) => {
    setSavedArticles(prev => {
      if (prev.includes(article.id)) {
        return prev.filter(id => id !== article.id);
      } else {
        return [...prev, article.id];
      }
    });
  };

  const handlePreferencesChange = useCallback(() => {
    if (allArticles.length > 0) {
      let articlesToShow = applyUserPreferences(allArticles, preferences);
      const filtered = applyFilters(articlesToShow, currentFilters);
      setFilteredArticles(filtered);
    }
  }, [allArticles, currentFilters, preferences]);

  useEffect(() => {
    handleLoadTopHeadlines();
  }, [handleLoadTopHeadlines]);

  useEffect(() => {
    handlePreferencesChange();
  }, [handlePreferencesChange]);

  const getResultsDescription = () => {
    const count = filteredArticles.length;
    const hasFilters = currentFilters.keyword || currentFilters.category || 
                      currentFilters.source || currentFilters.dateFrom || currentFilters.dateTo;
    const hasPreferences = preferences.preferredSources.length > 0 || 
                          preferences.preferredCategories.length > 0 || 
                          preferences.preferredAuthors.length > 0;

    if (hasFilters) {
      return `Showing ${count} article${count !== 1 ? 's' : ''} matching your filters`;
    } else if (hasPreferences) {
      return `Showing ${count} article${count !== 1 ? 's' : ''} based on your preferences`;
    } else {
      return `Showing ${count} article${count !== 1 ? 's' : ''} from all sources`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">News Aggregator by Ali Raza</h1>
            <p className="text-gray-600 mt-2 hidden md:block">Stay informed with the latest news from multiple sources</p>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <button
              onClick={handleLoadTopHeadlines}
              disabled={loading}
              className="btn-secondary flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base px-4 py-3 sm:px-3 sm:py-2"
            >
              <RefreshCw className={`w-5 h-5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              className="btn-primary flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base px-4 py-3 sm:px-3 sm:py-2"
            >
              <Settings className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Personalize</span>
            </button>
          </div>
        </div>

        <SearchAndFilter onSearch={handleSearch} loading={loading} />

        {!loading && !error && (
          <div className="mb-4 text-sm text-gray-600">
            {getResultsDescription()}
          </div>
        )}

        <ArticleList
          articles={filteredArticles}
          loading={loading}
          error={error}
          onSaveToPreferences={handleSaveToPreferences}
          savedArticles={savedArticles}
        />

        <PreferencesPanel
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          onPreferencesChange={handlePreferencesChange}
        />
      </div>
    </div>
  );
}; 