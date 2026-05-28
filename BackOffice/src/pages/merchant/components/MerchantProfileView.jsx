import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import MerchantPageHeader from './MerchantPageHeader';
import LocalizedFieldSet from './LocalizedFieldSet';
import { MERCHANT_LANGUAGES } from '../constants';
import { getLocalizedValue } from '../../../utils/localization';

const MerchantProfileView = ({
  t,
  shop,
  draft,
  categories = [],
  categoriesLoading = false,
  language = 'ca',
  isEditing,
  saving,
  onEdit,
  onCancel,
  onSubmit,
  onLocalizedChange,
  onFieldChange,
  error,
  success
}) => {
  const localizedShop = draft || shop;
  const statusKey = shop?.status?.toLowerCase?.() || '';
  const statusLabel = statusKey ? t(`merchant.status.${statusKey}`, shop.status) : '';
  const statusClassName = statusKey ? `merchant-status merchant-status--${statusKey}` : 'merchant-status';
  const categoryName = shop?.category?.name
    ? getLocalizedValue(shop.category.name, language, '')
    : '';

  return (
    <section className="merchant-page">
      <MerchantPageHeader
        eyebrow={t('merchant.profileTitle', 'Profile')}
        title={shop.name?.ca || shop.name?.es || shop.name?.en || t('merchant.profileSubtitle', 'My Shop Profile')}
        status={statusLabel}
        statusClassName={statusClassName}
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
            <h4>{t('merchant.categoryLabel', 'Category')}</h4>
            <p>{categoryName || '-'}</p>
          </Card>
          <Card className="merchant-summary-card">
            <h4>{t('merchant.locationLabel', 'Location')}</h4>
            <p><strong>{t('merchant.latitudeLabel', 'Latitude')}:</strong> {shop.latitude ?? '-'}</p>
            <p><strong>{t('merchant.longitudeLabel', 'Longitude')}:</strong> {shop.longitude ?? '-'}</p>
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
          <div className="merchant-warning">
            {t('merchant.revalidationWarning', 'Changing the shop name, category or location will send the shop to municipal review and temporarily hide it from the public catalogue.')}
          </div>
          <LocalizedFieldSet
            legend={t('merchant.shopName', 'Shop name')}
            values={localizedShop.name}
            onChange={(lang, value) => onLocalizedChange('name', lang, value)}
            requiredLanguage={null}
            t={t}
            className="merchant-fieldset merchant-fieldset--critical"
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
            <input
              maxLength={255}
              value={localizedShop.address}
              onChange={(event) => onFieldChange('address', event.target.value)}
            />
          </label>

          <label>
            <span>{t('merchant.phoneNumber', 'Phone number')}</span>
            <input
              maxLength={30}
              value={localizedShop.phoneNumber}
              onChange={(event) => onFieldChange('phoneNumber', event.target.value)}
            />
          </label>

          <label className="merchant-field merchant-field--critical">
            <span>{t('merchant.categoryLabel', 'Category')}</span>
            <select
              value={localizedShop.categoryId}
              onChange={(event) => onFieldChange('categoryId', event.target.value)}
              disabled={categoriesLoading}
            >
              <option value="">{t('merchant.categoryPlaceholder', 'Select a category')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getLocalizedValue(category.name, language, category.id)}
                </option>
              ))}
            </select>
          </label>

          <div className="merchant-coordinates">
            <label className="merchant-field merchant-field--critical">
              <span>{t('merchant.latitudeLabel', 'Latitude')}</span>
              <input
                type="number"
                step="0.000001"
                min={-90}
                max={90}
                value={localizedShop.latitude}
                onChange={(event) => onFieldChange('latitude', event.target.value)}
              />
            </label>
            <label className="merchant-field merchant-field--critical">
              <span>{t('merchant.longitudeLabel', 'Longitude')}</span>
              <input
                type="number"
                step="0.000001"
                min={-180}
                max={180}
                value={localizedShop.longitude}
                onChange={(event) => onFieldChange('longitude', event.target.value)}
              />
            </label>
          </div>

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