import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { approvedFacts, splitFacts, validateCvRequest, localCv, validateCvOutput, encodeProfile, decodeProfile, cvAsText, SAMPLE_FACTS } from '../dist/career-core.js';
import { generateCv, translateProfile } from '../career-ai.mjs';
import { createAppServer } from '../server.mjs';

const facts = SAMPLE_FACTS.map(f => ({ ...f, approved: true }));
const request = { task: 'tailor', language: 'en', company: 'Forma', role: 'Designer', jd: 'Figma, prototyping and user interviews.', facts };
const draft = { sections: [{ heading: 'Experience', items: [{ text: 'Product designer, 2022–2025.', factIds: ['sample-1'] }] }], gaps: ['Confirm design experience relevant to this role.'] };
const aiOptions = output => ({ env: { OPENAI_API_KEY: 'test-only-key', OPENAI_MODEL: 'test-model' }, fetchImpl: async () => Response.json({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(output) }] }] }) });

test('notes become unapproved facts; approval is required server-side', () => {
  const extracted = splitFacts('参与产品设计\n使用 Figma', 'zh');
  assert.equal(extracted.length, 2);
  assert.equal(extracted[0].approved, false);
  assert.throws(() => approvedFacts(extracted), /approved/);
  assert.throws(() => validateCvRequest({ ...request, facts: [] }), /Approve/);
  assert.throws(() => approvedFacts([facts[0], facts[0]]), /unique/);
});
test('local CV uses exact approved text in all supported languages', () => {
  for (const language of ['en', 'zh', 'tw']) {
    const output = localCv({ ...request, language });
    assert.equal(output.sections.flatMap(s => s.items).length, facts.length);
    assert.ok(output.sections.flatMap(s => s.items).every(i => i.text === facts.find(f => f.id === i.factIds[0])[language]));
    validateCvOutput(output, { ...request, language });
  }
  assert.throws(() => localCv({ ...request, facts: [{ ...facts[0], en: '' }] }), /translation is not configured/);
});
test('unknown citations and invented numbers are rejected', () => {
  assert.throws(() => validateCvOutput({ ...draft, sections: [{ heading: 'Skills', items: [{ text: 'Expert in everything.', factIds: ['unapproved'] }] }] }, request), /unapproved/);
  assert.throws(() => validateCvOutput({ ...draft, sections: [{ heading: 'Experience', items: [{ text: 'Managed 500 people.', factIds: ['sample-1'] }] }] }, request), /number/);
});
test('AI request transmits only whitelisted approved data with structured output and no storage', async () => {
  let sent;
  const output = await generateCv({ ...request, privateEmail: 'never-send@example.com', rawCv: 'private original' }, {
    env: { OPENAI_API_KEY: 'test-only-key' },
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://api.openai.com/v1/responses'); sent = JSON.parse(options.body);
      return Response.json({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(draft) }] }] });
    }
  });
  assert.equal(output.mode, 'ai'); assert.equal(sent.store, false); assert.equal(sent.text.format.strict, true);
  assert.ok(!sent.input.includes('never-send')); assert.ok(!sent.input.includes('private original'));
});
test('translation checks every source fact; service failures and refusals are visible', async () => {
  await assert.rejects(generateCv({ ...request, task: 'translate' }, aiOptions(draft)), /omitted/);
  for (const language of ['en', 'zh']) {
    const source = [{ ...facts[0], [language === 'en' ? 'en' : 'zh']: '' }];
    const translated = { sections: [{ heading: 'Experience', items: [{ text: facts[0][language], factIds: [facts[0].id] }] }], gaps: [] };
    const output = await generateCv({ ...request, task: 'translate', language, facts: source }, aiOptions(translated));
    assert.equal(output.sections[0].items[0].text, facts[0][language]);
  }
  await assert.rejects(generateCv(request, { env: {} }), /not configured/);
  await assert.rejects(generateCv(request, { env: { OPENAI_API_KEY: 'test' }, fetchImpl: async () => new Response('', { status: 401 }) }), /401/);
  await assert.rejects(generateCv(request, { env: { OPENAI_API_KEY: 'test' }, fetchImpl: async () => Response.json({ status: 'completed', output: [{ content: [{ type: 'refusal' }] }] }) }), /declined/);
});
test('profile translation preserves authoritative source and limits text size', async () => {
  const output = await translateProfile({ language: 'zh', headline: '产品设计师', about: '关注用户研究。' }, aiOptions({ en: { headline: 'Designer', about: 'User research.' }, zh: { headline: 'Incorrect source rewrite', about: 'Changed' }, tw: { headline: '產品設計師', about: '關注使用者研究。' } }));
  assert.equal(output.locales.zh.headline, '产品设计师');
  await assert.rejects(translateProfile({ language: 'en', headline: 'x'.repeat(161) }, aiOptions({})), /headline/);
});
const snapshot = now => ({ version: 1, name: '陈 Alex', city: '深圳', skills: 'Figma', contact: '', locales: { en: { headline: 'Designer', about: 'Let’s connect.' }, zh: { headline: '设计师', about: '欢迎交流。' } }, expiresAt: now + 86400000 });
test('snapshot round-trips multilingual Unicode without private fields', () => {
  const now = Date.now();
  const token = encodeProfile({ ...snapshot(now), facts, cv: 'PRIVATE CV', email: 'private@example.com', status: 'private immigration answer' }, now);
  const result = decodeProfile(token, now);
  assert.equal(result.name, '陈 Alex'); assert.equal(result.locales.zh.about, '欢迎交流。');
  assert.equal(result.contact, ''); assert.equal(result.facts, undefined); assert.equal(result.email, undefined);
  assert.ok(!JSON.stringify(result).includes('PRIVATE'));
});
test('invalid, expired and oversized profile links fail safely', () => {
  const now = Date.now(); const token = encodeProfile(snapshot(now), now);
  assert.throws(() => decodeProfile(token, now + 2 * 86400000), /expired/);
  assert.throws(() => decodeProfile('not!valid'), /Invalid/);
  assert.throws(() => decodeProfile('a'.repeat(13000)), /Invalid/);
  assert.throws(() => encodeProfile({ ...snapshot(now), locales: {} }, now), /Approve/);
});
test('CV export contains approved content and excludes review questions and references', () => {
  const text = cvAsText({ ...draft, company: 'Forma', role: 'Designer' }, { name: 'Alex', headline: '' });
  assert.match(text, /2022–2025/); assert.match(text, /Forma/);
  assert.ok(!text.includes('Confirm design experience')); assert.ok(!text.includes('sample-1'));
});
test('HTTP API enforces consent, origin, payload limit and missing-key behavior', async t => {
  const server = createAppServer({ env: {} }); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = body => fetch(`${base}/api/cv/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal((await fetch(`${base}/api/ai/status`).then(r => r.json())).configured, false);
  assert.equal((await post(request)).status, 400);
  assert.equal((await post({ ...request, consent: true })).status, 503);
  assert.equal((await fetch(`${base}/api/ai/status`, { headers: { Origin: 'https://untrusted.example' } })).status, 403);
  assert.equal((await post({ consent: true, raw: 'x'.repeat(160000) })).status, 413);
  assert.equal((await fetch(`${base}/api/cv/generate`)).status, 405);
  assert.equal((await fetch(`${base}/career-ui.js`)).status, 200);
});
test('HTTP AI flow uses validated facts and returns a review draft', async t => {
  const server = createAppServer(aiOptions(draft)); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/cv/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...request, consent: true }) });
  assert.equal(response.status, 200); assert.equal((await response.json()).mode, 'ai');
});
