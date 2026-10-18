import test from 'node:test';
import assert from 'node:assert/strict';
import { CAREER_COPY, careerText, languageName, localizeCareerError } from '../dist/career-i18n.js';
import { createCareerWorkspace } from '../dist/career-ui.js';
import { SAMPLE_FACTS, localCv } from '../dist/career-core.js';

function workspace(saved = null) {
  const store = new Map(saved ? [['across-career-v1', JSON.stringify(saved)]] : []);
  let language = 'en';
  const oldDocument = globalThis.document, oldStorage = globalThis.localStorage;
  const listeners = new Map(), elements = new Map();
  globalThis.document = { addEventListener: (type, handler) => listeners.set(type,handler), querySelector: selector => elements.get(selector) };
  globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key,value) => store.set(key,value) };
  const career = createCareerWorkspace({ navigate() {}, refresh() {}, getView: () => 'cv', getCandidate: () => ({ name: 'Candidate' }), getLanguage: () => language, jobs: [], toast() {}, closeModal() {} });
  return { career, elements, click: op => listeners.get('click')({target:{closest:()=>({dataset:{career:op}})},preventDefault(){}}), setLanguage: value => { language = value; }, stored: () => store.get('across-career-v1'), restore: () => { globalThis.document = oldDocument; globalThis.localStorage = oldStorage; } };
}
test('every interface message has all three languages and English labels contain no Chinese', () => {
  for (const [key, versions] of Object.entries(CAREER_COPY)) {
    assert.equal(versions.length,3,key);
    assert.ok(versions.every(text => typeof text === 'string' && text.length),key);
    assert.ok(!/[\u3400-\u9fff]/u.test(versions[0]),key);
  }
  assert.equal(languageName('zh','en'),'Simplified Chinese');
  assert.equal(languageName('en','tw'),'英語');
});
test('both empty editors follow interface language with no bilingual labels', () => {
  const w=workspace();
  try {
    for (const language of ['en','zh','tw']) {
      w.setLanguage(language);
      const cv=w.career.cvPage(),profile=w.career.talentProfilePage();
      assert.ok(cv.includes(careerText('sourceLanguage',language)));
      assert.ok(cv.includes(careerText('finalConsent',language)) === false); // no draft yet
      assert.ok(profile.includes(careerText('shareConsent',language)) === false); // no snapshot yet
      assert.ok(profile.includes(careerText('choosePublic',language)));
      assert.ok(!cv.includes('Fact review / 确认事实'));
      assert.ok(!profile.includes('Display name / 显示名称'));
      if(language==='en') assert.ok(!/[\u3400-\u9fff]/u.test(cv+profile));
      else {
        assert.ok(!cv.includes('>Source language<'));
        assert.ok(!profile.includes('>Live preview<'));
        assert.ok(!profile.includes('>Include city<'));
      }
    }
  } finally { w.restore(); }
});
test('switching interface language preserves facts, approvals, CV output and profile content language', () => {
  const facts=SAMPLE_FACTS.map(f=>({...f,approved:true}));
  const draft={...localCv({task:'translate',language:'en',facts}),id:'version-1',language:'en',company:'Company supplied by candidate',role:'Designer',revision:JSON.stringify(facts),approved:true};
  const saved={facts,source:'原始事实不能被界面切换更改',sourceLanguage:'zh',cv:{task:'translate',language:'en',company:'Company supplied by candidate',role:'Designer',jd:'',engine:'local'},drafts:[draft],talent:{name:'Candidate name',city:'Candidate city',contact:'',skills:'Figma',selectedLanguage:'en',showCity:true,showSkills:true,showContact:false,expiry:'30',locales:{en:{headline:'Candidate original headline',about:'Candidate original introduction',approved:true},zh:{headline:'候选人的原文',about:'用户文字',approved:false},tw:{headline:'候選人的原文',about:'使用者文字',approved:false}}}};
  const w=workspace(saved),before=w.stored();
  try {
    for(const language of ['en','zh','tw']) {
      w.setLanguage(language);
      const cv=w.career.cvPage(),profile=w.career.talentProfilePage();
      assert.ok(cv.includes(facts[0].zh));
      assert.ok(cv.includes(facts[0].en));
      assert.ok(cv.includes(careerText('candidateApproved',language)));
      assert.match(cv,/data-draft-approve="version-1" checked/);
      assert.match(cv,/option value="en" selected/);
      assert.ok(profile.includes('Candidate original headline'));
      assert.ok(profile.includes('Candidate original introduction'));
      assert.match(profile,/data-profile-approved checked/);
      assert.equal(w.stored(),before);
    }
  } finally { w.restore(); }
});
test('errors and confirmation labels are localized without changing source error contracts', () => {
  assert.equal(localizeCareerError('Approve at least one profile language.','zh'),'请至少确认一个档案语言版本。');
  assert.match(localizeCareerError('Check company (maximum 120 characters).','tw'),/請檢查公司/);
  assert.match(localizeCareerError('Draft introduced a number that is not in its approved facts. Add any new facts to the fact list and regenerate.','zh'),/请将新事实/);
  assert.ok(!localizeCareerError('Unexpected backend failure','zh').includes('Unexpected'));
  assert.equal(careerText('approvedCount','tw',{count:2,total:5}),'已確認 2 / 5 項');
});
test('a generated snapshot link survives interface switches with localized sharing controls', () => {
  const w=workspace({facts:[],drafts:[],cv:{},talent:{name:'Fictional candidate',locales:{en:{headline:'Designer',about:'Approved introduction.',approved:true},zh:{headline:'',about:'',approved:false},tw:{headline:'',about:'',approved:false}}}});
  const oldLocation=globalThis.location;
  globalThis.location={origin:'http://127.0.0.1:4173',pathname:'/'};
  try {
    w.elements.set('#public-share-consent',{checked:true});
    w.elements.set('#career-share-result',{innerHTML:''});
    w.click('review-share');
    w.click('create-link');
    const first=w.career.talentProfilePage();
    const link=/id="career-share-link" value="([^"]+)"/.exec(first)?.[1];
    assert.ok(link?.includes('#profile='));
    w.setLanguage('tw');
    const translated=w.career.talentProfilePage();
    assert.ok(translated.includes(link));
    assert.ok(translated.includes('複製連結'));
    assert.ok(translated.includes('已確認的語言版本'));
  } finally { w.restore(); globalThis.location=oldLocation; }
});

