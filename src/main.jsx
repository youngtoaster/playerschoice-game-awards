import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AwardsProvider } from './store/awardsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AwardsProvider>
      <App />
    </AwardsProvider>
  </React.StrictMode>
);
