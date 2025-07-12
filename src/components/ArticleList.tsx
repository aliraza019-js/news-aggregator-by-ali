import React from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { Loader2, AlertCircle } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
  error?: string;
  onSaveToPreferences?: (article: Article) => void;
  savedArticles?: string[];
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  loading,
  error,
  onSaveToPreferences,
  savedArticles = [],
}) => {
  console.log('ArticleList render - articles count:', articles.length);
  console.log('ArticleList render - loading:', loading);
  console.log('ArticleList render - error:', error);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-lg text-gray-600">Loading articles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Articles</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {articles.length} Article{articles.length !== 1 ? 's' : ''} Found
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onSaveToPreferences={
              onSaveToPreferences ? () => onSaveToPreferences(article) : undefined
            }
            isSaved={savedArticles.includes(article.id)}
          />
        ))}
      </div>

      {articles.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}; 