import { useTranslation } from 'react-i18next';

const UnauthorizedPage = () => {
  const { t } = useTranslation();

  return (
    <div className="unauthorized-container">
      <h2>{t('unauthorized.title', 'Unauthorized Access')}</h2>
      <p>{t('unauthorized.message', 'You do not have permission to access this page.')}</p>
    </div>
  );
};

export default UnauthorizedPage;
