import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ConfirmProvider } from './context/ConfirmProvider';
import { APP_NAME, DEFAULT_THEME } from './context/themeConfig';
import { useTheme } from './context/useTheme';
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

function AppShell() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="app">
        {!user && (
          <header className="app-header">
            <div className="app-brand">
              {theme.logoUrl ? (
                <img
                  className="app-brand-logo"
                  src={theme.logoUrl}
                  alt=""
                  aria-hidden="true"
                  onError={(event) => {
                    if (event.currentTarget.src !== DEFAULT_THEME.logoUrl) {
                      event.currentTarget.src = DEFAULT_THEME.logoUrl;
                    }
                  }}
                />
              ) : null}
              <div className="app-brand-text">
                <span>{APP_NAME}</span>
                <h1>{theme.name}</h1>
              </div>
            </div>
            <LanguageSwitcher />
          </header>
        )}
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
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ConfirmProvider>
          <AppShell />
        </ConfirmProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
