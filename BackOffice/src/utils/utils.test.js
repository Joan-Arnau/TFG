import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { getLocalizedValue, getLocalizedDraft, buildLocalizedMap } from './localization';
import { resolveBackendStaticUrl } from './backendUrls';

describe('Localization Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getLocalizedValue', () => {
    test('returns fallback when value is null or undefined', () => {
      expect(getLocalizedValue(null, 'ca', 'Fallback')).toBe('Fallback');
      expect(getLocalizedValue(undefined, 'ca', 'Fallback')).toBe('Fallback');
    });

    test('returns the value directly when it is a string', () => {
      expect(getLocalizedValue('Simple String', 'ca')).toBe('Simple String');
    });

    test('returns String representation when value is not an object or string', () => {
      expect(getLocalizedValue(12345, 'ca')).toBe('12345');
      expect(getLocalizedValue(true, 'ca')).toBe('true');
    });

    test('retrieves the exact requested language', () => {
      const map = { ca: 'Hola', es: 'Hola Spanish', en: 'Hello' };
      expect(getLocalizedValue(map, 'ca')).toBe('Hola');
      expect(getLocalizedValue(map, 'es')).toBe('Hola Spanish');
      expect(getLocalizedValue(map, 'en')).toBe('Hello');
    });

    test('retrieves using short language code when full locale is requested (e.g. ca-ES -> ca)', () => {
      const map = { ca: 'Hola', es: 'Hola Spanish', en: 'Hello' };
      expect(getLocalizedValue(map, 'ca-ES')).toBe('Hola');
    });

    test('falls back to defaultLanguage in localStorage', () => {
      localStorage.setItem('defaultLanguage', 'en');
      const map = { ca: '', es: '', en: 'Fallback Hello' };
      // request 'ca' which is empty, should fallback to localStorage's defaultLanguage ('en')
      expect(getLocalizedValue(map, 'ca')).toBe('Fallback Hello');
    });

    test('falls back to global default (ca) when defaultLanguage in localStorage is missing', () => {
      const map = { ca: 'Default Ca', es: '', en: '' };
      // request 'es' which is empty, should fallback to global default 'ca'
      expect(getLocalizedValue(map, 'es')).toBe('Default Ca');
    });

    test('falls back to other supported languages in order if defaultLanguage fallback is empty', () => {
      localStorage.setItem('defaultLanguage', 'ca');
      localStorage.setItem('supportedLanguages', JSON.stringify(['ca', 'es', 'en']));
      
      const map = { ca: '', es: 'Spanish Text', en: '' };
      // request 'ca' which is empty -> fallback to default 'ca' (empty) -> try 'es' (has value)
      expect(getLocalizedValue(map, 'ca')).toBe('Spanish Text');
    });

    test('returns first filled key in map if all else fails', () => {
      const map = { ca: '', es: '', en: '', fr: 'French Text' };
      expect(getLocalizedValue(map, 'ca')).toBe('French Text');
    });

    test('returns fallback if map has no filled values', () => {
      const map = { ca: '   ', es: '', en: '' };
      expect(getLocalizedValue(map, 'ca', 'Final Fallback')).toBe('Final Fallback');
    });
  });

  describe('getLocalizedDraft', () => {
    test('constructs ca/es/en structure using fallback logic', () => {
      const map = { ca: 'Catalan', es: 'Spanish', en: 'English' };
      const draft = getLocalizedDraft(map);
      expect(draft).toEqual({
        ca: 'Catalan',
        es: 'Spanish',
        en: 'English',
      });
    });

    test('handles empty or missing languages cleanly', () => {
      const map = { ca: 'Catalan', es: '', en: '' };
      const draft = getLocalizedDraft(map);
      expect(draft).toEqual({
        ca: 'Catalan',
        es: 'Catalan', // fallbacks apply
        en: 'Catalan',
      });
    });
  });

  describe('buildLocalizedMap', () => {
    test('trims inputs and fallback to empty string', () => {
      const draft = { ca: '  Catalan  ', es: '', en: null };
      expect(buildLocalizedMap(draft)).toEqual({
        ca: 'Catalan',
        es: '',
        en: '',
      });
    });
  });
});

describe('URL Utilities', () => {
  describe('resolveBackendStaticUrl', () => {
    test('returns null for empty/undefined values', () => {
      expect(resolveBackendStaticUrl(null)).toBeNull();
      expect(resolveBackendStaticUrl('')).toBeNull();
    });

    test('keeps blob: and data: URLs intact', () => {
      expect(resolveBackendStaticUrl('blob:http://localhost/abc')).toBe('blob:http://localhost/abc');
      expect(resolveBackendStaticUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
    });

    test('keeps full http:// or https:// URLs intact', () => {
      expect(resolveBackendStaticUrl('https://example.com/logo.png')).toBe('https://example.com/logo.png');
      expect(resolveBackendStaticUrl('http://example.com/logo.png')).toBe('http://example.com/logo.png');
    });

    test('returns relative URLs as is', () => {
      expect(resolveBackendStaticUrl('/images/logo.png')).toBe('/images/logo.png');
    });
  });
});