test('demo loaders prepare local scenarios in the chosen language without granting approvals', () => {
  for (const language of ['en','zh','tw']) {
    const w=workspace();
    try {
      w.setLanguage(language);w.click('sample');
      const cv=JSON.parse(w.stored());
      assert.equal(cv.sourceLanguage,language);assert.equal(cv.cv.language,language);
      assert.equal(cv.cv.company,'Forma Studio');assert.equal(cv.cv.engine,'local');assert.ok(cv.cv.jd);
      assert.equal(cv.facts.length,5);assert.ok(cv.facts.every(f=>!f.approved));assert.equal(cv.drafts.length,0);
      assert.equal(cv.source,cv.facts.map(f=>f[language]).join('\n'));
      w.click('sample-profile');const profile=JSON.parse(w.stored()).talent;
      assert.equal(profile.name,'Alex Chen');assert.equal(profile.selectedLanguage,language);assert.equal(profile.showContact,false);
      assert.ok(Object.values(profile.locales).every(locale=>!locale.approved && locale.about.includes('18%')));
    } finally {w.restore()}
  }
});
test('declining a demo replacement preserves the current workspace', () => {
  const w=workspace({facts:[],drafts:[],source:'My private notes',cv:{company:'My company'},talent:{name:'My name',locales:{}}});
  const oldConfirm=globalThis.confirm;let confirmations=0;
  globalThis.confirm=()=>{confirmations++;return false};
  try {const before=w.stored();w.click('sample');w.click('sample-profile');assert.equal(confirmations,2);assert.equal(w.stored(),before)}
  finally {globalThis.confirm=oldConfirm;w.restore()}
});


test('preview language switches independently without changing editing language, approvals or stored text', () => {
  const w=workspace();
  try {
    w.click('sample-profile');
    const before=w.stored();
    w.career.setPreviewLanguage('tw');
    const html=w.career.talentProfilePage();
    assert.match(html,/data-preview-language="tw" aria-pressed="true"/);
    assert.ok(html.includes('產品設計師，期待加入跨境團隊'));
    assert.ok(html.includes('Product designer exploring cross-border teams'));
    assert.equal(w.stored(),before);
    w.career.setPreviewLanguage('zh');
    assert.ok(w.career.talentProfilePage().includes('产品设计师，期待加入跨境团队'));
    assert.equal(w.stored(),before);
  } finally {w.restore();}
});

test('an empty preview language shows its empty state instead of another language’s content', () => {
  const w=workspace({facts:[],drafts:[],cv:{},talent:{name:'Fictional candidate',selectedLanguage:'en',locales:{en:{headline:'English only headline',about:'English only bio',approved:true}}}});
  try {
    w.career.setPreviewLanguage('tw');
    const html=w.career.talentProfilePage();
    const preview=html.slice(html.indexOf('class="profile-preview-stage"'),html.indexOf('class="profile-preview-caption"'));
    assert.ok(preview.includes('profile-preview-empty'));
    assert.ok(!preview.includes('English only headline'));
    assert.ok(html.includes('English only headline'));
    assert.ok(html.includes('data-profile-approved checked'));
  } finally {w.restore();}
});
