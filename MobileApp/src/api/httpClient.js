import axios from 'axios'
import i18n from '../i18n'
import Constants from 'expo-constants';

// Detect host IP automatically during development
const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0] || 'localhost';
  return `http://${localhost}/api`;
};

export const httpClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
})

httpClient.interceptors.request.use((config) => {
  const language = i18n.language ?? 'ca'
  
  // Public client: no Authorization header
  config.headers['Accept-Language'] = language

  return config
})
