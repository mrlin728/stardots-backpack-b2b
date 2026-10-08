import { readFile } from 'node:fs/promises';
import { publicRoutes, SITE_URL } from '../src/seo.js';
import { getLocale, localHref } from '../src/locale.js';
const failures=[];
for (const route of publicRoutes) {
 const html=await readFile(`dist/${route==='/'?'index':route.slice(1)}.html`,'utf8');
 const locale=getLocale(route);
 for(const [name,pattern] of [
  ['html language',new RegExp(`<html lang="${locale==='zh'?'zh-CN':'en'}"`)],
  ['canonical',new RegExp(`<link rel="canonical" href="${SITE_URL}${route}"`)],
  ['English alternate',new RegExp(`hreflang="en" href="${SITE_URL}${localHref(route,'en')}"`)],
  ['Chinese alternate',new RegExp(`hreflang="zh-CN" href="${SITE_URL}${localHref(route,'zh')}"`)],
 ]) if(!pattern.test(html)) failures.push(`${route}: ${name}`);
 if(locale==='zh') {
  const main=html.match(/<main[\s\S]*?<\/main>/)?.[0]||'';
  if(!/[\u3400-\u9fff]/.test(main)) failures.push(`${route}: no Chinese main content`);
  for(const [,href] of main.matchAll(/href="(\/[^"?#]*)/g)) {
   if(publicRoutes.includes(href)&&getLocale(href)!=='zh') failures.push(`${route}: English-only navigation ${href}`);
  }
 }
}
console.log(`Checked ${publicRoutes.length} localized HTML pages.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
