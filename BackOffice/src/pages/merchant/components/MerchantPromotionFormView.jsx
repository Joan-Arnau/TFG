import { useRef, useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import MerchantPageHeader from './MerchantPageHeader';
import LocalizedFieldSet from './LocalizedFieldSet';
import { resolveBackendStaticUrl } from '../../../utils/backendUrls';

const resolvePreviewSrc = (url) => resolveBackendStaticUrl(url);

const MerchantPromotionFormView = ({ 
  t, 
  title, 
  draft, 
  onLocalizedChange, 
  onFieldChange, 
  onSubmit, 
  canSubmit, 
  saving, 
  error, 
  onFileUpload, 
  uploading, 
  uploadError, 
  validationMessage,
  isEdit 
}) => {
  const fileInputRef = useRef(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(resolvePreviewSrc(draft.imageUrl || ''));
  const [lastObjectUrl, setLastObjectUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
    };
  }, [lastObjectUrl]);

  const handleChoose = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    try {
      if (lastObjectUrl) {
        URL.revokeObjectURL(lastObjectUrl);
      }
      const obj = URL.createObjectURL(f);
      setLastObjectUrl(obj);
      setLocalPreviewUrl(obj);
    } catch {
      // ignore preview errors
    }

    if (onFileUpload) {
      const url = await onFileUpload(f);
      if (url) {
        onFieldChange('imageUrl', url);
        setLocalPreviewUrl(url);
      }
    }

    e.target.value = '';
  };

  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const maxDateTime = "9999-12-31T23:59";

  return (
    <section className="merchant-page">
      <MerchantPageHeader eyebrow={t('merchant.promotionsTitle', 'Promotions')} title={title} />

      <form className="merchant-form" onSubmit={onSubmit}>
        <div className="merchant-warning">
          {t('merchant.promotionWarning')}
        </div>
        <LocalizedFieldSet
          legend={t('merchant.titleLabel', 'Title')}
          values={draft.title}
          onChange={(lang, value) => onLocalizedChange('title', lang, value)}
          requiredLanguage={null}
          t={t}
          className="merchant-fieldset merchant-fieldset--critical"
        />

        <LocalizedFieldSet
          legend={t('merchant.descriptionLabel', 'Description')}
          values={draft.description}
          onChange={(lang, value) => onLocalizedChange('description', lang, value)}
          renderAs="textarea"
          rows={3}
          requiredLanguage={null}
          t={t}
          className="merchant-fieldset merchant-fieldset--critical"
        />

        <label className="merchant-field merchant-field--critical">
          <span>{t('merchant.startDate', 'Start date')}</span>
          <input 
            required 
            type="datetime-local" 
            value={draft.startsAt} 
            onChange={(event) => onFieldChange('startsAt', event.target.value)} 
            disabled={isEdit}
            min={minDateTime}
            max={maxDateTime}
            style={isEdit ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
          />
        </label>

        <label className="merchant-field merchant-field--critical">
          <span>{t('merchant.endDate', 'End date')}</span>
          <input 
            required 
            type="datetime-local" 
            value={draft.endsAt} 
            onChange={(event) => onFieldChange('endsAt', event.target.value)} 
            min={draft.startsAt || minDateTime}
            max={maxDateTime}
          />
        </label>

        <div className="merchant-field merchant-field--critical">
          <span>{t('merchant.imagePreviewLabel', 'Image')}</span>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              ref={fileInputRef}
              id="promotion-image-file-hidden"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
            <Button type="button" onClick={handleChoose} disabled={uploading}>{uploading ? t('merchant.uploading', 'Uploading...') : t('merchant.upload', 'Upload')}</Button>
          </div>
          {uploadError ? <div className="error" style={{ marginTop: 6 }}>{uploadError}</div> : null}

          {(localPreviewUrl || draft?.imageUrl) ? (
            <div style={{ marginTop: 10 }}>
              <img
                src={localPreviewUrl || resolvePreviewSrc(draft.imageUrl)}
                alt={t('merchant.imagePreviewAlt', 'Image preview')}
                style={{ maxWidth: 320, maxHeight: 180, objectFit: 'cover', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
          ) : null}
        </div>

        <div className="merchant-form-actions">
          <Button type="submit" disabled={!canSubmit || saving || uploading}>{saving ? t('merchant.saving', 'Saving...') : t('merchant.save', 'Save')}</Button>
        </div>
        <p className="merchant-form-hint">{t('merchant.requiredFieldsHint', 'Camps obligatoris destacats amb vora lateral.')}</p>
        {!canSubmit && validationMessage ? <div className="error" style={{ marginTop: '1rem' }}>{validationMessage}</div> : null}
        {error ? <div className="error" style={{ marginTop: '1rem' }}>{error}</div> : null}
      </form>
    </section>
  );
};

export default MerchantPromotionFormView;
