// Shared, dependency-free contracts for the browser and the local AI endpoint.
export const LANGUAGES = { en: 'English', zh: '简体中文', tw: '繁體中文' };
export const FACT_KINDS = ['experience', 'education', 'skills', 'achievement', 'languages'];
export function requireText(value, max, name, optional = false) {
  if (typeof value !== 'string' || value.length > max || (!optional && !value.trim())) throw new Error(`Check ${name} (maximum ${max} characters).`);
  return value.trim();
}
export function approvedFacts(input) {
  if (!Array.isArray(input) || !input.length || input.length > 40) throw new Error('Approve between 1 and 40 facts first.');
  const ids = new Set();
  return input.map(f => {
    if (!f || f.approved !== true || !FACT_KINDS.includes(f.kind)) throw new Error('Only candidate-approved facts can be used.');
    const id = requireText(f.id, 60, 'fact ID');
    if (ids.has(id)) throw new Error('Fact IDs must be unique.');
    ids.add(id);
    const text = Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, requireText(f[l] ?? '', 1200, 'fact text', true)]));
    if (!Object.values(text).some(Boolean)) throw new Error('A fact cannot be empty.');
    return { id, kind: f.kind, approved: true, ...text };
  });
}
export function validateCvRequest(input) {
  if (!input || !Object.hasOwn(LANGUAGES, input.language) || !['tailor', 'translate'].includes(input.task)) throw new Error('Choose a supported task and language.');
  return {
    task: input.task, language: input.language,
    company: requireText(input.company ?? '', 120, 'company', input.task === 'translate'),
    role: requireText(input.role ?? '', 120, 'role', input.task === 'translate'),
    jd: requireText(input.jd ?? '', 10000, 'job description', input.task === 'translate'),
    facts: approvedFacts(input.facts)
  };
}
export function splitFacts(text, language) {
  requireText(text, 24000, 'CV text');
  if (!Object.hasOwn(LANGUAGES, language)) throw new Error('Choose the source language.');
  const lines = text.split(/\r?\n/).map(s => s.replace(/^\s*[-•*]\s*/, '').trim()).filter(Boolean);
  if (lines.length > 40 || lines.some(s => s.length > 1200)) throw new Error('Use up to 40 facts, each under 1,200 characters. Split long paragraphs onto separate lines.');
  return lines.map((line, i) => ({ id: `fact-${Date.now()}-${i}`, kind: 'experience', en: '', zh: '', tw: '', [language]: line, approved: false }));
}
const headings = {
  en: { experience: 'Experience', education: 'Education', skills: 'Skills', achievement: 'Selected achievements', languages: 'Languages' },
  zh: { experience: '工作经历', education: '教育背景', skills: '技能', achievement: '项目与成果', languages: '语言能力' },
  tw: { experience: '工作經歷', education: '教育背景', skills: '技能', achievement: '專案與成果', languages: '語言能力' }
};
export function localCv(input) {
  const r = validateCvRequest(input);
  if (r.facts.some(f => !f[r.language])) throw new Error(`AI translation is not configured. Add and approve ${LANGUAGES[r.language]} text for each fact, or choose a language already provided.`);
  // Local mode only reorders exact approved wording. It never invents a translation.
  const terms = [...new Set(r.jd.toLowerCase().match(/[\p{L}\p{N}+#.]{2,}/gu) || [])];
  const ranked = r.facts.map((f, i) => ({ f, i, score: terms.filter(t => f[r.language].toLowerCase().includes(t)).length })).sort((a, b) => b.score - a.score || a.i - b.i);
  return {
    sections: FACT_KINDS.map(kind => ({ heading: headings[r.language][kind], items: ranked.filter(x => x.f.kind === kind).map(({ f }) => ({ text: f[r.language], factIds: [f.id] })) })).filter(s => s.items.length),
    gaps: [r.task === 'tailor' ? 'Local mode orders your exact approved facts by keyword overlap. It does not assess suitability or rewrite your experience.' : 'Local mode uses the candidate-provided wording in the selected language.'],
    mode: 'local'
  };
}
export function validateCvOutput(output, input) {
  const request = validateCvRequest(input);
  const byId = new Map(request.facts.map(f => [f.id, f]));
  if (!output || !Array.isArray(output.sections) || !output.sections.length || output.sections.length > 8 || !Array.isArray(output.gaps) || output.gaps.length > 12) throw new Error('The generated draft was invalid. Please try again.');
  const sections = output.sections.map(section => {
    const heading = requireText(section.heading, 100, 'section heading');
    if (!Array.isArray(section.items) || !section.items.length || section.items.length > 40) throw new Error('Invalid draft section.');
    const items = section.items.map(item => {
      const text = requireText(item.text, 1800, 'draft item');
      if (!Array.isArray(item.factIds) || !item.factIds.length || item.factIds.some(id => !byId.has(id))) throw new Error('Draft includes an unapproved or missing source fact.');
      const source = item.factIds.map(id => { const f = byId.get(id); return [f.en, f.zh, f.tw].join(' '); }).join(' ');
      const sourceNumbers = new Set(source.match(/\d+(?:[.,]\d+)?/g) || []);
      if ((text.match(/\d+(?:[.,]\d+)?/g) || []).some(n => !sourceNumbers.has(n))) throw new Error('Draft introduced a number that is not in its approved facts.');
      return { text, factIds: [...new Set(item.factIds)] };
    });
    return { heading, items };
  });
  return { sections, gaps: output.gaps.map(s => requireText(s, 1200, 'review question')) };
}
export function validatePublicProfile(input, now = Date.now()) {
  if (!input || input.version !== 1) throw new Error('This profile link is not supported.');
  const expiresAt = Number(input.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt < now || expiresAt > now + 91 * 86400000) throw new Error('This profile link has expired or has an invalid expiry.');
  const name = requireText(input.name, 80, 'display name');
  const city = requireText(input.city ?? '', 80, 'city', true);
  const contact = requireText(input.contact ?? '', 200, 'contact', true);
  const skills = requireText(input.skills ?? '', 400, 'skills', true);
  const locales = {};
  for (const language of Object.keys(LANGUAGES)) {
    const locale = input.locales?.[language];
    if (!locale) continue;
    locales[language] = { headline: requireText(locale.headline, 160, 'headline'), about: requireText(locale.about ?? '', 1200, 'introduction', true) };
  }
  if (!Object.keys(locales).length) throw new Error('Approve at least one profile language.');
  // Whitelist only public fields. CVs, email defaults and work-status answers are never copied.
  return { version: 1, name, city, contact, skills, locales, expiresAt };
}
export function encodeProfile(input, now = Date.now()) {
  const text = JSON.stringify(validatePublicProfile(input, now));
  const binary = Array.from(new TextEncoder().encode(text), byte => String.fromCharCode(byte)).join('');
  const token = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (token.length > 12000) throw new Error('This profile is too long for a share link. Shorten the introduction.');
  return token;
}
export function decodeProfile(token, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 12000 || !/^[A-Za-z0-9_-]+$/.test(token)) throw new Error('Invalid profile link.');
  try {
    const bytes = Uint8Array.from(atob(token.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));
    return validatePublicProfile(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)), now);
  } catch (error) { throw new Error(error.message.includes('expired') ? error.message : 'This profile link is invalid or incomplete.'); }
}
export function cvAsText(draft, identity) {
  return [identity.name, identity.headline, '', [draft.company, draft.role].filter(Boolean).join(' · '), ...draft.sections.flatMap(s => ['', s.heading, ...s.items.map(i => `• ${i.text}`)])].filter(x => x !== undefined).join('\n');
}
export const SAMPLE_FACTS = [
  { id: 'sample-1', kind: 'experience', en: 'Product designer at a Shenzhen software studio, 2022–2025.', zh: '2022年至2025年，在深圳一家软件工作室担任产品设计师。', tw: '2022年至2025年，在深圳一家軟體工作室擔任產品設計師。', approved: false },
  { id: 'sample-2', kind: 'achievement', en: 'Redesigned onboarding with a team of 4; completion increased by 18% in an internal test.', zh: '与4人团队重新设计入门流程；内部测试中完成率提高了18%。', tw: '與4人團隊重新設計入門流程；內部測試中完成率提高了18%。', approved: false },
  { id: 'sample-3', kind: 'skills', en: 'Figma, prototyping, user interviews and design systems.', zh: 'Figma、原型设计、用户访谈与设计系统。', tw: 'Figma、原型設計、使用者訪談與設計系統。', approved: false },
  { id: 'sample-4', kind: 'education', en: 'BSc in Computer Science, 2022.', zh: '2022年获得计算机科学学士学位。', tw: '2022年取得電腦科學學士學位。', approved: false },
  { id: 'sample-5', kind: 'languages', en: 'Mandarin: native. English: professional working proficiency.', zh: '普通话：母语。英语：专业工作水平。', tw: '普通話：母語。英語：專業工作程度。', approved: false }
];
