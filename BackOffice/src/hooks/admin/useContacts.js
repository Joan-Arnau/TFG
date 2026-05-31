import { useCallback, useEffect, useState } from 'react';
import { contactService } from '../../api/services/contactService';
import { useTranslation } from 'react-i18next';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      // Sort alphabetically by service name (based on current language)
      const sortedContacts = data.sort((a, b) => {
        const nameA = a.serviceName[i18n.language] || a.serviceName['ca'] || '';
        const nameB = b.serviceName[i18n.language] || b.serviceName['ca'] || '';
        return nameA.localeCompare(nameB);
      });
      setContacts(sortedContacts);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    setTimeout(() => loadContacts(), 0);
  }, [loadContacts]);

  return {
    contacts,
    loading,
    error,
    refresh: loadContacts,
    create: contactService.create,
    update: contactService.update,
    delete: contactService.delete
  };
};
