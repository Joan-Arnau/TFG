import { createContext, useState, useContext, useEffect } from 'react';
import { httpClient } from '../api/httpClient';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
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
          setTheme({
            primaryColor: response.data.primaryColor || '#007AFF',
            secondaryColor: response.data.secondaryColor || '#5856D6',
            logoUrl: response.data.logoUrl,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch theme config:', error);
        setTheme(prev => ({ ...prev, loading: false }));
      }
    };

    fetchConfig();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
