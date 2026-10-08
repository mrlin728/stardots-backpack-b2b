import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { catalogItems, baselineCatalogItems } from '../src/catalog.js';
import { categories } from '../src/data.js';
import { validateInquiry } from '../src/inquiry-validation.js';
import { publicRoutes, pageMetadata, structuredData } from '../src/seo.js';

test('every public page has a unique route, descriptive title, and canonical-ready metadata', () => {
  assert.equal(new Set(publicRoutes).size, publicRoutes.length);
  assert.equal(publicRoutes.length % 2, 0);
  const titles = publicRoutes.map((route) => pageMetadata(route).title);
  assert.equal(new Set(titles).size, titles.length);
  for (const route of publicRoutes) {
    const meta = pageMetadata(route);
    assert.match(meta.title, /\| STARDOTS$/);
    assert.ok(meta.description.length >= (route.startsWith('/zh') ? 15 : 45), `${route} has a short description`);
    const graph = structuredData(route)['@graph'];
    assert.equal(graph[0]['@type'], 'Organization');
    if (route !== '/' && route !== '/zh') assert.ok(graph.some((node) => node['@type'] === 'BreadcrumbList'));
    assert.ok(graph.every((node) => node['@type'] !== 'Product'), 'No unverified Product offer schema');
  }
});

test('every catalog model has a unique public detail page and mapped images', () => {
  assert.ok(catalogItems.length > 0);
  assert.equal(new Set(catalogItems.map((item) => item.sku)).size, catalogItems.length);
  for (const item of catalogItems) {
    assert.ok(publicRoutes.includes(`/products/models/${item.slug}`));
    assert.ok(categories.some((category) => category.slug === item.category));
    assert.ok(item.images.length > 0, item.sku);
    assert.ok(item.images.every((image) => image.endsWith('.webp')));
  }
  for (const category of categories) assert.ok(catalogItems.some((item) => item.category === category.slug), `${category.slug} lacks a matching real model`);
});

test('each catalog card has a valid static AVIF derivative and a local full-resolution photograph with recorded origin', async () => {
  const files = await readdir('public/product-thumbs');
  assert.equal(files.length, baselineCatalogItems.length);
  const origins = JSON.parse(await readFile('docs/local-media-provenance.json', 'utf8'));
  for (const item of baselineCatalogItems) {
    const bytes = await readFile(`public/product-thumbs/${item.sku.toLowerCase()}.avif`);
    assert.equal(bytes.toString('ascii', 4, 8), 'ftyp', item.sku);
    assert.ok(bytes.length > 1000, item.sku);
    assert.ok(item.images[0].startsWith('/images/catalog/'), 'The full-resolution photo is local');
    assert.ok(Object.entries(origins).some(([origin,local]) => origin.startsWith('https://') && local === item.images[0]), 'The original source URL is recorded');
    assert.ok((await readFile('public' + item.images[0])).length > 1000, 'The full-resolution photo exists');
  }
});

test('inquiry requires real contact data, project context, and consent', () => {
  const invalid = validateInquiry({ name: 'A', email: 'invalid', message: 'short', consent: false });
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);
  assert.ok(invalid.errors.consent);
  assert.ok(invalid.errors.company);
  assert.ok(validateInquiry(null).errors.form);

  const valid = validateInquiry({
    name: '  Buyer  ', company: '  Example  ', email: ' buyer@example.com ', country: 'UK',
    product: 'Backpacks', model: 'MH-2506013', message: 'Please discuss a reference bag for our range.',
    sourcePage: '/products/models/mh-2506013', consent: true,
  });
  assert.deepEqual(valid.errors, {});
  assert.equal(valid.values.name, 'Buyer');
  assert.equal(valid.values.model, 'MH-2506013');
  assert.equal(valid.values.sourcePage, '/products/models/mh-2506013');
  assert.equal(validateInquiry({ ...valid.values, sourcePage: 'https://other.example/' }).values.sourcePage, '/contact');
});
