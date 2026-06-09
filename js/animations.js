(function(){
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const qs=(s,r=document)=>r.querySelector(s),qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
let observer;
function reveal(){
  const items=qsa('.reveal,[data-reveal]').filter(i=>!i.classList.contains('is-visible'));
  if(!items.length)return;
  items.forEach((i,n)=>i.style.transitionDelay=reduced?'0ms':`${Math.min(n*70,280)}ms`);
  if(reduced||!('IntersectionObserver'in window)){items.forEach(i=>i.classList.add('is-visible'));return;}
  observer=observer||new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
  items.forEach(i=>observer.observe(i));
}
function drawLines(){
  if(reduced)return;
  qsa('.drawn-line,.hero-doodle svg path,.hero-doodle svg line,.hero-doodle svg polyline').forEach(p=>{if(!p.getTotalLength)return;const l=p.getTotalLength();p.style.strokeDasharray=l;p.style.strokeDashoffset=l;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 1.55s cubic-bezier(0.22,1,0.36,1)';p.style.strokeDashoffset='0';});
}
function scrollLine(){
  const p=qs('.scroll-doodle path'); if(!p||reduced||!p.getTotalLength)return;
  const l=p.getTotalLength(); p.style.strokeDasharray=l; p.style.strokeDashoffset=l;
  const u=()=>{const r=p.closest('.scroll-doodle').getBoundingClientRect(),v=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));p.style.strokeDashoffset=String(l*(1-v));};
  u(); addEventListener('scroll',u,{passive:true}); addEventListener('resize',u);
}
function cursor(){
  if(reduced||!fine)return;
  let c=qs('.custom-cursor');
  if(!c){c=document.createElement('div');c.className='custom-cursor';c.setAttribute('aria-hidden','true');c.innerHTML='<span class="cursor-dot"></span><span class="cursor-label"></span>';document.body.appendChild(c);}
  const label=qs('.cursor-label',c); let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty;
  document.body.classList.add('has-custom-cursor');
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;c.classList.add('is-visible');},{passive:true});
  document.addEventListener('mouseover',e=>{const t=e.target.closest('[data-cursor],.project-card,.button,.nav-cta,.image-button,.archive-link,a,button');const text=t?.dataset.cursor||(t?.matches('.project-card,.archive-link')?'View':t?.matches('.image-button')?'Open':t?.matches('a,button')?'Go':'');label.textContent=text;c.classList.toggle('has-label',!!text);});
  document.addEventListener('mouseout',e=>{if(!e.relatedTarget||!e.relatedTarget.closest('[data-cursor],.project-card,.button,.nav-cta,.image-button,.archive-link,a,button')){label.textContent='';c.classList.remove('has-label');}});
  (function loop(){x+=(tx-x)*.22;y+=(ty-y)*.22;c.style.transform=`translate3d(${x}px,${y}px,0)`;requestAnimationFrame(loop);})();
}
function doodle(){
  if(reduced||!fine)return;
  let cv=qs('#doodle-canvas'); if(!cv){cv=document.createElement('canvas');cv.id='doodle-canvas';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);}
  const ctx=cv.getContext('2d'),colors=['#141414','#f2a394','#bfd7f3']; let dpr=1,down=false,cur=null; const strokes=[];
  function size(){dpr=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);} 
  const pt=e=>({x:e.clientX,y:e.clientY,t:performance.now(),j:(Math.random()-.5)*1.8});
  addEventListener('mousedown',e=>{if(e.button!==0)return;down=true;cur={c:colors[Math.floor(Math.random()*colors.length)],w:1.5+Math.random()*1.2,p:[pt(e)]};strokes.push(cur);});
  addEventListener('mousemove',e=>{if(!down||!cur)return;const a=cur.p[cur.p.length-1];if(Math.hypot(e.clientX-a.x,e.clientY-a.y)>3)cur.p.push(pt(e));},{passive:true});
  addEventListener('mouseup',()=>{down=false;cur=null}); addEventListener('mouseleave',()=>{down=false;cur=null}); addEventListener('resize',size); size();
  (function paint(){const now=performance.now();ctx.clearRect(0,0,innerWidth,innerHeight);for(let i=strokes.length-1;i>=0;i--){const s=strokes[i];s.p=s.p.filter(p=>now-p.t<4600);if(s.p.length<2){if(!s.p.length)strokes.splice(i,1);continue;}ctx.globalAlpha=Math.max(0,Math.min(1,(4600-(now-s.p[0].t))/1800));ctx.strokeStyle=s.c;ctx.lineWidth=s.w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(s.p[0].x,s.p[0].y);for(let n=1;n<s.p.length;n++){const a=s.p[n-1],b=s.p[n];ctx.quadraticCurveTo(a.x+a.j,a.y-a.j,(a.x+b.x)/2,(a.y+b.y)/2);}ctx.stroke();}ctx.globalAlpha=1;requestAnimationFrame(paint);})();
}
document.addEventListener('DOMContentLoaded',()=>{reveal();drawLines();scrollLine();cursor();doodle();});
addEventListener('content:updated',reveal);
})();
