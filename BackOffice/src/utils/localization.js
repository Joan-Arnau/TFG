export function getLocalizedValue(value, language, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return String(value);

  const normalizedLanguage = (language || '').toLowerCase();
  const shortLanguage = normalizedLanguage.split('-')[0];

  return (
    value[normalizedLanguage] ||
    value[shortLanguage] ||
    value.ca ||
    value.es ||
    value.en ||
    fallback
  );
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
