import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PinProvider } from './context/PinContext'; // <-- IMPORT
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PinProvider> {/* <-- WRAP APP */}
          <App />
        </PinProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);