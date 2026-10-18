import test from 'node:test';
import assert from 'node:assert/strict';
import { WORKSPACE_COPY, workspaceHeader } from '../dist/workspace-ui.js';
import { resolveWorkspaceRoute } from '../dist/workspace-routes.js';
import { encodeProfile } from '../dist/career-core.js';

// Source-level client fixtures: no browser, user storage or network access.
async function appFixture(route='cv-demo') {
  const keys=['document','window','location','history','localStorage','fetch'];
  const previous=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  const listeners=new Map(),windowListeners=new Map(),store=new Map();
  const node=()=>({innerHTML:'',textContent:'',focus(){},addEventListener(){},classList:{add(){},remove(){},toggle(){}},setAttribute(){}});
  const root=node(),modal={...node(),open:false,close(){this.open=false;},showModal(){this.open=true;}};
  const elements=new Map([['#app',root],['#modal',modal],['#toast',node()],['#main',node()],['.skip-link',node()]]);
  const section={dataset:{jobId:'j1',isDraft:'0',lang:'en'},querySelectorAll:()=>[],querySelector:()=>null};
  const document={documentElement:{lang:'en'},querySelector:key=>elements.get(key)||null,querySelectorAll:()=>[],addEventListener:(kind,fn)=>{if(!listeners.has(kind))listeners.set(kind,[]);listeners.get(kind).push(fn);}};
  Object.assign(globalThis,{document,window:{addEventListener:(kind,fn)=>windowListeners.set(kind,fn),scrollTo(){}},location:{hash:'#'+route},history:{replaceState(_state,_title,url){globalThis.location.hash=url;},pushState(_state,_title,url){globalThis.location.hash=url;}},localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)},fetch:async()=>({ok:true,json:async()=>({configured:false})})});
  const restore=()=>{for(const [key,descriptor] of previous){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}};
  try {await import(`../dist/app.js?fixture=${route}-${Date.now()}-${++appFixture.serial}`);await new Promise(setImmediate);}
  catch(error){restore();throw error;}
  const camel=name=>name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
  const control=(dataset={},extra={})=>({dataset,...extra,matches(selector){return selector.split(',').some(part=>part.trim().startsWith('.')?this.className===part.trim().slice(1):part.trim().startsWith('#')?this.id===part.trim().slice(1):[...part.matchAll(/\[data-([\w-]+)\]/g)].some(m=>Object.hasOwn(this.dataset,camel(m[1]))));},closest(selector){if(selector==='.marketing-section')return section;return this.matches(selector)?this:null;}});
  return {html:()=>root.innerHTML,modal:()=>modal.innerHTML,hash:()=>globalThis.location.hash,route(hash){globalThis.location.hash='#'+hash;windowListeners.get('popstate')?.();},click(dataset){const event={target:control(dataset),preventDefault(){}};for(const fn of listeners.get('click')||[])fn(event);},change(dataset,value,id){const event={target:control(dataset,{value,id}),preventDefault(){}};for(const fn of listeners.get('change')||[])fn(event);},toggle(className,open){const event={target:control({},{className,open})};for(const fn of listeners.get('toggle')||[])fn(event);},async settle(){await new Promise(setImmediate);},restore};
}
appFixture.serial=0;

test('workspace tool navigation stays inside its audience in each interface language',()=>{
  for(const copy of Object.values(WORKSPACE_COPY))assert(copy.length===3&&copy.every(Boolean));
  for(const mode of ['cv','profile','marketing','apply'])for(const language of ['en','zh','tw']){
    const header=workspaceHeader(mode,language);
    assert.equal((header.match(/aria-current="page"/g)||[]).length,mode==='marketing'?0:1);
    assert.equal((header.match(/data-view=/g)||[]).length,mode==='marketing'?0:4);
    if(mode==='marketing'){assert(!header.includes('data-view="cv-demo"'));assert(!header.includes('data-view="apply"'));}
    else {assert(!header.includes('data-view="marketing"'));assert(!header.includes('data-view="talent"'));}
  }
});

