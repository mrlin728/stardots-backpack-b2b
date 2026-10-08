import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const siteId='bags';
const canonical=value=>JSON.stringify(normalize(value));
function normalize(v){if(Array.isArray(v))return v.map(normalize);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])]));return v;}
const supplied=['CONTENT_RELEASE_ID','CONTENT_SNAPSHOT_PATH','CONTENT_SNAPSHOT_HASH'].some(k=>process.env[k]);
if(supplied&&!['CONTENT_RELEASE_ID','CONTENT_SNAPSHOT_PATH','CONTENT_SNAPSHOT_HASH'].every(k=>process.env[k]))throw Error('Release builds require release ID, snapshot path and hash together.');
if(!supplied&&process.env.CONTENT_BASELINE!=='1')throw Error('Select CONTENT_BASELINE=1 explicitly for baseline development; release builds require fixed snapshot inputs.');
const snapshot=JSON.parse(await readFile(supplied?process.env.CONTENT_SNAPSHOT_PATH:'content/local.snapshot.json','utf8'));
if(snapshot.schemaVersion!==1||snapshot.siteId!==siteId||!Array.isArray(snapshot.products)||!snapshot.imageSlots||!snapshot.redirects)throw Error('Invalid content snapshot/site.');
const seen=new Set();const slugs=new Set();
function checkAsset(a){if(!a||typeof a.id!=='string'||!a.provenance||!a.alt||!a.focal||![a.focal.x,a.focal.y].every(n=>Number.isFinite(n)&&n>=0&&n<=1))throw Error('Invalid asset metadata');
 for(const raw of [a.sourceUrl,a.cardUrl].filter(Boolean)){if(/[\\\s%?#]/.test(raw)||raw.includes('..')||!/\.(?:avif|webp|png|jpg|jpeg)$/i.test(raw))throw Error('Invalid public asset');
 if(raw.startsWith('/')){if(raw.startsWith('//')||!/^\/(?:images|product-thumbs)\//.test(raw))throw Error('Foreign asset');}
 else {const u=new URL(raw);if(u.protocol!=='https:'||u.host!=='ugxxaokbqkajqkgxdngz.supabase.co'||u.username||u.password||!(/^\/storage\/v1\/object\/public\/stardots-bags\//.test(u.pathname)||u.pathname.startsWith('/storage/v1/object/public/cms-published/bags/')))throw Error('Foreign/private asset');}}
}
for(const p of snapshot.products){if(!p.visible||!p.name||!p.description||!p.specs||!p.flags||!Array.isArray(p.images)||typeof p.sku!=='string'||!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)||Object.keys(p.legacy??{}).length||seen.has(p.sku.toLowerCase())||slugs.has(p.slug))throw Error('Duplicate or private product data');seen.add(p.sku.toLowerCase());slugs.add(p.slug);p.images.forEach(checkAsset);}
for(const [id,slot] of Object.entries(snapshot.imageSlots)){if(slot.slot!==id)throw Error('Wrong image slot');checkAsset(slot.image);}
for(const [from,to] of Object.entries(snapshot.redirects)){if(!/^\/[a-z0-9/-]+$/.test(from)||!/^\/[a-z0-9/-]+$/.test(to)||from.includes('//')||to.includes('//')||from===to)throw Error('Invalid redirect');}
const snapshotHash=createHash('sha256').update(canonical(snapshot)).digest('hex');
if(supplied&&(snapshot.releaseId!==process.env.CONTENT_RELEASE_ID||snapshotHash!==process.env.CONTENT_SNAPSHOT_HASH))throw Error('Release snapshot identity/hash mismatch.');
const sourceCommit=process.env.CONTENT_SOURCE_COMMIT??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!/^[a-f0-9]{40}$/.test(sourceCommit))throw Error('Invalid source commit');
const version={siteId,releaseId:snapshot.releaseId,snapshotHash,sourceCommit};
await mkdir('src/generated',{recursive:true});await mkdir('public',{recursive:true});
await writeFile('src/generated/content-snapshot.json',JSON.stringify(snapshot)+'\n');
await writeFile('src/generated/content-version.json',JSON.stringify(version)+'\n');
await writeFile('public/content-version.json',JSON.stringify(version)+'\n');
console.log(`Prepared ${siteId} snapshot ${snapshot.releaseId}: ${snapshot.products.length} products`);
