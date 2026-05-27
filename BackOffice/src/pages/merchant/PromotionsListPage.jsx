
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MERCHANT_ROUTES, buildPromotionEditPath } from './constants';
import { useMerchantPromotions } from './hooks/useMerchantPromotions';

const PromotionsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { promotions, loading, remove } = useMerchantPromotions();

  return (
    <section className="merchant-page">
      <div className="merchant-page-header">
        <div>
          <p className="merchant-eyebrow">{t('merchant.promotionsTitle', 'Promotions')}</p>
          <h3>{t('merchant.promotionsSubtitle', 'Active promotions')}</h3>
        </div>
        <button onClick={() => navigate(MERCHANT_ROUTES.PROMOTION_NEW)}>{t('merchant.newPromotion', 'New promotion')}</button>
      </div>

      <ul className="merchant-list">
        {promotions.map((promo) => (
          <li className="merchant-list-item" key={promo.id}>
            <div>
              <strong>{promo.title}</strong>
              <p>{promo.description}</p>
            </div>
            <div className="merchant-list-actions">
              <Link to={buildPromotionEditPath(promo.id)}>{t('merchant.edit', 'Edit')}</Link>
              <button onClick={() => remove(promo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PromotionsListPage;
