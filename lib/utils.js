export function validateUrl(url) {
  try {
    new URL(url);
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

export function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}