test('CV source and comparison views preserve draft review; new wording invalidates review',async()=>{
  const app=await appFixture();
  try {
    app.click({agentPrompt:'tailor',mode:'cv'});
    app.click({agentPrompt:'approve',mode:'cv'});
    assert.match(app.html(),/>Reviewed in demo</);
    app.click({agentView:'sources'});
    assert.match(app.html(),/Five fictional facts/);
    assert.match(app.html(),/18% in an internal test/);
    app.click({agentView:'document'});
    app.click({agentVersion:'original'});
    assert.match(app.html(),/data-agent-version="original" aria-pressed="true"/);
    app.click({agentVersion:'draft'});
    assert.match(app.html(),/>Reviewed in demo</);
    app.click({agentPrompt:'stronger',mode:'cv'});
    assert.match(app.html(),/>Draft · review required</);
  } finally {app.restore();}
});

test('campaign channel navigation retains independent content language and only renders one draft',async()=>{
  const app=await appFixture('marketing');
  try {
    assert.equal((app.html().match(/class="marketing-card"/g)||[]).length,1);
    assert(!app.html().includes('undefined'));
    app.click({marketingLang:'zh'});
    app.click({agentPrompt:'xhs',mode:'marketing'});
    assert.match(app.html(),/data-lang="zh"/);
    assert.match(app.html(),/class="marketing-card" data-channel="xiaohongshu"/);
    app.click({campaignChannel:'email'});
    assert.match(app.html(),/data-lang="zh"/);
    assert.match(app.html(),/class="marketing-card" data-channel="email"/);
    assert.equal((app.html().match(/class="marketing-card"/g)||[]).length,1);
  } finally {app.restore();}
});

test('workspace navigation opens a valid application portal and keeps location and consent user-controlled',async()=>{
  const app=await appFixture();
  try {
    app.click({view:'apply'});
    const html=app.html();
    assert.match(html,/id="apply-form" data-job-id="j1"/);
    assert.match(html,/class="portal-browser-bar"/);
    assert.match(html,/class="application-progress"/);
    assert.match(html,/<option value="">Choose current location<\/option>/);
    assert.match(html,/<input type="checkbox" name="consent" required>/);
    assert(!html.includes('class="apply-portal-hero"'));
    app.change({applicationRole:''},'j2');
    assert.match(app.html(),/id="apply-form" data-job-id="j2"/);
    assert.match(app.html(),/<input type="checkbox" name="consent" required>/);
  } finally {app.restore();}
});


test('profile editor remains open when editing language changes while recipient preview stays independent',async()=>{
  const app=await appFixture('talent-profile');
  try {
    app.click({career:'sample-profile'});
    app.toggle('profile-editor',true);
    app.change({profileLanguage:''},'zh');
    assert.match(app.html(),/class="profile-editor" open/);
    assert.match(app.html(),/data-profile-language><option value="en"/);
    assert.match(app.html(),/value="zh" selected/);
    app.click({previewLanguage:'tw'});
    // The actual profile region is replaced directly; persistent editor state
    // and wording must not be changed by this independent preview action.
    app.change({profileLanguage:''},'en');
    assert.match(app.html(),/class="profile-editor" open/);
    assert.match(app.html(),/data-preview-language="tw" aria-pressed="true"/);
    assert.match(app.html(),/產品設計師，期待加入跨境團隊/);
    assert.match(app.html(),/value="en" selected/);
  } finally {await app.settle();app.restore();}
});


test('scoped routes reject misplaced tools and legacy application links always resolve to the candidate workspace',()=>{
  assert.deepEqual(resolveWorkspaceRoute('apply','employer'),{workspace:'candidate',view:'apply',hash:'candidate/apply'});
  assert.deepEqual(resolveWorkspaceRoute('employer/apply'),{workspace:'employer',view:'employer',hash:'employer'});
  assert.deepEqual(resolveWorkspaceRoute('candidate/marketing'),{workspace:'candidate',view:'candidate',hash:'candidate'});
  assert.deepEqual(resolveWorkspaceRoute('employer/tools'),{workspace:'employer',view:'tools',hash:'employer/tools'});
  for(const value of ['candidate/__proto__','employer/constructor','__proto__','candidate/cv/extra'])assert.equal(typeof resolveWorkspaceRoute(value).view,'string');
});

