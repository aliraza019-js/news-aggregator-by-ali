import React, { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { FilterOptions } from '../types';

interface SearchAndFilterProps {
  onSearch: (filters: FilterOptions) => void;
  loading?: boolean;
}

const categories = [
  'general',
  'technology',
  'business',
  'science',
  'health',
  'sports',
  'entertainment',
  'politics',
  'world',
];

const sources = [
  'The Guardian',
  'The New York Times',
  'BBC News',
  'CNN',
  'Reuters',
  'Associated Press',
  'USA Today',
  'The Washington Post',
  'NPR',
  'Al Jazeera',
];

const sortOptions = [
  { value: 'relevancy', label: 'Relevance' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'publishedAt', label: 'Date' },
];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onSearch, loading = false }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    keyword: '',
    category: '',
    source: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'publishedAt',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      keyword: '',
      category: '',
      source: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'publishedAt',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    console.log('Filter changed:', field, value, newFilters);
    
    // Auto-trigger search for category and source changes
    if (field === 'category' || field === 'source') {
      onSearch(newFilters);
    }
  };

  // Auto-search when keyword changes (with debounce)
  const handleKeywordChange = (value: string) => {
    setFilters(prev => ({ ...prev, keyword: value }));
  };

  // Debounced search for keyword
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.keyword !== '') {
        onSearch(filters);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [filters.keyword, onSearch]);

  // Check if any filters are active
  const hasActiveFilters = filters.keyword || filters.category || filters.source || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for articles..."
            value={filters.keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="input-field pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'bg-primary-100 text-primary-700 border-primary-300' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filters {hasActiveFilters && <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">Active</span>}
        </button>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Search
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <select
                value={filters.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="input-field"
              >
                <option value="">All Sources</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleInputChange('dateTo', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('sortBy', option.value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filters.sortBy === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 