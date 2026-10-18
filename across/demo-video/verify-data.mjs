import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const data=JSON.parse(await fs.readFile(new URL('demo-data.json',import.meta.url),'utf8'));
assert.equal(data.fictional,true);
assert.equal(data.mode,'ideal-product-concept');
const facts=new Set(data.candidate.facts.map(f=>f.id));
assert.equal(facts.size,data.candidate.facts.length);
for(const requirement of data.job.requirements) for(const id of requirement.factIds) assert(facts.has(id),`Unknown evidence: ${id}`);
for(const id of data.cv.sourceFactIds) assert(facts.has(id));
for(const scene of data.scenes) for(const id of scene.factIds||[]) assert(facts.has(id));
let end=0;
for(const scene of data.scenes){assert.equal(scene.start,end,`Gap or overlap in ${scene.id}`);assert(scene.duration>0);end+=scene.duration;}
assert.equal(end,data.durationSeconds);
assert.equal(end,84);
assert.match(data.cv.selectedAchievement,/18% in an internal test/);
assert.match(data.candidate.profileLocales.en.about,/18% in an internal test/);
assert.match(data.candidate.profileLocales.zh.about,/内部测试中完成率提高了18%/);
assert.match(data.candidate.profileLocales.tw.about,/內部測試中完成率提高了18%/);
for(const name of ['email','workStatus','fullCv']){
  assert(data.candidate.excludedPublicFields.includes(name));
  assert(!data.candidate.publicFields.includes(name));
}
for(const draft of Object.values(data.marketing)){
  assert(draft.body.includes('HK$32,000–45,000'));
  assert.equal(draft.status,'Employer review required');
}
assert.equal(data.application.requiresCandidateConfirmation,true);
assert.equal(data.application.submission,'Simulated only');
assert(data.application.portalHost.endsWith('.example'));
assert(data.candidate.email.endsWith('@example.com'));
console.log('Demo data verified: continuous 84s story, valid evidence references, qualified outcomes, three locales, review and privacy boundaries.');
