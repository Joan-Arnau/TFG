import { useTranslation } from 'react-i18next';

const AdminDashboardHeader = ({ onRefresh, loading }) => {
  const { t } = useTranslation();

  return (
    <section className="dashboard-header">
      <div>
        <h2>{t('admin.dashboard.title')}</h2>
        <p>{t('admin.dashboard.description')}</p>
      </div>
      <button type="button" onClick={onRefresh} disabled={loading}>
        {loading ? t('admin.dashboard.refreshing') : t('admin.dashboard.refresh')}
      </button>
    </section>
  );
};

export default AdminDashboardHeader;
