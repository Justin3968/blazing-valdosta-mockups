// Theatrical crime-memorial layer (original SVG/CSS art). Visual only: changes no data, names, dates or totals.
(function(){
const wall=document.getElementById('bv-memorial');
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg';
document.documentElement.classList.add('bv-theatre');
// Shared SVG defs: flame gradients, glow, ink-stamp texture.
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="bvfRed" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff3a12"/><stop offset=".55" stop-color="#d4140f"/><stop offset="1" stop-color="#7a0606" stop-opacity="0"/></linearGradient>
<linearGradient id="bvfOr" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd23a"/><stop offset=".5" stop-color="#ff7a10"/><stop offset="1" stop-color="#ff4a10" stop-opacity=".2"/></linearGradient>
<linearGradient id="bvfYe" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#ffe56a"/><stop offset="1" stop-color="#ffc400" stop-opacity=".3"/></linearGradient>
<linearGradient id="bvFold" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".45" stop-color="#1d1a1a"/><stop offset=".6" stop-color="#2a2424"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="bvCShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".8" stop-color="#3b0a08" stop-opacity="0"/><stop offset="1" stop-color="#ff5a1a" stop-opacity=".35"/></linearGradient>
<linearGradient id="bvVal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#1a1414"/></linearGradient>
<filter id="bvGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="bv-ink"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.6" seed="9" result="g"/><feColorMatrix in="g" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.7" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>
</defs></svg><div class="bv-grain" aria-hidden="true"></div><div class="bv-vignette" aria-hidden="true"></div>`);

// Seeded random so the fire looks the same on every load.
let seed=7;const rnd=(a,b)=>{seed=(seed*16807)%2147483647;return a+(b-a)*(seed/2147483647)};
const tongue=(x,y,w,h,dx)=>`M${x-w/2},${y} C${x-w/2},${y-h*.45} ${x-w*.15+dx*.3},${y-h*.6} ${x+dx},${y-h} C${x+w*.2+dx*.35},${y-h*.55} ${x+w/2},${y-h*.42} ${x+w/2},${y} Z`;
const flame=(x,y,s,lean)=>{const w=30*s,h=rnd(80,135)*s,dx=lean*s+rnd(-6,6)*s,d=rnd(0,2.2).toFixed(2);
 return `<g class="bv-fl" style="transform-origin:${x.toFixed(0)}px ${y.toFixed(0)}px;animation-delay:-${d}s"><path d="${tongue(x,y,w*1.15,h,dx)}" fill="url(#bvfRed)"/><path d="${tongue(x,y,w*.75,h*.72,dx*.7)}" fill="url(#bvfOr)"/><path d="${tongue(x,y,w*.4,h*.42,dx*.4)}" fill="url(#bvfYe)"/></g>`};

// Original Blazers-inspired flame emblem (not the school's logo): sharp swept tongues, dark outline.
const P='M40,126 C16,122 4,102 8,82 C10,70 16,62 24,54 C21,66 23,74 29,78 C24,58 30,40 46,24 C43,40 47,50 55,56 C55,36 63,18 82,2 C75,22 77,38 85,50 C87,42 92,35 100,28 C95,44 99,58 99,72 C99,104 75,128 40,126 Z';
const tf=(k,cx,cy)=>`translate(${(cx*(1-k)).toFixed(1)},${(cy*(1-k)).toFixed(1)}) scale(${k})`;
const emblem=(cls,id)=>`<svg class="bv-emb ${cls}" viewBox="-6 -6 114 140" width="66" height="81" aria-hidden="true" focusable="false"><defs>
<linearGradient id="bveR${id}" x1="0" y1="1" x2=".6" y2="0"><stop offset="0" stop-color="#8e0a0e"/><stop offset=".55" stop-color="#e0140f"/><stop offset="1" stop-color="#ff3c14"/></linearGradient>
<linearGradient id="bveO${id}" x1="0" y1="1" x2=".6" y2="0"><stop offset="0" stop-color="#ff4a08"/><stop offset="1" stop-color="#ffa014"/></linearGradient>
<linearGradient id="bveY${id}" x1="0" y1="1" x2=".5" y2="0"><stop offset="0" stop-color="#ffcf1a"/><stop offset="1" stop-color="#fff6c0"/></linearGradient></defs>
<path d="${P}" fill="url(#bveR${id})" stroke="#0a0a0a" stroke-width="6" stroke-miterlimit="12" paint-order="stroke"/><path d="${P}" fill="url(#bveO${id})" transform="${tf(.72,52,124)}"/><path d="${P}" fill="url(#bveY${id})" transform="${tf(.44,54,124)}"/><path d="M14,96 C22,112 40,118 58,114" fill="none" stroke="#0a0a0a" stroke-width="3.5" stroke-linecap="round" opacity=".6"/></svg>`;

if(wall){
 wall.classList.add('bv-stage');
 const cands=wall.querySelectorAll('.bv-wall-head .bv-candle');
 cands.forEach((c,k)=>c.outerHTML=emblem(k?'bv-emb-r':'bv-emb-l',k));
 // Stamped totals inside the wall, computed exactly like the home clock (indexed 2026 reports through the review date).
 const S=window.SITE||{},list=(window.INCIDENTS||[]).filter(r=>S.year&&r.date>=S.year+'-01-01'&&r.date<=S.reviewed);
 const killed=list.reduce((n,r)=>n+r.fatal,0),wounded=list.reduce((n,r)=>n+r.injured,0);
 const count=wall.querySelector('.bv-wall-head');
 if(count&&list.length)count.insertAdjacentHTML('afterend',`<div class="bv-stamps" role="img" aria-label="${killed+wounded} people shot, ${killed} killed, ${wounded} wounded in indexed 2026 reports"><span class="bv-st bv-st-w">${killed+wounded}<small>shot</small></span><span class="bv-st bv-st-r">${killed}<small>killed</small></span><span class="bv-st bv-st-w2">${wounded}<small>wounded</small></span></div><p class="bv-stamp-note">People shot in indexed reports, Jan 1 – ${S.reviewedText||''} · partial archive, not a countywide count</p>`);
 wall.querySelectorAll('.bv-outlines li a').forEach(a=>a.insertAdjacentHTML('afterbegin','<span class="bv-cone" aria-hidden="true"></span><span class="bv-pool" aria-hidden="true"></span>'));
 wall.insertAdjacentHTML('afterbegin',`<div class="bv-stage-fx" aria-hidden="true"><div class="bv-reaper"></div><div class="bv-shade"></div><div class="bv-fog"></div>
<div class="bv-curtain bv-cl"></div><div class="bv-curtain bv-cr"></div><div class="bv-floorfire"></div><div class="bv-valance"></div>
<div class="bv-tape"><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span></div>
<svg class="bv-threads" viewBox="0 0 70 60"><g stroke="#f6cf00" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M2,10 C14,8 22,14 34,12"/><path d="M2,16 C12,18 20,26 26,34"/><path d="M2,24 C16,24 24,30 40,28"/><path d="M2,30 C10,34 14,44 18,52"/><path d="M2,38 C14,40 26,38 30,44"/><path d="M2,44 C8,46 16,50 22,58"/></g></svg></div>`);
 const fx=wall.querySelector('.bv-stage-fx'),cl=fx.querySelector('.bv-cl'),cr=fx.querySelector('.bv-cr'),ff=fx.querySelector('.bv-floorfire'),val=fx.querySelector('.bv-valance');
 let last='';
 function draw(){
  const W=cl.offsetWidth,H=wall.offsetHeight,w=wall.offsetWidth,fh=ff.offsetHeight;if(!W||!H)return;
  const key=W+'x'+H+'x'+w;if(key===last)return;last=key;seed=7;
  // Inner edge of the drawn-back drape: full width at the top, pinched at the tie-back, flared at the floor.
  const tb=.6,edge=t=>t<tb?W-(W*.48)*Math.pow(Math.sin(t/tb*Math.PI/2),1.3):W*.52+(W*.82-W*.52)*Math.pow((t-tb)/(1-tb),.8);
  const pts=[];for(let i=0;i<=60;i++)pts.push([edge(i/60),i/60*H]);
  const body='M0,0 L'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L')+` L0,${H} Z`;
  const line='M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L');
  let folds='';for(let x=-6;x<W+20;x+=Math.max(10,W/9))folds+=`<rect x="${x.toFixed(1)}" y="0" width="${Math.max(6,W/11).toFixed(1)}" height="${H}" fill="url(#bvFold)" opacity="${rnd(.5,.9).toFixed(2)}"/>`;
  const s0=Math.max(.42,Math.min(1,W/190));let fl='';
  const step=Math.max(24,46*s0);for(let y=H*.05;y<H*.985;y+=step*rnd(.8,1.1)){const t=y/H,s=s0*(.55+.6*t);fl+=flame(edge(t)-3,y+30*s,s,14)}
  const ty=tb*H,tie=`<path d="M0,${ty-12} Q${W*.33},${ty+6} ${W*.54},${ty-4} L${W*.54},${ty+10} Q${W*.33},${ty+22} 0,${ty+8}Z" fill="#3a0a0c" stroke="#8a1a1a"/>`;
  const svg=(cid)=>`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible"><defs><clipPath id="${cid}"><path d="${body}"/></clipPath></defs><g clip-path="url(#${cid})"><rect width="${W+4}" height="${H}" fill="#070707"/>${folds}<rect width="${W+4}" height="${H}" fill="url(#bvCShade)"/></g><path d="${line}" fill="none" stroke="#a3121c" stroke-width="3"/><path d="${line}" fill="none" stroke="#ff2a1a" stroke-width="10" opacity=".3" filter="url(#bvGlow)"/>${tie}<g filter="url(#bvGlow)">${fl}</g></svg>`;
  cl.innerHTML=svg('bvClipL');cr.innerHTML=svg('bvClipR');
  // Flames rising along the floor of the opening.
  const fs=Math.max(.45,Math.min(.95,fh/120));let f2='';for(let x=W*.45;x<w-W*.45;x+=rnd(16,26)*fs*1.2)f2+=flame(x,fh+4,rnd(.75,1.05)*fs,rnd(-10,10));
  ff.innerHTML=`<svg width="${w}" height="${fh}" viewBox="0 0 ${w} ${fh}" style="overflow:visible"><g filter="url(#bvGlow)">${f2}</g></svg>`;
  const sw=Math.max(70,Math.min(130,w/9));let q='';for(let x=w;x>-sw;x-=sw)q+=`Q${(x-sw/2).toFixed(1)},${x/sw%2<1?44:38} ${(x-sw).toFixed(1)},22 `;
  val.innerHTML=`<svg width="${w}" height="48" viewBox="0 0 ${w} 48"><path d="M0,0 H${w} V22 ${q}V0 Z" fill="url(#bvVal)" stroke="#8d1218" stroke-width="2"/></svg>`;
 }
 draw();if(window.ResizeObserver)new ResizeObserver(()=>draw()).observe(wall);else addEventListener('resize',draw);
 if(document.fonts)document.fonts.ready.then(draw);
}