test('explicit workspace switch opens separate dashboards and tool lists without mixing role navigation',async()=>{
  const app=await appFixture('candidate');
  try {
    assert.equal(app.hash(),'#candidate');
    assert.match(app.html(),/data-workspace-sidebar="candidate"/);
    assert(!app.html().includes('data-feature="marketing"'));
    app.click({view:'tools'});
    assert.equal(app.hash(),'#candidate/tools');
    assert(!app.html().includes('data-feature-card="marketing"'));
    app.click({workspace:'employer'});
    assert.equal(app.hash(),'#employer');
    assert.match(app.html(),/data-workspace-navigation="employer"/);
    assert(!app.html().includes('data-view="cv-demo"'));
    assert(!app.html().includes('data-view="profile"'));
    assert(!app.html().includes('data-view="apply"'));
    app.click({view:'tools'});
    assert.equal(app.hash(),'#employer/tools');
    assert.match(app.html(),/data-feature-card="marketing"/);
    assert(!app.html().includes('data-feature-card="cv"'));
    app.click({workspace:'candidate'});
    assert.equal(app.hash(),'#candidate');
    app.click({view:'apply'});
    assert.equal(app.hash(),'#candidate/apply');
    assert.match(app.html(),/data-workspace-sidebar="candidate"/);
  } finally {app.restore();}
});

test('employer vacancy previews do not show candidate apply or save-job actions',async()=>{
  const app=await appFixture('employer/jobs');
  try {
    app.click({job:'j1'});
    assert.match(app.modal(),/data-feature="marketing"/);
    assert(!app.modal().includes('data-apply='));
    assert(!app.modal().includes('data-save='));
  } finally {app.restore();}
});

test('deep links restore role context and switching workspaces preserves the fictional CV draft',async()=>{
  const app=await appFixture('candidate/cv');
  try {
    app.click({agentPrompt:'tailor',mode:'cv'});
    app.click({agentPrompt:'approve',mode:'cv'});
    app.click({workspace:'employer'});
    app.click({view:'marketing'});
    assert.equal(app.hash(),'#employer/marketing');
    app.click({workspace:'candidate'});
    app.click({view:'cv-demo'});
    assert.equal(app.hash(),'#candidate/cv');
    assert.match(app.html(),/>Reviewed in demo</);
  } finally {app.restore();}
});


test('history and reload-style routes restore the correct audience instead of retaining the previous role',async()=>{
  const app=await appFixture('employer/marketing');
  try {
    app.route('candidate/apply');
    assert.match(app.html(),/data-workspace-sidebar="candidate"/);
    assert.match(app.html(),/id="apply-form"/);
    app.route('employer/marketing');
    assert.match(app.html(),/data-workspace-navigation="employer"/);
    assert(!app.html().includes('data-view="apply"'));
    app.route('employer/apply');
    assert.equal(app.hash(),'#employer');
    assert(!app.html().includes('id="apply-form"'));
  } finally {app.restore();}
});

test('public profile snapshot links remain standalone after introducing workspace URL prefixes',async()=>{
  const token=encodeProfile({version:1,name:'Demo Person',city:'Shenzhen',skills:'Figma',contact:'',locales:{en:{headline:'Demo designer',about:'Fictional profile'}},expiresAt:Date.now()+86400000});
  const app=await appFixture('profile='+token);
  try {
    assert.match(app.html(),/class="public-talent-page"/);
    assert.match(app.html(),/Demo Person/);
    assert(!app.html().includes('data-workspace-sidebar'));
    assert.equal(app.hash(),'#profile='+token);
  } finally {app.restore();}
});


test('employer pages omit the sidebar and drawer while retaining navigation and the scripted copilot',async()=>{
  const app=await appFixture('employer');
  try {
    for(const view of ['employer','vacancies','marketing','talent','tools','resources']){
      app.click({view});
      const html=app.html();
      assert.match(html,/class="shell employer-shell"/);
      assert.match(html,/data-workspace-navigation="employer"/);
      assert(!html.includes('class="sidebar"'));
      assert(!html.includes('class="mobile-menu"'));
      assert(!html.includes('class="mobile-scrim"'));
      const nav=html.match(/<nav class="employer-top-nav"[\s\S]*?<\/nav>/)[0];
      assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
      for(const target of ['employer','vacancies','marketing','talent','tools','resources'])assert(nav.includes(`data-view="${target}"`));
      if(view==='marketing')assert.match(html,/class="agent-rail/);
    }
    app.click({workspace:'candidate'});
    assert.match(app.html(),/data-workspace-sidebar="candidate"/);
    assert(!app.html().includes('employer-shell'));
  } finally {app.restore();}
});
