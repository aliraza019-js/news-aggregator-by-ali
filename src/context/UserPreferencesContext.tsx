/**
 * User Preferences Context
 * @author Ali Raza
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '../types';
import { storageUtils } from '../utils/storageUtils';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  addPreferredSource: (source: string) => void;
  removePreferredSource: (source: string) => void;
  addPreferredCategory: (category: string) => void;
  removePreferredCategory: (category: string) => void;
  addPreferredAuthor: (author: string) => void;
  removePreferredAuthor: (author: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => 
    storageUtils.getUserPreferences()
  );

  useEffect(() => {
    storageUtils.setUserPreferences(preferences);
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const addPreferredSource = (source: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredSources: Array.from(new Set([...prev.preferredSources, source])),
    }));
  };

  const removePreferredSource = (source: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredSources: prev.preferredSources.filter(s => s !== source),
    }));
  };

  const addPreferredCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: Array.from(new Set([...prev.preferredCategories, category])),
    }));
  };

  const removePreferredCategory = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.filter(c => c !== category),
    }));
  };

  const addPreferredAuthor = (author: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredAuthors: Array.from(new Set([...prev.preferredAuthors, author])),
    }));
  };

  const removePreferredAuthor = (author: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredAuthors: prev.preferredAuthors.filter(a => a !== author),
    }));
  };

  const value: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    addPreferredSource,
    removePreferredSource,
    addPreferredCategory,
    removePreferredCategory,
    addPreferredAuthor,
    removePreferredAuthor,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}; 