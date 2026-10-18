import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENT_COPY, createAgentDemo, resolveDemoIntent } from '../dist/agent-demo.js';

function demo() {
  const previous=globalThis.document, handlers={}, calls=[];
  globalThis.document={addEventListener:(type,fn)=>handlers[type]=fn,querySelector:()=>null};
  const agent=createAgentDemo({getLanguage:()=> 'en',getCandidate:()=>({name:'<script>candidate</script>',status:'IANG'}),getJob:()=>({title:'Designer',company:'Forma Studio'}),refresh:()=>calls.push('render'),onMarketing:channel=>calls.push(channel),onFill:()=>calls.push('fill'),onStop:()=>calls.push('stop'),onPreview:language=>calls.push(language)});
  return {agent,calls,prompt(mode,intent){handlers.click({target:{closest:selector=>selector==='[data-agent-prompt]'?{dataset:{mode,agentPrompt:intent}}:null}});},restore(){globalThis.document=previous;}};
}

test('scripted prompts recognise typed requests across all three languages',()=>{
  for(const [mode,text,intent] of [['cv','Tailor my CV','tailor'],['cv','突出我的成果','stronger'],['cv','翻譯為繁體中文','translate'],['cv','I have reviewed this draft','approve'],['marketing','Adapt for 小红书','xhs'],['marketing','撰寫招募郵件','email'],['apply','Stop filling','stop'],['apply','幫我填寫申請表','fill'],['profile','哪些内容会分享？','privacy'],['profile','繁體中文預覽','preview'],['cv','<img src=x onerror=alert(1)>','fallback']])assert.equal(resolveDemoIntent(mode,text),intent,text);
  for(const [key,copy] of Object.entries(AGENT_COPY))assert.ok(copy.length===3&&copy.every(Boolean),key);
});

test('CV conversation changes only its fictional artifact and requires renewed demo review after changes',()=>{
  const d=demo();
  try {
    assert.match(d.agent.cvPage(),/>Original CV</);
    d.prompt('cv','tailor');
    assert.match(d.agent.cvPage(),/>Tailored draft</);
    assert.match(d.agent.rail('cv'),/five fictional facts/);
    d.prompt('cv','stronger');
    assert.match(d.agent.cvPage(),/class="cv-summary cv-highlight">Redesigned onboarding/);
    d.prompt('cv','approve');
    assert.match(d.agent.cvPage(),/>Reviewed in demo</);
    d.prompt('cv','translate');
    assert.match(d.agent.cvPage(),/lang="zh-Hant"/);
    assert.match(d.agent.cvPage(),/>Draft · review required</);
    assert.ok(d.calls.every(c=>c==='render'));
  } finally {d.restore();}
});

test('marketing, application and profile messages dispatch to their intended local workspace actions',()=>{
  const d=demo();
  try {
    d.prompt('marketing','xhs');d.prompt('marketing','email');d.prompt('apply','fill');d.prompt('apply','stop');d.prompt('profile','preview');
    assert.deepEqual(d.calls,['xiaohongshu','email','fill','stop','tw']);
    const rail=d.agent.rail('apply');
    assert.ok(rail.includes('&lt;script&gt;candidate&lt;/script&gt;'));
    assert.ok(!rail.includes('<script>candidate'));
    assert.ok(rail.includes('IANG'));
    d.agent.clear();
    assert.ok(!d.agent.rail('apply').includes('Partly filled'));
  } finally {d.restore();}
});
