import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import MerchantPageHeader from './MerchantPageHeader';
import LocalizedFieldSet from './LocalizedFieldSet';
import { MERCHANT_LANGUAGES } from '../constants';

const MerchantProfileView = ({ t, shop, draft, isEditing, saving, onEdit, onCancel, onSubmit, onLocalizedChange, onFieldChange, error, success }) => {
  const localizedShop = draft || shop;

  return (
    <section className="merchant-page">
      <MerchantPageHeader
        eyebrow={t('merchant.profileTitle', 'Profile')}
        title={shop.name?.ca || shop.name?.es || shop.name?.en || t('merchant.profileSubtitle', 'My Shop Profile')}
        badge={isEditing ? t('merchant.editing', 'Editing') : t('merchant.viewing', 'Viewing')}
        actions={isEditing ? (
          <Button variant="secondary" onClick={onCancel}>{t('merchant.cancel', 'Cancel')}</Button>
        ) : (
          <Button onClick={onEdit}>{t('merchant.editProfile', 'Edit profile')}</Button>
        )}
      />

      {!isEditing ? (
        <div className="merchant-readonly-grid">
          <Card className="merchant-summary-card">
            <h4>{t('merchant.shopName', 'Shop name')}</h4>
            {MERCHANT_LANGUAGES.map((lang) => (
              <p key={lang}><strong>{t(`language.${lang}`, lang.toUpperCase())}:</strong> {shop.name?.[lang] || '-'}</p>
            ))}
          </Card>
          <Card className="merchant-summary-card">
            <h4>{t('merchant.descriptionLabel', 'Description')}</h4>
            {MERCHANT_LANGUAGES.map((lang) => (
              <p key={lang}><strong>{t(`language.${lang}`, lang.toUpperCase())}:</strong> {shop.description?.[lang] || '-'}</p>
            ))}
          </Card>
          <Card className="merchant-summary-card">
            <h4>{t('merchant.contactData', 'Contact data')}</h4>
            <p><strong>{t('merchant.address', 'Address')}:</strong> {shop.address || '-'}</p>
            <p><strong>{t('merchant.phoneNumber', 'Phone number')}:</strong> {shop.phoneNumber || '-'}</p>
          </Card>
        </div>
      ) : (
        <form className="merchant-form" onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}>
          <LocalizedFieldSet
            legend={t('merchant.shopName', 'Shop name')}
            values={localizedShop.name}
            onChange={(lang, value) => onLocalizedChange('name', lang, value)}
            requiredLanguage={null}
            t={t}
          />

          <LocalizedFieldSet
            legend={t('merchant.descriptionLabel', 'Description')}
            values={localizedShop.description}
            onChange={(lang, value) => onLocalizedChange('description', lang, value)}
            renderAs="textarea"
            rows={4}
            requiredLanguage={null}
            t={t}
          />

          <label>
            <span>{t('merchant.address', 'Address')}</span>
            <input value={localizedShop.address} onChange={(event) => onFieldChange('address', event.target.value)} />
          </label>

          <label>
            <span>{t('merchant.phoneNumber', 'Phone number')}</span>
            <input value={localizedShop.phoneNumber} onChange={(event) => onFieldChange('phoneNumber', event.target.value)} />
          </label>

          <div className="merchant-form-actions">
            <Button type="submit" disabled={saving}>{saving ? t('merchant.saving', 'Saving...') : t('merchant.saveChanges', 'Save changes')}</Button>
          </div>
        </form>
      )}

      {error ? <div className="error">{error}</div> : null}
      {success ? <div className="success">{t('merchant.updated', 'Updated')}</div> : null}
    </section>
  );
};

export default MerchantProfileView;