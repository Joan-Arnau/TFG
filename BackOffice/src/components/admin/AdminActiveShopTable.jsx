import Button from '../ui/Button';
import Card from '../ui/Card';
import { getLocalizedValue } from '../../utils/localization';

const AdminActiveShopTable = ({
  shops,
  loading,
  error,
  onSuspend,
  onApprove,
  onDelete,
  t,
  i18n,
}) => {
  const getShopName = (shop) => {
    return getLocalizedValue(shop.name, i18n.language, `#${shop.id}`);
  };

  const getCategoryName = (shop) => {
    if (!shop.category) return '';
    return getLocalizedValue(shop.category.name, i18n.language, '');
  };

  if (loading) {
    return (
      <div className="panel loading-container">
        <p>{t('admin.shops.loading', 'Loading shops...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel error-container">
        <p className="error">{t('admin.shops.error', 'Error loading shops.')}</p>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="panel empty-container">
        <p>{t('admin.shops.noShops', 'No shops found.')}</p>
      </div>
    );
  }

  return (
    <Card className="admin-table-card">
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.shops.name', 'Name')}</th>
              <th>{t('admin.shops.category', 'Category')}</th>
              <th>{t('admin.shops.owner', 'Owner Email')}</th>
              <th>{t('admin.shops.status', 'Status')}</th>
              <th>{t('admin.shops.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td className="shop-name-cell">
                  <strong>{getShopName(shop)}</strong>
                  {shop.address && <span className="shop-table-subtext">{shop.address}</span>}
                </td>
                <td>
                  {getCategoryName(shop) ? (
                    <span className="badge-category">{getCategoryName(shop)}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{shop.ownerEmail || '-'}</td>
                <td>
                  <span className={`status-badge status-badge--${(shop.status || 'PENDING').toLowerCase()}`}>
                    {t(`admin.status.${(shop.status || 'PENDING').toLowerCase()}`, shop.status)}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    {shop.status === 'APPROVED' ? (
                      <Button variant="secondary" onClick={() => onSuspend(shop)}>
                        {t('admin.shops.suspend', 'Suspend')}
                      </Button>
                    ) : (
                      <Button variant="success" onClick={() => onApprove(shop)}>
                        {t('admin.shops.approve', 'Approve')}
                      </Button>
                    )}

                    <Button variant="danger" onClick={() => onDelete(shop)}>
                      {t('admin.shops.delete', 'Delete')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AdminActiveShopTable;
