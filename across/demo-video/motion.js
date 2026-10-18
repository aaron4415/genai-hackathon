// The capture timeline is deterministic. The optional standalone player is separate.
window.__timelines=window.__timelines||{};
const tl=gsap.timeline({paused:true});
window.__timelines["main"] = tl;
const sceneCues=[['opening',0],['cv-brief',6],['cv-evidence',18],['profile',31],['marketing',45],['application',59],['closing',74]];
for(const [id,start] of sceneCues){
 const scene=`#scene-${id}`;
 // Incoming scene crossfades over the still-visible outgoing scene.
 tl.from(scene,{opacity:0,duration:.55,ease:'sine.inOut',immediateRender:false},start+.01);
 if(id==='opening'){
  tl.from(`${scene} .eyebrow`,{y:15,opacity:0,duration:.6,ease:'power2.out'},.2);
  tl.from(`${scene} h1`,{y:38,opacity:0,duration:.85,ease:'power3.out'},.4);
  tl.from(`${scene} .opening-sub`,{y:20,opacity:0,duration:.7,ease:'sine.out'},.85);
  tl.from(`${scene} .opening-features>span`,{y:16,opacity:0,stagger:.09,duration:.55,ease:'power2.out'},1.2);
  tl.from(`${scene} .identity`,{x:35,opacity:0,rotation:1.2,duration:.85,ease:'power3.out'},.8);
  tl.from(`${scene} .opportunity`,{y:25,opacity:0,duration:.7,ease:'back.out(1.1)'},1.45);
  tl.from(`${scene} .story-note`,{y:10,opacity:0,duration:.55,ease:'sine.out'},2);
 }else if(id==='closing'){
  tl.from(`${scene} .eyebrow`,{y:15,opacity:0,duration:.65,ease:'sine.out'},74.2);
  tl.from(`${scene} h1`,{y:35,opacity:0,duration:.85,ease:'power3.out'},74.5);
  tl.from(`${scene} .closing-features>div`,{y:25,opacity:0,stagger:.13,duration:.7,ease:'power2.out'},75.3);
  tl.from(`${scene} .closing-line`,{y:16,opacity:0,duration:.7,ease:'sine.out'},76.5);
  tl.from(`${scene} .closing-disclosure`,{y:12,opacity:0,duration:.7,ease:'power2.out'},77.2);
 }else{
  tl.from(`${scene} .scene-title`,{y:24,opacity:0,duration:.7,ease:'power3.out'},start+.2);
  tl.from(`${scene} .artifact`,{y:26,opacity:0,duration:.75,ease:'power2.out'},start+.5);
  tl.from(`${scene} .agent-panel`,{x:25,opacity:0,duration:.8,ease:'sine.out'},start+.75);
 }
 if(id!=='closing')tl.from(`${scene} .caption`,{y:10,opacity:0,duration:.6,ease:'sine.out'},start+1.1);
}
for(const [id,times] of [['cv-brief',[7.6,10.4,13.5]],['cv-evidence',[19.5,24]],['profile',[32.3,35]],['marketing',[46.3,49.2]],['application',[60.2,64.2]]]){
 times.forEach((time,index)=>tl.from(`#${id}-message-${index}`,{y:18,opacity:0,duration:.6,ease:index%2?'sine.out':'power2.out'},time));
}
tl.from('#cv-review-bar',{y:12,opacity:0,duration:.6,ease:'power2.out'},28);
for(const [id,start] of [['en',31],['zh',36],['tw',40]])tl.from(`#locale-${id}`,{opacity:0,y:9,duration:.5,ease:'sine.out'},start+.1);
tl.from('#linkedin-card',{y:18,opacity:0,duration:.6,ease:'power2.out'},47.7);
tl.from('#xhs-card',{y:22,opacity:0,duration:.7,ease:'power3.out'},50.9);
for(const [id,time] of [['name',61],['email',62],['location',63],['status',63.5]]){
 tl.from(`#filled-${id}`,{opacity:0,y:5,duration:.4,ease:'power2.out'},time);
 tl.from(`#filled-${id}`,{color:'#7b9e68',duration:.7,ease:'sine.out'},time+.1);
}
tl.from('#attached-cv',{y:10,opacity:0,duration:.6,ease:'power2.out'},64.5);
tl.from('#application-review',{y:10,opacity:0,duration:.6,ease:'sine.out'},66);
tl.from('#confirm-button',{opacity:0,y:10,duration:.6,ease:'power2.out'},67);
tl.to('#confirm-button',{scale:.97,duration:.16,ease:'power2.inOut',repeat:1,yoyo:true},70.5);
tl.from('#application-success',{opacity:0,scale:.98,duration:.6,ease:'power3.out',immediateRender:false},72);
tl.from('.progress-fill',{scaleX:0,duration:84,ease:'none'},0);
tl.to('.ambient-one',{x:-18,y:16,duration:84,ease:'sine.inOut'},0);

if(new URLSearchParams(location.search).has('preview')){
 document.body.classList.add('standalone-preview');
 const clips=[...document.querySelectorAll('.scene,.locale,.application-success')];
 const seek=document.querySelector('#seek'),play=document.querySelector('#play'),clock=document.querySelector('#clock');
 const resize=()=>document.querySelector('#main').style.transform=`scale(${Math.min(innerWidth/1920,(innerHeight-78)/1080)})`;
 const update=()=>{
  const t=tl.time();
  for(const clip of clips){const start=Number(clip.dataset.start),end=start+Number(clip.dataset.duration);clip.hidden=t<start||t>=end;}
  seek.value=t;clock.textContent=`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')} / 1:24`;
  play.textContent=tl.paused()?'Play demo':'Pause';
 };
 tl.eventCallback('onUpdate',update);tl.eventCallback('onComplete',()=>{tl.pause();update();});
 play.onclick=()=>{if(tl.time()>=83.9)tl.seek(0);tl.paused(!tl.paused());update();};
 seek.oninput=()=>{tl.pause().seek(Number(seek.value));update();};
 document.querySelector('#jump').onchange=event=>{tl.pause().seek(Number(event.target.value)+2);update();};
 addEventListener('resize',resize);resize();tl.seek(.01);update();
}
