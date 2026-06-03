import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputI18n from '../forms/InputI18n';
import CategorySelect from '../forms/CategorySelect';
import MapPicker from '../ui/MapPicker';
import ImageUpload from '../forms/ImageUpload';
import DateTimePicker from '../forms/DateTimePicker';
import { useTranslation } from 'react-i18next';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';
import { useCategories } from '../../hooks/common/useCategories';

const EventFormModal = ({ event, onClose, onSave, onUploadImage }) => {
  const { t } = useTranslation();
  const { categories } = useCategories('EVENT');

  const [title, setTitle] = useState(event?.title || { ca: '', es: '', en: '' });
  const [description, setDescription] = useState(event?.description || { ca: '', es: '', en: '' });
  const [categoryId, setCategoryId] = useState(event?.category?.id || '');
  const [startDate, setStartDate] = useState(event?.startsAt ? new Date(event.startsAt) : null);
  const [endDate, setEndDate] = useState(event?.endsAt ? new Date(event.endsAt) : null);
  const [isFestival, setIsFestival] = useState(event?.isFestival || false);
  const [locationText, setLocationText] = useState(event?.locationText || { ca: '', es: '', en: '' });
  const [latitude, setLatitude] = useState(event?.latitude || null);
  const [longitude, setLongitude] = useState(event?.longitude || null);
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mapCenter] = useState([41.1561, 1.1033]);
  const mapZoom = 13;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (event) {
        setTitle(getLocalizedDraft(event.title));
        setDescription(getLocalizedDraft(event.description));
        setCategoryId(event.category?.id || '');
        setStartDate(event.startsAt ? new Date(event.startsAt) : null);
        setEndDate(event.endsAt ? new Date(event.endsAt) : null);
        setIsFestival(event.isFestival || false);
        setLocationText(getLocalizedDraft(event.locationText));
        setLatitude(event.latitude || null);
        setLongitude(event.longitude || null);
        setImageUrl(event.imageUrl || '');
      } else {
        setTitle({ ca: '', es: '', en: '' });
        setDescription({ ca: '', es: '', en: '' });
        setCategoryId('');
        setStartDate(null);
        setEndDate(null);
        setIsFestival(false);
        setLocationText({ ca: '', es: '', en: '' });
        setLatitude(null);
        setLongitude(null);
        setImageUrl('');
      }
      setValidationErrors({});
      setIsSubmitting(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [event]);

  const formatDateForBackend = (date) => {
    if (!date) return null;
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    const offsetMinutes = date.getTimezoneOffset();
    const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    const absOffsetMinutes = Math.abs(offsetMinutes);
    const offsetHours = pad(Math.floor(absOffsetMinutes / 60));
    const offsetMins = pad(absOffsetMinutes % 60);
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}${offsetMins}`;
  };

  const formatDateToLocalString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const validateForm = () => {
    const errors = {};

    if (!title.ca.trim() && !title.es.trim() && !title.en.trim()) {
      errors.title = t('validation.event.title.required', 'El títol és obligatori en tots els idiomes.');
    }
    if (!description.ca.trim() && !description.es.trim() && !description.en.trim()) {
      errors.description = t('validation.event.description.required', 'La descripció és obligatòria en tots els idiomes.');
    }
    if (!categoryId) {
      errors.categoryId = t('validation.event.category.required', 'La categoria és obligatòria.');
    }
    if (!startDate) {
      errors.startDate = t('validation.event.startDate.required', 'La data d\'inici és obligatòria.');
    } else if (!event && startDate.getTime() < new Date().getTime()) {
      errors.startDate = t('validation.event.startDate.past', 'La data d\'inici no pot ser anterior a l\'actual.');
    }
    if (startDate && endDate && endDate.getTime() <= startDate.getTime()) {
      errors.endDate = t('validation.date.range', 'La data de fi ha de ser posterior a la data d\'inici.');
    }
    if ((latitude !== null && longitude === null) || (latitude === null && longitude !== null)) {
      errors.location = t('validation.location.pair', 'La latitud i la longitud s\'han d\'informar juntes.');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;
      if (selectedFile) finalImageUrl = await onUploadImage(selectedFile);

      await onSave({
        title: buildLocalizedMap(title),
        description: buildLocalizedMap(description),
        categoryId: parseInt(categoryId, 10),
        startsAt: formatDateForBackend(startDate),
        endsAt: formatDateForBackend(endDate),
        isFestival,
        locationText: buildLocalizedMap(locationText),
        latitude,
        longitude,
        imageUrl: finalImageUrl,
      });
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setValidationErrors({ general: err.response?.data?.message || err.message || t('common.saveError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="admin-category-modal">
        <h3>{event ? t('admin.events.editTitle', 'Edit Event') : t('admin.events.addNew', 'New Event')}</h3>
        {validationErrors.general && <p className="alert alert-danger mb-2">{validationErrors.general}</p>}
        <form onSubmit={handleSubmit} style={{ maxHeight: '85vh', overflowY: 'auto', paddingRight: '10px' }}>
          <InputI18n label={t('admin.events.titleField', 'Títol')} value={title} onChange={(lang, val) => setTitle({...title, [lang]: val})} errors={validationErrors.title} placeholderKey="admin.events.titlePlaceholder" />
          <InputI18n label={t('common.description', 'Descripció')} value={description} onChange={(lang, val) => setDescription({...description, [lang]: val})} errors={validationErrors.description} placeholderKey="admin.events.descPlaceholder" isTextArea />
          <InputI18n label={t('admin.events.locationName', 'Lloc')} value={locationText} onChange={(lang, val) => setLocationText({...locationText, [lang]: val})} placeholderKey="admin.events.locationNamePlaceholder" />
          
          <div className="form-group">
            <label className="form-label">{t('common.category', 'Categoria')}</label>
            <CategorySelect categories={categories} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} placeholder={t('admin.events.selectCategory', 'Selecciona categoria')} />
            {validationErrors.categoryId && <p className="error-message">{validationErrors.categoryId}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.events.startDate', 'Data d\'inici')}</label>
            <DateTimePicker selected={startDate} onChange={setStartDate} showTimeSelect min={!event ? formatDateToLocalString(new Date()) : undefined} />
            {validationErrors.startDate && <p className="error-message">{validationErrors.startDate}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.events.endDate', 'Data de fi')}</label>
            <DateTimePicker selected={endDate} onChange={setEndDate} showTimeSelect min={startDate ? formatDateToLocalString(startDate) : (!event ? formatDateToLocalString(new Date()) : undefined)} />
            {validationErrors.endDate && <p className="error-message">{validationErrors.endDate}</p>}
          </div>

          <div className="form-group" style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem', marginTop: '1rem', width: 'fit-content' }}>
            <label htmlFor="isFestival" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>{t('admin.events.isFestival', 'És Festa Major')}</label>
            <input type="checkbox" id="isFestival" checked={isFestival} onChange={(e) => setIsFestival(e.target.checked)} style={{ width: 'auto', margin: 0 }} />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.events.locationCoordinates', 'Coordenades')}</label>
            <MapPicker lat={latitude} lng={longitude} onLocationSelect={(ll) => { setLatitude(ll.lat); setLongitude(ll.lng); }} mapCenter={mapCenter} mapZoom={mapZoom} height="200px" />
            {validationErrors.location && <p className="error-message">{validationErrors.location}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">{t('common.image', 'Imatge')}</label>
            <ImageUpload currentImageUrl={imageUrl} onFileSelect={setSelectedFile} />
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
export default EventFormModal;
