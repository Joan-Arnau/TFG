import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { httpClient } from '../api/httpClient';
import { formatImageUrl } from '../utils/imageUtils';
import { setDefaultLanguage } from '../api/services/publicService';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const initialLanguageRef = useRef(i18n.language);
  const defaultLanguageAppliedRef = useRef(false);
  const [theme, setTheme] = useState({
    municipalityName: 'Ajuntament de Fontserena',
    primaryColor: '#007AFF',
    secondaryColor: '#5856D6',
    logoUrl: null,
    loading: true
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await httpClient.get('/public/config');
        if (response.data) {
          const { branding, defaultLanguage, supportedLanguages, municipalityName } = response.data;
          setDefaultLanguage(defaultLanguage);
          
          // Apply the API default only if the user has not changed language while config was loading.
          if (!defaultLanguageAppliedRef.current && defaultLanguage) {
            if (i18n.language === initialLanguageRef.current && i18n.language !== defaultLanguage) {
              i18n.changeLanguage(defaultLanguage);
            }
            defaultLanguageAppliedRef.current = true;
          }

          setTheme({
            municipalityName: municipalityName?.trim() || 'Ajuntament de Fontserena',
            primaryColor: branding?.primaryColor || '#007AFF',
            secondaryColor: branding?.secondaryColor || '#5856D6',
            logoUrl: branding?.logoUrl ? formatImageUrl(branding.logoUrl) : null,
            supportedLanguages: supportedLanguages || ['ca', 'es', 'en'],
            defaultLanguage: defaultLanguage || 'ca',
            loading: false
          });
        }
      } catch {
        console.error('Failed to fetch theme config');
        setTheme(prev => ({ ...prev, loading: false }));
      }
    };

    fetchConfig();
  }, [i18n]);
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
