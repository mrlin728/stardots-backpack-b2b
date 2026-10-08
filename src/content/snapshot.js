import raw from '../generated/content-snapshot.json' with {type:'json'};
import version from '../generated/content-version.json' with {type:'json'};
export function validateSnapshot(snapshot){
 if(snapshot.schemaVersion!==1||snapshot.siteId!=='bags'||!Array.isArray(snapshot.products)||!snapshot.imageSlots||!snapshot.redirects)throw Error('Wrong snapshot/site');
 const skus=new Set(),slugs=new Set();
 function asset(a){for(const raw of [a.sourceUrl,a.cardUrl].filter(Boolean)){
  if(/[\\\s%?#]/.test(raw)||raw.includes('..')||!/\.(?:avif|webp|png|jpg|jpeg)$/i.test(raw))throw Error('Invalid public asset');
  if(raw.startsWith('/')){if(!/^\/(?:images|product-thumbs)\//.test(raw))throw Error('Foreign asset');}
  else{const u=new URL(raw);if(u.protocol!=='https:'||u.host!=='ugxxaokbqkajqkgxdngz.supabase.co'||u.username||u.password||!(u.pathname.startsWith('/storage/v1/object/public/stardots-bags/')||u.pathname.startsWith('/storage/v1/object/public/cms-published/bags/')))throw Error('Private/foreign asset');}
 }}
 for(const p of snapshot.products){if(skus.has(p.sku.toLowerCase())||slugs.has(p.slug))throw Error('Duplicate identity');skus.add(p.sku.toLowerCase());slugs.add(p.slug);p.images.forEach(asset);}
 for(const slot of Object.values(snapshot.imageSlots))asset(slot.image);
 return snapshot;
}
const built=validateSnapshot(raw);
export function getBuildSnapshot(){return built;}
export const contentVersion=version;
