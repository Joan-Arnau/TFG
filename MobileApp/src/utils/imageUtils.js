import Constants from 'expo-constants';

// Detect host IP automatically during development
const getAssetBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0] || 'localhost';
  return `http://${localhost}`;
};

const ASSET_BASE_URL = getAssetBaseUrl();
const ALLOWED_IMAGE_PATHS = ['/uploads/', '/seed-images/'];

const isAllowedRelativeImagePath = (path) => (
  ALLOWED_IMAGE_PATHS.some((prefix) => path.startsWith(prefix))
);

/**
 * Converts API-owned relative image paths to device-accessible URLs.
 * Absolute URLs are intentionally rejected; image fields must be persisted as relative paths.
 */
export const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const cleanUrl = url.replace(/[\n\r\t]/g, "").trim();
  const path = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;

  if (!isAllowedRelativeImagePath(path)) {
    return null;
  }

  return `${ASSET_BASE_URL}${path}`;
};
