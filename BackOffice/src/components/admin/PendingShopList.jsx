import { useTranslation } from 'react-i18next';

const PendingShopList = ({ shops, loading, error }) => {
  const { t, i18n } = useTranslation();

  const getShopName = (shop) => {
    const nameData = shop.name ?? shop.tradeName ?? shop.title;
    if (typeof nameData === 'object' && nameData !== null) {
      return nameData[i18n.language] || nameData['ca'] || nameData['es'] || nameData['en'] || `#${shop.id}`;
    }
    return nameData ?? `#${shop.id}`;
  };

  if (loading) {
    return (
      <section className="panel">
        <h3>{t('admin.shops.pendingTitle')}</h3>
        <p>{t('admin.shops.loading')}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <h3>{t('admin.shops.pendingTitle')}</h3>
        <p className="error">{t('admin.shops.error')}</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h3>{t('admin.shops.pendingTitle')}</h3>
      {shops.length === 0 ? (
        <p>{t('admin.shops.noPendingShops')}</p>
      ) : (
        <ul className="shop-list">
          {shops.map((shop) => (
            <li key={shop.id ?? getShopName(shop)} className="shop-list-item">
              <strong>{getShopName(shop)}</strong>
              {shop.status && <span>{shop.status}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PendingShopList;
