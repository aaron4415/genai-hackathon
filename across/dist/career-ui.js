import { careerText, languageName, localizeKnownText, localizeCareerError } from './career-i18n.js';
import { LANGUAGES, FACT_KINDS, SAMPLE_FACTS, splitFacts, localCv, validateCvOutput, encodeProfile, decodeProfile, cvAsText } from './career-core.js';

const STORAGE = 'across-career-v1';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

export function createCareerWorkspace({ navigate, refresh, getView, getCandidate, getLanguage = () => 'en', getJobTitle = j => j.title, jobs, toast, closeModal }) {
  let data = restore(), status = null, error = '', busy = false, selectedDraft = data.drafts[0]?.id, publicLanguage = 'en', publicToken = '', publicProfile = null;
  let reviewSnapshot = null;
  let previewLanguage = data.talent.selectedLanguage;
  let generatedShareLink = '';
  const tr = (key, params) => careerText(key,getLanguage(),params);
  const langName = language => languageName(language,getLanguage());
  const persist = () => { try { localStorage.setItem(STORAGE, JSON.stringify(data)); return true; } catch { toast(tr('storageError')); return false; } };
  const repaint = () => { refresh(); };
  const clearApprovals = () => { data.drafts.forEach(d => { d.approved = false; }); reviewSnapshot = null; };
  const languages = (selected, extra = '') => `<select ${extra}>${Object.entries(LANGUAGES).map(([l]) => `<option value="${l}" ${l === selected ? 'selected' : ''}>${langName(l)}</option>`).join('')}</select>`;
  const header = (eyebrow, title, description) => `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div><button class="btn btn-outline" data-view="tools">${tr('back')}</button></div>`;
  const message = () => error ? `<div class="career-error" role="alert">${esc(localizeCareerError(error,getLanguage()))}</div>` : '';
  const aiStatus = () => `<span class="tag ${status?.configured ? 'mint' : ''}">${status === null ? tr('aiChecking') : status.configured ? tr('aiConfigured') : tr('aiLocal')}</span>`;
  const aiConsent = id => `<label class="check-field"><input id="${id}" type="checkbox" ${!status?.configured ? 'disabled' : ''}><span>${tr('aiConsent')}</span></label>`;
  const factRevision = () => JSON.stringify(data.facts);
  function draftCurrent(draft) { return draft?.revision === factRevision(); }
  function cvPage() {
    const count = data.facts.filter(f => f.approved).length;
    const draft = data.drafts.find(d => d.id === selectedDraft) || data.drafts[0];
    return `${header(tr('cvEyebrow'), tr('cvTitle'), tr('cvDescription'))}
      <div class="career-status">${aiStatus()}<span>${tr('privateWorkspace')}</span></div>${message()}
      <div class="career-steps"><span>${tr('step1')}</span><span>${tr('step2')}</span><span>${tr('step3')}</span><span>${tr('step4')}</span></div>
      <div class="career-workbench"><div>
      <section class="panel"><h2>${tr('startTitle')}</h2><p>${tr('startHelp')}</p>
        <label class="field">${tr('sourceLanguage')}${languages(data.sourceLanguage, 'data-career-source-language')}</label>
        <label class="field">${tr('sourceNotes')}<textarea data-career-source rows="6" maxlength="24000" placeholder="${esc(tr('notesPlaceholder'))}">${esc(data.source)}</textarea></label>
        <div class="career-actions"><button class="btn btn-primary" data-career="extract">${tr('reviewFacts')}</button><label class="btn btn-outline career-upload">${tr('importText')}<input type="file" data-career-file accept=".txt,text/plain"></label><button class="text-btn" data-career="sample">${tr('loadFacts')}</button></div>
        <small class="career-help">${tr('importHelp')}</small><p class="career-demo-note">${tr('cvDemoHelp')}</p>
      </section>
      <section class="panel"><div class="section-heading"><h2>${tr('factsTitle')}</h2><span class="tag mint" id="career-fact-count">${tr('approvedCount',{count,total:data.facts.length})}</span></div><p>${tr('factHelp')}</p>
      ${data.facts.length ? data.facts.map((f, index) => `<article class="career-fact" data-fact="${esc(f.id)}"><div class="career-fact-top"><strong>${tr('factNumber',{number:index+1})}</strong><label class="sr-only" for="kind-${esc(f.id)}">${tr('factCategory',{number:index+1})}</label><select id="kind-${esc(f.id)}" data-fact-kind>${FACT_KINDS.map(kind => `<option value="${kind}" ${f.kind === kind ? 'selected' : ''}>${tr(kind)}</option>`).join('')}</select><button class="text-btn" data-career="remove-fact" data-id="${esc(f.id)}">${tr('remove')}</button></div>
        <label class="field">${langName(data.sourceLanguage)}<textarea data-fact-text="${Object.hasOwn(LANGUAGES, data.sourceLanguage) ? data.sourceLanguage : 'en'}" rows="2" maxlength="1200">${esc(f[data.sourceLanguage] || '')}</textarea></label>
        <details><summary>${tr('otherLanguages')}</summary>${Object.entries(LANGUAGES).filter(([l]) => l !== data.sourceLanguage).map(([l, name]) => `<label class="field">${langName(l)}<textarea data-fact-text="${l}" rows="2" maxlength="1200">${esc(f[l])}</textarea></label>`).join('')}</details>
        <label class="check-field"><input type="checkbox" data-fact-approved ${f.approved ? 'checked' : ''}><span>${tr('factConsent')}</span></label></article>`).join('') : `<div class="career-empty">${tr('emptyFacts')}</div>`}
      <button class="text-btn" data-career="add-fact">${tr('addFact')}</button></section>
      </div><div>
      <section class="panel"><h2>${tr('tailorTitle')}</h2><p>${tr('tailorHelp')}</p>
        <label class="field">${tr('task')}<select data-cv="task"><option value="tailor" ${data.cv.task === 'tailor' ? 'selected' : ''}>${tr('tailorTask')}</option><option value="translate" ${data.cv.task === 'translate' ? 'selected' : ''}>${tr('translateTask')}</option></select></label>
        <label class="field">${tr('sampleJd')}<select data-career-job><option value="">${tr('chooseRole')}</option>${jobs.map(j => `<option value="${esc(j.id)}" ${j.company === data.cv.company && (j.title === data.cv.role || getJobTitle(j) === data.cv.role) ? 'selected' : ''}>${esc(getJobTitle(j))} · ${esc(j.company)}</option>`).join('')}</select></label>
        <div class="form-grid"><label class="field">${tr('company')}<input data-cv="company" maxlength="120" value="${esc(data.cv.company)}"></label><label class="field">${tr('role')}<input data-cv="role" maxlength="120" value="${esc(data.cv.role)}"></label></div>
        <label class="field">${tr('jd')}<textarea data-cv="jd" maxlength="10000" rows="6" placeholder="${esc(tr('jdPlaceholder'))}">${esc(data.cv.jd)}</textarea></label>
        <label class="field">${tr('outputLanguage')}${languages(data.cv.language, 'data-cv="language"')}</label>
        <label class="field">${tr('draftingMode')}<select data-cv="engine"><option value="local" ${data.cv.engine === 'local' ? 'selected' : ''}>${tr('localMode')}</option><option value="ai" ${data.cv.engine === 'ai' ? 'selected' : ''} ${!status?.configured ? 'disabled' : ''}>${tr('aiMode')}</option></select></label>
        <p class="career-help">${tr('localHelp')}</p>${aiConsent('cv-ai-consent')}
        <button class="btn btn-primary full" data-career="generate" ${busy || !count ? 'disabled' : ''}>${busy ? tr('preparing') : tr('createDraft')}</button>
      </section>
      <section class="panel"><div class="section-heading"><h2>${tr('versions')}</h2><span class="tag">${data.drafts.length} / 12</span></div>
        ${data.drafts.length ? `<label class="field">${tr('savedVersion')}<select data-career-draft>${data.drafts.map(d => `<option value="${esc(d.id)}" ${d.id === draft?.id ? 'selected' : ''}>${esc(d.company || tr('translation'))} · ${esc(d.role || langName(d.language))} · ${esc(langName(d.language))}</option>`).join('')}</select></label>` : `<p>${tr('versionsHelp')}</p>`}
        ${draft ? draftEditor(draft) + `<button class="text-btn" data-career="delete-draft" data-id="${esc(draft.id)}" style="margin-top:18px">${tr('deleteVersion')}</button>` : ''}
      </section></div></div>`;
  }
  function draftEditor(d) {
    const stale = !draftCurrent(d);
    return `<div class="career-status"><span data-draft-status class="tag ${d.approved && !stale ? 'mint' : ''}">${stale ? tr('staleDraft') : d.approved ? tr('candidateApproved') : tr('needsReview')}</span><small>${d.mode === 'ai' ? tr('aiProposal') : tr('localDraft')}</small></div>
      <p class="career-help">${tr('draftReviewHelp')}</p>
      ${d.sections.map((section, s) => `<div class="career-draft-section"><h3>${esc(section.heading)}</h3>${section.items.map((item, i) => `<label class="field">${tr('draftWording')}<textarea rows="3" maxlength="1800" data-draft-section="${s}" data-draft-item="${i}" data-draft-id="${esc(d.id)}">${esc(item.text)}</textarea><small>${tr('source')} ${item.factIds.map(id => { const f = data.facts.find(f => f.id === id); return f ? esc(f[data.sourceLanguage] || f.en || f.zh || f.tw) : tr('factRemoved'); }).join(' · ')}</small></label>`).join('')}</div>`).join('')}
      ${d.gaps.length ? `<details open><summary>${tr('questions')}</summary><ul class="career-gaps">${d.gaps.map(g => `<li>${esc(localizeKnownText(g,getLanguage()))}</li>`).join('')}</ul><p class="career-help">${tr('gapsHelp')}</p></details>` : ''}
      <label class="check-field"><input type="checkbox" data-draft-approve="${esc(d.id)}" ${d.approved && !stale ? 'checked' : ''} ${stale ? 'disabled' : ''}><span>${tr('finalConsent')}</span></label>
      <div class="career-actions"><button class="btn btn-primary" data-career="export-cv" data-id="${esc(d.id)}" ${!d.approved || stale ? 'disabled' : ''}>${tr('downloadCv')}</button><button class="btn btn-outline" data-career="print-cv" data-id="${esc(d.id)}" ${!d.approved || stale ? 'disabled' : ''}>${tr('printCv')}</button></div>`;
  }
  function profileCard(p, language, preview = false) {
 const locale=p.locales[language]||Object.values(p.locales)[0];
 const ct=(key,params)=>careerText(key,language,params);
 return `<article class="public-talent-card" lang="${language==='zh'?'zh-Hans':language==='tw'?'zh-Hant':'en'}"><div class="public-talent-cover"><span class="tag">${ct(preview?'privatePreview':'openConversation')}</span><span>across.</span></div><div class="public-talent-body"><div class="public-avatar">${esc(p.name.slice(0,1))}</div><h1>${esc(p.name)}</h1><p class="public-headline">${esc(locale.headline)}</p>${p.city?`<p class="muted">${esc(p.city)}</p>`:''}<h2>${ct('aboutMe')}</h2><p class="public-about">${esc(locale.about)}</p>${p.skills?`<h2>${ct('skillsInterests')}</h2><div class="profile-skill-pills">${p.skills.split(/[,，·]/).map(s=>s.trim()).filter(Boolean).map(s=>`<span>${esc(s)}</span>`).join('')}</div>`:''}${p.contact?`<section class="public-contact"><h2>${ct('connect')}</h2><p>${esc(p.contact)}</p><small>${ct('requestCv')}</small></section>`:`<section class="public-contact"><p>${ct('noContact')}</p></section>`}<p class="career-help">${ct('profileFootnote',{date:esc(new Date(p.expiresAt).toISOString().slice(0,10))})}</p></div></article>`;
  }
  function selectedProfile(strict = false) {
    const t = data.talent;
    const locales = Object.fromEntries(Object.entries(t.locales).filter(([, l]) => !strict || l.approved).filter(([, l]) => l.headline.trim()).map(([lang, l]) => [lang, { headline: l.headline, about: l.about }]));
    return { version: 1, name: t.name.trim(), city: t.showCity ? t.city.trim() : '', skills: t.showSkills ? t.skills.trim() : '', contact: t.showContact ? t.contact.trim() : '', locales, expiresAt: Date.now() + Number(t.expiry) * 86400000 };
  }
  function shareResult(){
    if(!generatedShareLink)return '';
    const link=generatedShareLink;
    return `<label class="field">${tr('shareLink')}<input readonly id="career-share-link" value="${esc(link)}"></label><div class="career-actions"><button class="btn btn-outline" data-career="copy-share">${tr('copyLink')}</button><a class="btn btn-primary" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${tr('openProfile')}</a><button class="text-btn" data-career="download-profile">${tr('downloadLink')}</button></div><p class="career-help">${tr('linkNote')}</p>`;
  }
  function profilePreview() {
    const preview=selectedProfile(), active=data.talent.locales[previewLanguage];
    return `<div class="profile-preview-heading"><div><span class="eyebrow">${tr('previewEyebrow')}</span><h2>${tr('livePreview')}</h2></div><span class="profile-live-dot">${tr('live')}</span></div><div class="profile-language-tabs" role="group" aria-label="${tr('previewLanguage')}">${Object.keys(LANGUAGES).map(l=>`<button data-preview-language="${l}" aria-pressed="${l===previewLanguage}" class="${l===previewLanguage?'active':''}"><span>${langName(l)}</span><i class="${data.talent.locales[l].approved?'approved':''}" aria-label="${tr(data.talent.locales[l].approved?'approved':'pending')}"></i></button>`).join('')}</div><div class="profile-preview-stage">${preview.name&&active?.headline.trim()?profileCard({...preview,locales:{[previewLanguage]:{headline:active.headline,about:active.about}}},previewLanguage,true):`<div class="profile-preview-empty"><span aria-hidden="true">◎</span><h3>${langName(previewLanguage)}</h3><p>${tr('emptyLanguage')}</p><button class="btn btn-outline" data-career="sample-profile">${tr('loadProfile')}</button></div>`}</div><div class="profile-preview-caption"><span>◉ ${tr('previewOnly')}</span><span>${Object.values(data.talent.locales).filter(l=>l.approved).length} / 3 ${tr('approvedLanguages')}</span></div><p class="career-help">${tr('previewHelp')}</p>`;
  }
  function refreshPreview() { const region=document.querySelector('[data-profile-preview]');if(region)region.innerHTML=profilePreview(); }
  function talentProfilePage() {
    const t = data.talent, lang = t.selectedLanguage, l = t.locales[lang];
    return `${header(tr('profileEyebrow'), tr('profileTitle'), tr('profileDescription'))}
      <div class="career-status">${aiStatus()}<span>${tr('privateProfile')}</span></div>${message()}
      <div class="career-workbench profile-workbench"><div><section class="panel"><h2>${tr('introduction')}</h2><p>${tr('introductionHelp')}</p>
        <label class="field">${tr('displayName')}<input maxlength="80" data-talent="name" value="${esc(t.name)}"></label>
        <div class="form-grid"><label class="field">${tr('city')}<input data-talent="city" maxlength="80" value="${esc(t.city)}"></label><label class="field">${tr('skillsInterests')}<input data-talent="skills" maxlength="400" value="${esc(t.skills)}"></label></div>
        <label class="field">${tr('contactMethod')}<input data-talent="contact" maxlength="200" value="${esc(t.contact)}" placeholder="${esc(tr('contactPlaceholder'))}"></label>
        <div class="career-actions"><button class="text-btn" data-career="profile-from-candidate">${tr('useCandidate')}</button><button class="text-btn" data-career="sample-profile">${tr('loadProfile')}</button></div><p class="career-demo-note">${tr('profileDemoHelp')}</p>
      </section><section class="panel"><h2>${tr('languageVersions')}</h2><label class="field">${tr('editingLanguage')}${languages(lang, 'data-profile-language')}</label>
        <label class="field">${tr('headline')}<input data-profile-text="headline" maxlength="160" value="${esc(l.headline)}"></label>
        <label class="field">${tr('about')}<textarea data-profile-text="about" maxlength="1200" rows="6" placeholder="${esc(tr('aboutPlaceholder'))}">${esc(l.about)}</textarea></label>
        <label class="check-field"><input type="checkbox" data-profile-approved ${l.approved ? 'checked' : ''}><span>${tr('profileConsent',{language:langName(lang)})}</span></label>
        <p class="career-help">${Object.entries(t.locales).map(([key, value]) => `${langName(key)}: ${value.approved ? tr('approved') : tr('pending')}`).join(' · ')}</p>
        ${aiConsent('profile-ai-consent')}<button class="btn btn-outline" data-career="translate-profile" ${busy || !status?.configured ? 'disabled' : ''}>${busy ? tr('translating') : tr('translateProfile')}</button><p class="career-help">${tr('profileAiHelp')}</p>
      </section><section class="panel"><h2>${tr('choosePublic')}</h2>
        ${[['showCity', tr('includeCity')], ['showSkills', tr('includeSkills')], ['showContact', tr('includeContact')]].map(([key, text]) => `<label class="check-field"><input type="checkbox" data-talent-toggle="${key}" ${t[key] ? 'checked' : ''}><span>${text}</span></label>`).join('')}
        <label class="field">${tr('expiry')}<select data-talent="expiry">${['7', '30', '90'].map(days => `<option value="${days}" ${t.expiry === days ? 'selected' : ''}>${tr('days',{days})}</option>`).join('')}</select></label>
        <p class="career-help">${tr('snapshotHelp')}</p>
        <button class="btn btn-primary full" data-career="review-share">${tr('reviewSnapshot')}</button>
        ${reviewSnapshot ? `<div class="career-share-review"><h3>${tr('exactSnapshot')}</h3>${profileCard(reviewSnapshot,Object.keys(reviewSnapshot.locales)[0],true)}<p>${tr('publicLanguages')} ${Object.keys(reviewSnapshot.locales).map(l => langName(l)).join(' · ')}</p><p>${tr('includes')} ${[tr('displayName'),tr('approvedLanguages'),reviewSnapshot.city&&tr('city'),reviewSnapshot.skills&&tr('skills'),reviewSnapshot.contact&&tr('contact')].filter(Boolean).join(' · ')}.</p><label class="check-field"><input id="public-share-consent" type="checkbox"><span>${tr('shareConsent')}</span></label><button class="btn btn-primary" data-career="create-link">${tr('createLink')}</button></div>` : ''}
        <div id="career-share-result" aria-live="polite">${shareResult()}</div>
      </section></div><div class="career-profile-preview" data-profile-preview>${profilePreview()}</div></div>`;
  }
  function publicPage() {
    if (!publicProfile) return `<section class="panel"><h1>${tr('profileUnavailable')}</h1><p>${esc(error ? localizeCareerError(error,getLanguage()) : tr('invalidProfile'))}</p><button class="btn btn-outline" data-view="tools">${tr('openAcross')}</button></section>`;
    const active = publicProfile.locales[publicLanguage] ? publicLanguage : Object.keys(publicProfile.locales)[0];
    const pt=key=>careerText(key,active);
    return `<div class="public-talent-page" lang="${active==='zh'?'zh-Hans':active==='tw'?'zh-Hant':'en'}"><header><a href="#discover" class="brand">across.</a><label class="field">${pt('profileLanguage')}<select data-public-language>${Object.keys(publicProfile.locales).map(l => `<option value="${l}" ${l === active ? 'selected' : ''}>${languageName(l,active)}</option>`).join('')}</select></label></header>${profileCard(publicProfile, active)}<p class="career-help">${pt('snapshotNote')}</p></div>`;
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
  function invalidateProfile() { reviewSnapshot = null; generatedShareLink = ''; }
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
      if (op === 'extract') { if (data.facts.length && !confirm(tr('confirmFacts'))) return; data.facts = splitFacts(data.source, data.sourceLanguage); clearApprovals(); }
      if (op === 'sample') {
        if ((data.source || data.facts.length || data.cv.company || data.cv.role || data.cv.jd) && !confirm(tr('confirmSample'))) return;
        const language = Object.hasOwn(LANGUAGES, getLanguage()) ? getLanguage() : 'en';
        const role = jobs.find(j => j.title === 'Product Designer' && j.company === 'Forma Studio');
        data.sourceLanguage = language; data.facts = clone(SAMPLE_FACTS); data.source = SAMPLE_FACTS.map(f => f[language]).join('\n');
        data.cv = { task: 'tailor', company: 'Forma Studio', role: role ? getJobTitle(role) : 'Product Designer', jd: role ? [role.summary, ...role.requirements].join('\n') : 'Design thoughtful digital products with Figma, prototyping, user research and design systems. Collaborate across Hong Kong and Shenzhen. Bring 3+ years of product design experience and a portfolio.', language, engine: 'local' };
        clearApprovals();
      }
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
          toast(tr('ready'));
        } finally { busy = false; }
      }
      if (op === 'delete-draft') { if (!confirm(tr('confirmDelete'))) return; data.drafts = data.drafts.filter(d => d.id !== button.dataset.id); selectedDraft = data.drafts[0]?.id; }
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
        if (data.talent.name && !confirm(tr('confirmProfile'))) return;
        data.talent = { ...initial().talent, name: 'Alex Chen', city: 'Shenzhen ↔ Hong Kong', selectedLanguage: Object.hasOwn(LANGUAGES, getLanguage()) ? getLanguage() : 'en', skills: 'Figma · User research · Prototyping · Design systems', contact: 'alex.chen@example.com', locales: {
          en: { headline: 'Product designer exploring cross-border teams', about: 'From 2022 to 2025, I designed digital products at a Shenzhen software studio. With a team of 4, I redesigned onboarding; completion increased by 18% in an internal test. I work with Figma, user interviews and design systems. I’m exploring product design teams in Hong Kong and Shenzhen. Let’s talk about your team before I share a tailored CV.', approved: false },
          zh: { headline: '产品设计师，期待加入跨境团队', about: '2022年至2025年，我在深圳一家软件工作室设计数字产品。我与4人团队重新设计入门流程，内部测试中完成率提高了18%。我使用 Figma，开展用户访谈，并参与设计系统工作。目前正在了解香港和深圳的产品设计团队。欢迎先聊聊团队和职位，再分享定制简历。', approved: false },
          tw: { headline: '產品設計師，期待加入跨境團隊', about: '2022年至2025年，我在深圳一家軟體工作室設計數位產品。我與4人團隊重新設計入門流程，內部測試中完成率提高了18%。我使用 Figma，進行使用者訪談，並參與設計系統工作。目前正在了解香港和深圳的產品設計團隊。歡迎先聊聊團隊和職位，再分享量身調整的履歷。', approved: false }
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
        generatedShareLink = link;
        result.innerHTML = shareResult();
        return;
      }
      if (op === 'copy-share') { const input = document.querySelector('#career-share-link'); try { await navigator.clipboard.writeText(input.value); toast(tr('copied')); } catch { input.select(); toast(tr('copyManually')); } return; }
      if (op === 'download-profile') { const link = document.querySelector('#career-share-link')?.value; if (link) download(`<!doctype html><meta charset="utf-8"><title>${tr('downloadLinkTitle')}</title><p><a href="${esc(link)}">${tr('downloadLinkOpen')}</a></p><p>${tr('downloadLinkHelp')}</p>`, 'across-profile-link.html', 'text/html;charset=utf-8'); return; }
      if (op === 'clear') { if (!confirm(tr('confirmClear'))) return; data = initial(); selectedDraft = null; reviewSnapshot = null; generatedShareLink = ''; }
      persist(); repaint();
    } catch (e) { busy = false; error = e.message; repaint(); }
  }
  document.addEventListener('click', e => { const previewButton=e.target.closest('[data-preview-language]');if(previewButton?.dataset.previewLanguage){previewLanguage=previewButton.dataset.previewLanguage;refreshPreview();document.querySelector(`[data-preview-language="${previewLanguage}"]`)?.focus({preventScroll:true});return;} const button = e.target.closest('[data-career]'); if (button) { e.preventDefault(); void action(button); } });
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
      const badge = document.querySelector('#career-fact-count'); if (badge) badge.textContent = `${tr('approvedCount',{count,total:data.facts.length})}`;
      const generate = document.querySelector('[data-career="generate"]'); if (generate) generate.disabled = busy || !count;
      document.querySelectorAll('[data-draft-status]').forEach(tag => { tag.textContent = tr('staleDraft'); });
      persist();
    }
    if (el.matches('[data-cv]')) { data.cv[el.dataset.cv] = el.value; persist(); }
    if (el.matches('[data-draft-id]')) {
      const d = data.drafts.find(d => d.id === el.dataset.draftId); d.sections[Number(el.dataset.draftSection)].items[Number(el.dataset.draftItem)].text = el.value; d.approved = false;
      const approve = document.querySelector(`[data-draft-approve="${d.id}"]`); if (approve) approve.checked = false;
      document.querySelectorAll('[data-draft-status]').forEach(tag => { tag.textContent = tr('needsReview'); });
      document.querySelectorAll('[data-career="export-cv"],[data-career="print-cv"]').forEach(b => { b.disabled = true; }); persist();
    }
    if (el.matches('[data-talent]')) { data.talent[el.dataset.talent] = el.value; invalidateProfile(); document.querySelector('.career-share-review')?.remove(); document.querySelector('#career-share-result')?.replaceChildren(); persist(); }
    if (el.matches('[data-profile-text]')) { const locale = data.talent.locales[data.talent.selectedLanguage]; locale[el.dataset.profileText] = el.value; locale.approved = false; invalidateProfile(); const check = document.querySelector('[data-profile-approved]'); if (check) check.checked = false; document.querySelector('.career-share-review')?.remove(); document.querySelector('#career-share-result')?.replaceChildren(); persist(); }
    if(el.matches('[data-talent],[data-profile-text]'))refreshPreview();
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
  const featureText=(feature,field)=>{const keys={cv:{name:'cvTitle',body:'cvCard',action:'cvAction'},profile:{name:'profileTitle',body:'profileCard',action:'profileAction'}};return keys[feature.id]?.[field]?tr(keys[feature.id][field]):feature[field]};
  return { setPreviewLanguage: language => { if(Object.hasOwn(LANGUAGES,language)){previewLanguage=language;refreshPreview();} }, featureText, cvPage, talentProfilePage, publicPage, open, openShared, clear: () => { data = initial(); reviewSnapshot = null; generatedShareLink = ''; persist(); } };
}
