import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { MERCHANT_ROUTES } from '../../constants';

const UnauthorizedPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Determine dashboard redirect path based on user role
  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_MERCHANT') return MERCHANT_ROUTES.BASE;
    return '/login';
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ border: '3px solid #ef4444', borderRadius: '50%', width: '64px', height: '64px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2.5rem', color: '#ef4444' }}>!</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem' }}>
          {t('unauthorized.title', 'Accés Denegat')}
        </h2>
        <p className="auth-description" style={{ marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.5' }}>
          {t('unauthorized.message', 'No tens permís per accedir a aquesta pàgina o secció.')}
        </p>
        
        {user ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Link to={getDashboardPath()} className="auth-form" style={{ textDecoration: 'none' }}>
              <button type="button" style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', fontWeight: 600 }}>
                {t('unauthorized.backToDashboard', 'Tornar al Tauler de Control')}
              </button>
            </Link>
            <div className="auth-links" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              <Link to="/login">{t('unauthorized.goToLogin', 'Anar a l\'Accés principal')}</Link>
            </div>
          </div>
        ) : (
          <Link to="/login" className="auth-form" style={{ textDecoration: 'none' }}>
            <button type="button" style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', fontWeight: 600 }}>
              {t('unauthorized.backToLogin', 'Anar a l\'Accés')}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedPage;
