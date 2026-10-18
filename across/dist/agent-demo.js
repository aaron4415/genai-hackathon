import { SAMPLE_FACTS } from './career-core.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const AGENT_COPY = {
  you:['You','你','你'], name:['Name','姓名','姓名'], emailLabel:['Email','邮箱','電郵'], headline:['Headline','简介','簡介'], destination:['Destination','目标城市','目標城市'], workStatus:['Work status','工作状态','工作狀態'], stage:['Stage','申请阶段','申請階段'], expiry:['Expiry','到期日','到期日'], sponsorship:['Sponsorship','雇主支持','僱主支持'], qualifications:['Qualifications','专业资历','專業資歷'], mainlandNotes:['Mainland notes','内地工作备注','內地工作備註'],
  agent:['Across agent','Across 智能助手','Across 智能助手'], demo:['Scripted demo · no live AI','预设对话演示 · 非实时 AI','預設對話示範 · 非即時 AI'],
  cv:['CV copilot','简历助手','履歷助手'], marketing:['Marketing copilot','营销助手','行銷助手'], apply:['Application copilot','申请助手','申請助手'], profile:['Profile copilot','档案助手','檔案助手'],
  cvTitle:['A conversation. A stronger CV.','聊一聊，让简历更出色。','聊一聊，讓履歷更出色。'],
  cvSub:['Meet Alex Chen. Turn a fictional designer’s experience into a CV for Forma Studio, one conversation at a time.','以虚构设计师 Alex Chen 为例，通过对话定制申请 Forma Studio 的简历。','以虛構設計師 Alex Chen 為例，透過對話調整申請 Forma Studio 的履歷。'],
  original:['Original CV','原始简历','原始履歷'], tailored:['Tailored draft','定制草稿','調整後草稿'], reviewed:['Reviewed in demo','已在演示中确认','已在示範中確認'], draft:['Draft · review required','草稿 · 需要确认','草稿 · 需要確認'],
  role:['Target opportunity','目标职位','目標職位'], evidence:['Source experience','经历依据','經歷依據'], summary:['Profile','个人简介','個人簡介'], experience:['Selected experience','精选经历','精選經歷'], skills:['Skills','技能','技能'],
  studio:['Open full CV studio','打开完整简历工作室','開啟完整履歷工作室'], restart:['Restart conversation','重新开始对话','重新開始對話'], send:['Send message','发送消息','傳送訊息'], placeholder:['Ask your agent…','与助手聊一聊…','與助手聊一聊…'],
  context:['IN THIS WORKSPACE','当前工作空间','目前工作空間'], fictional:['Fictional demo candidate','虚构演示候选人','虛構示範候選人'], candidate:['Candidate information','候选人资料','候選人資料'],
  private:['Chat stays in this visit. Nothing is sent or published.','对话仅在本次访问保留。不会发送或发布任何内容。','對話僅在本次瀏覽保留。不會傳送或發佈任何內容。'],
  helloCv:['Hi! I’m your CV copilot. Alex is applying for Product Designer at Forma Studio. I have five fictional source facts ready. Shall we tailor the CV together?','你好！我是你的简历助手。Alex 正申请 Forma Studio 的产品设计师职位。我已准备好五项虚构经历，一起定制简历吧。','你好！我是你的履歷助手。Alex 正申請 Forma Studio 的產品設計師職位。我已準備好五項虛構經歷，一起調整履歷吧。'],
  tailor:['Tailor my CV for this role','为这个职位定制简历','為這個職位調整履歷'], stronger:['Emphasise my achievements','突出我的成果','突出我的成果'], translate:['Make a Traditional Chinese version','生成繁体中文版本','產生繁體中文版本'], approve:['I’ve reviewed this demo draft','我已确认这份演示草稿','我已確認這份示範草稿'],
  tailoredReply:['I’ve brought the onboarding project, user research and Figma work to the front. The draft on the left now follows Forma Studio’s product-design brief. All statements come from the five fictional facts.','已优先展示入职流程项目、用户研究和 Figma 经历。左侧草稿已按 Forma Studio 的产品设计要求调整，全部内容来自五项虚构事实。','已優先展示入職流程專案、使用者研究及 Figma 經歷。左側草稿已按 Forma Studio 的產品設計要求調整，全部內容來自五項虛構事實。'],
  strongerReply:['I’ve led with the 18% onboarding result and kept “in an internal test” beside it. I can’t confirm a portfolio or three years of experience without a review of the dates and work samples; those remain questions for Alex.','已突出入职流程提升 18% 的成果，并保留「内部测试」的限定。现有资料无法确认作品集或三年经验，需要向 Alex 核实。','已突出入職流程提升 18% 的成果，並保留「內部測試」的限定。現有資料無法確認作品集或三年經驗，需要向 Alex 核實。'],
  translateReply:['The preview now uses the prewritten Traditional Chinese version of the same fictional facts. You can switch the CV language above the document.','预览已切换为同一组虚构事实的预写繁体中文版本。可在文档上方切换简历语言。','預覽已切換為同一組虛構事實的預寫繁體中文版本。可在文件上方切換履歷語言。'],
  approvedReply:['Marked as reviewed for this demo. Your real saved CVs and approvals are separate. Open the full CV studio when you want to work with your own information.','已标记为演示确认。真实保存的简历及确认状态独立管理。处理个人资料时可打开完整简历工作室。','已標記為示範確認。真實儲存的履歷及確認狀態獨立管理。處理個人資料時可開啟完整履歷工作室。'],
  helloMarketing:['Let’s turn this role into a recruitment campaign. Choose an opportunity on the left, then ask me for LinkedIn, Xiaohongshu or a recruiter email. The channel drafts stay editable.','一起把这个职位变成招聘文案吧。先在左侧选择职位，再让我生成 LinkedIn、小红书或招聘邮件。所有渠道草稿都可以编辑。','一起把這個職位變成招聘文案吧。先在左側選擇職位，再讓我產生 LinkedIn、小紅書或招募郵件。所有渠道草稿都可以編輯。'],
  linkedin:['Draft a LinkedIn post','起草 LinkedIn 帖子','起草 LinkedIn 貼文'], xhs:['Adapt it for Xiaohongshu','改成小红书风格','改成小紅書風格'], email:['Write a recruiter email','撰写招聘邮件','撰寫招募郵件'],
  marketingReply:['I’ve opened the selected channel draft on the left. This is a prewritten template using the selected role’s details. Edit the copy, switch its language, then copy it when ready. Nothing is published.','已在左侧打开对应渠道草稿。这是使用当前职位资料的预写模板。可编辑文案、切换语言并复制，不会自动发布。','已在左側開啟對應渠道草稿。這是使用目前職位資料的預寫範本。可編輯文案、切換語言並複製，不會自動發佈。'],
  helloApply:['I’m beside the simulated company portal. Your saved candidate information is shown here. I can map it into the form and prepare a short introduction, then pause for your review.','我就在模拟公司网站旁边。下方是你保存的候选人资料。我可以将资料填入表格并准备简短介绍，然后暂停等待你确认。','我就在模擬公司網站旁邊。下方是你儲存的候選人資料。我可以將資料填入表格並準備簡短介紹，然後暫停等待你確認。'],
  fill:['Fill this application for me','帮我填写申请表','幫我填寫申請表'], check:['What needs my review?','我需要确认什么？','我需要確認甚麼？'], stop:['Stop filling','停止填写','停止填寫'],
  saved:['This demo application has already been saved. Nothing was sent to an employer.','这份演示申请已保存，没有发送给雇主。','這份示範申請已儲存，沒有傳送給僱主。'],
  working:['I’m filling the local demo form. Follow the highlighted fields on the left.','正在填写本地演示表格，请查看左侧高亮字段。','正在填寫本機示範表格，請查看左側高亮欄位。'],
  filled:['The form is ready for review. Check every field and the introduction, choose consent yourself, then use “Save demo application”. No employer receives this demo.','表格已准备好。请检查所有字段和介绍，自行勾选同意，再点击「保存演示申请」。不会发送给雇主。','表格已準備好。請檢查所有欄位及介紹，自行勾選同意，再點擊「儲存示範申請」。不會傳送給僱主。'],
  reviewApply:['Please verify your name, email, current location and exact work-authorisation answer. Destination preference does not establish current location. The introduction is a template for you to edit; I haven’t verified qualifications or documents.','请核实姓名、邮箱、目前所在地及确切工作许可状态。目标城市不等于目前所在地。介绍为可编辑模板；我没有核实资历或证件。','請核實姓名、電郵、目前所在地及確切工作許可狀態。目標城市不等於目前所在地。介紹為可編輯範本；我沒有核實資歷或證件。'],
  stopped:['Stopped. Partly filled fields remain editable. Consent and submission are still yours.','已停止。已填写字段仍可编辑，同意及提交由你决定。','已停止。已填寫欄位仍可編輯，同意及提交由你決定。'],
  helloProfile:['Your introduction can travel in three languages. Use the independent language tabs above the live preview to see what a recipient will read.','让你的介绍跨越三种语言。使用实时预览上方的独立语言标签，查看收件人看到的内容。','讓你的介紹跨越三種語言。使用即時預覽上方的獨立語言標籤，查看收件人看到的內容。'],
  preview:['Show Traditional Chinese preview','查看繁体中文预览','查看繁體中文預覽'], privacy:['What will be shared?','哪些内容会分享？','哪些內容會分享？'],
  previewReply:['I’ve switched the live preview to Traditional Chinese. If that version is empty, add your wording or load the fictional profile demo. Your editing language and approvals stay unchanged.','实时预览已切换为繁体中文。如果该版本为空，请填写内容或载入虚构档案示例。编辑语言和确认状态保持不变。','即時預覽已切換為繁體中文。如果該版本為空，請填寫內容或載入虛構檔案範例。編輯語言及確認狀態保持不變。'],
  privacyReply:['Only approved language versions and the fields you select go into a share snapshot. Contact is off by default. Review the exact snapshot before creating its link.','分享快照只包含你已确认的语言版本和所选字段，默认不含联系方式。生成链接前请确认准确的公开快照。','分享快照只包含你已確認的語言版本及所選欄位，預設不含聯絡方式。產生連結前請確認準確的公開快照。'],
  fallback:['This demo follows a prepared conversation. Try one of the suggested messages below to see the next step.','本演示使用预设对话，请选择下方建议消息体验下一步。','本示範使用預設對話，請選擇下方建議訊息體驗下一步。'],
  marketingTitle:['One role. Every channel.','一个职位，多种表达。','一個職位，多種表達。'], marketingSub:['Brief your agent on the right. Review your recruitment campaign on the left.','在右侧与助手沟通，在左侧确认招聘文案。','在右側與助手溝通，在左側確認招募文案。'],
  documentLanguage:['CV language','简历语言','履歷語言'], portal:['Simulated company website','模拟公司网站','模擬公司網站'], saveApplication:['Save demo application','保存演示申请','儲存示範申請']
};
export const agentText = (key, language='en') => AGENT_COPY[key]?.[language==='zh'?1:language==='tw'?2:0] || key;

