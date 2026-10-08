import { contentVersion } from '../src/content/snapshot.js';
import { siteImage } from '../src/content/site-images.js';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getLocale, localHref, basePath } from '../src/locale.js';
import { SITE_URL, publicRoutes, pageMetadata, structuredData } from '../src/seo.js';

const preview = process.env.VERCEL_ENV === 'preview';
const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const { default: App } = await server.ssrLoadModule('/src/App.jsx');

const escapeHtml = (text) => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
try {
  for (const route of publicRoutes) {
    globalThis.window = { location: { pathname: route, search: '', hash: '' } };
    const markup = renderToString(React.createElement(App));
    const { title, description, image } = pageMetadata(route);
    const locale = getLocale(route);
    const canonical = `${SITE_URL}${route}`;
    const schema = JSON.stringify(structuredData(route)).replaceAll('<', '\\u003c');
    const head = [
      `<link rel="alternate" hreflang="en" href="${SITE_URL}${localHref(route, 'en')}" />`,
      `<link rel="alternate" hreflang="zh-CN" href="${SITE_URL}${localHref(route, 'zh')}" />`,
      `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${localHref(route, 'en')}" />`,
      `<meta property="og:locale" content="${locale === 'zh' ? 'zh_CN' : 'en_US'}" />`,
      `<link rel="canonical" href="${canonical}" />`,
      `<meta property="og:type" content="${basePath(route).startsWith('/resources/') ? 'article' : 'website'}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${canonical}" />`,
      image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : '',
      preview ? '<meta name="robots" content="noindex,nofollow" />' : '',
      basePath(route) === '/' ? `<link rel="preload" as="image" href="${escapeHtml(siteImage('home-hero','/images/hero-bags.jpg'))}" />` : '',
      `<script type="application/ld+json">${schema}</script>`,
    ].filter(Boolean).join('');
    const html = template
      .replace('<html lang="en">', `<html lang="${locale === 'zh' ? 'zh-CN' : 'en'}">`)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace('</head>', `${head}<meta name="stardots-content-release" content="${contentVersion.releaseId}" /></head>`);
    const output = path.join('dist', route === '/' ? 'index.html' : `${route.slice(1)}.html`);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
  }
  const previewHtml=template.replace('</head>','<meta name="robots" content="noindex,nofollow" /><meta name="referrer" content="no-referrer" /></head>').replace(/<title>.*?<\/title>/,'<title>草稿预览 — STARDOTS</title>');
  await mkdir('dist/zh',{recursive:true});await writeFile('dist/content-preview.html',previewHtml);await writeFile('dist/zh/content-preview.html',previewHtml);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map((route) => `<url><loc>${SITE_URL}${route}</loc></url>`).join('')}</urlset>`);
  await writeFile('dist/robots.txt', preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log(`Prerendered ${publicRoutes.length} English and Chinese pages${preview ? ' for preview (noindex)' : ''}`);
} finally {
  delete globalThis.window;
  await server.close();
}
