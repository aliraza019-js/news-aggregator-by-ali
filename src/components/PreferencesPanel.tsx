import React, { useState } from 'react';
import { Settings, X, Plus, Trash2 } from 'lucide-react';
import { useUserPreferences } from '../context/UserPreferencesContext';

interface PreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesChange?: () => void; // Callback to trigger frontend filtering
}

const availableSources = [
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

const availableCategories = [
  'technology',
  'business',
  'science',
  'health',
  'sports',
  'entertainment',
  'politics',
  'world',
  'environment',
  'education',
];

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ isOpen, onClose, onPreferencesChange }) => {
  const { preferences, addPreferredSource, removePreferredSource, addPreferredCategory, removePreferredCategory, addPreferredAuthor, removePreferredAuthor } = useUserPreferences();
  
  const [newAuthor, setNewAuthor] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const triggerFeedback = () => {
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleAddAuthor = () => {
    if (newAuthor.trim() && !preferences.preferredAuthors.includes(newAuthor.trim())) {
      addPreferredAuthor(newAuthor.trim());
      setNewAuthor('');
      // Trigger frontend filtering
      console.log('Author preference added, calling onPreferencesChange');
      onPreferencesChange?.();
      triggerFeedback();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddAuthor();
    }
  };

  const handleSourceToggle = (source: string) => {
    if (preferences.preferredSources.includes(source)) {
      removePreferredSource(source);
    } else {
      addPreferredSource(source);
    }
    // Trigger frontend filtering
    console.log('Source preference changed, calling onPreferencesChange');
    onPreferencesChange?.();
    triggerFeedback();
  };

  const handleCategoryToggle = (category: string) => {
    if (preferences.preferredCategories.includes(category)) {
      removePreferredCategory(category);
    } else {
      addPreferredCategory(category);
    }
    // Trigger frontend filtering
    console.log('Category preference changed, calling onPreferencesChange');
    onPreferencesChange?.();
    triggerFeedback();
  };

  const handleRemoveAuthor = (author: string) => {
    removePreferredAuthor(author);
    // Trigger frontend filtering
    console.log('Author preference changed, calling onPreferencesChange');
    onPreferencesChange?.();
    triggerFeedback();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Personalize Your Feed</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Feedback indicator */}
        {showFeedback && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Preferences updated! Your feed is being filtered in real-time.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Preferred Sources */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred News Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableSources.map((source) => {
                const isSelected = preferences.preferredSources.includes(source);
                return (
                  <button
                    key={source}
                    onClick={() => handleSourceToggle(source)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{source}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Categories */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCategories.map((category) => {
                const isSelected = preferences.preferredCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">{category}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Authors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Authors</h3>
            
            {/* Add new author */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter author name..."
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field flex-1"
              />
              <button
                onClick={handleAddAuthor}
                disabled={!newAuthor.trim()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* List of preferred authors */}
            <div className="space-y-2">
              {preferences.preferredAuthors.map((author) => (
                <div
                  key={author}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium">{author}</span>
                  <button
                    onClick={() => handleRemoveAuthor(author)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
              {preferences.preferredAuthors.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No preferred authors added yet. Add authors to personalize your feed.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};