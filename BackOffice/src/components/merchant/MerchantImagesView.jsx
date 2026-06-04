import Button from '../ui/Button';
import Card from '../ui/Card';
import MerchantPageHeader from './MerchantPageHeader';
import { resolveBackendStaticUrl } from '../../utils/backendUrls';

const MerchantImagesView = ({ t, images, onUpload, onSave, onDelete, uploading, uploadError, pendingPreviewUrl }) => {
  const getImageSrc = (img) => resolveBackendStaticUrl(img.imageUrl || img.url || '');

  return (
    <section className="merchant-page">
      <MerchantPageHeader
        eyebrow={t('merchant.imagesTitle', 'Images')}
        title={t('merchant.imagesSubtitle', 'Shop gallery')}
        actions={(
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button as="label" className="merchant-upload-button">
              {t('merchant.uploadImage', 'Upload image')}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onUpload} />
            </Button>
            <Button type="button" onClick={onSave} disabled={uploading || !pendingPreviewUrl}>
              {uploading ? t('merchant.uploading', 'Uploading...') : t('merchant.save', 'Save')}
            </Button>
          </div>
        )}
      />

      {pendingPreviewUrl ? (
        <Card className="merchant-image-card" style={{ maxWidth: 260, marginBottom: 16 }}>
          <img
            src={pendingPreviewUrl}
            alt={t('merchant.imagePreviewAlt', 'Image preview')}
            style={{ height: 160, objectFit: 'contain', background: '#f8fafc' }}
          />
          <div className="merchant-image-meta">
            <span>{t('merchant.pendingImage', 'Pending upload')}</span>
          </div>
        </Card>
      ) : null}

      {uploadError ? <div className="error" style={{ marginBottom: 12 }}>{uploadError}</div> : null}

      <ul className="merchant-grid">
        {images.map((img) => (
          <li key={img.id}>
            <Card className="merchant-image-card">
              {getImageSrc(img) ? (
                <img src={getImageSrc(img)} alt={img.filename || `Image ${img.id}`} />
              ) : null}
              <div className="merchant-image-meta">
                <span>{img.filename || `${t('merchant.imageText', 'Image')} ${img.id}`}</span>
                <Button variant="danger" onClick={() => onDelete(img.id)}>{t('merchant.delete', 'Delete')}</Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MerchantImagesView;
