import {test} from 'node:test';
import assert from 'node:assert/strict';
import {toBagCatalog} from '../src/content/catalog-adapter.js';
import {getBuildSnapshot, validateSnapshot} from '../src/content/snapshot.js';
test('new primary images use their own derivatives and hidden models disappear',()=>{
 const snapshot=structuredClone(getBuildSnapshot());
 const p=snapshot.products[0];p.images[0]={...p.images[0],sourceUrl:'/images/new.webp',cardUrl:'/images/new-card.webp'};
 snapshot.products[1].visible=false;
 const catalog=toBagCatalog(snapshot);
 assert.equal(catalog.length,snapshot.products.length-1);
 assert.equal(catalog[0].images[0],'/images/new.webp');assert.equal(catalog[0].cardUrl,'/images/new-card.webp');
 assert.ok(!catalog.some(p=>p.sku===snapshot.products[1].sku));
});
test('wrong sites, duplicate identities and signed private references are rejected',()=>{
 const s=structuredClone(getBuildSnapshot());
 assert.throws(()=>validateSnapshot({...s,siteId:'footwear'}));
 assert.throws(()=>validateSnapshot({...s,products:[...s.products,s.products[0]]}));
 s.products[0].images[0].sourceUrl='https://ugxxaokbqkajqkgxdngz.supabase.co/storage/v1/object/sign/cms-drafts/a?token=secret';
 assert.throws(()=>validateSnapshot(s));
});

test('preserved baseline contains 67 models and unchanged bilingual catalog fields',async()=>{const {baselineCatalogItems}=await import('../src/catalog.js');assert.equal(baselineCatalogItems.length,67);const built=toBagCatalog(getBuildSnapshot());for(const p of baselineCatalogItems){const row=built.find(x=>x.sku===p.sku);assert.ok(row);assert.deepEqual(row.name,p.name);assert.deepEqual(row.description,p.description);assert.deepEqual(row.images,p.images);}});
test('product specifications and image descriptions/crops survive the public adapter',()=>{const snapshot=structuredClone(getBuildSnapshot());snapshot.products[0].specs={capacity:{en:'10 L',zh:'10 升'}};snapshot.products[0].images[0].alt={en:'Custom image description',zh:'定制图片说明'};snapshot.products[0].images[0].focal={x:0.2,y:0.8};const item=toBagCatalog(snapshot)[0];assert.deepEqual(item.specs,snapshot.products[0].specs);assert.deepEqual(item.imageRefs[0],snapshot.products[0].images[0]);});
