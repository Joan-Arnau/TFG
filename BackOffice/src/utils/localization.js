export function getLocalizedValue(value, language, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return String(value);

  const normalizedLanguage = (language || '').toLowerCase();
  const shortLanguage = normalizedLanguage.split('-')[0];

  // Retrieve cached default language and supported languages to apply dynamic fallback logic
  const defaultLang = localStorage.getItem('defaultLanguage') || 'ca';
  const supportedLangsStr = localStorage.getItem('supportedLanguages');
  
  let supportedLangs = ['ca', 'es', 'en'];
  try {
    if (supportedLangsStr) {
      supportedLangs = JSON.parse(supportedLangsStr);
    }
  } catch (e) {
    console.error('Error parsing supportedLanguages from localStorage', e);
  }

  // 1. Try the requested language
  if (value[normalizedLanguage]?.trim()) return value[normalizedLanguage];
  if (value[shortLanguage]?.trim()) return value[shortLanguage];

  // 2. Try the configured default language fallback
  if (value[defaultLang]?.trim()) return value[defaultLang];

  // 3. Try other supported languages in order
  for (const lang of supportedLangs) {
    if (value[lang]?.trim()) return value[lang];
  }

  // 4. Final fallback: return any filled string value in the map
  const firstFilledKey = Object.keys(value).find(key => value[key]?.trim());
  if (firstFilledKey) return value[firstFilledKey];

  return fallback;
}

export function getLocalizedDraft(value) {
  return {
    ca: getLocalizedValue(value, 'ca', ''),
    es: getLocalizedValue(value, 'es', ''),
    en: getLocalizedValue(value, 'en', ''),
  };
}

export function buildLocalizedMap(draft) {
  return {
    ca: draft?.ca?.trim() || '',
    es: draft?.es?.trim() || '',
    en: draft?.en?.trim() || '',
  };
}
