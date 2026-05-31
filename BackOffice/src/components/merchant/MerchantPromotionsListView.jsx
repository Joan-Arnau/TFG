import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import MerchantPageHeader from './MerchantPageHeader';
import { resolveBackendStaticUrl } from '../../utils/backendUrls';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getStatus = (promo) => {
  if (!promo?.startsAt || !promo?.endsAt) return '';
  const now = new Date();
  const startsAt = new Date(promo.startsAt);
  const endsAt = new Date(promo.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) return '';
  if (now < startsAt) return 'upcoming';
  if (now > endsAt) return 'expired';
  return 'active';
};

const MerchantPromotionsListView = ({ t, promotions, onCreate, onEditPath, onDelete, getTitle, getDescription }) => {

  const translateStatus = (statusKey) => statusKey ? t(`merchant.promoStatus.${statusKey}`) : '';

  return (
    <section className="merchant-page">
      <MerchantPageHeader
        eyebrow={t('merchant.promotionsTitle', 'Promotions')}
        title={t('merchant.promotionsSubtitle', 'Active promotions')}
        actions={<Button onClick={onCreate}>{t('merchant.newPromotion', 'New promotion')}</Button>}
      />

      <ul className="merchant-list">
        {promotions.map((promo) => (
          <li key={promo.id}>
            <Card className="merchant-list-item">
              <div className="merchant-list-item-main">
                {resolveBackendStaticUrl(promo.imageUrl) ? (
                  <div className="merchant-list-thumb">
                    <img
                      src={resolveBackendStaticUrl(promo.imageUrl)}
                      alt={getTitle(promo)}
                    />
                  </div>
                ) : null}
                <div className="merchant-list-content">
                  <div className="merchant-list-heading">
                    <strong>{getTitle(promo)}</strong>
                    {getStatus(promo) ? (
                      <span className={`merchant-status merchant-status--${getStatus(promo)}`}>
                        {translateStatus(getStatus(promo))}
                      </span>
                    ) : null}
                  </div>
                  {getDescription(promo) ? <p>{getDescription(promo)}</p> : null}
                  <div className="merchant-list-details">
                    {promo.startsAt ? <span>{t('merchant.startsAt', 'Starts')}: {formatDate(promo.startsAt)}</span> : null}
                    {promo.endsAt ? <span>{t('merchant.endsAt', 'Ends')}: {formatDate(promo.endsAt)}</span> : null}
                  </div>
                </div>
              </div>
              <div className="merchant-list-actions">
                <Button as={Link} to={onEditPath(promo.id)} variant="ghost">{t('merchant.edit', 'Edit')}</Button>
                <Button variant="danger" onClick={() => onDelete(promo.id)}>{t('merchant.delete', 'Delete')}</Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MerchantPromotionsListView;
