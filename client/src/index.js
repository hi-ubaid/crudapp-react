import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SuccessMessageProvider } from './Context/SuccessContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SuccessMessageProvider>
        <App />
    </SuccessMessageProvider>
  </React.StrictMode>
);

