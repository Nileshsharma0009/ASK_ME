import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/styles.css';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
