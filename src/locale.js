import { messages } from './messages.js';
export function getLocale(path = typeof window !== 'undefined' ? window.location.pathname : '/') { return /^\/zh(?:\/|$)/.test(path) ? 'zh' : 'en'; }
export function basePath(path = typeof window !== 'undefined' ? window.location.pathname : '/') { const p = path.replace(/^\/zh(?=\/|$)/, '') || '/'; return p.replace(/\/$/, '') || '/'; }
export function localHref(href, locale = getLocale()) {
  if (!href.startsWith('/') || href.startsWith('//') || /^\/(?:api|images|assets|product-thumbs|downloads)(?:\/|$)/.test(href)) return href;
  const match = href.match(/^([^?#]*)(.*)$/); const p = basePath(match[1]);
  return (locale === 'zh' ? '/zh' + (p === '/' ? '' : p) : p) + match[2];
}
export function t(key, params = {}, locale = getLocale()) {
  const message = messages[locale]?.[key] ?? messages.en[key];
  if (message === undefined) throw new Error(`Missing translation: ${key}`);
  return message.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? `{${name}}`));
}
