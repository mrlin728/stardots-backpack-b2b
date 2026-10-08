import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/inquiry.js';
const validBody = { name: 'QA Buyer', company: 'Example', email: 'qa@example.com', country: 'UK', product: 'Backpacks', model: 'MH-2506013', message: 'Please discuss this reference bag.', sourcePage: '/products/models/mh-2506013', consent: true, projectType: 'reference', stage: 'sample', referenceUrl: 'https://example.com/brief', targetWindow: 'Spring collection' };
function response() { return { statusCode: 200, headers: {}, payload: null, setHeader(key, value) { this.headers[key] = value; return this; }, status(code) { this.statusCode = code; return this; }, json(payload) { this.payload = payload; return this; } }; }
function request(body = validBody, ip = 'qa') { return { method: 'POST', body, headers: { 'content-type': 'application/json' }, socket: { remoteAddress: ip } }; }
test('FormSubmit receives the validated brief and only explicit success is accepted', async () => {
 const original = globalThis.fetch;
 try {
  globalThis.fetch = async (url, options) => {
   assert.equal(url, 'https://formsubmit.co/ajax/contact@cnstardots.com');
   const sent = JSON.parse(options.body);
   assert.equal(sent.email, validBody.email); assert.equal(sent.model, validBody.model);
   assert.equal(sent.referenceUrl, validBody.referenceUrl); assert.equal(sent.projectType, 'reference');
   assert.equal(sent._subject, 'STARDOTS bag inquiry — Example');
   return { ok: true, json: async () => ({ success: 'true', message: 'The form was submitted successfully.' }) };
  };
  const res = response(); await handler(request(), res);
  assert.equal(res.statusCode, 202); assert.equal(res.payload.accepted, true);
 } finally { globalThis.fetch = original; }
});
test('activation, provider rejection, malformed responses and transport failure never report acceptance', async () => {
 const original = globalThis.fetch; const log = console.error; console.error = () => {};
 try {
  for (const payload of [{ success: 'false', message: 'Activate your form' }, { success: true, message: 'Check your inbox to activate this form.' }, { success: 'false', message: 'Rejected' }, {}]) {
   globalThis.fetch = async () => ({ ok: true, json: async () => payload });
   const res = response(); await handler(request(validBody, JSON.stringify(payload)), res);
   assert.ok(res.statusCode >= 400); assert.ok(!res.payload.accepted);
  }
  globalThis.fetch = async () => { throw new Error('network unavailable'); };
  const res = response(); await handler(request(validBody, 'network'), res); assert.equal(res.statusCode, 502);
 } finally { globalThis.fetch = original; console.error = log; }
});
test('invalid, honeypot and oversized submissions do not reach FormSubmit; failed attempts are limited', async () => {
 const original = globalThis.fetch; let calls = 0;
 try {
  globalThis.fetch = async () => { calls++; return { ok: true, json: async () => ({ success: false }) }; };
  for (const body of [{}, { ...validBody, website: 'spam' }, { ...validBody, extra: 'x'.repeat(33000) }]) {
   const res = response(); await handler(request(body, 'invalid'), res); assert.ok(!res.payload.accepted);
  }
  assert.equal(calls, 0);
  for (let i = 0; i < 6; i++) { const res = response(); await handler(request(validBody, 'limit'), res); if (i === 5) assert.equal(res.statusCode, 429); }
  assert.equal(calls, 5);
 } finally { globalThis.fetch = original; }
});

test('a maximum-length Chinese message reaches the provider without byte-limit rejection', async () => {
 const original = globalThis.fetch;
 try {
  const body = { ...validBody, language: 'zh', name: '采购测试', company: '中文测试公司', country: '中国', message: '包'.repeat(4000) };
  assert.ok(Buffer.byteLength(JSON.stringify(body)) > 12000);
  globalThis.fetch = async (_url, options) => {
   const sent = JSON.parse(options.body); assert.equal(sent.message, body.message); assert.equal(sent.language, 'zh');
   return { ok: true, json: async () => ({ success: true }) };
  };
  const req = request(body, 'chinese-byte-limit'); req.headers['content-length'] = String(Buffer.byteLength(JSON.stringify(body)));
  const res = response(); await handler(req, res); assert.equal(res.statusCode, 202);
 } finally { globalThis.fetch = original; }
});
