import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import MapPicker from '../ui/MapPicker';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';

const POIFormModal = ({ poi, onClose, onSave, categories, onUploadImage, t }) => {
  const { i18n } = useTranslation();
  const [nameDraft, setNameDraft] = useState({ ca: '', es: '', en: '' });
  const [descDraft, setDescDraft] = useState({ ca: '', es: '', en: '' });
  const [categoryId, setCategoryId] = useState('');
  const [activeLangTab, setActiveLangTab] = useState('ca');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(poi?.imageUrl || null);
  const [latitude, setLatitude] = useState(poi ? poi.locationLat : '');
  const [longitude, setLongitude] = useState(poi ? poi.locationLng : '');

  useEffect(() => {
    setTimeout(() => {
      if (poi) {
        setNameDraft(getLocalizedDraft(poi.name));
        setDescDraft(getLocalizedDraft(poi.description));
        setCategoryId(poi.category?.id || '');
        setLatitude(poi.locationLat || '');
        setLongitude(poi.locationLng || '');
        setImagePreview(poi.imageUrl || null);
      } else {
        setNameDraft({ ca: '', es: '', en: '' });
        setDescDraft({ ca: '', es: '', en: '' });
        setCategoryId(categories.length > 0 ? categories[0].id : '');
        setLatitude('');
        setLongitude('');
        setImagePreview(null);
      }
      setError(null);
    }, 0);
  }, [poi, categories]);

  const handleMapLocationSelect = (latlng) => {
    setLatitude(latlng.lat);
    setLongitude(latlng.lng);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nameDraft.ca.trim() && !nameDraft.es.trim() && !nameDraft.en.trim()) {
      setError(t('admin.tourism.errorNameRequired', 'At least one name is required.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: buildLocalizedMap(nameDraft),
        description: buildLocalizedMap(descDraft),
        categoryId: Number(categoryId),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      const savedPoi = await onSave(payload);

      if (imageFile && savedPoi) {
        await onUploadImage(savedPoi.id, imageFile);
      }

      onClose();
    } catch (err) {
      console.error('Error saving POI:', err);
      setError(t('admin.tourism.saveError', 'Failed to save POI.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = [
    { code: 'ca', name: 'Català' },
    { code: 'es', name: 'Castellano' },
    { code: 'en', name: 'English' },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="admin-poi-modal" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem' }}>{poi ? t('admin.tourism.editTitle', "Editar Punt d'Interès") : t('admin.tourism.addNew', "Nou Punt d'Interès")}</h3>
        {error && <div className="alert alert-danger mb-4">{error}</div>}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', paddingRight: '10px' }}>
          <div className="form-group">
            <label className="form-label">{t('admin.tourism.name', 'Nom')}</label>
            <div className="lang-tabs mb-2">
              {languages.map((lang) => (
                <button key={lang.code} type="button" className={`lang-tab-btn ${activeLangTab === lang.code ? 'active' : ''}`} onClick={() => setActiveLangTab(lang.code)}>{lang.name}</button>
              ))}
            </div>
            {languages.map((lang) => (
              <div key={lang.code} style={{ display: activeLangTab === lang.code ? 'block' : 'none' }}>
                <input type="text" className="form-input mb-2" value={nameDraft[lang.code]} onChange={(e) => setNameDraft({...nameDraft, [lang.code]: e.target.value})} placeholder={t('admin.tourism.namePlaceholder', { lang: lang.name })} />
                <textarea className="form-input" value={descDraft[lang.code]} onChange={(e) => setDescDraft({...descDraft, [lang.code]: e.target.value})} placeholder={t('admin.tourism.descPlaceholder', { lang: lang.name })} />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.tourism.category', 'Categoria')}</label>
            <select className="form-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name[i18n.language] || cat.name['ca']}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.tourism.location', 'Localització (Lat, Lng)')}</label>
            <MapPicker lat={latitude ? parseFloat(latitude) : null} lng={longitude ? parseFloat(longitude) : null} onLocationSelect={handleMapLocationSelect} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input type="number" readOnly className="form-input" value={latitude} placeholder="Latitud" />
              <input type="number" readOnly className="form-input" value={longitude} placeholder="Longitud" />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">{t('common.image', 'Imatge')}</label>
            <label className="ui-button ui-button--secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
              {t('common.chooseFile', 'Seleccionar fitxer')}
              <input type="file" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
            {imageFile && <div className="mt-2 text-sm">{imageFile.name}</div>}
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
            )}
          </div>

          <div className="admin-modal-actions" style={{ marginTop: '2rem' }}>
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting} style={{marginRight: '8px'}}>{t('common.cancel', 'Cancel·lar')}</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? t('common.saving', 'Desant...') : t('common.save', 'Desar')}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default POIFormModal;
