import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/useTheme';
import { APP_NAME, DEFAULT_THEME } from '../../context/themeConfig';
import LanguageSwitcher from '../common/LanguageSwitcher';

const AdminDashboardHeader = ({ onRefresh, loading }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme } = useTheme();

  return (
    <header className="dashboard-header unified-header">
      <div className="header-brand-section">
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
          <div className="header-municipality-tag">
            <span>{APP_NAME}</span>
            <span className="tag-separator">•</span>
            <strong>{theme.name}</strong>
          </div>
          <h2>{t('admin.dashboard.title', "Panell d'administració")}</h2>
          <p>{t('admin.dashboard.description', "Gestiona municipis, categories, comerços i usuaris des d'aquest espai.")}</p>
        </div>
      </div>
      
      <div className="header-actions-section" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <LanguageSwitcher />
        <button 
          type="button" 
          onClick={onRefresh} 
          disabled={loading}
          style={{
            border: '1px solid rgba(255, 255, 255, 0.45)', 
            borderRadius: '6px', 
            background: 'rgba(255, 255, 255, 0.14)', 
            color: '#ffffff', 
            cursor: 'pointer', 
            padding: '0.6rem 1rem',
            fontWeight: '600',
            transition: 'background 0.2s ease',
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.14)'}
        >
          {loading ? t('admin.dashboard.refreshing') : t('admin.dashboard.refresh')}
        </button>
        <button 
          type="button" 
          onClick={logout}
          style={{ 
            backgroundColor: '#ef4444', 
            borderColor: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '0.6rem 1rem',
            borderRadius: '6px',
            border: '1px solid transparent',
          }}
        >
          {t('common.logout', 'Tancar sessió')}
        </button>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
