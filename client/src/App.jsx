import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BillingPage from './pages/BillingPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/billing" an element={<BillingPage />} />
      <Route path="/history" element={<HistoryPage />} />
      {/* This will redirect any unknown URL to the home page for now */}
      <Route path="*" element={<Navigate to="/" />} /> 
    </Routes>
  );
}

export default App;