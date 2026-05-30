import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputI18n from '../forms/InputI18n';
import CategorySelect from '../forms/CategorySelect';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';

const ContactFormModal = ({ contact, onClose, onSave, categories, t }) => {
  const [nameDraft, setNameDraft] = useState({ ca: '', es: '', en: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [iconName, setIconName] = useState('call-outline');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (contact) {
        setNameDraft(getLocalizedDraft(contact.serviceName));
        setPhoneNumber(contact.phoneNumber || '');
        setIconName(contact.iconName || 'call-outline');
        setCategoryId(contact.category?.id || '');
      } else {
        setNameDraft({ ca: '', es: '', en: '' });
        setPhoneNumber('');
        setIconName('call-outline');
        setCategoryId(categories.length > 0 ? categories[0].id : '');
      }
      setError(null);
    }, 0);
  }, [contact, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!Object.values(nameDraft).some(val => val.trim() !== '')) {
      setError(t('admin.contacts.errorNameRequired', 'Almenys un nom és obligatori.'));
      return;
    }
    if (!phoneNumber.trim()) {
      setError(t('admin.contacts.errorPhoneRequired', 'El telèfon és obligatori.'));
      return;
    }
    if (!categoryId) {
      setError(t('admin.contacts.errorCategoryRequired', 'La categoria és obligatòria.'));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        serviceName: buildLocalizedMap(nameDraft),
        phoneNumber,
        iconName,
        categoryId: Number(categoryId),
      });
      onClose();
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message;
      setError(backendMessage || t('admin.contacts.saveError', 'Error al desar el contacte.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const icons = [
    { value: 'shield-outline', label: t('admin.contacts.iconTypes.security', 'Seguretat') },
    { value: 'business-outline', label: t('admin.contacts.iconTypes.administration', 'Administració') },
    { value: 'medical-outline', label: t('admin.contacts.iconTypes.health', 'Salut') },
    { value: 'medkit-outline', label: t('admin.contacts.iconTypes.pharmacy', 'Farmàcia') },
    { value: 'call-outline', label: t('admin.contacts.iconTypes.general', 'General') },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="admin-category-modal">
        <h3>{contact ? t('admin.contacts.editTitle', 'Editar Contacte') : t('admin.contacts.addNew', 'Nou Contacte')}</h3>
        {error && <div className="alert alert-danger mb-2">{error}</div>}
        <form onSubmit={handleSubmit} style={{ maxHeight: '85vh', overflowY: 'auto', paddingRight: '10px' }}>
          <InputI18n
            label={t('admin.contacts.name', 'Nom')}
            value={nameDraft}
            onChange={(lang, val) => setNameDraft({...nameDraft, [lang]: val})}
            placeholderKey="admin.contacts.namePlaceholder"
          />
          <div className="form-group">
            <label className="form-label">{t('admin.contacts.phone', 'Telèfon')}</label>
            <input type="text" className="form-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin.contacts.category', 'Categoria')}</label>
            <CategorySelect
              categories={categories}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder={t('admin.contacts.selectCategory', 'Selecciona categoria')}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('admin.contacts.icon', 'Icona')}</label>
            <select className="form-input" value={iconName} onChange={(e) => setIconName(e.target.value)}>
              {icons.map((icon) => <option key={icon.value} value={icon.value}>{icon.label}</option>)}
            </select>
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
export default ContactFormModal;
