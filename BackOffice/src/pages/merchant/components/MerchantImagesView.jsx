import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import MerchantPageHeader from './MerchantPageHeader';

const MerchantImagesView = ({ t, images, onUpload, onDelete }) => {
  return (
    <section className="merchant-page">
      <MerchantPageHeader
        eyebrow={t('merchant.imagesTitle', 'Images')}
        title={t('merchant.imagesSubtitle', 'Shop gallery')}
        actions={(
          <Button as="label" className="merchant-upload-button">
            {t('merchant.uploadImage', 'Upload image')}
            <input type="file" onChange={onUpload} />
          </Button>
        )}
      />

      <ul className="merchant-grid">
        {images.map((img) => (
          <li key={img.id}>
            <Card className="merchant-image-card">
              <img src={img.url} alt={img.filename} />
              <div className="merchant-image-meta">
                <span>{img.filename}</span>
                <Button variant="secondary" onClick={() => onDelete(img.id)}>{t('merchant.delete', 'Delete')}</Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MerchantImagesView;