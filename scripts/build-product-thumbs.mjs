import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { catalogItems } from '../src/catalog.js';

// Generate only small card assets. Detail galleries keep their existing originals.
// macOS sips decodes the existing WebP and encodes a 640px AVIF derivative.
const run = promisify(execFile);
const target = path.resolve('public/product-thumbs');
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stardots-thumbs-'));
await mkdir(target, { recursive: true });

let next = 0;
const results = [];
async function worker() {
  while (next < catalogItems.length) {
    const item = catalogItems[next++];
    const response = await fetch(item.images[0], { signal: AbortSignal.timeout(15000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Source unavailable: ${item.sku} (${response.status})`);
    const original = path.join(temporary, `${item.sku}.webp`);
    const derivative = path.join(target, `${item.sku.toLowerCase()}.avif`);
    await writeFile(original, Buffer.from(await response.arrayBuffer()));
    await run('sips', ['-s', 'format', 'avif', '--resampleWidth', '640', original, '--out', derivative]);
    const bytes = await readFile(derivative);
    if (bytes.length < 1000 || bytes.toString('ascii', 4, 8) !== 'ftyp') throw new Error(`Invalid derivative: ${item.sku}`);
    results.push({ sku: item.sku, bytes: bytes.length });
  }
}

try {
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`Generated ${results.length} product card AVIFs, ${(results.reduce((sum, item) => sum + item.bytes, 0) / 1048576).toFixed(2)} MiB total`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
