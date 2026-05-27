import { useTranslation } from 'react-i18next';
import { useMerchantImages } from './hooks/useMerchantImages';

const ImagesPage = () => {
  const { t } = useTranslation();
  const { images, upload, remove } = useMerchantImages();

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await upload(file);
  };

  const handleDelete = async (id) => {
    await remove(id);
  };

  return (
    <section className="merchant-page">
      <div className="merchant-page-header">
        <div>
          <p className="merchant-eyebrow">{t('merchant.imagesTitle', 'Images')}</p>
          <h3>{t('merchant.imagesSubtitle', 'Shop gallery')}</h3>
        </div>
        <label className="merchant-upload-button">
          {t('merchant.uploadImage', 'Upload image')}
          <input type="file" onChange={onFileChange} />
        </label>
      </div>

      <ul className="merchant-grid">
        {images.map((img) => (
          <li className="merchant-image-card" key={img.id}>
            <img src={img.url} alt={img.filename} />
            <div className="merchant-image-meta">
              <span>{img.filename}</span>
              <button onClick={() => handleDelete(img.id)}>{t('merchant.delete', 'Delete')}</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ImagesPage;
