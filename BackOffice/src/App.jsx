import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ConfirmProvider } from './context/ConfirmProvider';
import { APP_NAME, DEFAULT_THEME } from './context/themeConfig';
import { useTheme } from './context/useTheme';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Keep critical path (LoginPage) synchronous for immediate load
import LoginPage from './pages/auth/LoginPage';

// Lazy load non-critical and domain-specific routes
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const UnauthorizedPage = lazy(() => import('./pages/auth/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('./pages/auth/NotFoundPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const MerchantDashboard = lazy(() => import('./pages/merchant/MerchantDashboard'));

import { MERCHANT_ROUTES } from './constants';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import './styles/App.css';
import './styles/auth.css';
import './styles/merchant.css';
import './styles/adminDashboard.css';
import './styles/adminTables.css';
import './styles/adminModals.css';

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
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--brand-primary, #0f172a)', fontWeight: 600 }}>
            Carregant...
          </div>
        }>
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
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
