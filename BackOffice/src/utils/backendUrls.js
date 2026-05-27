export function resolveBackendStaticUrl(url) {
  if (!url) return null;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return url;
}