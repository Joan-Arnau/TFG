import { Navigate, Route, Routes, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/useTheme';
import { APP_NAME, DEFAULT_THEME } from '../../context/themeConfig';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import ProfilePage from './ProfilePage';
import PromotionsListPage from './PromotionsListPage';
import PromotionFormPage from './PromotionFormPage';
import ImagesPage from './ImagesPage';
import useMerchantDashboard from '../../hooks/merchant/useMerchantDashboard';
import { MERCHANT_ROUTES } from '../../constants';

const MerchantDashboard = () => {
  const { hero, navItems } = useMerchantDashboard();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="merchant-dashboard">
      <header className="merchant-hero panel unified-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="header-brand-section" style={{ display: 'flex', alignItems: 'center' }}>
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
              style={{ width: '48px', height: '48px', objectFit: 'contain', marginRight: '16px' }}
            />
          ) : null}
          <div className="header-text-block">
            <div className="header-municipality-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '4px' }}>
              <span>{APP_NAME}</span>
              <span>•</span>
              <strong>{theme.name}</strong>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>{hero.title}</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.85)' }}>{hero.description}</p>
          </div>
        </div>
        
        <div className="header-actions-section" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <LanguageSwitcher />
          <button 
            type="button" 
            onClick={logout}
            style={{ 
              border: '1px solid rgba(255, 255, 255, 0.45)', 
              borderRadius: '6px', 
              background: 'rgba(255, 255, 255, 0.14)', 
              color: '#ffffff', 
              cursor: 'pointer', 
              padding: '0.6rem 1rem',
              fontWeight: '600',
              transition: 'background 0.2s ease',
              height: 'fit-content'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.14)'}
          >
            {t('common.logout', 'Tancar sessió')}
          </button>
        </div>
      </header>

      <div className="merchant-shell">
        <aside className="merchant-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              className={({ isActive }) => `merchant-nav-link ${isActive ? 'active' : ''}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </aside>

        <main className="merchant-content panel">
          <Routes>
            <Route index element={<Navigate to={MERCHANT_ROUTES.PROFILE} replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="promotions" element={<PromotionsListPage />} />
            <Route path="promotions/new" element={<PromotionFormPage />} />
            <Route path="promotions/:id/edit" element={<PromotionFormPage />} />
            <Route path="images" element={<ImagesPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MerchantDashboard;
