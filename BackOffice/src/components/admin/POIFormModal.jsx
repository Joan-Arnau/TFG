import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputI18n from '../forms/InputI18n';
import CategorySelect from '../forms/CategorySelect';
import MapPicker from '../ui/MapPicker';
import ImageUpload from '../forms/ImageUpload';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';

const POIFormModal = ({ poi, onClose, onSave, categories, onUploadImage, t }) => {
  const [nameDraft, setNameDraft] = useState({ ca: '', es: '', en: '' });
  const [descDraft, setDescDraft] = useState({ ca: '', es: '', en: '' });
  const [categoryId, setCategoryId] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageUrl, setImageUrl] = useState(poi?.imageUrl || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (poi) {
        setNameDraft(getLocalizedDraft(poi.name));
        setDescDraft(getLocalizedDraft(poi.description));
        setCategoryId(poi.category?.id || '');
        setLatitude(poi.locationLat || null);
        setLongitude(poi.locationLng || null);
        setImageUrl(poi.imageUrl || '');
      } else {
        setNameDraft({ ca: '', es: '', en: '' });
        setDescDraft({ ca: '', es: '', en: '' });
        setCategoryId(categories.length > 0 ? categories[0].id : '');
        setLatitude(null);
        setLongitude(null);
        setImageUrl('');
      }
      setError(null);
    }, 0);
  }, [poi, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!Object.values(nameDraft).some(val => val.trim() !== '')) {
      setError(t('admin.tourism.errorNameRequired', 'Almenys un nom és obligatori.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: buildLocalizedMap(nameDraft),
        description: buildLocalizedMap(descDraft),
        categoryId: Number(categoryId),
        latitude,
        longitude,
      };
      const savedPoi = await onSave(payload);

      if (selectedFile && savedPoi) {
        await onUploadImage(savedPoi.id, selectedFile);
      }

      onClose();
    } catch (err) {
      console.error('Error saving POI:', err);
      setError(t('admin.tourism.saveError', 'Error al desar el punt d\'interès.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="admin-category-modal">
        <h3>{poi ? t('admin.tourism.editTitle', "Editar Punt d'Interès") : t('admin.tourism.addNew', "Nou Punt d'Interès")}</h3>
        {error && <div className="alert alert-danger mb-2">{error}</div>}
        <form onSubmit={handleSubmit} style={{ maxHeight: '85vh', overflowY: 'auto', paddingRight: '10px' }}>
          <InputI18n
            label={t('admin.tourism.name', 'Nom')}
            value={nameDraft}
            onChange={(lang, val) => setNameDraft({...nameDraft, [lang]: val})}
            placeholderKey="admin.tourism.namePlaceholder"
          />
          <InputI18n
            label={t('common.description', 'Descripció')}
            value={descDraft}
            onChange={(lang, val) => setDescDraft({...descDraft, [lang]: val})}
            placeholderKey="admin.tourism.descPlaceholder"
            isTextArea
          />
          <div className="form-group">
            <label className="form-label">{t('common.category', 'Categoria')}</label>
            <CategorySelect
              categories={categories}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder={t('admin.tourism.selectCategory', 'Selecciona categoria')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin.tourism.location', 'Localització (Lat, Lng)')}</label>
            <MapPicker
              lat={latitude}
              lng={longitude}
              onLocationSelect={(latlng) => { setLatitude(latlng.lat); setLongitude(latlng.lng); }}
              height="200px"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('common.image', 'Imatge')}</label>
            <ImageUpload
              currentImageUrl={imageUrl}
              onFileSelect={setSelectedFile}
            />
          </div>
          <div className="admin-modal-actions mt-4" style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('common.cancel', 'Cancel·lar')}</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? t('common.saving', 'Desant...') : t('common.save', 'Desar')}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default POIFormModal;
