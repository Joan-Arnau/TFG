import { useState, useEffect, useMemo, useCallback } from 'react';
import { publicService } from '../api/services/publicService';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await publicService.getContacts();
      setContacts(data);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Group contacts by category
  const groupedContacts = useMemo(() => {
    const groups = {};
    contacts.forEach(contact => {
      const category = contact.categoryName || 'Altres';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(contact);
    });

    return Object.keys(groups).sort().map(category => ({
      title: category,
      data: groups[category]
    }));
  }, [contacts]);

  return useMemo(() => ({
    contacts: groupedContacts,
    loading,
    error,
    refetch: fetchData
  }), [groupedContacts, loading, error, fetchData]);
};
