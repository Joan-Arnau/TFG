import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <header className="app-header">
          <h1>PromoRural BackOffice</h1>
          <LanguageSwitcher />
        </header>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/merchant/*" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_MERCHANT']}>
                <MerchantDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
