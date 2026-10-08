import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInquiry } from '../src/inquiry-validation.js';
const base = { name: 'Buyer', company: 'Example', email: 'buyer@example.com', country: 'UK', product: 'Tote Bags', message: 'Develop a tote collection.', consent: true };
test('optional sourcing brief survives validation and remains optional', () => {
  assert.deepEqual(validateInquiry(base).errors, {});
  const { values, errors } = validateInquiry({ ...base, projectType: 'reference', stage: 'sample', referenceUrl: ' https://example.com/brief ', targetWindow: ' Spring collection ' });
  assert.deepEqual(errors, {});
  assert.equal(values.projectType, 'reference');
  assert.equal(values.stage, 'sample');
  assert.equal(values.referenceUrl, 'https://example.com/brief');
  assert.equal(values.targetWindow, 'Spring collection');
});
test('reference links reject executable schemes and credentials; brief fields have limits', () => {
  for (const referenceUrl of ['javascript:alert(1)', 'data:text/html,test', 'https://name:secret@example.com', 'not-a-url']) {
    assert.ok(validateInquiry({ ...base, referenceUrl }).errors.referenceUrl);
  }
  assert.ok(validateInquiry({ ...base, targetWindow: 'x'.repeat(121) }).errors.targetWindow);
  assert.ok(validateInquiry({ ...base, projectType: 'stock-guaranteed', stage: 'unknown' }).errors.projectType);
  assert.ok(validateInquiry({ ...base, stage: 'unknown' }).errors.stage);
});

test('Chinese enquiry retains language and returns Chinese validation errors', () => {
 const { values, errors } = validateInquiry({ ...base, language: 'zh', email: 'bad', message: '短', consent: false });
 assert.equal(values.language, 'zh');
 assert.match(errors.email, /[\u3400-\u9fff]/); assert.match(errors.consent, /[\u3400-\u9fff]/);
 assert.equal(validateInquiry({ ...base, language: 'de' }).values.language, 'en');
});
