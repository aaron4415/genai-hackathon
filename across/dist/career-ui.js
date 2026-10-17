import { LANGUAGES, FACT_KINDS, SAMPLE_FACTS, splitFacts, localCv, validateCvOutput, encodeProfile, decodeProfile, cvAsText } from './career-core.js';

const STORAGE = 'across-career-v1';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const label = { experience: 'Experience / 工作经历', education: 'Education / 教育背景', skills: 'Skills / 技能', achievement: 'Projects & achievements / 项目成果', languages: 'Languages / 语言能力' };
const clone = value => JSON.parse(JSON.stringify(value));
const blankLocales = () => Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, { headline: '', about: '', approved: false }]));
const initial = () => ({ facts: [], source: '', sourceLanguage: 'zh', cv: { task: 'tailor', company: '', role: '', jd: '', language: 'en', engine: 'local' }, drafts: [], talent: { name: '', city: '', contact: '', skills: '', locales: blankLocales(), selectedLanguage: 'en', showCity: true, showSkills: true, showContact: false, expiry: '30' } });
function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
    if (!saved || !Array.isArray(saved.facts) || !Array.isArray(saved.drafts) || !saved.talent?.locales || !saved.cv) return initial();
    // Local storage is user-editable; cap records and never treat persisted output as HTML.
    return { ...initial(), ...saved, facts: saved.facts.slice(0, 40), drafts: saved.drafts.slice(0, 12), talent: { ...initial().talent, ...saved.talent, locales: { ...blankLocales(), ...saved.talent.locales } } };
  } catch { return initial(); }
}
function download(text, filename, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function createCareerWorkspace({ navigate, refresh, getView, getCandidate, jobs, toast, closeModal }) {
  let data = restore(), status = null, error = '', busy = false, selectedDraft = data.drafts[0]?.id, publicLanguage = 'en', publicToken = '', publicProfile = null;
  let reviewSnapshot = null;
  const persist = () => { try { localStorage.setItem(STORAGE, JSON.stringify(data)); return true; } catch { toast('Browser storage is unavailable. Export your work before leaving.'); return false; } };
  const repaint = () => { refresh(); };
  const clearApprovals = () => { data.drafts.forEach(d => { d.approved = false; }); reviewSnapshot = null; };
  const languages = (selected, extra = '') => `<select ${extra}>${Object.entries(LANGUAGES).map(([l, name]) => `<option value="${l}" ${l === selected ? 'selected' : ''}>${name}</option>`).join('')}</select>`;
  const header = (eyebrow, title, description) => `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div><button class="btn btn-outline" data-view="tools">Back to AI workspace</button></div>`;
  const message = () => error ? `<div class="career-error" role="alert">${esc(error)}</div>` : '';
  const aiStatus = () => `<span class="tag ${status?.configured ? 'mint' : ''}">${status === null ? 'Checking AI connection…' : status.configured ? 'AI configured · OpenAI' : 'Local editor · AI not configured'}</span>`;
  const aiConsent = id => `<label class="check-field"><input id="${id}" type="checkbox" ${!status?.configured ? 'disabled' : ''}><span>Send only the selected approved facts and JD (or profile introduction) to OpenAI for this request. Review its privacy terms before using personal data.</span></label>`;
  const factRevision = () => JSON.stringify(data.facts);
  function draftCurrent(draft) { return draft?.revision === factRevision(); }
  function cvPage() {
    const count = data.facts.filter(f => f.approved).length;
    const draft = data.drafts.find(d => d.id === selectedDraft) || data.drafts[0];
    return `${header('YOUR EXPERIENCE, IN YOUR WORDS', 'CV studio', 'Tailor your CV to a company’s JD, or translate it between English and Chinese. You approve the facts and the final wording.')}
      <div class="career-status">${aiStatus()}<span>Private workspace · saved in this browser</span></div>${message()}
      <div class="career-steps"><span>01 · Add your story</span><span>02 · Approve facts</span><span>03 · Tailor / translate</span><span>04 · Review & export</span></div>
      <div class="career-workbench"><div>
      <section class="panel"><h2>Start with what you know <span class="muted">从真实经历开始</span></h2><p>No CV yet? Write your education, work, projects and skills in everyday language, one fact per line. Add real dates and results only when you can confirm them.</p>
        <label class="field">Source language / 原文语言${languages(data.sourceLanguage, 'data-career-source-language')}</label>
        <label class="field">CV or experience notes / 简历或经历<textarea data-career-source rows="6" maxlength="24000" placeholder="例如：2022–2025，在深圳一家软件公司担任产品设计师。\n使用 Figma 为一个移动应用设计了注册流程。">${esc(data.source)}</textarea></label>
        <div class="career-actions"><button class="btn btn-primary" data-career="extract">Review as facts</button><label class="btn btn-outline career-upload">Import .txt<input type="file" data-career-file accept=".txt,text/plain"></label><button class="text-btn" data-career="sample">Load bilingual example</button></div>
        <small class="career-help">Text stays local. Paste text from a PDF or Word CV. Sample facts are fictional and start unapproved.</small>
      </section>
      <section class="panel"><div class="section-heading"><h2>Fact review / 确认事实</h2><span class="tag mint" id="career-fact-count">${count} / ${data.facts.length} approved</span></div><p>Only checked facts go into a draft. Edit any wording to remove its approval. Add translated wording yourself, or use AI after approving the source.</p>
      ${data.facts.length ? data.facts.map((f, index) => `<article class="career-fact" data-fact="${esc(f.id)}"><div class="career-fact-top"><strong>Fact ${index + 1}</strong><label class="sr-only" for="kind-${esc(f.id)}">Category for fact ${index + 1}</label><select id="kind-${esc(f.id)}" data-fact-kind>${FACT_KINDS.map(kind => `<option value="${kind}" ${f.kind === kind ? 'selected' : ''}>${label[kind]}</option>`).join('')}</select><button class="text-btn" data-career="remove-fact" data-id="${esc(f.id)}">Remove</button></div>
        <label class="field">${LANGUAGES[data.sourceLanguage] || 'Original wording'}<textarea data-fact-text="${Object.hasOwn(LANGUAGES, data.sourceLanguage) ? data.sourceLanguage : 'en'}" rows="2" maxlength="1200">${esc(f[data.sourceLanguage] || '')}</textarea></label>
        <details><summary>Other languages / 其他语言（optional）</summary>${Object.entries(LANGUAGES).filter(([l]) => l !== data.sourceLanguage).map(([l, name]) => `<label class="field">${name}<textarea data-fact-text="${l}" rows="2" maxlength="1200">${esc(f[l])}</textarea></label>`).join('')}</details>
        <label class="check-field"><input type="checkbox" data-fact-approved ${f.approved ? 'checked' : ''}><span>I confirm all wording entered for this fact is accurate. / 我确认这条事实及其译文准确。</span></label></article>`).join('') : '<div class="career-empty">Your facts will appear here for review. Nothing is approved automatically.</div>'}
      <button class="text-btn" data-career="add-fact">+ Add a fact / 添加事实</button></section>
      </div><div>
      <section class="panel"><h2>Make it relevant / 按职位定制</h2><p>A clear CV connects your evidence to a role. It never turns a missing requirement into a claim.</p>
        <label class="field">Task<select data-cv="task"><option value="tailor" ${data.cv.task === 'tailor' ? 'selected' : ''}>Tailor to a company JD / 定制简历</option><option value="translate" ${data.cv.task === 'translate' ? 'selected' : ''}>Translate only / 仅翻译，保留全部事实</option></select></label>
        <label class="field">Use a sample JD (optional)<select data-career-job><option value="">Choose a role…</option>${jobs.map(j => `<option value="${esc(j.id)}">${esc(j.title)} · ${esc(j.company)}</option>`).join('')}</select></label>
        <div class="form-grid"><label class="field">Company / 公司<input data-cv="company" maxlength="120" value="${esc(data.cv.company)}"></label><label class="field">Role / 职位<input data-cv="role" maxlength="120" value="${esc(data.cv.role)}"></label></div>
        <label class="field">Job description / 职位描述<textarea data-cv="jd" maxlength="10000" rows="6" placeholder="Paste the actual JD here. For translation only, leave it blank.">${esc(data.cv.jd)}</textarea></label>
        <label class="field">Output language / 输出语言${languages(data.cv.language, 'data-cv="language"')}</label>
        <label class="field">Drafting mode<select data-cv="engine"><option value="local" ${data.cv.engine === 'local' ? 'selected' : ''}>Local · exact approved wording</option><option value="ai" ${data.cv.engine === 'ai' ? 'selected' : ''} ${!status?.configured ? 'disabled' : ''}>AI · tailor and translate</option></select></label>
        <p class="career-help">Local mode organizes existing wording. New Chinese–English translations and AI rewriting need the server’s AI connection.</p>${aiConsent('cv-ai-consent')}
        <button class="btn btn-primary full" data-career="generate" ${busy || !count ? 'disabled' : ''}>${busy ? 'Preparing your draft…' : 'Create review draft / 生成待审阅版本'}</button>
      </section>
      <section class="panel"><div class="section-heading"><h2>Your versions / 简历版本</h2><span class="tag">${data.drafts.length} / 12</span></div>
        ${data.drafts.length ? `<label class="field">Saved version<select data-career-draft>${data.drafts.map(d => `<option value="${esc(d.id)}" ${d.id === draft?.id ? 'selected' : ''}>${esc(d.company || 'Translation')} · ${esc(d.role || LANGUAGES[d.language])} · ${esc(LANGUAGES[d.language])}</option>`).join('')}</select></label>` : '<p>Keep separate versions for different companies. Approving a draft never submits it.</p>'}
        ${draft ? draftEditor(draft) + `<button class="text-btn" data-career="delete-draft" data-id="${esc(draft.id)}" style="margin-top:18px">Delete this saved version</button>` : ''}
      </section></div></div>`;
  }
  function draftEditor(d) {
    const stale = !draftCurrent(d);
    return `<div class="career-status"><span data-draft-status class="tag ${d.approved && !stale ? 'mint' : ''}">${stale ? 'Facts changed · regenerate before export' : d.approved ? 'Candidate approved' : 'Needs candidate review'}</span><small>${d.mode === 'ai' ? 'AI proposal' : 'Local draft'}</small></div>
      <p class="career-help">Check every line against its source. Editing the draft clears final approval. Source references help review; they are not independent verification.</p>
      ${d.sections.map((section, s) => `<div class="career-draft-section"><h3>${esc(section.heading)}</h3>${section.items.map((item, i) => `<label class="field">Draft wording<textarea rows="3" maxlength="1800" data-draft-section="${s}" data-draft-item="${i}" data-draft-id="${esc(d.id)}">${esc(item.text)}</textarea><small>Source: ${item.factIds.map(id => { const f = data.facts.find(f => f.id === id); return f ? esc(f[data.sourceLanguage] || f.en || f.zh || f.tw) : 'Fact removed'; }).join(' · ')}</small></label>`).join('')}</div>`).join('')}
      ${d.gaps.length ? `<details open><summary>Questions & gaps / 待确认信息</summary><ul class="career-gaps">${d.gaps.map(g => `<li>${esc(g)}</li>`).join('')}</ul><p class="career-help">These questions are not included in the exported CV.</p></details>` : ''}
      <label class="check-field"><input type="checkbox" data-draft-approve="${esc(d.id)}" ${d.approved && !stale ? 'checked' : ''} ${stale ? 'disabled' : ''}><span>I have checked this version against my facts, including dates, numbers and translation. It is accurate. / 我已核对并确认此版本准确。</span></label>
      <div class="career-actions"><button class="btn btn-primary" data-career="export-cv" data-id="${esc(d.id)}" ${!d.approved || stale ? 'disabled' : ''}>Download CV (.txt)</button><button class="btn btn-outline" data-career="print-cv" data-id="${esc(d.id)}" ${!d.approved || stale ? 'disabled' : ''}>Print / Save PDF</button></div>`;
  }
  function profileCard(p, language, preview = false) {
    const locale = p.locales[language] || Object.values(p.locales)[0];
    return `<article class="public-talent-card" lang="${language === 'zh' ? 'zh-Hans' : language === 'tw' ? 'zh-Hant' : 'en'}"><div class="public-talent-cover"><span class="tag">${preview ? 'PRIVATE PREVIEW' : 'OPEN TO A CONVERSATION'}</span><span>across.</span></div><div class="public-talent-body"><div class="public-avatar">${esc(p.name.slice(0, 1))}</div><h1>${esc(p.name)}</h1><p class="public-headline">${esc(locale.headline)}</p>${p.city ? `<p class="muted">${esc(p.city)}</p>` : ''}<h2>${language === 'en' ? 'A little about me' : language === 'zh' ? '关于我' : '關於我'}</h2><p class="public-about">${esc(locale.about)}</p>${p.skills ? `<h2>${language === 'en' ? 'Skills & interests' : '技能与方向'}</h2><p>${esc(p.skills)}</p>` : ''}${p.contact ? `<section class="public-contact"><h2>${language === 'en' ? 'Let’s connect' : '欢迎联系'}</h2><p>${esc(p.contact)}</p><small>${language === 'en' ? 'Contact me to discuss the role and request a tailored CV.' : '欢迎先沟通职位，再索取定制简历。'}</small></section>` : '<section class="public-contact"><p>Contact details were not included. Ask the person who shared this profile to connect you.</p></section>'}<p class="career-help">Candidate-provided profile · not verified by Across · available until ${esc(new Date(p.expiresAt).toISOString().slice(0, 10))}</p></div></article>`;
  }
  function selectedProfile(strict = false) {
    const t = data.talent;
    const locales = Object.fromEntries(Object.entries(t.locales).filter(([, l]) => !strict || l.approved).filter(([, l]) => l.headline.trim()).map(([lang, l]) => [lang, { headline: l.headline, about: l.about }]));
    return { version: 1, name: t.name.trim(), city: t.showCity ? t.city.trim() : '', skills: t.showSkills ? t.skills.trim() : '', contact: t.showContact ? t.contact.trim() : '', locales, expiresAt: Date.now() + Number(t.expiry) * 86400000 };
  }
  function talentProfilePage() {
    const t = data.talent, lang = t.selectedLanguage, l = t.locales[lang];
    const preview = selectedProfile();
    return `${header('YOUR STORY, BEFORE YOUR CV', 'Multilingual talent profile', 'Introduce yourself in English and Chinese. Share a short profile first; send a tailored CV when a conversation becomes relevant.')}
      <div class="career-status">${aiStatus()}<span>Private until you create and share a snapshot link</span></div>${message()}
      <div class="career-workbench"><div><section class="panel"><h2>Your public introduction / 公开介绍</h2><p>Choose what employers can see. Your private CV, source facts, email and work-status answers are never added automatically.</p>
        <label class="field">Display name / 显示名称<input maxlength="80" data-talent="name" value="${esc(t.name)}"></label>
        <div class="form-grid"><label class="field">City / 城市<input data-talent="city" maxlength="80" value="${esc(t.city)}"></label><label class="field">Skills & interests / 技能与方向<input data-talent="skills" maxlength="400" value="${esc(t.skills)}"></label></div>
        <label class="field">How employers can contact you (optional)<input data-talent="contact" maxlength="200" value="${esc(t.contact)}" placeholder="A professional email, WeChat ID or portfolio address you want public"></label>
        <div class="career-actions"><button class="text-btn" data-career="profile-from-candidate">Use my display name and headline</button><button class="text-btn" data-career="sample-profile">Load trilingual example</button></div>
      </section><section class="panel"><h2>Language versions / 多语言版本</h2><label class="field">Editing language${languages(lang, 'data-profile-language')}</label>
        <label class="field">Professional headline / 职业介绍<input data-profile-text="headline" maxlength="160" value="${esc(l.headline)}"></label>
        <label class="field">About you / 自我介绍<textarea data-profile-text="about" maxlength="1200" rows="6" placeholder="What do you enjoy working on? What opportunities would you like to discuss?">${esc(l.about)}</textarea></label>
        <label class="check-field"><input type="checkbox" data-profile-approved ${l.approved ? 'checked' : ''}><span>I approve the ${LANGUAGES[lang]} wording for public sharing. / 我确认此语言版本可公开分享。</span></label>
        <p class="career-help">${Object.entries(t.locales).map(([key, value]) => `${LANGUAGES[key]}: ${value.approved ? 'approved' : 'needs review'}`).join(' · ')}</p>
        ${aiConsent('profile-ai-consent')}<button class="btn btn-outline" data-career="translate-profile" ${busy || !status?.configured ? 'disabled' : ''}>${busy ? 'Translating…' : 'Draft all three languages with AI'}</button><p class="career-help">Only this language’s headline and introduction are sent for translation. Every generated version starts unapproved. Manual editing works without AI.</p>
      </section><section class="panel"><h2>Choose what to share / 选择公开内容</h2>
        ${[['showCity', 'Include city'], ['showSkills', 'Include skills & interests'], ['showContact', 'Include my contact method']].map(([key, text]) => `<label class="check-field"><input type="checkbox" data-talent-toggle="${key}" ${t[key] ? 'checked' : ''}><span>${text}</span></label>`).join('')}
        <label class="field">Link expiry<select data-talent="expiry">${['7', '30', '90'].map(days => `<option value="${days}" ${t.expiry === days ? 'selected' : ''}>${days} days</option>`).join('')}</select></label>
        <p class="career-help">A snapshot link contains the selected public text. Anyone with it can read and copy it. It cannot be revoked or updated; later edits need a new link. Expiry is checked by this viewer, not a way to delete copies. Localhost links work only on this computer; sharing with others needs the app on a reachable host.</p>
        <button class="btn btn-primary full" data-career="review-share">Review public snapshot</button>
        ${reviewSnapshot ? `<div class="career-share-review"><h3>Exact public snapshot</h3>${profileCard(reviewSnapshot,Object.keys(reviewSnapshot.locales)[0],true)}<p>Languages: ${Object.keys(reviewSnapshot.locales).map(l => LANGUAGES[l]).join(' · ')}</p><p>Includes: display name, approved language versions${reviewSnapshot.city ? ', city' : ''}${reviewSnapshot.skills ? ', skills' : ''}${reviewSnapshot.contact ? ', contact method' : ''}.</p><label class="check-field"><input id="public-share-consent" type="checkbox"><span>I reviewed the preview and approve making exactly this information readable to anyone with the link.</span></label><button class="btn btn-primary" data-career="create-link">Create share link</button></div>` : ''}
        <div id="career-share-result" aria-live="polite"></div>
      </section></div><div class="career-profile-preview"><h2>Live preview / 预览</h2>${preview.name && Object.keys(preview.locales).length ? profileCard(preview, lang, true) : '<div class="panel career-empty">Add a display name and a headline to preview your profile.</div>'}<p class="career-help">This preview can include unapproved edits. Only approved language versions go into the reviewed share snapshot.</p></div></div>`;
  }
  function publicPage() {
    if (!publicProfile) return `<section class="panel"><h1>Profile unavailable</h1><p>${esc(error || 'This link is invalid or has expired.')}</p><button class="btn btn-outline" data-view="tools">Open Across</button></section>`;
    const active = publicProfile.locales[publicLanguage] ? publicLanguage : Object.keys(publicProfile.locales)[0];
    return `<div class="public-talent-page"><header><a href="#discover" class="brand">across.</a><label class="field">Profile language<select data-public-language>${Object.keys(publicProfile.locales).map(l => `<option value="${l}" ${l === active ? 'selected' : ''}>${LANGUAGES[l]}</option>`).join('')}</select></label></header>${profileCard(publicProfile, active)}<p class="career-help">This is a self-contained snapshot supplied by the candidate. Across has no employer messaging or document-request inbox.</p></div>`;
  }
  function open(view) {
    error = ''; closeModal(); navigate(view);
    if (status === null) fetch('/api/ai/status').then(r => r.ok ? r.json() : { configured: false }).then(s => { status = s; if (['cv', 'talent-profile'].includes(getView())) repaint(); }).catch(() => { status = { configured: false }; if (['cv', 'talent-profile'].includes(getView())) repaint(); });
  }
  function openShared(token) {
    error = ''; publicProfile = null; publicToken = token;
    try { publicProfile = decodeProfile(token); publicLanguage = Object.keys(publicProfile.locales)[0]; } catch (e) { error = e.message; }
    closeModal(); navigate('shared-profile');
    history.replaceState(null, '', `#profile=${publicToken}`);
  }
  function invalidateProfile() { reviewSnapshot = null; }
  async function requestApi(endpoint, payload) {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(70000) });
    let result; try { result = await response.json(); } catch { throw new Error('The AI endpoint is unavailable. Run the Node server or use local mode.'); }
    if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
    return result;
  }
  async function action(button) {
    const op = button.dataset.career;
    error = '';
    if (busy && ['generate', 'translate-profile'].includes(op)) return;
    try {
      if (op === 'extract') { if (data.facts.length && !confirm('Replace the current fact list with these notes? Existing drafts will need to be regenerated.')) return; data.facts = splitFacts(data.source, data.sourceLanguage); clearApprovals(); }
      if (op === 'sample') { if (data.facts.length && !confirm('Replace the current fact list with fictional sample facts?')) return; data.sourceLanguage = 'zh'; data.facts = clone(SAMPLE_FACTS); data.source = SAMPLE_FACTS.map(f => f.zh).join('\n'); clearApprovals(); }
      if (op === 'add-fact') { if (data.facts.length >= 40) throw new Error('Use up to 40 facts.'); data.facts.push({ id: crypto.randomUUID(), kind: 'experience', en: '', zh: '', tw: '', approved: false }); clearApprovals(); }
      if (op === 'remove-fact') { data.facts = data.facts.filter(f => f.id !== button.dataset.id); clearApprovals(); }
      if (op === 'generate') {
        const facts = clone(data.facts.filter(f => f.approved));
        const request = { ...data.cv, facts };
        const revision = factRevision();
        const identity = { name: getCandidate().name, headline: '' };
        const consent = !!document.querySelector('#cv-ai-consent')?.checked;
        if (request.engine === 'ai' && !consent) throw new Error('Approve sending the selected facts and JD to OpenAI first.');
        if (data.drafts.length >= 12) throw new Error('You have 12 versions. Delete a saved version after exporting it, then create another draft.');
        busy = true; repaint();
        try {
          const result = request.engine === 'ai' ? await requestApi('/api/cv/generate', { ...request, consent }) : localCv(request);
          const validated = validateCvOutput(result, request);
          if (factRevision() !== revision) throw new Error('Your facts changed while the draft was being created. Please generate again.');
          const draft = { ...validated, mode: result.mode, id: crypto.randomUUID(), language: request.language, company: request.company, role: request.role, revision, identity, approved: false };
          data.drafts.unshift(draft); selectedDraft = draft.id;
          toast('Draft ready. Review it before approving export.');
        } finally { busy = false; }
      }
      if (op === 'delete-draft') { if (!confirm('Delete this saved CV version from this browser?')) return; data.drafts = data.drafts.filter(d => d.id !== button.dataset.id); selectedDraft = data.drafts[0]?.id; }
      if (op === 'export-cv' || op === 'print-cv') {
        const draft = data.drafts.find(d => d.id === button.dataset.id);
        if (!draft?.approved || !draftCurrent(draft)) throw new Error('Review and approve a current draft first.');
        const text = cvAsText(draft, draft.identity);
        if (op === 'export-cv') download(text, `CV-${(draft.company || 'translated').replace(/[^a-zA-Z0-9_-]/g, '_')}-${draft.language}.txt`);
        else {
          let print = document.querySelector('#career-print');
          if (!print) { print = document.createElement('pre'); print.id = 'career-print'; document.body.append(print); }
          print.textContent = text; document.body.classList.add('career-printing'); window.print(); document.body.classList.remove('career-printing');
        }
        return;
      }
      if (op === 'profile-from-candidate') { const p = getCandidate(); data.talent.name = p.name; const l = data.talent.selectedLanguage; data.talent.locales[l].headline = p.headline; data.talent.locales[l].approved = false; invalidateProfile(); }
      if (op === 'sample-profile') {
        if (data.talent.name && !confirm('Replace the profile editor with a fictional example?')) return;
        data.talent = { ...initial().talent, name: 'Alex Chen', city: 'Shenzhen ↔ Hong Kong', skills: 'Figma · Research · Prototyping', contact: 'alex.chen@example.com', locales: {
          en: { headline: 'Product designer exploring cross-border teams', about: 'I enjoy turning research into clear, thoughtful digital experiences. I am interested in product design opportunities in Hong Kong and Shenzhen. Let’s talk about your team before I share a tailored CV.', approved: false },
          zh: { headline: '产品设计师，期待加入跨境团队', about: '我喜欢将研究转化为清晰、细致的数字体验，正在了解香港和深圳的产品设计机会。欢迎先聊聊团队和职位，再分享定制简历。', approved: false },
          tw: { headline: '產品設計師，期待加入跨境團隊', about: '我喜歡將研究轉化為清晰、細緻的數位體驗，正在了解香港和深圳的產品設計機會。歡迎先聊聊團隊和職位，再分享量身調整的履歷。', approved: false }
        } }; invalidateProfile();
      }
      if (op === 'translate-profile') {
        const language = data.talent.selectedLanguage, locale = clone(data.talent.locales[language]);
        if (!locale.approved) throw new Error('Approve the source wording before requesting translations.');
        const consent = !!document.querySelector('#profile-ai-consent')?.checked;
        if (!consent) throw new Error('Approve sending the selected profile text to OpenAI first.');
        const before = JSON.stringify(data.talent.locales);
        busy = true; repaint();
        try {
          const result = await requestApi('/api/profile/translate', { ...locale, language, consent });
          if (before !== JSON.stringify(data.talent.locales)) throw new Error('Profile text changed during translation. Please retry.');
          data.talent.locales = Object.fromEntries(Object.entries(result.locales).map(([l, text]) => [l, { ...text, approved: false }])); invalidateProfile();
        } finally { busy = false; }
      }
      if (op === 'review-share') { reviewSnapshot = null; const snapshot = selectedProfile(true); encodeProfile(snapshot); reviewSnapshot = snapshot; }
      if (op === 'create-link') {
        if (!reviewSnapshot || !document.querySelector('#public-share-consent')?.checked) throw new Error('Review the snapshot and approve public sharing first.');
        const token = encodeProfile(reviewSnapshot);
        const link = `${location.origin}${location.pathname}#profile=${token}`;
        const result = document.querySelector('#career-share-result');
        result.innerHTML = `<label class="field">Share link<input readonly id="career-share-link" value="${esc(link)}"></label><div class="career-actions"><button class="btn btn-outline" data-career="copy-share">Copy link</button><a class="btn btn-primary" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Open shared profile</a><button class="text-btn" data-career="download-profile">Download profile link (.html)</button></div><p class="career-help">This link includes only the snapshot you approved. Sending it to someone is a separate action.</p>`;
        return;
      }
      if (op === 'copy-share') { const input = document.querySelector('#career-share-link'); try { await navigator.clipboard.writeText(input.value); toast('Profile link copied'); } catch { input.select(); toast('Select and copy the link above.'); } return; }
      if (op === 'download-profile') { const link = document.querySelector('#career-share-link')?.value; if (link) download(`<!doctype html><meta charset="utf-8"><title>Across profile link</title><p><a href="${esc(link)}">Open the candidate-approved Across profile</a></p><p>This file links to a snapshot. The app must be available at that address.</p>`, 'across-profile-link.html', 'text/html;charset=utf-8'); return; }
      if (op === 'clear') { if (!confirm('Clear your CV facts, drafts and public-profile editor in this browser? Shared snapshot copies cannot be recalled.')) return; data = initial(); selectedDraft = null; reviewSnapshot = null; }
      persist(); repaint();
    } catch (e) { busy = false; error = e.message; repaint(); }
  }
  document.addEventListener('click', e => { const button = e.target.closest('[data-career]'); if (button) { e.preventDefault(); void action(button); } });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.matches('[data-career-source]')) { data.source = el.value; persist(); }
    if (el.matches('[data-fact-text]')) {
      const f = data.facts.find(f => f.id === el.closest('[data-fact]').dataset.fact);
      f[el.dataset.factText] = el.value; f.approved = false; clearApprovals();
      el.closest('[data-fact]').querySelector('[data-fact-approved]').checked = false;
      // Invalidate visible exports immediately, while preserving the input's cursor.
      document.querySelectorAll('[data-draft-approve]').forEach(input => { input.checked = false; input.disabled = true; });
      document.querySelectorAll('[data-career="export-cv"],[data-career="print-cv"]').forEach(button => { button.disabled = true; });
      const count = data.facts.filter(f => f.approved).length;
      const badge = document.querySelector('#career-fact-count'); if (badge) badge.textContent = `${count} / ${data.facts.length} approved`;
      const generate = document.querySelector('[data-career="generate"]'); if (generate) generate.disabled = busy || !count;
      document.querySelectorAll('[data-draft-status]').forEach(tag => { tag.textContent = 'Facts changed · regenerate before export'; });
      persist();
    }
    if (el.matches('[data-cv]')) { data.cv[el.dataset.cv] = el.value; persist(); }
    if (el.matches('[data-draft-id]')) {
      const d = data.drafts.find(d => d.id === el.dataset.draftId); d.sections[Number(el.dataset.draftSection)].items[Number(el.dataset.draftItem)].text = el.value; d.approved = false;
      const approve = document.querySelector(`[data-draft-approve="${d.id}"]`); if (approve) approve.checked = false;
      document.querySelectorAll('[data-draft-status]').forEach(tag => { tag.textContent = 'Needs candidate review'; });
      document.querySelectorAll('[data-career="export-cv"],[data-career="print-cv"]').forEach(b => { b.disabled = true; }); persist();
    }
    if (el.matches('[data-talent]')) { data.talent[el.dataset.talent] = el.value; invalidateProfile(); document.querySelector('.career-share-review')?.remove(); document.querySelector('#career-share-result')?.replaceChildren(); persist(); }
    if (el.matches('[data-profile-text]')) { const locale = data.talent.locales[data.talent.selectedLanguage]; locale[el.dataset.profileText] = el.value; locale.approved = false; invalidateProfile(); const check = document.querySelector('[data-profile-approved]'); if (check) check.checked = false; document.querySelector('.career-share-review')?.remove(); document.querySelector('#career-share-result')?.replaceChildren(); persist(); }
  });
  document.addEventListener('change', async e => {
    const el = e.target;
    if (el.matches('[data-career-file]')) {
      try { const file = el.files[0]; if (!file) return; if (!file.name.toLowerCase().endsWith('.txt') || file.size > 100000) throw new Error('Choose a .txt file under 100 KB.'); data.source = await file.text(); if (data.source.length > 24000) throw new Error('Use up to 24,000 characters.'); persist(); error = ''; repaint(); } catch (e) { error = e.message; repaint(); } return;
    }
    if (el.matches('[data-career-source-language]')) { data.sourceLanguage = el.value; persist(); repaint(); }
    if (el.matches('[data-fact-kind],[data-fact-approved]')) {
      const f = data.facts.find(f => f.id === el.closest('[data-fact]').dataset.fact);
      if (el.matches('[data-fact-kind]')) { f.kind = el.value; f.approved = false; } else { f.approved = el.checked && !!(f.en || f.zh || f.tw).trim(); }
      clearApprovals(); persist(); repaint();
    }
    if (el.matches('[data-cv]')) { data.cv[el.dataset.cv] = el.value; persist(); }
    if (el.matches('[data-career-job]') && el.value) { const j = jobs.find(j => j.id === el.value); data.cv = { ...data.cv, company: j.company, role: j.title, jd: [j.summary, ...j.requirements].join('\n') }; persist(); repaint(); }
    if (el.matches('[data-career-draft]')) { selectedDraft = el.value; repaint(); }
    if (el.matches('[data-draft-approve]')) { const d = data.drafts.find(d => d.id === el.dataset.draftApprove); if (d && draftCurrent(d)) { try { if(el.checked) validateCvOutput(d,{task:'translate',language:d.language,company:d.company,role:d.role,jd:'',facts:data.facts.filter(f=>f.approved)}); d.approved=el.checked; error=''; } catch(e) { d.approved=false; error=e.message+' Add any new facts to the fact list and regenerate.'; } persist(); repaint(); } }
    if (el.matches('[data-profile-language]')) { data.talent.selectedLanguage = el.value; persist(); repaint(); }
    if (el.matches('[data-profile-approved]')) { const l = data.talent.locales[data.talent.selectedLanguage]; l.approved = el.checked && !!l.headline.trim(); invalidateProfile(); persist(); repaint(); }
    if (el.matches('[data-talent-toggle]')) { data.talent[el.dataset.talentToggle] = el.checked; invalidateProfile(); persist(); repaint(); }
    if (el.matches('[data-talent],[data-profile-text]')) { persist(); repaint(); }
    if (el.matches('[data-public-language]')) { publicLanguage = el.value; repaint(); }
  });
  return { cvPage, talentProfilePage, publicPage, open, openShared, clear: () => { data = initial(); reviewSnapshot = null; persist(); } };
}
