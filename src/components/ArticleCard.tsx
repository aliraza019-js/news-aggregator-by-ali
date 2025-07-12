/**
 * Article Card Component
 * @author Ali Raza
 */

import React from 'react';
import { ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Article } from '../types';
import { formatDate, truncateText } from '../utils/textUtils';

interface ArticleCardProps {
  article: Article;
  onSaveToPreferences?: () => void;
  isSaved?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onSaveToPreferences, 
  isSaved = false 
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const renderImage = () => {
    if (!article.urlToImage) return null;

    return (
      <div className="lg:w-1/3">
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 lg:h-32 object-cover rounded-lg"
          onError={handleImageError}
        />
      </div>
    );
  };

  const renderSaveButton = () => {
    if (!onSaveToPreferences) return null;

    return (
      <button
        onClick={onSaveToPreferences}
        className={`flex-shrink-0 p-2 rounded-full transition-colors ${
          isSaved 
            ? 'bg-primary-100 text-primary-600' 
            : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
        }`}
        title={isSaved ? 'Remove from preferences' : 'Add to preferences'}
      >
        <svg
          className="w-4 h-4"
          fill={isSaved ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    );
  };

  const renderMetaInfo = () => (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
      <div className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(article.publishedAt)}</span>
      </div>

      <div className="flex items-center gap-1">
        <Tag className="w-4 h-4" />
        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
          {article.source.name}
        </span>
      </div>

      {article.author && (
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{truncateText(article.author, 30)}</span>
        </div>
      )}

      {article.category && (
        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
          {article.category}
        </span>
      )}
    </div>
  );

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {renderImage()}

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {article.title}
            </h3>
            {renderSaveButton()}
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(article.description, 200)}
          </p>

          {renderMetaInfo()}

          <div className="flex items-center gap-2 mt-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Read Full Article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 