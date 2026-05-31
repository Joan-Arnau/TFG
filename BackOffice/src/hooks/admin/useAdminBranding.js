import { useState, useEffect, useCallback } from 'react';
import { adminConfigService } from '../../api/services/adminConfigService';

export const useAdminBranding = () => {
  const [config, setConfig] = useState({
    municipalityName: '',
    defaultLanguage: 'ca',
    supportedLanguages: ['ca'],
    branding: {
      logoUrl: '',
      primaryColor: '#0f172a',
      secondaryColor: '#2563eb',
    },
    latitude: 41.1561,
    longitude: 1.1033,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminConfigService.getConfig();
      if (data) {
        setConfig({
          municipalityName: data.municipalityName || '',
          defaultLanguage: data.defaultLanguage || 'ca',
          supportedLanguages: data.supportedLanguages || ['ca'],
          branding: {
            logoUrl: data.branding?.logoUrl || '',
            primaryColor: data.branding?.primaryColor || '#0f172a',
            secondaryColor: data.branding?.secondaryColor || '#2563eb',
          },
          latitude: data.latitude ?? 41.1561,
          longitude: data.longitude ?? 1.1033,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConfig();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchConfig]);

  const updateConfigField = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBrandingField = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value,
      },
    }));
  };

  const handleLogoUpload = async (file) => {
    setSaving(true);
    setError(null);
    try {
      const result = await adminConfigService.uploadLogo(file);
      if (result && result.url) {
        updateBrandingField('logoUrl', result.url);
        return result.url;
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error uploading logo');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const saveConfig = async (overrideConfig) => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const payload = overrideConfig || config;
      await adminConfigService.updateConfig(payload);
      setSaveSuccess(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error saving config');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    config,
    loading,
    saving,
    error,
    saveSuccess,
    updateConfigField,
    updateBrandingField,
    handleLogoUpload,
    saveConfig,
    refresh: fetchConfig,
  };
};
