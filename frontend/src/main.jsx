import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// PUBLIC_INTERFACE
/** Entrypoint for React app */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
