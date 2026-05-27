import Button from '../../../components/ui/Button';
import MerchantPageHeader from './MerchantPageHeader';
import LocalizedFieldSet from './LocalizedFieldSet';

const MerchantPromotionFormView = ({ t, title, draft, onLocalizedChange, onFieldChange, onSubmit, canSubmit, saving, error }) => {
  return (
    <section className="merchant-page">
      <MerchantPageHeader eyebrow={t('merchant.promotionsTitle', 'Promotions')} title={title} />

      <form className="merchant-form" onSubmit={onSubmit}>
        <LocalizedFieldSet
          legend={t('merchant.titleLabel', 'Title')}
          values={draft.title}
          onChange={(lang, value) => onLocalizedChange('title', lang, value)}
          requiredLanguage="ca"
          t={t}
        />

        <LocalizedFieldSet
          legend={t('merchant.descriptionLabel', 'Description')}
          values={draft.description}
          onChange={(lang, value) => onLocalizedChange('description', lang, value)}
          renderAs="textarea"
          rows={3}
          requiredLanguage={null}
          t={t}
        />

        <label>
          <span>{t('merchant.startDate', 'Start date')}</span>
          <input type="datetime-local" value={draft.startsAt} onChange={(event) => onFieldChange('startsAt', event.target.value)} />
        </label>

        <label>
          <span>{t('merchant.endDate', 'End date')}</span>
          <input type="datetime-local" value={draft.endsAt} onChange={(event) => onFieldChange('endsAt', event.target.value)} />
        </label>

        <label>
          <span>{t('merchant.imageUrl', 'Image URL')}</span>
          <input value={draft.imageUrl} onChange={(event) => onFieldChange('imageUrl', event.target.value)} />
        </label>

        <div className="merchant-form-actions">
          <Button type="submit" disabled={!canSubmit || saving}>{saving ? t('merchant.saving', 'Saving...') : t('merchant.save', 'Save')}</Button>
        </div>
        {error ? <div className="error">{error}</div> : null}
      </form>
    </section>
  );
};

export default MerchantPromotionFormView;