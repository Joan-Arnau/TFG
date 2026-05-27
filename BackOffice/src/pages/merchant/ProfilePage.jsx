import { useTranslation } from 'react-i18next';
import { useMerchantProfile } from './hooks/useMerchantProfile';
import { useAsyncSubmit } from '../../hooks/useAsyncSubmit';

const ProfilePage = () => {
  const { shop, loading, error, success, save } = useMerchantProfile();

  const { t } = useTranslation();
  if (!shop) return <div>{t('common.loading', 'Loading...')}</div>;

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    save(data);
  };

  return (
    <section className="merchant-page">
      <div className="merchant-page-header">
        <div>
          <p className="merchant-eyebrow">{t('merchant.profileTitle', 'Profile')}</p>
          <h3>{t('merchant.profileSubtitle', 'My Shop Profile')}</h3>
        </div>
        <div className="merchant-status">{success ? t('merchant.saved', 'Saved') : t('merchant.editing', 'Editing')}</div>
      </div>

      <form className="merchant-form" onSubmit={onSubmit}>
        <label>
          <span>{t('merchant.shopName', 'Shop name')}</span>
          <input name="name" defaultValue={shop.name || ''} />
        </label>
        <label>
          <span>{t('merchant.descriptionLabel', 'Description')}</span>
          <textarea name="description" defaultValue={shop.description || ''} rows={5} />
        </label>
        <label>
          <span>{t('merchant.address', 'Address')}</span>
          <input name="address" defaultValue={shop.address || ''} />
        </label>
        <div className="merchant-form-actions">
          <button type="submit" disabled={loading}>{loading ? t('merchant.saving', 'Saving...') : t('merchant.saveChanges', 'Save changes')}</button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{t('merchant.updated', 'Updated')}</div>}
      </form>
    </section>
  );
};

export default ProfilePage;
