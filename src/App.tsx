/**
 * Main Application Component
 * @author Ali Raza
 */

import React from 'react';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { NewsPage } from './pages/NewsPage';
import './App.css';

function App() {
  return (
    <UserPreferencesProvider>
      <div className="App">
        <NewsPage />
      </div>
    </UserPreferencesProvider>
  );
}

export default App;
