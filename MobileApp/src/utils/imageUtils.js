import Constants from 'expo-constants';

// Detect host IP automatically during development
const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0] || 'localhost';
  // Use port 8080 (backend) to serve images from /uploads
  return `http://${localhost}:8080`;
};

const BASE_URL = getBaseUrl();

/**
 * Formats an image URL. 
 * If it's already an absolute URL (starts with http), it returns it.
 * If it's a relative path, it prefixes it with the server's base URL.
 * Also performs aggressive cleaning of whitespace and newlines.
 */
export const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return 'https://via.placeholder.com/800x400?text=No+Image';
  }

  // CLEANING: Remove newlines, tabs and trim whitespace
  const cleanUrl = url.replace(/[\n\r\t]/g, "").trim();

  let finalUrl = cleanUrl;
  if (!cleanUrl.startsWith('http')) {
    const path = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    finalUrl = `${BASE_URL}${path}`;
  }
  
  return finalUrl;
};
