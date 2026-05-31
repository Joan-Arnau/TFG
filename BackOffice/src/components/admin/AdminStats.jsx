import { useTranslation } from 'react-i18next';

const AdminStats = ({ 
  pendingShopsCount = 0, 
  allShopsCount = 0, 
  categoriesCount = 0, 
  announcementsCount = 0, 
  eventsCount = 0, 
  poisCount = 0 
}) => {
  const { t } = useTranslation();

  return (
    <section className="dashboard-stats" aria-label={t('admin.stats.label', 'Estadístiques')}>
      <article className="panel stat-card">
        <span> {t('admin.stats.pendingShops', 'Sol·licituds Pendents')}</span>
        <strong>{pendingShopsCount}</strong>
      </article>
      
      <article className="panel stat-card">
        <span> {t('admin.stats.activeShops', 'Comerços Actius')}</span>
        <strong>{allShopsCount}</strong>
      </article>
      
      <article className="panel stat-card">
        <span> {t('admin.stats.categoriesCount', 'Total Categories')}</span>
        <strong>{categoriesCount}</strong>
      </article>
      
      <article className="panel stat-card">
        <span> {t('admin.stats.announcementsCount', 'Bandos Publicats')}</span>
        <strong>{announcementsCount}</strong>
      </article>
      
      <article className="panel stat-card">
        <span> {t('admin.stats.eventsCount', 'Esdeveniments')}</span>
        <strong>{eventsCount}</strong>
      </article>
      
      <article className="panel stat-card">
        <span> {t('admin.stats.poisCount', 'Punts d\'Interès')}</span>
        <strong>{poisCount}</strong>
      </article>
    </section>
  );
};

export default AdminStats;
