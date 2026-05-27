import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import MerchantPageHeader from './MerchantPageHeader';

const MerchantPromotionsListView = ({ t, promotions, onCreate, onEditPath, onDelete, getTitle, getDescription }) => {
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
              <div>
                <strong>{getTitle(promo)}</strong>
                <p>{getDescription(promo)}</p>
              </div>
              <div className="merchant-list-actions">
                <Button as={Link} to={onEditPath(promo.id)} variant="ghost">{t('merchant.edit', 'Edit')}</Button>
                <Button variant="secondary" onClick={() => onDelete(promo.id)}>{t('merchant.delete', 'Delete')}</Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MerchantPromotionsListView;