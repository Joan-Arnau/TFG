
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MERCHANT_ROUTES, buildPromotionEditPath } from '../../constants';
import { useMerchantPromotions } from '../../hooks/merchant/useMerchantPromotions';
import { getLocalizedValue } from '../../utils/localization';
import MerchantPromotionsListView from '../../components/merchant/MerchantPromotionsListView';

const PromotionsListPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { promotions, remove } = useMerchantPromotions();

  return (
    <MerchantPromotionsListView
      t={t}
      promotions={promotions}
      onCreate={() => navigate(MERCHANT_ROUTES.PROMOTION_NEW)}
      onEditPath={buildPromotionEditPath}
      onDelete={remove}
      getTitle={(promo) => getLocalizedValue(promo.title, i18n.language, t('merchant.newPromotion', 'New promotion'))}
      getDescription={(promo) => getLocalizedValue(promo.description, i18n.language, '')}
    />
  );
};

export default PromotionsListPage;
