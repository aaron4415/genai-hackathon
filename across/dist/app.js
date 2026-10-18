import { createAgentDemo } from './agent-demo.js';
import { createCareerWorkspace } from './career-ui.js';
import { careerText } from './career-i18n.js';
const icons = {
  search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  briefcase:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a25 25 0 0 0 18 0M12 12v3"/>',
  bookmark:'<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4z"/>',
  document:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  sparkle:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4M18 4h4"/>',
  book:'<path d="M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2z"/>',
  arrow:'<path d="M4 12h15m-5-5 5 5-5 5"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6"/>',
  check:'<path d="m5 12 4 4L20 5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  external:'<path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/>',
  plus:'<path d="M12 4v16M4 12h16"/>',
  route:'<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h4"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  logout:'<path d="M9 3H4v18h5m3-9h9m-4-4 4 4-4 4"/>'
};
const icon = name => `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.grid}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mark = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 23 16 6h6L10 23zm12 0L28 6h4L20 23z" fill="currentColor"/></svg>';

const jobs = [
  {id:'j1',title:'Product Designer',zh:'产品设计师',tw:'產品設計師',company:'Forma Studio',initial:'f',bg:'#eeeee7',ink:'#4e5a42',city:'Hong Kong',area:'Quarry Bay',mode:'Hybrid',category:'Design',salary:'HK$32k – 45k',min:32000,days:1,skills:['Figma','Design systems','English · 普通话'],sponsor:true,featured:true,summary:'Shape thoughtful digital experiences for a new generation of financial products. Join a small, collaborative team working across Hong Kong and Shenzhen.',requirements:['3+ years of product design experience with a portfolio of shipped work.','Confidence in prototyping, user research and design systems.','Able to collaborate in English; Mandarin is useful for this team.'],benefits:['3 office days / 2 remote days','20 days annual leave','Cross-border team visits with expenses covered']},
  {id:'j2',title:'Frontend Engineer',zh:'前端工程师',tw:'前端工程師',company:'Orbit Labs',initial:'◒',bg:'#eee9f5',ink:'#8c77a8',city:'Shenzhen',area:'Nanshan',mode:'On-site',category:'Engineering',salary:'RMB 25k – 38k',min:25000,days:1,skills:['React','TypeScript','普通话 · English'],sponsor:false,featured:true,summary:'Build intuitive tools that make complex workflows feel simple. Work closely with our product and design team in our Nanshan studio.',requirements:['3+ years building production web applications.','Strong React, TypeScript and accessible interface skills.','Mandarin working proficiency and English documentation skills.'],benefits:['Five-day working week','Learning and equipment budget','Relocation support discussed individually']},
  {id:'j3',title:'Data Analyst',zh:'数据分析师',tw:'數據分析師',company:'Kindred Health',initial:'k.',bg:'#f8e9df',ink:'#bc8768',city:'Hong Kong',area:'Science Park',mode:'Hybrid',category:'Data',salary:'HK$28k – 40k',min:28000,days:2,skills:['SQL','Python','Healthcare'],sponsor:true,summary:'Turn healthcare data into insights that help people live better. Partner with a regional team to improve our patient experience.',requirements:['2+ years of analytics experience and strong SQL skills.','Experience communicating findings to non-technical teams.','English working proficiency; Cantonese is helpful for this role.'],benefits:['Flexible working hours','Medical and dental cover','Individual development budget']},
  {id:'j4',title:'Growth Marketing Manager',zh:'增长营销经理',tw:'增長行銷經理',company:'Morrow Collective',initial:'m',bg:'#e8eee6',ink:'#78916b',city:'Shenzhen',area:'Futian',mode:'Hybrid',category:'Marketing',salary:'RMB 22k – 32k',min:22000,days:2,skills:['Growth','Content','粤语 · 普通话'],sponsor:false,summary:'Connect a growing lifestyle brand with communities on both sides of the border. Bring a curious, analytical approach to regional campaigns.',requirements:['3+ years in growth or content marketing.','Experience with campaign measurement and experimentation.','Mandarin and Cantonese communication skills for this team.'],benefits:['Two remote days per week','Quarterly cross-border team gatherings','Transparent performance bonus structure']},
  {id:'j5',title:'Full Stack Developer',zh:'全栈开发工程师',tw:'全端開發工程師',company:'Layer One',initial:'L',bg:'#e6edf0',ink:'#698894',city:'Hong Kong',area:'Sheung Wan',mode:'Remote',category:'Engineering',salary:'HK$38k – 55k',min:38000,days:3,skills:['Node.js','React','PostgreSQL'],sponsor:true,summary:'Help ambitious teams move from idea to working product. Own features from the first conversation through to release in a supportive engineering team.',requirements:['4+ years of full stack development.','Experience with APIs, modern frontend frameworks and testing.','Ability to work Hong Kong business hours; work location subject to agreement.'],benefits:['Remote-first within approved locations','25 days annual leave','Annual equipment allowance']},
  {id:'j6',title:'AI Product Manager',zh:'AI 产品经理',tw:'AI 產品經理',company:'Pollen Technology',initial:'✳',bg:'#f3eedc',ink:'#a49355',city:'Shenzhen',area:'Nanshan',mode:'Hybrid',category:'Product',salary:'RMB 30k – 45k',min:30000,days:3,skills:['Product strategy','AI / ML','B2B SaaS'],sponsor:false,summary:'Bring useful AI products to regional businesses. Work with engineers and researchers to turn customer needs into clear, measurable product decisions.',requirements:['3+ years in product management, ideally B2B software.','Experience evaluating AI product quality and user value.','Strong Mandarin and English stakeholder communication.'],benefits:['Flexible working arrangements','Conference and learning support','Cross-border customer exposure']},
  {id:'j7',title:'UX Researcher',zh:'用户体验研究员',tw:'使用者體驗研究員',company:'Forma Studio',initial:'f',bg:'#eeeee7',ink:'#4e5a42',city:'Hong Kong',area:'Quarry Bay',mode:'Hybrid',category:'Design',salary:'HK$30k – 42k',min:30000,days:4,skills:['Research','Interviews','Cantonese'],sponsor:true,summary:'Help us understand how people use financial products through thoughtful qualitative and quantitative research.',requirements:['2+ years in user research.','Experience planning and running interviews.','Cantonese and English proficiency for local interviews.'],benefits:['20 days annual leave','Mentorship programme','Hybrid working']},
  {id:'j8',title:'Backend Engineer',zh:'后端工程师',tw:'後端工程師',company:'Orbit Labs',initial:'◒',bg:'#eee9f5',ink:'#8c77a8',city:'Shenzhen',area:'Futian',mode:'On-site',category:'Engineering',salary:'RMB 28k – 42k',min:28000,days:5,skills:['Python','APIs','Cloud'],sponsor:false,summary:'Build reliable services behind everyday tools for cross-border teams.',requirements:['3+ years building backend services.','Experience with Python, API design and cloud infrastructure.','Mandarin working proficiency.'],benefits:['Learning budget','Five-day working week','Relocation discussion available']}
];
const resources = [
 {name:'IANG',label:'Non-local graduates',body:'For qualifying non-local graduates and qualifying GBA campus graduates. Recent-graduate applications generally do not require a job offer. Holding a qualifying degree alone is not permission to work; record the actual admission status and conditions.',url:'https://www.immd.gov.hk/eng/services/visas/IANG.html'},
 {name:'ASMTP',label:'Mainland professionals',body:'An employment admission route for Mainland residents with relevant professional skills. A confirmed employment offer and employer-related information form part of the assessment. Ask about sponsorship needs rather than assuming a candidate already has permission.',url:'https://www.immd.gov.hk/eng/services/visas/ASMTP.html'},
 {name:'TTPS',label:'Top Talent Pass Scheme',body:'A separate talent-admission route with category-specific requirements. A Hong Kong job offer is not required at the initial application stage. Record whether permission has been granted, is pending, or is only being explored.',url:'https://www.immd.gov.hk/eng/services/visas/TTPS.html'},
 {name:'Working in the Mainland',label:'Hong Kong → Shenzhen',body:'Hong Kong residents are no longer required to obtain the former Mainland employment permit. Identity documents and employment-related procedures still matter. Requirements for people using other travel documents can differ; check the official guidance for individual circumstances.',url:'https://www2.jobs.gov.hk/0/en/information/Mainland/Guide/'}
];
const features = [
 {id:'cv',icon:'document',name:'CV studio',available:true,action:'Open CV studio',sub:'Your experience. A new perspective.',body:'Adapt Chinese CVs into English, tailor them to a job description, and refine your story with evidence you approve.',steps:['Bring your experience','Choose a role','Review your tailored draft']},
 {id:'marketing',icon:'sparkle',name:'Employer marketing',available:true,action:'Open marketing demo',sub:'Make your opportunity understood.',body:'Create editable recruitment copy for six channels in English, Simplified Chinese and Traditional Chinese using a sample job or your local draft.',steps:['Add a job description','Choose audience & channel','Review the campaign']},
 {id:'profile',icon:'globe',name:'Multilingual talent profile',available:true,action:'Create my share profile',sub:'Be discovered on both sides.',body:'Create and approve your introduction in English, Simplified Chinese and Traditional Chinese. Share selected public details before sending a tailored CV.',steps:['Build your profile','Review each language','Choose what to share']},
 {id:'agent',icon:'route',name:'Job application agent',available:true,action:'Try application demo',sub:'Less repetition. More intention.',body:'Choose a fictional role and try the scripted assistant on a simulated application form. Applications stay in this browser.',steps:['Choose an opportunity','Prepare the application','Review before submission']}
];
const translations = {
 en:{workspace:"Workspace",interactiveDemo:"INTERACTIVE DEMO",interfaceLanguage:"Interface language",openProfile:"Open profile",editProfile:"Edit your profile",openNavigation:"Open navigation",mainNavigation:"Main navigation",personalWorkspace:"Personal workspace",brandTagline:"CAREERS WITHOUT BORDERS",promoTitle:"A world beyond the familiar.",promoPeople:"Find your people.",promoChapter:"Build your next chapter.",aboutAcross:"Get to know Across",resetDemo:"Reset demo",skipContent:"Skip to content",hiringOverview:"Hiring overview",jobPosts:"Your job posts",talentPreview:"Talent preview",cv:'CV studio',shareProfile:'Share my profile',discover:'Discover jobs',saved:'Saved jobs',applications:'My applications',profile:'My profile',tools:'AI workspace',resources:'Cross-border guide',candidate:'Candidate workspace',employer:'Employer workspace',hiring:'For employers',welcome:'A little closer to your next chapter.',greeting:'Good to see you,',hero:'Your next chapter,',hero2:'on either side.',subtitle:'Discover opportunities in Hong Kong and Shenzhen. Two cities. More possibilities. One place to start.',search:'Search jobs',placeholder:'Job title, skill or company',recommended:'Opportunities to explore',recommendedSub:'A fresh perspective on where your skills could take you.',both:'Both cities',hk:'Hong Kong',sz:'Shenzhen',filters:'All disciplines',modes:'Any work style',recent:'Most recent',oldest:'Oldest first',all:'All opportunities',results:'opportunities',save:'Save job',unsave:'Unsave job',month:'/ month',details:'View role',work:'YOUR WORKSPACE',explore:'EXPLORE',complete:'Complete profile',yourProfile:'Your profile',progress:'Profile completeness',profileTip:'Add your work status so you can keep the right questions in view.',profileFoot:'Your profile stays in this browser',routeTitle:'Two cities. One career journey.',routeBody:'Get to know the practical side of working across the border.',routeLink:'Explore the guide',coming:'A little help for your next step.',comingBody:'Try the marketing and application demos, and explore what comes next.',exploreTools:'Explore AI tools',footer:'Made for a world of possibilities.',demo:'Demo workspace · All opportunities are fictional',more:'Show more opportunities',less:'Show fewer opportunities',noResults:'No opportunities here yet',noResultsSub:'Try a different keyword, city or work style.',reset:'Clear filters',savedSub:'Keep the opportunities you want to come back to.',apply:'Try demo application',profileSub:'A clearer picture of you, across both markets.',saveProfile:'Save profile',back:'Back to opportunities'},
 zh:{workspace:"工作空间",interactiveDemo:"互动演示",interfaceLanguage:"界面语言",openProfile:"打开我的资料",editProfile:"编辑我的资料",openNavigation:"打开导航",mainNavigation:"主导航",personalWorkspace:"个人工作空间",brandTagline:"职业无界",promoTitle:"探索熟悉之外的世界。",promoPeople:"找到同路人。",promoChapter:"开启职业新篇章。",aboutAcross:"了解 Across",resetDemo:"重置演示",skipContent:"跳至正文",hiringOverview:"招聘概览",jobPosts:"我的职位",talentPreview:"人才预览",cv:'简历工作室',shareProfile:'分享我的资料',discover:'发现职位',saved:'收藏职位',applications:'我的申请',profile:'我的资料',tools:'AI 工作空间',resources:'跨境就业指南',candidate:'求职者工作空间',employer:'雇主工作空间',hiring:'雇主入口',welcome:'离你的下一站，更近一步。',greeting:'很高兴见到你，',hero:'你的职业下一站，',hero2:'不止一座城。',subtitle:'探索香港与深圳的工作机会。双向连接，让更多可能发生。',search:'搜索职位',placeholder:'职位名称、技能或公司',recommended:'探索新的工作机会',recommendedSub:'从另一个角度，看见你的职业可能。',both:'全部城市',hk:'香港',sz:'深圳',filters:'全部职能',modes:'全部工作模式',recent:'最新发布',oldest:'最早发布',all:'全部机会',results:'个机会',save:'收藏职位',unsave:'取消收藏',month:'/ 月',details:'查看职位',work:'我的空间',explore:'探索',complete:'完善资料',yourProfile:'你的资料',progress:'资料完整度',profileTip:'补充你的工作许可状态，让下一步沟通更清晰。',profileFoot:'资料仅保存在当前浏览器',routeTitle:'双城生活，同一个职业方向。',routeBody:'了解跨境工作的实际安排与需要核实的信息。',routeLink:'查看就业指南',coming:'为你的下一步，准备更多助力。',comingBody:'体验招聘营销与职位申请演示，探索更多未来工具。',exploreTools:'探索 AI 工具',footer:'连接双城，发现更多可能。',demo:'演示工作空间 · 所有职位均为虚构',more:'显示更多职位',less:'收起更多职位',noResults:'暂时没有符合条件的机会',noResultsSub:'试试其他关键词、城市或工作模式。',reset:'清除筛选',savedSub:'收藏感兴趣的机会，方便稍后查看。',apply:'体验演示申请',profileSub:'让两地的团队，更清楚地认识你。',saveProfile:'保存资料',back:'返回职位'},
 tw:{workspace:"工作空間",interactiveDemo:"互動示範",interfaceLanguage:"介面語言",openProfile:"開啟我的資料",editProfile:"編輯我的資料",openNavigation:"開啟導覽",mainNavigation:"主要導覽",personalWorkspace:"個人工作空間",brandTagline:"職業無界",promoTitle:"探索熟悉以外的世界。",promoPeople:"找到同行者。",promoChapter:"開啟職業新篇章。",aboutAcross:"認識 Across",resetDemo:"重設示範",skipContent:"跳至正文",hiringOverview:"招聘概覽",jobPosts:"我的職位",talentPreview:"人才預覽",cv:'履歷工作室',shareProfile:'分享我的檔案',discover:'探索職位',saved:'收藏職位',applications:'我的申請',profile:'我的資料',tools:'AI 工作空間',resources:'跨境就業指南',candidate:'求職者工作空間',employer:'僱主工作空間',hiring:'僱主入口',welcome:'離你的下一站，更近一步。',greeting:'很高興見到你，',hero:'你的職業下一站，',hero2:'不止一座城。',subtitle:'探索香港與深圳的工作機會。雙向連接，讓更多可能發生。',search:'搜尋職位',placeholder:'職位名稱、技能或公司',recommended:'探索新的工作機會',recommendedSub:'從另一個角度，看見你的職業可能。',both:'全部城市',hk:'香港',sz:'深圳',filters:'全部職能',modes:'全部工作模式',recent:'最新發佈',oldest:'最早發佈',all:'全部機會',results:'個機會',save:'收藏職位',unsave:'取消收藏',month:'/ 月',details:'查看職位',work:'我的空間',explore:'探索',complete:'完善資料',yourProfile:'你的資料',progress:'資料完整度',profileTip:'補充你的工作許可狀態，讓下一步溝通更清晰。',profileFoot:'資料僅保存在目前瀏覽器',routeTitle:'雙城生活，同一個職業方向。',routeBody:'了解跨境工作的實際安排與需要核實的資訊。',routeLink:'查看就業指南',coming:'為你的下一步，準備更多助力。',comingBody:'體驗招聘行銷與職位申請示範，探索更多未來工具。',exploreTools:'探索 AI 工具',footer:'連接雙城，發現更多可能。',demo:'示範工作空間 · 所有職位均為虛構',more:'顯示更多職位',less:'收起更多職位',noResults:'暫時沒有符合條件的機會',noResultsSub:'試試其他關鍵字、城市或工作模式。',reset:'清除篩選',savedSub:'收藏感興趣的機會，方便稍後查看。',apply:'體驗示範申請',profileSub:'讓兩地的團隊，更清楚地認識你。',saveProfile:'儲存資料',back:'返回職位'}
};
function stored(){try{return JSON.parse(localStorage.getItem('across-demo-v1')) || {}}catch{return {}}}
const savedData=stored();
const state={view:'discover',workspace:'candidate',city:'both',query:'',discipline:'all',mode:'all',sort:'recent',expanded:false,lang:['en','zh','tw'].includes(savedData.lang)?savedData.lang:'en',saved:Array.isArray(savedData.saved)?savedData.saved.filter(id=>jobs.some(j=>j.id===id)):[],applications:Array.isArray(savedData.applications)?savedData.applications.filter(x=>jobs.some(j=>j.id===x.jobId)).slice(0,100):[],profile:{name:'Alex Chen',headline:'Product designer · Shenzhen',email:'alex.chen@example.com',destination:'Hong Kong',status:'Not sure yet',stage:'Exploring',expiry:'',sponsorship:'Not sure',qualification:'',...savedData.profile},vacancies:Array.isArray(savedData.vacancies)?savedData.vacancies.slice(0,50):[],marketingEdits:(savedData.marketingEdits&&typeof savedData.marketingEdits==='object'&&!Array.isArray(savedData.marketingEdits))?savedData.marketingEdits:{},applyTarget:null,applySuccess:null,applyAgentUsed:false,agentRunning:false,agentStep:null,agentCompletedSteps:[]};
let toastTimer;
const t=k=>translations[state.lang][k] || translations.en[k] || k;
const title=j=>state.lang==='en'?j.title:state.lang==='zh'?j.zh:j.tw;
const city=c=>c==='Hong Kong'?t('hk'):c==='Shenzhen'?t('sz'):c;
const profilePercent=()=>Math.round([state.profile.name,state.profile.headline,state.profile.email,state.profile.status!=='Not sure yet',state.profile.qualification].filter(Boolean).length/5*100);
function persist(){try{localStorage.setItem('across-demo-v1',JSON.stringify({saved:state.saved,applications:state.applications,profile:state.profile,lang:state.lang,vacancies:state.vacancies,marketingEdits:state.marketingEdits}));return true}catch{toast('Browser storage is unavailable. Changes last for this visit only.');return false}}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500)}
function logo(j,large=false){return `<span class="company-logo ${large?'large':''}" style="--logo-bg:${j.bg};--logo-ink:${j.ink}" aria-hidden="true">${j.initial}</span>`}
function navItem(view,label,i,extra=''){return `<button class="nav-item ${state.view===view?'active':''}" data-view="${view}" ${state.view===view?'aria-current="page"':''}>${icon(i)}<span>${label}</span>${extra}</button>`}
function skyline(){return `<div class="hero-art" aria-hidden="true"><svg viewBox="0 0 500 250" preserveAspectRatio="xMaxYMax meet"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#dce7d3" stop-opacity="0"/><stop offset="1" stop-color="#b7c8a7" stop-opacity=".22"/></linearGradient></defs><circle cx="354" cy="128" r="123" fill="#e1e9d8"/><circle cx="354" cy="128" r="94" fill="none" stroke="#d0ddc3" stroke-dasharray="3 7"/><path d="M20 230Q130 150 250 215T500 180V250H20Z" fill="url(#sky)"/><g fill="#c6d5ba" stroke="#afc39f" stroke-width=".7"><path d="M55 220v-53h23v53m6 0v-67h16v67m9 0v-89l12-15 12 15v89m-13-89v-26m22 115v-43h23v43m13 0V94h13v-25h10v25h12v126m-18-126v126m30 0v-69h22v69m10 0v-96h23v96m8 0v-50h20v50m20 0V116h21v104m-10-104V99m21 121V77l15-20 15 20v143m-15-143v143m24 0v-83h23v83m9 0V92l12-17 12 17v128m7 0v-53h30v53m7 0v-99h25v99"/></g><path d="M0 237h500" stroke="#afc49f"/><path d="M0 227q200 35 500-5" stroke="#c7d5bb" fill="none"/><path d="M134 172Q242 32 368 133" stroke="#8da876" stroke-width="1.2" stroke-dasharray="4 5" fill="none"/><circle cx="134" cy="172" r="5" fill="#eaf0e5" stroke="#89a570"/><circle cx="368" cy="133" r="5" fill="#eaf0e5" stroke="#89a570"/><path d="m242 72 8-4-3 9-1-4z" fill="#89a570"/></svg></div><div class="city-note" aria-hidden="true">HONG KONG <i></i> SHENZHEN</div><div class="city-label" aria-hidden="true">22.3193° N ↔ 22.5431° N</div>`}
function sidebar(){return `<div class="mobile-scrim" data-action="close-menu"></div><aside class="sidebar" aria-label="${t('mainNavigation')}"><a href="#discover" class="brand" aria-label="Across home"><span class="brandmark">${mark}</span>across<span style="color:#99b18c">.</span></a><div class="brand-sub">${t('brandTagline')}</div><button class="workspace-switch" data-action="switch-workspace">${icon(state.workspace==='candidate'?'user':'briefcase')}<span>${t(state.workspace==='candidate'?'candidate':'employer')}</span>${icon('down')}</button><div class="nav-label">${t('work')}</div><nav>${state.workspace==='candidate'?`${navItem('discover',t('discover'),'grid')}${navItem('saved',t('saved'),'bookmark',state.saved.length?`<span class="count">${state.saved.length}</span>`:'')}${navItem('applications',t('applications'),'briefcase')}${navItem('profile',t('profile'),'user')}${navItem('cv-demo',t('cv'),'document')}${navItem('talent-profile',t('shareProfile'),'globe')}`:`${navItem('employer',t('hiringOverview'),'grid')}${navItem('vacancies',t('jobPosts'),'briefcase')}${navItem('talent',t('talentPreview'),'people')}`}</nav><div class="nav-label" style="margin-top:26px">${t('explore')}</div><nav>${navItem('tools',t('tools'),'sparkle')}${navItem('resources',t('resources'),'book')}</nav><div class="sidebar-bottom"><div class="side-promo">${icon('globe')}<h3>${t('promoTitle')}</h3><p>${t('promoPeople')}<br>${t('promoChapter')}</p><button data-view="resources">${t('aboutAcross')} ${icon('arrow')}</button></div><div class="side-user"><span class="avatar">${esc(initials())}</span><div><strong>${esc(state.profile.name)}</strong><small>${t('personalWorkspace')}</small></div><button aria-label="${t('editProfile')}" data-view="profile">${icon('settings')}</button></div></div></aside>`}
function initials(){return state.profile.name.split(' ').filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase()}
function topbar(){let name=state.view==='marketing'?agent.tr('marketing'):['cv','cv-demo'].includes(state.view)?t('cv'):state.view==='talent-profile'?t('shareProfile'):state.view==='employer'?t('hiringOverview'):state.view==='vacancies'?t('jobPosts'):state.view==='talent'?t('talentPreview'):t(state.view);return `<header class="topbar"><button class="mobile-menu" data-action="menu" aria-label="${t('openNavigation')}" aria-expanded="false">${icon('menu')}</button><div class="breadcrumb"><span>${t('workspace')}</span>${icon('chevron')}<span>${esc(name)}</span></div><div class="top-actions"><span class="demo-pill">${t('interactiveDemo')}</span><label class="sr-only" for="language">${t('interfaceLanguage')}</label><select class="language" id="language"><option value="en" ${state.lang==='en'?'selected':''}>EN</option><option value="zh" ${state.lang==='zh'?'selected':''}>简体中文</option><option value="tw" ${state.lang==='tw'?'selected':''}>繁體中文</option></select><span class="divider"></span><button class="text-btn" data-action="switch-workspace">${t(state.workspace==='candidate'?'hiring':'candidate')} ${icon('external')}</button><button class="avatar" data-view="profile" aria-label="${t('openProfile')}">${esc(initials())}</button></div></header>`}
function footer(){return `<footer class="footer"><span>© 2026 Across · ${t('footer')}</span><div><span>${t('demo')}</span><button class="reset-link" data-action="reset-demo">${t('resetDemo')}</button></div></footer>`}
function search(){return `<form id="search-form" class="search-box" role="search">${icon('search')}<label for="job-search" class="sr-only">${t('placeholder')}</label><input id="job-search" name="query" value="${esc(state.query)}" placeholder="${t('placeholder')}" autocomplete="off"><span class="shortcut" aria-hidden="true">⌘ K</span><button class="btn btn-primary" type="submit">${t('search')} ${icon('arrow')}</button></form>`}
function filteredJobs(){return jobs.filter(j=>(state.view!=='saved'||state.saved.includes(j.id))&&(state.city==='both'||j.city===state.city)&&(state.discipline==='all'||j.category===state.discipline)&&(state.mode==='all'||j.mode===state.mode)&&(!state.query||[j.title,j.zh,j.tw,j.company,j.city,j.area,...j.skills].join(' ').toLowerCase().includes(state.query.toLowerCase()))).sort((a,b)=>state.sort==='oldest'?b.days-a.days:a.days-b.days)}
function jobCard(j){const saved=state.saved.includes(j.id);return `<article class="job-card"><div class="card-top">${logo(j)}<button class="bookmark ${saved?'saved':''}" data-save="${j.id}" aria-label="${t(saved?'unsave':'save')}: ${esc(title(j))}" aria-pressed="${saved}">${icon('bookmark')}</button></div><button class="job-title" data-job="${j.id}"><h3>${esc(title(j))}</h3></button><div class="company-name">${esc(j.company)} <span aria-label="Fictional company">↗</span></div><div class="location">${icon('pin')}${city(j.city)} · ${j.area}</div><div class="tag-row"><span class="tag">${j.mode}</span><span class="tag">Full-time</span><span class="tag mint">${esc(j.skills[0])}</span></div><div class="card-bottom"><span class="salary">${j.salary} <small>${t('month')}</small></span><span class="posted">${j.days}d ago</span></div><div class="job-note">${icon(j.sponsor?'globe':'people')}${j.sponsor?'Open to sponsorship discussion':'Cross-border applicants welcome'}</div></article>`}
function filters(){const count=filteredJobs().length;return `<div class="segmented" role="group" aria-label="Job destination">${[['both','both'],['Hong Kong','hk'],['Shenzhen','sz']].map(([value,label])=>`<button class="${state.city===value?'active':''}" data-city="${value}" aria-pressed="${state.city===value}">${t(label)}${value==='both'?`<span class="tab-count">${state.view==='saved'?state.saved.length:jobs.length}</span>`:''}</button>`).join('')}</div><div class="filter-row"><label class="sr-only" for="discipline">Discipline</label><select class="filter-select" id="discipline"><option value="all">${t('filters')}</option>${['Design','Engineering','Data','Marketing','Product'].map(x=>`<option ${state.discipline===x?'selected':''}>${x}</option>`).join('')}</select><label class="sr-only" for="work-mode">Work style</label><select class="filter-select" id="work-mode"><option value="all">${t('modes')}</option>${['Hybrid','On-site','Remote'].map(x=>`<option ${state.mode===x?'selected':''}>${x}</option>`).join('')}</select><label class="sr-only" for="sort">Sort opportunities</label><select class="filter-select" id="sort"><option value="recent" ${state.sort==='recent'?'selected':''}>${t('recent')}</option><option value="oldest" ${state.sort==='oldest'?'selected':''}>${t('oldest')}</option></select><span class="results-count">${count} ${t('results')}</span></div>`}
function empty(heading,body,button=''){return `<div class="empty">${icon('search')}<h3>${heading}</h3><p>${body}</p>${button}</div>`}
function jobsList(){const all=filteredJobs();return `<div class="jobs-grid">${all.length?all.slice(0,state.expanded?all.length:4).map(jobCard).join(''):empty(t('noResults'),t('noResultsSub'),`<button class="btn btn-outline" data-action="clear-filters">${t('reset')}</button>`)}</div>${all.length>4?`<button class="btn btn-outline load-more" data-action="expand">${t(state.expanded?'less':'more')}${icon('down')}</button>`:''}`}
function profilePanel(){const percent=profilePercent();return `<section class="profile-card"><div class="panel-label">${t('yourProfile')}${icon('user')}</div><div class="profile-identity"><span class="avatar">${esc(initials())}</span><div><h3>${esc(state.profile.name)}</h3><p>${esc(state.profile.headline)}</p></div></div><div class="progress-label"><span>${t('progress')}</span><strong>${percent}%</strong></div><div class="progress" role="progressbar" aria-label="Profile completeness" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><div style="width:${percent}%"></div></div><p class="profile-tip">${t('profileTip')}</p><button class="btn btn-outline full" data-view="profile">${t('complete')}${icon('arrow')}</button><div class="profile-footnote">${icon('shield')}${t('profileFoot')}</div></section>`}
function rightColumn(){return `<aside class="right-column" aria-label="Your cross-border journey">${profilePanel()}<section class="route-card">${icon('route')}<h3>${t('routeTitle')}</h3><p>${t('routeBody')}</p><button class="text-btn" data-view="resources">${t('routeLink')}${icon('arrow')}</button><div class="route-visual" aria-hidden="true"><span>HK</span><i class="route-line"></i><span>SZ</span></div></section><section class="news-card"><div class="eyebrow">A LITTLE CLARITY GOES A LONG WAY</div><a class="news-link" href="https://www.immd.gov.hk/eng/services/visas/IANG.html" target="_blank" rel="noopener noreferrer"><span class="news-icon">${icon('document')}</span><div><p>Understanding IANG & work status</p><small>Immigration Department · Official source</small></div>${icon('external')}</a><button class="news-link" data-view="tools" style="text-align:left;width:100%"><span class="news-icon">${icon('sparkle')}</span><div><p>Meet your future AI workspace</p><small>Four tools. Built around your journey.</small></div>${icon('arrow')}</button></section></aside>`}
function banner(){return `<section class="bottom-banner"><span class="banner-icon">${icon('sparkle')}</span><div><h3>${t('coming')}</h3><p>${t('comingBody')}</p></div><button class="text-btn" data-view="tools">${t('exploreTools')} ${icon('arrow')}</button></section>`}
function discover(){return `<div class="welcome-row"><span>${t('greeting')} <strong>${esc(state.profile.name.split(' ')[0])}.</strong> ${t('welcome')}</span><span class="date">${icon('globe')} HONG KONG ↔ SHENZHEN</span></div><section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> TWO CITIES. ENDLESS POSSIBILITIES.</div><h1>${t('hero')}<br><em>${t('hero2')}</em></h1><p>${t('subtitle')}</p></div>${skyline()}</section>${search()}<div class="discovery"><section aria-label="Job opportunities"><div class="section-heading"><div><h2>${t('recommended')}</h2><p>${t('recommendedSub')}</p></div><button class="text-btn" data-action="all-jobs">${t('all')}${icon('arrow')}</button></div>${filters()}${jobsList()}</section>${rightColumn()}</div>${banner()}`}
function heading(eyebrow,name,body,action=''){return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${name}</h1><p>${body}</p></div>${action}</div>`}
function savedPage(){return `${heading('YOUR SHORTLIST',t('saved'),t('savedSub'))}${search()}<div style="margin-top:25px">${filters()}${jobsList()}</div>`}
function applicationsPage(){return `${heading('YOUR NEXT STEPS',t('applications'),'A little intention behind every opportunity. Demo applications stay in this browser.')}<div class="notice" style="margin:0 0 22px">${icon('shield')} This is a demonstration. No application is sent to an employer or external platform.</div>${state.applications.length?state.applications.map(a=>{const j=jobs.find(x=>x.id===a.jobId);return `<article class="application-card">${logo(j)}<div><button class="job-title" data-job="${j.id}"><h3>${esc(title(j))}</h3></button><p>${j.company} · ${city(j.city)} · ${esc(a.date)}</p></div><div class="application-card-tail">${a.agent?`<span class="status-badge mint">${icon('route')}Assisted by AI agent</span>`:`<span class="status-badge">Demo application saved</span>`}<button class="text-btn" data-job="${j.id}">Reopen ${icon('arrow')}</button></div></article>`}).join(''):empty('Your next step starts here','Explore a role and try the demo application flow.',`<button class="btn btn-primary" data-view="discover">${t('discover')}${icon('arrow')}</button>`)}`}
function options(arr,selected){return arr.map(x=>`<option ${x===selected?'selected':''} value="${esc(x)}">${esc(x)}</option>`).join('')}
function profilePage(){const p=state.profile;return `${heading('YOUR STORY, CLEARLY TOLD',t('profile'),t('profileSub'))}<div class="wide-layout"><form id="profile-form"><section class="panel"><h2>The essentials</h2><p>Start with a few details. This demo uses a fictional profile.</p><div class="form-grid"><label class="field">Display name<input name="name" required maxlength="80" value="${esc(p.name)}" autocomplete="name"></label><label class="field">Email<input type="email" name="email" required maxlength="150" value="${esc(p.email)}" autocomplete="email"></label><label class="field full-width">Professional headline<input name="headline" required maxlength="160" value="${esc(p.headline)}"></label><label class="field">Where would you like to work?<select name="destination" id="destination">${options(['Hong Kong','Shenzhen','Both cities'],p.destination)}</select></label><label class="field">Qualifications & professional certificates<input name="qualification" maxlength="300" value="${esc(p.qualification)}" placeholder="e.g. BSc Computer Science, AWS certification"><small>Self-reported. A professional certificate is separate from work authorisation.</small></label></div></section><section class="panel" id="work-status-panel">${workStatusFields(p.destination)}</section><div class="form-actions"><button class="btn btn-primary" type="submit">${t('saveProfile')}${icon('check')}</button></div><p class="language-note">Profile forms and official-source summaries are shown in English in this demo. Job titles and core discovery navigation support three languages.</p></form><aside class="profile-sidebar">${profilePanel()}<section class="panel" style="margin-top:20px"><span class="feature-icon" style="display:inline-flex">${icon('globe')}</span><h3 style="margin-top:22px">A profile that travels with you.</h3><p style="margin-top:10px">Introduce yourself in English and Chinese, and choose which details appear in your share link.</p><button class="text-btn" data-feature="profile" style="margin-top:15px">Create my share profile ${icon('arrow')}</button></section></aside></div>`}
function workStatusFields(destination){const p=state.profile;return `<h2>Work status & practical arrangements</h2><p>Help your future conversations start with the right questions.</p>${destination!=='Shenzhen'?`<div class="form-grid"><label class="field">Hong Kong admission / residence status<select name="status">${options(['Not sure yet','HK permanent resident / right to land','IANG','TTPS','ASMTP','QMAS','TechTAS','Dependant permission','Other permission','No current permission'],p.status)}</select><small>Choose your actual status, rather than a pathway you might qualify for.</small></label><label class="field">Current stage<select name="stage">${options(['Exploring','Application pending','Permission granted'],p.stage)}</select></label><label class="field">Permission expiry, if applicable<input name="expiry" type="date" value="${esc(p.expiry)}"><small>Check the conditions and limit of stay on your own permission.</small></label><label class="field">Employer sponsorship / approval support<select name="sponsorship">${options(['Not sure','May need employer support','I believe no support is needed','Prefer to discuss'],p.sponsorship)}</select></label></div><div class="notice"><strong>IANG is an admission arrangement, not a professional certificate.</strong> Other routes include ASMTP and TTPS. Your answers are self-reported and do not establish eligibility or a right to work. <a href="https://www.immd.gov.hk/eng/services/visas/immigration-entry-guideline.html" target="_blank" rel="noopener noreferrer">Check official admission guidance ↗</a></div>`:''}${destination!=='Hong Kong'?`<div class="notice"><strong>Planning to work in Shenzhen?</strong> Hong Kong residents no longer need the former Mainland employment permit. Relevant identity documents and employment procedures still matter, and arrangements can differ for holders of other travel documents. <a href="https://www2.jobs.gov.hk/0/en/information/Mainland/Guide/" target="_blank" rel="noopener noreferrer">Read the Labour Department guide ↗</a></div><div class="form-grid"><label class="field full-width">Mainland work arrangements to clarify<textarea name="mainlandNotes" maxlength="1000" placeholder="Identity documents, employer registration, professional recognition or other questions">${esc(p.mainlandNotes || '')}</textarea><small>Do not enter identity document numbers or upload sensitive documents in this demo.</small></label></div>`:''}<div class="notice" style="background:#f8f6ee;color:#9a936f;border-color:#eeebdc">Guidance is preliminary and was checked against official sources on 17 October 2026. Authorities determine formal eligibility. No documents are verified or uploaded by this prototype.</div>`}
function toolsPage(){return `${heading('TOOLS FOR YOUR NEXT CHAPTER',t('tools'),careerText('toolsDescription',state.lang))}<div class="feature-grid">${features.map(f=>`<article class="feature-card" data-feature-card="${f.id}"><div class="feature-card-top"><span class="feature-icon">${icon(f.icon)}</span><span class="tag ${f.available?'mint':''}">${f.available?'Demo available':'Coming later'}</span></div><h2>${career.featureText(f,'name')}</h2><p>${career.featureText(f,'body')}</p><button class="text-btn" data-feature="${f.id}">${career.featureText(f,'action')||'Explore the concept'} ${icon('arrow')}</button></article>`).join('')}</div><div class="notice">CV tailoring and profile translation use AI when configured, with candidate review before export or sharing. Marketing and application tools remain local demos. Nothing is automatically sent to an employer.</div>`}
function resourcesPage(){return `${heading('A LITTLE CLARITY, BEFORE THE LEAP',t('resources'),'Practical starting points for Hong Kong ↔ Shenzhen careers. Go directly to the source.')}<div class="notice" style="margin:0 0 24px">${icon('book')} Official-source summaries · Checked 17 October 2026 · Preliminary information, not an eligibility decision. Your own permission and circumstances determine what applies.</div><div class="resource-grid">${resources.map((r,i)=>`<article class="resource-card"><div class="eyebrow">${i===3?'HONG KONG → MAINLAND':'MAINLAND → HONG KONG'}</div><h2>${r.name}</h2><span class="tag mint">${r.label}</span><p style="margin-top:16px">${r.body}</p><a href="${r.url}" target="_blank" rel="noopener noreferrer">Read the official guidance ${icon('external')}</a></article>`).join('')}</div><section class="panel" style="margin-top:22px"><h2>Bring better questions to the conversation.</h2><ul class="credentials"><li>${icon('document')}<div><strong>Work authorisation and professional qualifications are separate.</strong><small>Ask which permission is held, its current stage and its expiry. Verify role-specific certificates separately.</small></div></li><li>${icon('briefcase')}<div><strong>Compare the whole employment package.</strong><small>Clarify currency, working hours, leave, benefits, work location and any relocation support. This demo does not convert salaries.</small></div></li><li>${icon('people')}<div><strong>Ask about the team's actual working practices.</strong><small>Language, communication style and workplace expectations vary between companies.</small></div></li></ul><button class="btn btn-outline" data-view="profile">Update your work status ${icon('arrow')}</button></section>`}
function employerPage(postsOnly=false){return `${heading('GREAT TEAMS CROSS BORDERS',postsOnly?'Your job posts':'Find your next great teammate.','A shared workspace for opportunities in Hong Kong and Shenzhen.',`<button class="btn btn-primary" data-action="new-vacancy">${icon('plus')}Create demo job</button>`)}${!postsOnly?`<div class="stats"><section class="stat"><small>DEMO JOB POSTS</small><strong>${2+state.vacancies.length}</strong><p>Across two connected cities</p></section><section class="stat"><small>SAMPLE CANDIDATES</small><strong>03</strong><p>Fictional profiles for demonstration</p></section><section class="stat"><small>MARKETS CONNECTED</small><strong>02</strong><p>Hong Kong ↔ Shenzhen</p></section></div>`:''}<section class="panel"><div class="section-heading"><h2>Your opportunities</h2><span class="tag">Demo company · Forma Studio</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Role</th><th>Location</th><th>Work style</th><th>Status</th><th></th></tr></thead><tbody>${jobs.filter(j=>j.company==='Forma Studio').map(j=>`<tr><td><strong>${j.title}</strong><br><small>Full-time · ${j.salary}</small></td><td>${j.city}</td><td>${j.mode}</td><td><span class="status-badge">Sample listing</span></td><td><button class="text-btn" data-job="${j.id}">Preview ${icon('arrow')}</button></td></tr>`).join('')}${state.vacancies.map(v=>`<tr><td><strong>${esc(v.title)}</strong><br><small>${esc(v.salary)}</small></td><td>${esc(v.city)}</td><td>${esc(v.mode)}</td><td><span class="status-badge amber">Local draft</span></td><td><button class="text-btn" data-draft="${esc(v.id)}">Preview ${icon('arrow')}</button></td></tr>`).join('')}</tbody></table></div></section>${!postsOnly?`<div class="feature-grid" style="margin-top:23px"><section class="panel" style="margin:0"><h2>Tell the right story, in either market.</h2><p>Recruitment content that helps candidates understand your role, expectations and team.</p><button class="text-btn" data-feature="marketing" style="margin-top:19px">Preview employer marketing ${icon('arrow')}</button></section><section class="panel" style="margin:0"><h2>Look beyond a familiar CV.</h2><p>Explore a fictional talent preview. Future matching will explain evidence and information gaps.</p><button class="text-btn" data-view="talent" style="margin-top:19px">Explore talent ${icon('arrow')}</button></section></div>`:''}<div class="notice">All listings and candidates here are fictional. New jobs remain browser-local drafts; nothing is published or sent. Employers on either side can use the same workflow.</div>`}
function talentPage(){return `${heading('PEOPLE, BEYOND THE KEYWORDS','A fresh perspective on talent.','Fictional candidates exploring Hong Kong and Shenzhen. No ranking or eligibility decisions.')}<div class="feature-grid">${[{name:'Jamie Wong',role:'Frontend Engineer',from:'Hong Kong',to:'Shenzhen',skills:'React · TypeScript · Accessibility',initial:'JW'},{name:'Lin Xu',role:'Product Designer',from:'Shenzhen',to:'Hong Kong',skills:'Figma · Research · Design systems',initial:'LX'},{name:'Sam Lee',role:'Data Analyst',from:'Hong Kong',to:'Both cities',skills:'SQL · Python · Experimentation',initial:'SL'}].map(p=>`<section class="feature-card"><span class="avatar" style="height:48px;width:48px;margin-bottom:19px">${p.initial}</span><h2>${p.name}</h2><p>${p.role}<br>${p.from} → ${p.to}<br>${p.skills}</p><button class="text-btn" data-action="talent-preview">Profile preview ${icon('arrow')}</button></section>`).join('')}</div><div class="notice">Sample profiles are not real people. Create your own multilingual share profile from AI workspace. These sample candidates are fictional; there is no employer messaging inbox.</div>`}
function marketingPage(){
 const posts=[...jobs.filter(j=>j.company==='Forma Studio').map(j=>postForMarketing(j,false)),...state.vacancies.map(v=>postForMarketing(v,true))];
 const selected=posts.find(p=>p.id===state.marketingTarget)||posts[0];
 state.marketingTarget=selected.id;
 return `${heading('ACROSS / '+agent.tr('marketing'),agent.tr('marketingTitle'),agent.tr('marketingSub'))}<div class="agent-layout"><section class="agent-artifact"><section class="panel"><label class="field">${agent.tr('role')}<select data-marketing-workspace-job>${posts.map(p=>`<option value="${esc(p.id)}" ${p.id===selected.id?'selected':''}>${esc(p.title)} · ${esc(p.company)}</option>`).join('')}</select></label></section>${marketingSectionHtml(selected,state.lang)}</section>${agent.rail('marketing')}</div>`;
}
function render(){
 document.querySelector('.skip-link').textContent=t('skipContent');
 const views={cv:()=>career.cvPage(),'cv-demo':()=>agent.cvPage(),marketing:marketingPage,'talent-profile':()=>`<div class="agent-layout profile-agent-layout"><div>${career.talentProfilePage()}</div>${agent.rail('profile')}</div>`,discover,saved:savedPage,applications:applicationsPage,profile:profilePage,tools:toolsPage,resources:resourcesPage,employer:()=>employerPage(),vacancies:()=>employerPage(true),talent:talentPage};
 document.documentElement.lang=state.lang==='zh'?'zh-Hans':state.lang==='tw'?'zh-Hant':'en';
 const titleView=['cv','cv-demo'].includes(state.view)?t('cv'):state.view==='marketing'?agent.tr('marketing'):state.view==='talent-profile'?t('shareProfile'):state.view==='employer'?'Employer workspace':state.view==='apply'?'Application demo':t(state.view);
 document.title=`Across — ${titleView}`;
 const root=document.querySelector('#app');
 if(state.view==='shared-profile'){document.title='Across — Talent profile';root.innerHTML=career.publicPage();return;}
 if(state.view==='apply'&&state.applyTarget){const j=jobs.find(x=>x.id===state.applyTarget);if(j){root.innerHTML=`<div class="application-demo-layout"><div class="application-browser"><div class="portal-browser-bar"><span aria-hidden="true">● ● ●</span><strong>▣ careers.${esc(j.company.toLowerCase().replace(/[^a-z0-9]/g,''))}.example / apply</strong><small>${agent.tr('portal')}</small></div>${state.applySuccess?applyPortalSuccess(j):applyPortalPage(j)}</div>${agent.rail('apply')}</div>`;return;}state.applyTarget=null;}
 root.innerHTML=`${sidebar()}<div class="shell">${topbar()}<main id="main" class="content" data-feature-screen="${esc(state.view)}" tabindex="-1">${(views[state.view] || discover)()}${footer()}</main></div>`;
}
function navigate(view){
 const allowed=['discover','saved','applications','profile','tools','resources','employer','vacancies','talent','apply','cv','cv-demo','marketing','talent-profile','shared-profile'];
 if(!allowed.includes(view))view='discover';
 if(state.view!==view)state.agentRunning=false;
 state.view=view;
 if(['employer','vacancies','talent','marketing'].includes(view))state.workspace='employer';
 if(['discover','saved','applications','profile','cv','cv-demo','talent-profile'].includes(view))state.workspace='candidate';
 if(view!=='apply'){state.query='';state.city='both';state.discipline='all';state.mode='all';state.expanded=false;}
 history.replaceState(null,'',`#${view}`);render();window.scrollTo({top:0});document.querySelector('#main')?.focus({preventScroll:true});
}
const modal=document.querySelector('#modal');

// === Employer marketing pipeline =========================================
const marketingChannels=[
 {id:'linkedin',icon:'people',limit:1300,name:{en:'LinkedIn · long form',zh:'LinkedIn · 长帖',tw:'LinkedIn · 長帖'},sub:{en:'Professional, structured',zh:'专业、结构化',tw:'專業、結構化'}},
 {id:'twitter',icon:'globe',limit:280,name:{en:'X / Twitter',zh:'X / Twitter',tw:'X / Twitter'},sub:{en:'Punch + hashtags',zh:'短打 + 话题',tw:'短打 + 話題'}},
 {id:'xiaohongshu',icon:'bookmark',limit:600,name:{en:'Xiaohongshu card',zh:'小红书图文',tw:'小紅書圖文'},sub:{en:'Lifestyle, emoji-rich',zh:'生活化、带 emoji',tw:'生活化、帶 emoji'}},
 {id:'wechat',icon:'mail',limit:160,name:{en:'WeChat moment',zh:'微信朋友圈',tw:'微信朋友圈'},sub:{en:'Casual, ~140 chars',zh:'轻松，约 140 字',tw:'輕鬆，約 140 字'}},
 {id:'jobsdb',icon:'briefcase',limit:2000,name:{en:'Jobsdb / formal listing',zh:'职位平台正式简介',tw:'職位平台正式簡介'},sub:{en:'Plain listing format',zh:'简洁列表格式',tw:'簡潔列表格式'}},
 {id:'email',icon:'pin',limit:700,name:{en:'Recruiter email',zh:'招聘邮件',tw:'招募郵件'},sub:{en:'Subject + body',zh:'主题 + 正文',tw:'主旨 + 正文'}}
];
const marketingCity={hk:{en:'Hong Kong',zh:'香港',tw:'香港'},sz:{en:'Shenzhen',zh:'深圳',tw:'深圳'}};
const marketingMode={Hybrid:{en:'Hybrid',zh:'混合办公',tw:'混合辦公'},'On-site':{en:'On-site',zh:'现场办公',tw:'現場辦公'},Remote:{en:'Remote',zh:'远程',tw:'遠端'}};
function cityKeyOf(c){return c==='Hong Kong'?'hk':c==='Shenzhen'?'sz':'hk'}
function modeOf(p,l){return (marketingMode[p]&&marketingMode[p][l])||p||''}
function cleanHashtag(s){return String(s||'').toLowerCase().replace(/[^a-z0-9一-鿿]+/g,'').slice(0,24)}
function postForMarketing(input,isDraft){
 const ck=cityKeyOf(input.city);
 const skills=(isDraft?[]:(input.skills||[]));
 const reqs=(isDraft?[]:(input.requirements||[]));
 const bens=(isDraft?[]:(input.benefits||[]));
 const cat=isDraft?'':input.category;
 return {
  id:input.id,isDraft:!!isDraft,
  title:input.title||'',summary:input.summary||'',
  company:isDraft?'Forma Studio':(input.company||'Forma Studio'),
  cityKey:ck,mode:input.mode||'Hybrid',salary:input.salary||'',
  req1:reqs[0]||skills[0]||'Genuine interest in this role',
  req2:reqs[1]||skills[1]||'Clear communication and curiosity',
  req3:reqs[2]||skills[2]||'Comfortable working across Hong Kong and Shenzhen',
  ben1:bens[0]||'Flexible working arrangements',
  ben2:bens[1]||'Supportive, cross-border team',
  ben3:bens[2]||'A chance to shape something new',
  hook:input.summary?(input.summary.split(/[.!?。!?]/,1)[0]||'').trim():'',
  tagEn:cleanHashtag(cat||skills[0]||'careers'),
  tagZh:cleanHashtag((cat||'招聘'))
 };
}
const marketingTemplates={
 linkedin:p=>({
  en:`🎯 We're hiring: ${p.title} — ${p.company}\n`+
      `📍 ${marketingCity[p.cityKey].en} · ${p.mode} · ${p.salary}\n\n`+
      `${p.summary}\n\n`+
      `What you'd bring:\n`+
      `• ${p.req1}\n• ${p.req2}\n• ${p.req3}\n\n`+
      `What we offer:\n`+
      `• ${p.ben1}\n• ${p.ben2}\n• ${p.ben3}\n\n`+
      `Interested? Drop a comment, send a DM, or apply via the link below. Every message gets read.\n\n`+
      `#hiring #${p.cityKey} #${p.tagEn}`,
  zh:`🎯 我们在招：${p.title} — ${p.company}\n`+
      `📍 ${marketingCity[p.cityKey].zh} · ${modeOf(p.mode,'zh')} · ${p.salary}\n\n`+
      `${p.summary}\n\n`+
      `希望你具备：\n`+
      `• ${p.req1}\n• ${p.req2}\n• ${p.req3}\n\n`+
      `我们提供：\n`+
      `• ${p.ben1}\n• ${p.ben2}\n• ${p.ben3}\n\n`+
      `感兴趣欢迎留言、私信，或点击下方链接投递。每一条我们都会看到。\n\n`+
      `#招聘 #${marketingCity[p.cityKey].zh} #${p.tagZh}`,
  tw:`🎯 我們在招募：${p.title} — ${p.company}\n`+
      `📍 ${marketingCity[p.cityKey].tw} · ${modeOf(p.mode,'tw')} · ${p.salary}\n\n`+
      `${p.summary}\n\n`+
      `希望你具備：\n`+
      `• ${p.req1}\n• ${p.req2}\n• ${p.req3}\n\n`+
      `我們提供：\n`+
      `• ${p.ben1}\n• ${p.ben2}\n• ${p.ben3}\n\n`+
      `有興趣歡迎留言、私訊，或點擊下方連結投遞。每一則我們都會看到。\n\n`+
      `#招募 #${marketingCity[p.cityKey].tw} #${p.tagZh}`
 }),
 twitter:p=>({
  en:`🎯 ${p.title} — ${p.company}\n${marketingCity[p.cityKey].en} · ${p.mode}\n\n${(p.summary.slice(0,140))}${(p.summary.length>140?'…':'')}\n\nApply via the link. We read every DM.\n\n#${p.tagEn} #${p.cityKey} #hiring`,
  zh:`🎯 招 ${p.title} · ${marketingCity[p.cityKey].zh}\n${(p.summary.slice(0,100))}${(p.summary.length>100?'…':'')}\n\n私信获取投递方式，留言必回。\n\n#${p.tagZh} #${p.cityKey==='hk'?'香港招聘':'深圳招聘'}`,
  tw:`🎯 招 ${p.title} · ${marketingCity[p.cityKey].tw}\n${(p.summary.slice(0,100))}${(p.summary.length>100?'…':'')}\n\n私訊獲取投遞方式，留言必回。\n\n#${p.tagZh} #${p.cityKey==='hk'?'香港招募':'深圳招募'}`
 }),
 xiaohongshu:p=>({
  en:`🌿 ${p.title} 🌿\n📍 ${marketingCity[p.cityKey].en} · ${p.mode}\n💰 ${p.salary}\n\n${p.summary}\n\n✨ Perks: ${p.ben1} · ${p.ben2}\n📩 DM me for the full description and how to apply!\n\n#${p.tagEn} #${p.cityKey==='hk'?'hongkonglife':'shenzhenlife'} #hiring`,
  zh:`🌿 ${p.title} · 招募中 🌿\n📍 ${marketingCity[p.cityKey].zh} · ${modeOf(p.mode,'zh')}\n💰 ${p.salary}\n\n${p.summary}\n\n✨ 福利：${p.ben1} · ${p.ben2}\n📩 感兴趣欢迎私信或留言，告知后会发完整 JD~\n\n#${p.tagZh} #${p.cityKey==='hk'?'香港生活':'深圳生活'} #找工作`,
  tw:`🌿 ${p.title} · 招募中 🌿\n📍 ${marketingCity[p.cityKey].tw} · ${modeOf(p.mode,'tw')}\n💰 ${p.salary}\n\n${p.summary}\n\n✨ 福利：${p.ben1} · ${p.ben2}\n📩 有興趣歡迎私訊或留言，告知後會發完整 JD~\n\n#${p.tagZh} #${p.cityKey==='hk'?'香港生活':'深圳生活'} #找工作`
 }),
 wechat:p=>({
  en:`🌱 Hiring a ${p.title} in ${marketingCity[p.cityKey].en} (${p.mode}). ${p.hook||`It's a great role on a small, cross-border team`}. DM me for the full description.`,
  zh:`🌱 ${marketingCity[p.cityKey].zh}招 ${p.title}！${p.hook?(p.hook+'。'):''}${p.ben1}，${p.ben2}。有兴趣私我〜`,
  tw:`🌱 ${marketingCity[p.cityKey].tw}招 ${p.title}！${p.hook?(p.hook+'。'):''}${p.ben1}，${p.ben2}。有興趣私我〜`
 }),
 jobsdb:p=>({
  en:`JOB TITLE: ${p.title}\nCOMPANY: ${p.company}\nLOCATION: ${marketingCity[p.cityKey].en}\nWORK TYPE: ${p.mode} · Full-time\nSALARY: ${p.salary}\n\n${p.summary}\n\nREQUIREMENTS:\n- ${p.req1}\n- ${p.req2}\n- ${p.req3}\n\nBENEFITS:\n- ${p.ben1}\n- ${p.ben2}\n- ${p.ben3}`,
  zh:`职位名称：${p.title}\n公司：${p.company}\n地点：${marketingCity[p.cityKey].zh}\n工作方式：${modeOf(p.mode,'zh')} · 全职\n薪资：${p.salary}\n\n${p.summary}\n\n要求：\n- ${p.req1}\n- ${p.req2}\n- ${p.req3}\n\n福利：\n- ${p.ben1}\n- ${p.ben2}\n- ${p.ben3}`,
  tw:`職位名稱：${p.title}\n公司：${p.company}\n地點：${marketingCity[p.cityKey].tw}\n工作方式：${modeOf(p.mode,'tw')} · 全職\n薪資：${p.salary}\n\n${p.summary}\n\n要求：\n- ${p.req1}\n- ${p.req2}\n- ${p.req3}\n\n福利：\n- ${p.ben1}\n- ${p.ben2}\n- ${p.ben3}`
 }),
 email:p=>({
  en:`Subject: We're hiring — ${p.title} (${marketingCity[p.cityKey].en}, ${p.mode})\n\nHi {{first_name}},\n\n${p.hook||`We're hiring a ${p.title}.`}\n\nIn this role, you'd bring:\n- ${p.req1}\n- ${p.req2}\n- ${p.req3}\n\nQuick details:\n- Location: ${marketingCity[p.cityKey].en}\n- Work style: ${p.mode}\n- Salary: ${p.salary}\n\nIf this sounds like you, reply to this email or send a DM — happy to share more.\n\nBest,\n${p.company} hiring`,
  zh:`主题：我们在招 — ${p.title}（${marketingCity[p.cityKey].zh}，${modeOf(p.mode,'zh')}）\n\n您好，\n\n${p.hook||`我们在招 ${p.title}。`}\n\n希望你具备：\n- ${p.req1}\n- ${p.req2}\n- ${p.req3}\n\n工作要点：\n- 工作地：${marketingCity[p.cityKey].zh}\n- 工作模式：${modeOf(p.mode,'zh')}\n- 薪资：${p.salary}\n\n感兴趣欢迎直接回复邮件或留言，我们乐意进一步分享。\n\n顺颂时祺，\n${p.company} 招聘`,
  tw:`主旨：我们在招募 — ${p.title}（${marketingCity[p.cityKey].tw}，${modeOf(p.mode,'tw')}）\n\n您好，\n\n${p.hook||`我們在招募 ${p.title}。`}\n\n希望你具備：\n- ${p.req1}\n- ${p.req2}\n- ${p.req3}\n\n工作要點：\n- 工作地：${marketingCity[p.cityKey].tw}\n- 工作模式：${modeOf(p.mode,'tw')}\n- 薪資：${p.salary}\n\n有興趣歡迎直接回信或留言，我們樂意進一步分享。\n\n順頌時祺，\n${p.company} 招募`
 })
};
function getMarketingText(p,channelId,lang){
 const edit=state.marketingEdits&&state.marketingEdits[p.id]&&state.marketingEdits[p.id][channelId]&&state.marketingEdits[p.id][channelId][lang];
 if(typeof edit==='string')return edit;
 const tpl=marketingTemplates[channelId];
 if(!tpl)return'';
 return(tpl(p)[lang]||'');
}
function setMarketingEdit(p,channelId,lang,text){
 if(!state.marketingEdits[p.id])state.marketingEdits[p.id]={};
 if(!state.marketingEdits[p.id][channelId])state.marketingEdits[p.id][channelId]={};
 state.marketingEdits[p.id][channelId][lang]=text;
}
function clearMarketingEdit(p,channelId){
 if(state.marketingEdits[p.id])delete state.marketingEdits[p.id][channelId];
}
function clearMarketingAll(p){delete state.marketingEdits[p.id]}
function marketingSectionHtml(p,lang){
 const L=(lang==='zh'||lang==='tw')?lang:'en';
 const headName=lang==='zh'?'简体中文':lang==='tw'?'繁體中文':'EN';
 return `<section class="marketing-section" data-feature-screen="marketing" data-job-id="${esc(p.id)}" data-is-draft="${p.isDraft?'1':'0'}" data-lang="${L}">
  <div class="marketing-head">
   <div class="marketing-head-left">
    <span class="eyebrow">EMPLOYER MARKETING PIPELINE</span>
    <h3>Marketing copy · ${esc(p.title)}</h3>
   </div>
   <div class="marketing-lang segmented" role="tablist" aria-label="Marketing language">
    <button class="${L==='en'?'active':''}" data-marketing-lang="en" role="tab" aria-selected="${L==='en'}">EN</button>
    <button class="${L==='zh'?'active':''}" data-marketing-lang="zh" role="tab" aria-selected="${L==='zh'}">简体中文</button>
    <button class="${L==='tw'?'active':''}" data-marketing-lang="tw" role="tab" aria-selected="${L==='tw'}">繁體中文</button>
   </div>
  </div>
  <p class="marketing-note">Template-based drafts tuned per channel. Edit any field — your changes save to this browser only. Now showing <strong>${esc(headName)}</strong>.</p>
  <div class="marketing-cards">${marketingChannels.map(ch=>{
   const text=getMarketingText(p,ch.id,L);
   const count=text.length;
   const over=count>ch.limit;
   const chName=ch.name[L]||ch.name.en;
   const chSub=ch.sub[L]||ch.sub.en;
   return `<article class="marketing-card" data-channel="${ch.id}">
    <header class="marketing-card-head">
     <span class="marketing-card-icon">${icon(ch.icon)}</span>
     <strong>${esc(chName)}</strong>
     <small class="marketing-card-sub">${esc(chSub)}</small>
     <span class="marketing-card-limit ${over?'over':''}" data-limit="${ch.limit}">${count} / ${ch.limit}</span>
     <button class="icon-button" data-marketing-copy aria-label="Copy ${esc(chName)} copy" title="Copy">${icon('document')}</button>
     <button class="icon-button" data-marketing-reset aria-label="Reset ${esc(chName)} to default" title="Reset to template">${icon('close')}</button>
    </header>
    <textarea data-marketing-text data-channel="${ch.id}" rows="6" spellcheck="false" aria-label="${esc(chName)} copy · ${esc(headName)}">${esc(text)}</textarea>
   </article>`;
  }).join('')}</div>
  <div class="marketing-foot">
   <button class="text-btn" data-marketing-reset-all>${icon('close')}Reset all edits</button>
   <span>${marketingChannels.length} channels × 3 languages · template-based, no AI calls</span>
  </div>
 </section>`;
}
function marketingFindPost(section){
 const jobId=section.dataset.jobId;
 const isDraft=section.dataset.isDraft==='1';
 const src=isDraft?state.vacancies:jobs;
 return {post:postForMarketing(src.find(x=>x.id===jobId),isDraft),isDraft};
}
function marketingRefreshCard(section,channelId){
 const {post}=marketingFindPost(section);
 if(!post.id)return;
 const lang=section.dataset.lang;
 const card=section.querySelector(`.marketing-card[data-channel="${channelId}"]`);
 if(!card)return;
 const ch=marketingChannels.find(c=>c.id===channelId);
 const ta=card.querySelector('[data-marketing-text]');
 ta.value=getMarketingText(post,channelId,lang);
 const limitChip=card.querySelector('.marketing-card-limit');
 const len=ta.value.length;
 limitChip.textContent=`${len} / ${ch.limit}`;
 limitChip.classList.toggle('over',len>ch.limit);
}
function marketingRefreshAll(section,lang){
 section.dataset.lang=lang;
 section.querySelectorAll('[data-marketing-lang]').forEach(b=>b.classList.toggle('active',b.dataset.marketingLang===lang));
 marketingChannels.forEach(ch=>marketingRefreshCard(section,ch.id));
}
function copyMarketingText(text){
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).catch(()=>fallbackCopy(text))}
 else fallbackCopy(text);
}
function fallbackCopy(text){
 const ta=document.createElement('textarea');
 ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
 document.body.appendChild(ta);ta.select();
 try{document.execCommand('copy')}catch{}
 document.body.removeChild(ta);
}

function openDialog(name,body,drawer=false,actions=''){modal.className=drawer?'drawer':'';modal.innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${name}</h2><button class="icon-button" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button></div><div class="dialog-body">${body}</div>${actions}`;if(!modal.open)modal.showModal();modal.scrollTop=0}

// === Apply portal (full-page external-style careers site) ==============
function agentStepsFor(j,profile){
 return [
  {id:'name',label:'Name',value:profile.name||''},
  {id:'email',label:'Email',value:profile.email||''},
  {id:'workauth',label:'Work authorisation',value:profile.status||'Not sure yet'},
  {id:'cover',label:'Introduction',value:`Hello ${j.company} team,\n\nI am interested in your ${title(j)} opportunity. My profile: ${profile.headline||'Please add your experience here'}. I would welcome a conversation about the role and the team.\n\n${profile.name||''}`}
 ];
}
function applyResetState(){
 state.applyAgentUsed=false;
 state.agentRunning=false;
 state.agentStep=null;
 state.agentCompletedSteps=[];
}
function applyPortalPage(j){
 const profile=state.profile;
 const already=state.applications.some(a=>a.jobId===j.id);
 const consentOptions=[...new Set(['Not sure yet',profile.status,'HK permanent resident / right to land','IANG','TTPS','ASMTP','QMAS','TechTAS','Dependant permission','Other permission','No current permission'].filter(Boolean))];
 return `<div class="apply-portal" data-feature-screen="agent">
  <header class="apply-portal-header">
   <button class="apply-back" data-apply-back aria-label="Back to Across">${icon('arrow')}<span>Back to Across</span></button>
   <small><strong>${esc(j.company)}</strong> · Local application demo</small>
   <span class="apply-pill">SIMULATED PORTAL</span>
  </header>
  <section class="apply-portal-hero">
   <span class="apply-portal-logo" style="--logo-bg:${j.bg};--logo-ink:${j.ink}" aria-hidden="true">${j.initial}</span>
   <small class="eyebrow">HIRING ACROSS BORDERS</small>
   <h1>${esc(j.company)} careers</h1>
   <p>Build your next chapter with ${esc(j.company)}. Explore the role, understand the team’s expectations, and start a conversation.</p>
  </section>
  <section class="apply-role">
   <div class="apply-role-head">
    <h2>${esc(title(j))}</h2>
    <span class="status-badge mint">${j.mode}</span>
   </div>
   <p class="apply-role-meta">${city(j.city)} · ${j.area} · ${j.salary} · Full-time</p>
   <p class="apply-role-summary">${esc(j.summary)}</p>
   <h3>What you'd bring</h3>
   <ul>${j.requirements.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   <h3>The practical details</h3>
   <ul>${j.benefits.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
  </section>
  <section class="apply-form-wrap">
   <header class="apply-form-head">
    <small class="eyebrow">FORM ON COMPANY SITE</small>
    <h2>Apply for this role</h2>
    <p>This fictional company portal runs inside Across. Ask the agent beside it to prepare the form, then review the details yourself.</p>
   </header>
   <form id="apply-form" data-job-id="${esc(j.id)}" autocomplete="on">
    <div class="form-grid">
     <label class="field">Your name<input name="name" required maxlength="80" value=""></label>
     <label class="field">Email<input type="email" name="email" required maxlength="150" value=""></label>
     <label class="field">Phone (optional)<input name="phone" type="tel" maxlength="40" placeholder="Not required — leave blank"></label>
     <label class="field">Current location<select name="location" required>
      <option value="">Choose current location</option>${['Hong Kong','Shenzhen','Other'].map(o=>`<option>${o}</option>`).join('')}
     </select></label>
     <label class="field full-width">Work authorisation<select name="workauth" required>
      ${consentOptions.map(o=>`<option ${(profile.status||'Not sure yet')===o?'selected':''}>${o}</option>`).join('')}
     </select><small>Your self-reported status is copied exactly. Verify your permission and conditions before any real application.</small></label>
    </div>
    <label class="field full-width">Why are you interested in this role? (optional)<textarea name="cover" maxlength="1500" placeholder="A short note that helps the hiring team understand your fit."></textarea></label>
    <label class="check-field"><input type="checkbox" name="consent" required><span>I confirm the information above is accurate and I understand this only saves a local demo record. No employer receives it.</span></label>
    <div class="apply-actions">
     <button type="submit" class="btn btn-primary" ${already?'disabled':''}>${agent.tr('saveApplication')} ${icon('arrow')}</button>
     <button type="button" class="btn btn-outline" data-apply-back>Cancel</button>
    </div>
   </form>
  </section>
 </div>`;
}
function applyPortalSuccess(j){
 const success=state.applySuccess||{};
 return `<div class="apply-portal" data-feature-screen="agent">
  <header class="apply-portal-header">
   <button class="apply-back" data-apply-back aria-label="Back to Across">${icon('arrow')}<span>Back to Across</span></button>
   <small>${esc(j.company)} · Demo record saved</small>
  </header>
  <div class="apply-success">
   <span class="success-icon">${icon('check')}</span>
   <h2>Your demo application is saved.</h2>
   <p>A local record was created${success.date?` on <strong>${esc(success.date)}</strong>`:''}. Nothing was sent to ${esc(j.company)}.</p>
   ${success.agent?`<p class="apply-agent-badge">${icon('route')} Prepared with the scripted agent · ${esc((state.agentCompletedSteps||[]).length)} steps taken</p>`:''}
   <div class="apply-success-actions">
    <button class="btn btn-primary" data-modal-view="applications">View my applications ${icon('arrow')}</button>
    <button class="btn btn-outline" data-apply-back>Back to discover</button>
   </div>
   <p class="muted small">A demo record is saved in this browser. Nothing leaves your device.</p>
  </div>
 </div>`;
}
let applyRunToken=0;
function stopApplyAgent(){applyRunToken++;state.agentRunning=false;}
async function applyRunAgent(){
 if(state.agentRunning||!state.applyTarget||state.applySuccess)return;
 const j=jobs.find(x=>x.id===state.applyTarget);
 if(!j||state.applications.some(a=>a.jobId===j.id))return;
 const token=++applyRunToken, form=document.querySelector('#apply-form');
 if(!form)return;
 state.agentRunning=true;state.applyAgentUsed=true;state.agentCompletedSteps=[];
 agent.syncRail('apply');
 for(const step of agentStepsFor(j,state.profile)){
  if(token!==applyRunToken||!state.agentRunning||!form.isConnected)return;
  const field=form.elements.namedItem(step.id);if(!field)continue;
  field.value=step.value;field.classList.add('agent-filled');field.dispatchEvent(new Event('input',{bubbles:true}));
  field.scrollIntoView({behavior:'smooth',block:'center'});
  state.agentCompletedSteps.push(step.id);
  await new Promise(resolve=>setTimeout(resolve,650));
 }
 if(token!==applyRunToken||!state.agentRunning||!form.isConnected)return;
 state.agentRunning=false;agent.reply('apply','filled');
}



function showJob(id){const j=jobs.find(x=>x.id===id);if(!j)return;const already=state.applications.some(a=>a.jobId===id);const p=postForMarketing(j,false);openDialog('A closer look',`${logo(j,true)}<h2 class="detail-title">${esc(title(j))}</h2><p class="detail-company">${j.company} · ${city(j.city)} · ${j.area}</p><div class="tag-row">${j.skills.map(s=>`<span class="tag mint">${s}</span>`).join('')}</div><div class="detail-meta"><div><small>Monthly base salary</small><strong>${j.salary}</strong></div><div><small>Work arrangement</small><strong>${j.mode} · Full-time</strong></div><div><small>Destination</small><strong>${city(j.city)}</strong></div><div><small>Employer support</small><strong>${j.sponsor?'Open to discussion':'Ask the employer'}</strong></div></div><div class="detail-section"><h3>A little about the opportunity</h3><p>${j.summary}</p></div><div class="detail-section"><h3>What you bring</h3><ul>${j.requirements.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="detail-section"><h3>The practical details</h3><ul>${j.benefits.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="notice">${icon('globe')} Moving across the border? Clarify work permission, language expectations and the full employment package. Sponsorship discussion does not guarantee permission. <a href="#resources" data-modal-view="resources">Open the cross-border guide</a>.</div><p class="language-note">Fictional opportunity for demo use. Salary is shown in the original currency, before deductions. No exchange-rate comparison is made.</p>${state.workspace==='employer'?marketingSectionHtml(p,state.lang):''}`,true,`<div class="detail-actions"><button class="btn btn-primary" data-apply="${id}" ${already?'disabled':''}>${already?'Demo application saved':'Apply on company site'}${icon(already?'check':'arrow')}</button><button class="btn btn-outline" data-save="${id}" aria-pressed="${state.saved.includes(id)}">${icon('bookmark')}${t(state.saved.includes(id)?'unsave':'save')}</button></div>`)}
function applyDialog(id){const j=jobs.find(x=>x.id===id);if(!j)return;openDialog('Your next step',`<div style="display:flex;gap:14px;align-items:center">${logo(j)}<div><h3>${esc(title(j))}</h3><p class="muted small" style="margin-top:4px">${j.company} · ${city(j.city)}</p></div></div><form id="application-form" data-job-id="${id}"><div class="notice">Try the application experience. Nothing will be sent, and no real CV is required.</div><div class="form-grid"><label class="field full-width">Your profile<input value="${esc(state.profile.name)} · ${esc(state.profile.headline)}" readonly></label><label class="field full-width">A short introduction (optional)<textarea name="note" maxlength="1500" placeholder="What interests you about this opportunity?"></textarea></label></div><label class="check-field"><input type="checkbox" required><span>I understand this is a demo application stored only in this browser. No employer will receive it.</span></label><button type="submit" class="btn btn-primary full">Save demo application ${icon('arrow')}</button></form>`)}
function marketingDialog(selectedId){
 const posts=[...jobs.filter(j=>j.company==='Forma Studio').map(j=>postForMarketing(j,false)),...state.vacancies.map(v=>postForMarketing(v,true))];
 const selected=posts.find(p=>p.id===selectedId)||posts[0];
 openDialog('Employer marketing',`<p class="muted small">Choose an opportunity, then edit its copy for each channel and language. Nothing is published.</p><label class="field" style="margin-top:20px">Opportunity<select data-marketing-job>${posts.map(p=>`<option value="${esc(p.id)}" ${p.id===selected.id?'selected':''}>${esc(p.title)}${p.isDraft?' · Local draft':''}</option>`).join('')}</select></label>${marketingSectionHtml(selected,state.lang)}`,true);
}
function applicationAgentDialog(){
 openDialog('Job application agent',`<p class="muted small">Choose a fictional role to open its simulated application form, then chat with the agent beside it. Nothing is sent to an employer.</p><div style="margin-top:20px">${jobs.map(j=>{const applied=state.applications.some(a=>a.jobId===j.id);return `<button class="btn btn-outline full" style="margin-bottom:12px" data-apply="${j.id}" ${applied?'disabled':''}>${applied?'Demo application saved:':'Prepare application:'} ${esc(title(j))} · ${esc(j.company)} ${icon('arrow')}</button>`}).join('')}</div>`);
}
function featureDialog(id){if(id==='cv'){navigate('cv-demo');return}if(id==='profile'){career.open('talent-profile');return}if(id==='marketing'){navigate('marketing');return}if(id==='agent'){applicationAgentDialog();return}const f=features.find(x=>x.id===id);if(!f)return;openDialog(f.name,`<span class="feature-icon" style="display:inline-flex">${icon(f.icon)}</span><h2 style="font-size:24px;margin-top:22px">${f.sub}</h2><p style="font-size:12px;line-height:1.9;color:#8a997b;margin-top:13px">${f.body}</p><ul class="credentials">${f.steps.map((x,i)=>`<li><span class="avatar" style="width:26px;height:26px;font-size:10px;background:#eef3e8">0${i+1}</span><strong>${x}</strong></li>`).join('')}</ul><div class="notice">Planned for a later phase. This screen explains the concept; the feature is not implemented in this prototype.</div><button class="btn btn-outline full" data-action="close-modal" style="margin-top:22px">Got it ${icon('check')}</button>`)}
function newVacancy(){openDialog('Create a demo opportunity',`<form id="vacancy-form"><p class="muted small" style="line-height:1.8">Build a local draft for either market. No listing is published.</p><div class="form-grid"><label class="field full-width">Job title<input name="title" required maxlength="100" placeholder="e.g. Senior Product Designer"></label><label class="field">Destination<select name="city"><option>Hong Kong</option><option>Shenzhen</option></select></label><label class="field">Work arrangement<select name="mode"><option>Hybrid</option><option>On-site</option><option>Remote</option></select></label><label class="field full-width">Monthly base salary, with currency<input name="salary" required maxlength="80" placeholder="e.g. HK$35,000–45,000"></label><label class="field full-width">About the opportunity<textarea name="summary" required maxlength="2500" placeholder="Responsibilities, expectations and what your team offers"></textarea></label></div><button class="btn btn-primary full" type="submit" style="margin-top:24px">Save local draft ${icon('check')}</button></form>`)}
function toggleSave(id){if(!jobs.some(j=>j.id===id))return;const existed=state.saved.includes(id);state.saved=existed?state.saved.filter(x=>x!==id):[...state.saved,id];const saved=persist();render();if(modal.open&&modal.classList.contains('drawer'))showJob(id);if(saved)toast(existed?'Removed from your saved jobs':'Saved for your next chapter')}
document.addEventListener('click',e=>{
 const mk=e.target.closest('[data-marketing-lang],[data-marketing-copy],[data-marketing-reset],[data-marketing-reset-all],[data-apply-run-agent],[data-apply-cancel-agent],[data-apply-back]');
 if(mk){
  if(mk.dataset.applyRunAgent!==undefined){applyRunAgent();return}
  if(mk.dataset.applyCancelAgent!==undefined){stopApplyAgent();toast('Agent stopped');return}
  if(mk.dataset.applyBack!==undefined){applyResetState();navigate('discover');return}
  const section=mk.closest('.marketing-section');
  if(section){
   const jobId=section.dataset.jobId;
   const isDraft=section.dataset.isDraft==='1';
   const src=isDraft?state.vacancies:jobs;
   const input=src.find(x=>x.id===jobId);
   if(input){
    const p=postForMarketing(input,isDraft);
    if(mk.dataset.marketingLang){marketingRefreshAll(section,mk.dataset.marketingLang);return}
    if(mk.dataset.marketingCopy!==undefined){const card=mk.closest('.marketing-card');const ta=card&&card.querySelector('[data-marketing-text]');if(ta){copyMarketingText(ta.value);toast('Copied to clipboard');}return}
    if(mk.dataset.marketingReset!==undefined){const card=mk.closest('.marketing-card');const cid=card&&card.dataset.channel;if(cid){clearMarketingEdit(p,cid);persist();marketingRefreshCard(section,cid);toast('Reset to default');}return}
    if(mk.dataset.marketingResetAll!==undefined){clearMarketingAll(p);persist();section.outerHTML=marketingSectionHtml(p,section.dataset.lang);toast('All marketing copy reset');return}
   }
  }
  return;
 }
 const button=e.target.closest('[data-view],[data-save],[data-job],[data-city],[data-action],[data-feature],[data-apply],[data-modal-view],[data-draft]');if(!button)return;
 if(button.dataset.view){if(['cv','talent-profile'].includes(button.dataset.view))career.open(button.dataset.view);else navigate(button.dataset.view);return}
 if(button.dataset.modalView){e.preventDefault();modal.close();navigate(button.dataset.modalView);return}
 if(button.dataset.save){toggleSave(button.dataset.save);return}
 if(button.dataset.job){showJob(button.dataset.job);return}
 if(button.dataset.city){state.city=button.dataset.city;state.expanded=false;render();return}
 if(button.dataset.feature){featureDialog(button.dataset.feature);return}
 if(button.dataset.apply){stopApplyAgent();agent.resetApply();state.applyTarget=button.dataset.apply;state.applySuccess=null;applyResetState();if(modal.open)modal.close();navigate('apply');return}
 if(button.dataset.draft){const d=state.vacancies.find(x=>x.id===button.dataset.draft);if(d){const p=postForMarketing(d,true);openDialog('Local draft preview',`<span class="tag">Unpublished demo draft</span><h2 style="margin-top:19px">${esc(d.title)}</h2><p class="muted small" style="margin-top:12px">${esc(d.city)} · ${esc(d.mode)} · ${esc(d.salary)}</p><p style="font-size:12px;line-height:1.9;white-space:pre-wrap;margin-top:22px">${esc(d.summary)}</p>${marketingSectionHtml(p,state.lang)}`);}return}
 switch(button.dataset.action){
  case 'switch-workspace':state.workspace=state.workspace==='candidate'?'employer':'candidate';navigate(state.workspace==='employer'?'employer':'discover');break;
  case 'close-modal':modal.close();break;
  case 'menu':document.querySelector('.sidebar').classList.add('open');document.querySelector('.mobile-scrim').classList.add('open');button.setAttribute('aria-expanded','true');break;
  case 'close-menu':document.querySelector('.sidebar').classList.remove('open');document.querySelector('.mobile-scrim').classList.remove('open');document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','false');break;
  case 'expand':state.expanded=!state.expanded;render();break;
  case 'clear-filters':state.query='';state.city='both';state.mode='all';state.discipline='all';render();break;
  case 'all-jobs':state.query='';state.city='both';state.mode='all';state.discipline='all';state.expanded=true;render();break;
  case 'new-vacancy':newVacancy();break;
  case 'talent-preview':openDialog('Multilingual talent profiles',`<div class="success-state"><span class="success-icon">${icon('people')}</span><h2>A richer picture of a person.</h2><p>This fictional preview introduces the talent-discovery experience. Detailed multilingual profiles and headhunter sharing will be developed later.</p><button class="btn btn-outline" data-feature="profile">Explore the planned feature ${icon('arrow')}</button></div>`);break;
  case 'reset-demo':openDialog('Start a fresh demo?',`<p class="muted small" style="line-height:1.9">This clears saved jobs, demo applications, profile edits, job drafts, CV facts and CV versions, and your share-profile editor in this browser. Export anything you need first. Existing shared snapshot copies cannot be recalled. You will return to the fictional starter profile.</p><button class="btn btn-primary full" data-action="confirm-reset" style="margin-top:24px">Reset this browser's demo</button>`);break;
  case 'confirm-reset':try{localStorage.removeItem('across-demo-v1');career.clear();history.replaceState(null,'',location.pathname);location.reload()}catch{toast('Browser storage cannot be reset in this session.')}break;
 }
});
document.addEventListener('change',e=>{
 if(e.target.matches('[data-marketing-job]')){marketingDialog(e.target.value);return}
 if(e.target.matches('[data-marketing-workspace-job]')){state.marketingTarget=e.target.value;render();return}
 if(e.target.id==='language'){state.lang=e.target.value;persist();render()}
 if(e.target.id==='discipline'){state.discipline=e.target.value;render()}
 if(e.target.id==='work-mode'){state.mode=e.target.value;render()}
 if(e.target.id==='sort'){state.sort=e.target.value;render()}
 if(e.target.id==='destination'){
  const form=document.querySelector('#profile-form');const data=Object.fromEntries(new FormData(form));Object.assign(state.profile,data);
  document.querySelector('#work-status-panel').innerHTML=workStatusFields(e.target.value);
 }
});
let marketingPersistTimer;
document.addEventListener('input',e=>{
 if(e.target.dataset&&e.target.dataset.marketingText!==undefined){
  const section=e.target.closest('.marketing-section');
  if(!section)return;
  const jobId=section.dataset.jobId;
  const isDraft=section.dataset.isDraft==='1';
  const src=isDraft?state.vacancies:jobs;
  const input=src.find(x=>x.id===jobId);
  if(!input)return;
  const p=postForMarketing(input,isDraft);
  setMarketingEdit(p,e.target.dataset.channel,section.dataset.lang,e.target.value);
  const card=e.target.closest('.marketing-card');
  if(card){
   const ch=marketingChannels.find(c=>c.id===card.dataset.channel);
   const limitChip=card.querySelector('.marketing-card-limit');
   const len=e.target.value.length;
   if(limitChip&&ch){
    limitChip.textContent=`${len} / ${ch.limit}`;
    limitChip.classList.toggle('over',len>ch.limit);
   }
  }
  clearTimeout(marketingPersistTimer);
  marketingPersistTimer=setTimeout(()=>persist(),400);
 }
});
document.addEventListener('submit',e=>{
 if(!['search-form','profile-form','application-form','vacancy-form','apply-form'].includes(e.target.id))return;e.preventDefault();const data=Object.fromEntries(new FormData(e.target));
 if(e.target.id==='search-form'){state.query=data.query.trim();state.expanded=true;render();return}
 if(e.target.id==='profile-form'){Object.assign(state.profile,data);if(persist())toast('Profile saved in this browser');render();return}
 if(e.target.id==='application-form'){
  const id=e.target.dataset.jobId;if(state.applications.some(a=>a.jobId===id)){toast('You already saved a demo application for this role.');return}
  state.applications.unshift({jobId:id,note:data.note,date:new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Hong_Kong'}).format(new Date())});const saved=persist();render();
  openDialog('One step closer',`<div class="success-state"><span class="success-icon">${icon('check')}</span><h2>${saved?'Your demo application is saved.':'Demo completed for this visit.'}</h2><p>Nothing has been sent to ${esc(jobs.find(j=>j.id===id).company)}.<br>${saved?'You can revisit it in My applications.':'Browser storage is unavailable; this application will not survive a reload.'}</p><button class="btn btn-primary" data-modal-view="applications">View my applications ${icon('arrow')}</button></div>`);return;
 }
 if(e.target.id==='vacancy-form'){state.vacancies.push({...data,id:crypto.randomUUID()});const saved=persist();modal.close();navigate('vacancies');if(saved)toast('Demo draft saved. Nothing has been published.')}
 if(e.target.id==='apply-form'){
  const id=e.target.dataset.jobId;
  if(state.applications.some(a=>a.jobId===id)){toast('You already saved a demo application for this role.');return}
  const consentChecked=e.target.querySelector('[name="consent"]')&&e.target.querySelector('[name="consent"]').checked;
  if(!consentChecked){toast('Please confirm the consent checkbox before submitting.');return}
  const today=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Hong_Kong'}).format(new Date());
  state.applications.unshift({jobId:id,note:data.cover||'',date:today,agent:!!state.applyAgentUsed});
  const saved=persist();
  state.applySuccess={date:today,agent:!!state.applyAgentUsed};
  state.agentRunning=false;state.agentStep=null;
  render();agent.reply('apply','saved');
  if(saved)toast('Demo application saved. Nothing was sent to an employer.');
  return;
 }
});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(modal.open)modal.close();if(!['discover','saved'].includes(state.view))navigate('discover');document.querySelector('#job-search')?.focus()}if(e.key==='Escape'){document.querySelector('.sidebar')?.classList.remove('open');document.querySelector('.mobile-scrim')?.classList.remove('open');document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','false')}});
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
const agent=createAgentDemo({getApplicationStatus:()=>({running:state.agentRunning,saved:!!state.applySuccess}),getLanguage:()=>state.lang,getCandidate:()=>state.profile,getJob:()=>jobs.find(j=>j.id===(state.view==='marketing'?state.marketingTarget:state.applyTarget))||state.vacancies.find(j=>j.id===state.marketingTarget),refresh:render,onStop:stopApplyAgent,onFill:applyRunAgent,onPreview:language=>career.setPreviewLanguage(language),onMarketing:channel=>{
 const card=document.querySelector(`.marketing-card[data-channel="${channel}"]`);
 document.querySelectorAll('.marketing-card').forEach(c=>c.classList.toggle('agent-selected',c===card));
 card?.scrollIntoView({behavior:'smooth',block:'center'});
}});
const career=createCareerWorkspace({navigate,refresh:render,getView:()=>state.view,getCandidate:()=>state.profile,getLanguage:()=>state.lang,getJobTitle:title,jobs,toast,closeModal:()=>{if(modal.open)modal.close()}});
function routeHash(){const hash=location.hash.slice(1);if(hash.startsWith('profile=')){career.openShared(hash.slice(8));return}if(['cv','talent-profile'].includes(hash)){career.open(hash);return}if(hash!=='main')navigate(hash||'discover')}
window.addEventListener('hashchange',routeHash);
routeHash();
