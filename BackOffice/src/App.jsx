import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import UnauthorizedPage from './features/auth/pages/UnauthorizedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import { MERCHANT_ROUTES } from './pages/merchant/constants';
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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path={`${MERCHANT_ROUTES.BASE}/*`} 
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
