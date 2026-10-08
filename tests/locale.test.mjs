import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocale, basePath, localHref } from '../src/locale.js';
import { publicRoutes, englishRoutes, pageMetadata, structuredData } from '../src/seo.js';
import { getSiteData } from '../src/data.js';
test('URL selects locale with English default and switching preserves query/hash', () => {
 assert.equal(getLocale('/'), 'en'); assert.equal(getLocale('/zh'), 'zh'); assert.equal(getLocale('/zh/products'), 'zh'); assert.equal(getLocale('/zhong'), 'en');
 assert.equal(basePath('/zh/products'), '/products');
 assert.equal(localHref('/products/models/mh-2506013?source=home#quote','zh'),'/zh/products/models/mh-2506013?source=home#quote');
 assert.equal(localHref('/zh/contact?model=MH-2506013#quote','en'),'/contact?model=MH-2506013#quote');
 assert.equal(localHref('/','zh'),'/zh');
 for (const href of ['https://example.com','//example.com','mailto:test@example.com','#quote','/images/duffel.webp','/downloads/stardots-buyer-brief.txt']) assert.equal(localHref(href,'zh'),href);
});
test('every English page has a Chinese counterpart and localized metadata', () => {
 assert.equal(publicRoutes.length,englishRoutes.length*2);
 for(const route of publicRoutes.filter(p=>getLocale(p)==='en')){
  const zh=localHref(route,'zh'); assert.ok(publicRoutes.includes(zh));
  assert.match(pageMetadata(zh).title,/[\u3400-\u9fff]/);
  assert.match(pageMetadata(zh).description,/[\u3400-\u9fff]/);
  const breadcrumb=structuredData(zh)['@graph'].find(x=>x['@type']==='BreadcrumbList');
  if(breadcrumb) assert.ok(breadcrumb.itemListElement.every(x=>x.item.startsWith('https://stardotsbags.com/zh')));
 }
});
test('Chinese data keeps route identifiers and supplies all public content sections',()=>{
 const en=getSiteData('en'),zh=getSiteData('zh');
 for(const name of ['categories','services','markets','articles']) {
  assert.deepEqual(zh[name].map(x=>x.slug),en[name].map(x=>x.slug));
  for(const item of zh[name]) assert.match(item.name||item.title,/[\u3400-\u9fff]/);
 }
 assert.equal(zh.faqs.length,en.faqs.length);
 for(const f of zh.faqs) assert.match(f.a,/[\u3400-\u9fff]/);
});

test('all message keys and interpolation variables have matching Chinese translations', async()=>{
 const {messages}=await import('../src/messages.js');
 assert.ok(Object.keys(messages.en).length>0,'Message catalog must not be empty');
 assert.deepEqual(Object.keys(messages.en).sort(),Object.keys(messages.zh).sort());
 for(const [key,value] of Object.entries(messages.en)) {
  assert.ok(messages.zh[key]?.trim(),key);
  const slots=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
  assert.deepEqual(slots(messages.zh[key]),slots(value),key);
 }
});
