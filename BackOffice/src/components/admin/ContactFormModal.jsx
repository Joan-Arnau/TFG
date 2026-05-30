import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';

const ContactFormModal = ({ contact, onClose, onSave, categories, t }) => {
  const { i18n } = useTranslation();
  const [nameDraft, setNameDraft] = useState({ ca: '', es: '', en: '' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [iconName, setIconName] = useState('call-outline');
  const [categoryId, setCategoryId] = useState('');
  const [activeLangTab, setActiveLangTab] = useState('ca');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [contact, categories]);

  const handleNameChange = (lang, val) => {
    setNameDraft((prev) => ({ ...prev, [lang]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nameDraft.ca.trim() && !nameDraft.es.trim() && !nameDraft.en.trim()) {
      setError(t('admin.contacts.errorNameRequired', 'At least one name is required.'));
      return;
    }
    if (!phoneNumber.trim()) {
      setError(t('admin.contacts.errorPhoneRequired', 'Phone number is required.'));
      return;
    }
    if (!categoryId) {
      setError(t('admin.contacts.errorCategoryRequired', 'Category is required.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        serviceName: buildLocalizedMap(nameDraft),
        phoneNumber,
        iconName,
        categoryId: Number(categoryId),
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Error saving contact:', err);
      const backendMessage = err.response?.data?.message || err.message;
      setError(backendMessage || t('admin.contacts.saveError', 'Failed to save contact.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = [
    { code: 'ca', name: 'Català' },
    { code: 'es', name: 'Castellano' },
    { code: 'en', name: 'English' },
  ];

  const icons = [
    { value: 'shield-outline', label: t('admin.contacts.iconTypes.security', 'Seguretat') },
    { value: 'business-outline', label: t('admin.contacts.iconTypes.administration', 'Administració') },
    { value: 'medical-outline', label: t('admin.contacts.iconTypes.health', 'Salut') },
    { value: 'medkit-outline', label: t('admin.contacts.iconTypes.pharmacy', 'Farmàcia') },
    { value: 'call-outline', label: t('admin.contacts.iconTypes.general', 'General') },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="admin-contact-modal">
        <h3>{contact ? t('admin.contacts.editTitle', 'Editar Contacte') : t('admin.contacts.addNew', 'Nou Contacte')}</h3>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('admin.contacts.name', 'Nom')}</label>
            <div className="lang-tabs mb-2">
              {languages.map((lang) => (
                <button key={lang.code} type="button" className={`lang-tab-btn ${activeLangTab === lang.code ? 'active' : ''}`} onClick={() => setActiveLangTab(lang.code)}>
                  {lang.name}
                  {nameDraft[lang.code]?.trim() && <span className="lang-filled-indicator">•</span>}
                </button>
              ))}
            </div>
            {languages.map((lang) => (
              <div key={lang.code} style={{ display: activeLangTab === lang.code ? 'block' : 'none' }}>
                <input type="text" className="form-input" value={nameDraft[lang.code]} onChange={(e) => handleNameChange(lang.code, e.target.value)} placeholder={t('admin.categories.namePlaceholder', { lang: lang.name })} />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.contacts.phone', 'Telèfon')}</label>
            <input type="text" className="form-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.contacts.category', 'Categoria')}</label>
            <select className="form-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">{t('admin.contacts.selectCategory', 'Selecciona una categoria')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name[i18n.language] || cat.name['ca']}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.contacts.icon', 'Icona')}</label>
            <select className="form-input" value={iconName} onChange={(e) => setIconName(e.target.value)}>
              {icons.map((icon) => (
                <option key={icon.value} value={icon.value}>{icon.label}</option>
              ))}
            </select>
          </div>

          <div className="admin-modal-actions mt-4">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('common.cancel', 'Cancel·lar')}</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? t('common.saving', 'Desant...') : t('common.save', 'Desar')}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ContactFormModal;
