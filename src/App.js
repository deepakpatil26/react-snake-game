import React, { useState, useEffect } from 'react';
import './App.css';
import SnakeGame from './components/SnakeGame';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference on initial load
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  // Save dark mode preference on change
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <button
        className='dark-mode-toggle'
        onClick={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <SnakeGame darkMode={darkMode} />
    </div>
  );
}

export default App;