export function resolveDemoIntent(mode, text) {
  const value=text.toLowerCase();
  if(mode==='cv') {
    if(/繁|traditional|translate|翻译|翻譯/.test(value)) return 'translate';
    if(/reviewed|approve|已确认|已確認/.test(value)) return 'approve';
    if(/achievement|18%|成果|stronger/.test(value)) return 'stronger';
    if(/tailor|cv|简历|履歷|定制/.test(value)) return 'tailor';
  }
  if(mode==='marketing') {
    if(/小红书|小紅書|xiaohongshu/.test(value)) return 'xhs';
    if(/email|邮件|郵件/.test(value)) return 'email';
    if(/linkedin|campaign|文案/.test(value)) return 'linkedin';
  }
  if(mode==='apply') {
    if(/stop|停止/.test(value)) return 'stop';
    if(/review|check|确认|確認/.test(value)) return 'check';
    if(/fill|apply|application|填写|填寫/.test(value)) return 'fill';
  }
  if(mode==='profile') {
    if(/shar|privacy|分享/.test(value)) return 'privacy';
    if(/preview|traditional|预览|預覽|繁/.test(value)) return 'preview';
  }
  return 'fallback';
}

export function createAgentDemo({ getLanguage, getCandidate, getJob, refresh, onMarketing, onFill, onStop, onPreview, getApplicationStatus = () => ({}) }) {
  const sessions={};
  let cvStage='original', cvLanguage='en', cvReviewed=false;
  const tr=key=>agentText(key,getLanguage());
  const session=mode=>sessions[mode] ||= [{role:'agent',key:{cv:'helloCv',marketing:'helloMarketing',apply:'helloApply',profile:'helloProfile'}[mode]}];
  const suggestions=mode=>({cv:cvStage==='original'?['tailor']:cvReviewed?['stronger','translate']:['stronger','translate','approve'],marketing:['linkedin','xhs','email'],apply:getApplicationStatus().saved?['check']:getApplicationStatus().running?['stop','check']:['fill','check'],profile:['preview','privacy']})[mode];
  function rail(mode) {
    const candidate=getCandidate(), job=getJob();
    const context=mode==='apply'?`<details class="agent-candidate" open><summary>${tr('candidate')}</summary><dl>${[['name',candidate.name],['emailLabel',candidate.email],['headline',candidate.headline],['destination',candidate.destination],['workStatus',candidate.status],['stage',candidate.stage],['expiry',candidate.expiry],['sponsorship',candidate.sponsorship],['qualifications',candidate.qualification],['mainlandNotes',candidate.mainlandNotes]].filter(([,v])=>v).map(([k,v])=>`<div><dt>${tr(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></details>`:'';
    return `<aside class="agent-rail" aria-label="${tr('agent')}" data-agent-mode="${mode}"><header class="agent-rail-head"><span class="agent-orb" aria-hidden="true">✧</span><div><strong>${tr('agent')}</strong><small><i></i> ${tr(mode)}</small></div><button class="icon-button" data-agent-restart="${mode}" aria-label="${tr('restart')}" title="${tr('restart')}">↺</button></header><div class="agent-demo-label">${tr('demo')}</div><nav class="agent-mode-nav" aria-label="${tr('agent')}">${[['cv','cv'],['profile','profile'],['marketing','marketing'],['apply','agent']].map(([m,f])=>`<button data-feature="${f}" class="${mode===m?'active':''}" ${mode===m?'aria-current="page"':''}>${tr(m)}</button>`).join('')}</nav><div class="agent-context"><small>${tr('context')}</small><strong>${esc(mode==='cv'?'Alex Chen → Forma Studio':job ? `${job.company} · ${job.title}` : tr('profile'))}</strong>${mode==='cv'?`<span>${tr('fictional')} · Figma · UX</span>`:''}</div>${context}<div class="agent-messages" role="log" aria-label="${tr(mode)}" aria-live="polite" aria-relevant="additions">${session(mode).map(m=>`<div class="agent-message ${m.role}"><small>${m.role==='agent'?'✧ '+tr('agent'):tr('you')}</small><p>${esc(m.key?tr(m.key):m.text)}</p></div>`).join('')}</div><div class="agent-suggestions">${suggestions(mode).map(key=>`<button data-agent-prompt="${key}" data-mode="${mode}">${tr(key)} <span>↗</span></button>`).join('')}</div><form class="agent-composer" data-agent-form="${mode}"><label class="sr-only" for="agent-message-${mode}">${tr('placeholder')}</label><textarea id="agent-message-${mode}" name="message" rows="2" maxlength="1200" required placeholder="${tr('placeholder')}"></textarea><button type="submit" aria-label="${tr('send')}">↑</button></form><p class="agent-footnote">${tr('private')}</p></aside>`;
  }
  function syncRail(mode) {
    const current=document.querySelector(`[data-agent-mode="${mode}"]`);
    if(!current)return;
    current.outerHTML=rail(mode);
    const log=document.querySelector('.agent-messages'); if(log)log.scrollTop=log.scrollHeight;
  }
  function reply(mode,key) {session(mode).push({role:'agent',key});syncRail(mode);}
  function send(mode,text,intent=resolveDemoIntent(mode,text)) {
    session(mode).push({role:'user',text});
    if(mode==='cv' && ['tailor','stronger','translate','approve'].includes(intent)) {
      if(intent==='approve' && cvStage==='original')intent='tailor';
      if(intent!=='approve')cvReviewed=false;
      if(intent==='translate')cvLanguage='tw';
      if(intent==='approve')cvReviewed=true;else if(intent!=='translate'||cvStage==='original')cvStage=intent;
      session(mode).push({role:'agent',key:{tailor:'tailoredReply',stronger:'strongerReply',translate:'translateReply',approve:'approvedReply'}[intent]});refresh();
    } else if(mode==='marketing' && ['linkedin','xhs','email'].includes(intent)) {onMarketing(intent==='xhs'?'xiaohongshu':intent);reply(mode,'marketingReply');}
    else if(mode==='apply' && intent==='fill') {const status=getApplicationStatus();if(status.saved)reply(mode,'saved');else if(!status.running){reply(mode,'working');onFill();}}
    else if(mode==='apply' && intent==='stop') {onStop();reply(mode,'stopped');}
    else if(mode==='apply' && intent==='check')reply(mode,'reviewApply');
    else if(mode==='profile' && intent==='preview') {onPreview('tw');reply(mode,'previewReply');}
    else if(mode==='profile' && intent==='privacy')reply(mode,'privacyReply');
    else reply(mode,'fallback');
    const log=document.querySelector('.agent-messages');if(log)log.scrollTop=log.scrollHeight;
    document.querySelector(`[data-agent-form="${mode}"] textarea`)?.focus({preventScroll:true});
  }
  function cvPage() {
    const language=cvLanguage, tailored=cvStage!=='original';
    const descriptions={en:['Product designer working across research, prototypes and design systems.','Product designer bringing user research, Figma prototyping and design-system experience to Forma Studio’s cross-border team.'],zh:['专注用户研究、原型和设计系统的产品设计师。','以用户研究、Figma 原型和设计系统经验，为 Forma Studio 跨境团队贡献力量的产品设计师。'],tw:['專注使用者研究、原型及設計系統的產品設計師。','以使用者研究、Figma 原型及設計系統經驗，為 Forma Studio 跨境團隊貢獻力量的產品設計師。']};
    const facts=tailored?[SAMPLE_FACTS[1],SAMPLE_FACTS[2],SAMPLE_FACTS[0],SAMPLE_FACTS[3],SAMPLE_FACTS[4]]:SAMPLE_FACTS;
    return `<div class="page-heading"><div><div class="eyebrow">ACROSS / ${tr('cv')}</div><h1>${tr('cvTitle')}</h1><p>${tr('cvSub')}</p></div></div><div class="agent-layout"><section class="agent-artifact"><div class="demo-opportunity"><span class="agent-orb">f</span><div><small>${tr('role')}</small><h2>Product Designer <span>· Forma Studio</span></h2><p>Hong Kong · Hybrid · Figma / Research / Design systems</p></div></div><div class="cv-preview-toolbar"><span class="tag mint">${tr(tailored?'tailored':'original')}</span><label>${tr('documentLanguage')} <select data-agent-cv-language><option value="en" ${language==='en'?'selected':''}>English</option><option value="zh" ${language==='zh'?'selected':''}>简体中文</option><option value="tw" ${language==='tw'?'selected':''}>繁體中文</option></select></label></div><article class="demo-cv-paper" lang="${language==='tw'?'zh-Hant':language==='zh'?'zh-Hans':'en'}"><header><small>PRODUCT / DESIGN / CROSS-BORDER</small><h2>Alex Chen<span>陈晓</span></h2><p>Product Designer · Shenzhen ↔ Hong Kong</p><span class="cv-review-badge">${tr(cvReviewed?'reviewed':'draft')}</span></header><h3>${tr('summary')}</h3><p class="cv-summary ${tailored?'cv-highlight':''}">${esc(cvStage==='stronger'?facts[0][language]+' '+descriptions[language][1]:descriptions[language][tailored?1:0])}</p><h3>${tr('experience')}</h3><ul>${facts.map((f,i)=>`<li class="${tailored&&i===0?'cv-highlight':''}">${esc(f[language])}<small>${tr('evidence')} ${SAMPLE_FACTS.indexOf(f)+1}</small></li>`).join('')}</ul><h3>${tr('skills')}</h3><div class="demo-skill-row">${['Figma','User research','Prototyping','Design systems'].map(s=>`<span>${s}</span>`).join('')}</div><footer>${tr('fictional')} · ${tr('demo')}</footer></article><button class="btn btn-outline" data-view="cv">${tr('studio')} ↗</button></section>${rail('cv')}</div>`;
  }
  document.addEventListener('click',e=>{
    const prompt=e.target.closest('[data-agent-prompt]'); if(prompt){send(prompt.dataset.mode,tr(prompt.dataset.agentPrompt),prompt.dataset.agentPrompt);return;}
    const reset=e.target.closest('[data-agent-restart]');if(reset){const mode=reset.dataset.agentRestart;onStop();delete sessions[mode];if(mode==='cv'){cvStage='original';cvLanguage='en';cvReviewed=false;refresh();}else syncRail(mode);}
  });
  document.addEventListener('submit',e=>{const mode=e.target.dataset.agentForm;if(!mode)return;e.preventDefault();const text=new FormData(e.target).get('message').trim();if(text)send(mode,text.slice(0,1200));});
  document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.target.matches('[data-agent-form] textarea')){e.preventDefault();e.target.form.requestSubmit();}});
  document.addEventListener('change',e=>{if(e.target.matches('[data-agent-cv-language]')){cvLanguage=e.target.value;cvReviewed=false;refresh();}});
  return {rail,cvPage,reply,syncRail,tr,resetApply:()=>{delete sessions.apply;},clear:()=>{for(const k of Object.keys(sessions))delete sessions[k];cvStage='original';cvLanguage='en';cvReviewed=false;}};
}