// Evidence board: pins, typewriter tags and red string across the three columns.
const three=document.getElementById('bv-three');
if(three){
 three.classList.add('bv-board');
 const tags=['EXHIBIT A · TIME','EXHIBIT B · LOCATION','EXHIBIT C · NAMES'];
 const cols=[...three.querySelectorAll('.bv-three-col')];
 cols.forEach((c,k)=>c.insertAdjacentHTML('afterbegin',`<span class="bv-pin" aria-hidden="true"></span><span class="bv-tag">${tags[k]||''}</span>`));
 three.insertAdjacentHTML('afterbegin','<svg class="bv-strings" aria-hidden="true"></svg>');
 const st=three.querySelector('.bv-strings');
 const seg=(a,c,sag)=>{const y=(sag<0?Math.min(a[1],c[1]):Math.max(a[1],c[1]))+sag,d=`M${a[0]},${a[1]} Q${(a[0]+c[0])/2},${y} ${c[0]},${c[1]}`;return `<path d="${d}" stroke="#000" stroke-opacity=".5" stroke-width="3" fill="none" transform="translate(2,4)"/><path d="${d}" stroke="#c4101e" stroke-width="2" fill="none"/>`};
 function strings(){const r=three.getBoundingClientRect(),p=[...three.querySelectorAll('.bv-pin')].map(e=>{const q=e.getBoundingClientRect();return[(q.left-r.left+q.width/2).toFixed(1),(q.top-r.top+q.height/2).toFixed(1)].map(Number)});
  st.setAttribute('width',r.width);st.setAttribute('height',r.height);st.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
  if(p.length<3){st.innerHTML='';return}
  const row=Math.abs(p[0][1]-p[2][1])<40;
  st.innerHTML=row?seg(p[0],p[1],-12)+seg(p[1],p[2],-12)+seg(p[0],p[2],-34):seg(p[0],p[1],0)+seg(p[1],p[2],0)}
 strings();if(window.ResizeObserver)new ResizeObserver(strings).observe(three);addEventListener('load',strings);
 // Numbered yellow evidence tents on the Where They Fell markers and in its key (same order as the markers).
 three.querySelectorAll('#bv-fell-map .fatal-marker-wrap').forEach((m,k)=>m.insertAdjacentHTML('beforeend',`<span class="bv-tent bv-tent-${k%4}" aria-hidden="true">${k+1}</span>`));
 three.querySelectorAll('.bv-fell-key li').forEach((li,k)=>li.insertAdjacentHTML('afterbegin',`<span class="bv-tent-k" aria-label="Evidence ${k+1}">${k+1}</span>`));
 const sheet=three.querySelector('.bv-listcol .bv-compact');if(sheet)sheet.insertAdjacentHTML('beforebegin','<div class="bv-blot-head"><span>LOWNDES CO. · FATAL · BLOTTER</span><span>'+sheet.children.length+' ENTRIES</span></div>');
}
// Section header bars with a skull mark.
document.querySelectorAll('.bv-three-col>h2,.bv-dash-head>h2,.post.panel>h2').forEach(h=>h.classList.add('bv-barh'));
// Ink-stamped big numbers (home running totals and Shooting Outcomes).
document.querySelectorAll('.bv-stat.bv-hero .bv-stat-num,.bv-stat.bv-big .bv-stat-num,.bv-to-nums b').forEach(b=>b.classList.add('bv-inked'));

// Slow fade-in as each section scrolls into view (skipped for reduced motion).
if(!reduce&&'IntersectionObserver' in window){
 const els=[...document.querySelectorAll('#bv-memorial,#bv-three>.bv-three-col,#dashboard,.featured-panels>.post,.masonry-item>.post,#incidents,#hospital')];
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('bv-in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.04});
 els.forEach(e=>{e.classList.add('bv-reveal');io.observe(e)});
}
})();
