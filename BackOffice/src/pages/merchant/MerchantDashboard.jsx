import { useTranslation } from 'react-i18next';

const MerchantDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard">
      <h2>{t('app.sectionMerchant')}</h2>
      <p>{t('app.sectionMerchantDescription')}</p>
    </div>
  );
};

export default MerchantDashboard;
