import { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { httpClient } from '../api/httpClient';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState({
    primaryColor: '#007AFF',
    secondaryColor: '#5856D6',
    logoUrl: null,
    loading: true
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await httpClient.get('/public/config');
        if (response.data) {
          const { branding, defaultLanguage } = response.data;
          
          // Sync i18n with API default language ONLY on first load
          if (!isInitialized && defaultLanguage && i18n.language !== defaultLanguage) {
            i18n.changeLanguage(defaultLanguage);
            setIsInitialized(true);
          }

          setTheme({
            primaryColor: branding?.primaryColor || '#007AFF',
            secondaryColor: branding?.secondaryColor || '#5856D6',
            logoUrl: branding?.logoUrl,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch theme config');
        setTheme(prev => ({ ...prev, loading: false }));
      }
    };

    fetchConfig();
  }, [isInitialized]); // Removed i18n from deps to avoid re-triggering on manual change

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
