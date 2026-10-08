import { readFile, readdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { catalogItems } from '../src/catalog.js';
import { categories, articles, serviceMedia } from '../src/data.js';
const run = promisify(execFile);

function dimensions(bytes, extension) {
  if (extension === '.webp' && bytes.toString('ascii', 0, 4) === 'RIFF') {
    const format = bytes.toString('ascii', 12, 16);
    if (format === 'VP8X') return [1 + bytes.readUIntLE(24, 3), 1 + bytes.readUIntLE(27, 3)];
    if (format === 'VP8 ') return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff];
    if (format === 'VP8L') return [1 + (((bytes[22] & 0x3f) << 8) | bytes[21]), 1 + (((bytes[24] & 0x0f) << 10) | (bytes[23] << 2) | (bytes[22] >> 6))];
  }
  if (extension === '.jpg' || extension === '.jpeg') {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset++; continue; }
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
      offset += 2 + length;
    }
  }
  if (extension === '.png' && bytes.toString('ascii', 1, 4) === 'PNG') return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
  if (extension === '.svg') {
    const match = bytes.toString('utf8').match(/viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"/);
    if (match) return [Number(match[1]), Number(match[2])];
  }
  return [null, null];
}

const media = new Map();
function use(url, usage) {
  const record = media.get(url) || { url, source: url.startsWith('http') ? 'Existing public STARDOTS product archive' : 'Local site asset; inspect role before reuse', usage: [] };
  record.usage.push(usage);
  media.set(url, record);
}
for (const item of catalogItems) item.images.forEach((url, index) => use(url, { role: 'product gallery', sku: item.sku, category: item.category, view: index + 1, alt: `${item.name[0]} (${item.sku})`, loading: index === 0 ? 'eager on detail; lazy in grids' : 'lazy thumbnail' }));
for (const item of catalogItems) use(`/product-thumbs/${item.sku.toLowerCase()}.avif`, { role: 'catalog card derivative', sku: item.sku, category: item.category, original: item.images[0], alt: `${item.name[0]} (${item.sku})`, loading: 'lazy' });
for (const category of categories) use(category.image, { role: 'category', slug: category.slug, alt: `${category.name} reference model`, loading: 'lazy on index; eager on category page' });
for (const article of articles) use(article.image, { role: 'article', slug: article.slug, alt: '', loading: 'lazy on cards; eager on article page' });
for (const [slug, asset] of Object.entries(serviceMedia)) use(asset.src, { role: 'service', slug, alt: asset.alt, loading: 'eager on service page' });
const localFiles = ['favicon.svg', ...(await readdir('public/images')).map((file) => `images/${file}`), ...(await readdir('public/product-thumbs')).map((file) => `product-thumbs/${file}`)];
const sourceFiles = ['index.html', 'src/App.jsx', 'src/Catalog.jsx', 'src/data.js', 'src/seo.js', 'src/styles.css', 'src/reference.css', 'src/audit-fixes.css'];
const sources = await Promise.all(sourceFiles.map(async (file) => [file, await readFile(file, 'utf8')]));
for (const file of localFiles) {
  const url = `/${file}`;
  if (!media.has(url)) use(url, { role: 'local asset', alt: '', loading: 'review usage' });
  const record = media.get(url);
  record.references = sources.flatMap(([source, text]) => text.split('\n').flatMap((line, index) => line.includes(url) ? [{ file: source, line: index + 1 }] : []));
  const bytes = await readFile(path.join('public', file));
  let [width, height] = dimensions(bytes, path.extname(file).toLowerCase());
  if (file.endsWith('.avif')) {
    const { stdout } = await run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', path.join('public', file)]);
    width = Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
    height = Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
  }
  const source = file.startsWith('product-thumbs/') ? '640px static AVIF card derivative of the linked original product photograph' : record.references.length ? 'Local illustrative or editorial asset; not evidence of company facilities or a product model' : 'Retained legacy asset; currently unused';
  Object.assign(record, { source, width, height, aspectRatio: width && height ? Number((width / height).toFixed(3)) : null, bytes: bytes.length, duplicateReferences: record.references.length > 1 });
}

const remote = [...media.values()].filter((item) => item.url.startsWith('http'));
for (let start = 0; start < remote.length; start += 6) {
  await Promise.all(remote.slice(start, start + 6).map(async (record) => {
    try {
      const [head, partial] = await Promise.all([
        fetch(record.url, { method: 'HEAD', signal: AbortSignal.timeout(12000) }),
        fetch(record.url, { headers: { Range: 'bytes=0-65535' }, signal: AbortSignal.timeout(12000) }),
      ]);
      const bytes = Buffer.from(await partial.arrayBuffer());
      const [width, height] = dimensions(bytes, '.webp');
      const contentRange = partial.headers.get('content-range');
      const fullLength = contentRange?.split('/').at(-1);
      Object.assign(record, { status: head.status, contentType: head.headers.get('content-type'), width, height, aspectRatio: width && height ? Number((width / height).toFixed(3)) : null, bytes: Number(head.headers.get('content-length') || fullLength) || null, duplicateReferences: record.usage.length > 1 });
    } catch (error) { record.error = error.message; }
  }));
}
const list = [...media.values()].sort((a, b) => a.url.localeCompare(b.url));
await writeFile('image-manifest.json', `${JSON.stringify({ generatedAt: new Date().toISOString(), note: 'Remote originals remain in the existing public product archive. Static AVIFs are smaller card derivatives. Local illustrative assets are not proof of company facilities or specific product specifications.', totals: { local: localFiles.length, remote: remote.length, models: catalogItems.length, cardDerivatives: catalogItems.length }, images: list }, null, 2)}\n`);
console.log(`Mapped ${list.length} images (${remote.length} remote product images, ${localFiles.length} local assets)`);
