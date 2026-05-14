import { useTranslation } from 'react-i18next';

const AdminStats = ({ pendingShops }) => {
  const { t } = useTranslation();

  return (
    <section className="dashboard-stats" aria-label={t('admin.stats.label')}>
      <article className="panel stat-card">
        <span>{t('admin.stats.pendingShops')}</span>
        <strong>{pendingShops.length}</strong>
      </article>
    </section>
  );
};

export default AdminStats;
