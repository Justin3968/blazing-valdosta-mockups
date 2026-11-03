// Theatrical crime-memorial layer (original SVG/CSS art). Visual only: changes no data, names, dates or totals.
(function(){
const wall=document.getElementById('bv-memorial');
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg';
document.documentElement.classList.add('bv-theatre');
// Shared SVG defs: flame gradients, glow, ink-stamp texture.
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="bvfRed" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e0121e"/><stop offset=".55" stop-color="#b0101a"/><stop offset="1" stop-color="#7a0606" stop-opacity="0"/></linearGradient>
<linearGradient id="bvfOr" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffa3aa"/><stop offset=".5" stop-color="#ff3344"/><stop offset="1" stop-color="#ff1f2e" stop-opacity=".2"/></linearGradient>
<linearGradient id="bvfYe" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#ffc8cc"/><stop offset="1" stop-color="#ff7a84" stop-opacity=".3"/></linearGradient>
<linearGradient id="bvFold" x1="0" x2="1"><stop offset="0" stop-color="#020202"/><stop offset=".28" stop-color="#0c0c0d"/><stop offset=".48" stop-color="#1b1b1d"/><stop offset=".6" stop-color="#2a2a2c"/><stop offset=".72" stop-color="#141415"/><stop offset="1" stop-color="#010101"/></linearGradient>
<linearGradient id="bvCShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".65"/><stop offset=".8" stop-color="#0a0a0a" stop-opacity="0"/><stop offset="1" stop-color="#3a3a3c" stop-opacity=".3"/></linearGradient>
<linearGradient id="bvVal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".6" stop-color="#0e0e0f"/><stop offset="1" stop-color="#1f1f21"/></linearGradient>
<filter id="bvGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="bv-ink"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.6" seed="9" result="g"/><feColorMatrix in="g" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.4 1.7" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>
</defs></svg><div class="bv-grain" aria-hidden="true"></div><div class="bv-vignette" aria-hidden="true"></div>`);

// Seeded random so the fire looks the same on every load.
let seed=7;const rnd=(a,b)=>{seed=(seed*16807)%2147483647;return a+(b-a)*(seed/2147483647)};
// Cartoon fire: one chunky teardrop tongue with a curly tip, drawn in a unit box (base centre at 0,0, height 1).
const TG='M0,0 C-.52,0 -.64,-.3 -.44,-.55 C-.3,-.74 -.1,-.82 .02,-1.02 C.24,-.97 .27,-.8 .12,-.76 C.36,-.66 .6,-.42 .52,-.2 C.46,-.04 .26,0 0,0 Z';
// Sin City comic-ink fire: pure black ink outlines, flat red-only fills, white-hot core.
const OL='#000',CR='#b0101a',CO='#ff1f2e',CY='#ffffff',CH='#ffffff';
const tng=(x,y,w,h,sk,flip,fill,extra='')=>`<path d="${TG}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) skewX(${sk.toFixed(1)}) scale(${(flip?-w:w).toFixed(2)},${h.toFixed(2)})" fill="${fill}" vector-effect="non-scaling-stroke" ${extra}/>`;
const hl=(x,y,w,h,sk)=>`<ellipse cx="${(x-w*.12+sk*-h*.004).toFixed(1)}" cy="${(y-h*.42).toFixed(1)}" rx="${(w*.07).toFixed(1)}" ry="${(h*.1).toFixed(1)}" fill="${CH}" opacity=".9"/>`;
const flame=(x,y,s,lean,sw=7)=>{const w=44*s,h=rnd(70,108)*s,sk=Math.max(-22,Math.min(22,-lean*1.1+rnd(-8,8))),fp=rnd(0,1)<.5,d=rnd(0,1.2).toFixed(2),du=rnd(.8,1.15).toFixed(2);
 return `<g class="bv-fl" style="transform-origin:${x.toFixed(0)}px ${y.toFixed(0)}px;animation-delay:-${d}s;animation-duration:${du}s">${tng(x,y,w,h,sk,fp,CR,`stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke"`)}${tng(x,y-h*.02,w*.66,h*.64,sk,fp,CO,`stroke="#000" stroke-width="${(sw*.45).toFixed(1)}" stroke-linejoin="round" paint-order="stroke"`)}${tng(x,y-h*.03,w*.36,h*.36,sk,fp,CY,`stroke="#000" stroke-width="${(sw*.35).toFixed(1)}" stroke-linejoin="round" paint-order="stroke"`)}</g>`};

// Original Blazers-inspired cartoon emblem (not the school's logo): three chunky curly tongues merged under one thick outline.
const ET=[[30,124,46,70,14,1],[78,124,42,84,-12,0],[54,126,64,118,-4,0]];
const emblem=(cls)=>{const sil=ET.map(t=>tng(t[0],t[1],t[2],t[3],t[4],t[5],CR)).join('');
 return `<svg class="bv-emb ${cls}" viewBox="-4 -8 112 142" width="66" height="84" aria-hidden="true" focusable="false"><g stroke="${OL}" stroke-width="11" stroke-linejoin="round">${sil}</g>${sil}<g stroke="#000" stroke-width="4" stroke-linejoin="round" paint-order="stroke">${ET.map(t=>tng(t[0],t[1]-2,t[2]*.6,t[3]*.62,t[4],t[5],CO)).join('')}${tng(54,124,26,52,-4,0,CY)}${tng(32,123,14,26,14,1,CY)}${tng(77,123,14,30,-12,0,CY)}</g><ellipse cx="44" cy="62" rx="5" ry="11" transform="rotate(14 44 62)" fill="${CH}"/><circle cx="47" cy="44" r="3" fill="${CH}"/></svg>`};

if(wall){
 wall.classList.add('bv-stage');
 const cands=wall.querySelectorAll('.bv-wall-head .bv-candle');
 cands.forEach((c,k)=>c.outerHTML=emblem(k?'bv-emb-r':'bv-emb-l'));
 // Stamped totals inside the wall, computed exactly like the home clock (indexed 2026 reports through the review date).
 const S=window.SITE||{},list=(window.INCIDENTS||[]).filter(r=>S.year&&r.date>=S.year+'-01-01'&&r.date<=S.reviewed);
 const killed=list.reduce((n,r)=>n+r.fatal,0),wounded=list.reduce((n,r)=>n+r.injured,0);
 const count=wall.querySelector('.bv-wall-head');
 if(count&&list.length)count.insertAdjacentHTML('afterend',`<div class="bv-stamps" role="img" aria-label="${killed+wounded} people shot, ${killed} killed, ${wounded} wounded in indexed 2026 reports"><span class="bv-st bv-st-w">${killed+wounded}<small>shot</small></span><span class="bv-st bv-st-r">${killed}<small>killed</small></span><span class="bv-st bv-st-w2">${wounded}<small>wounded</small></span></div><p class="bv-stamp-note">People shot in indexed reports, Jan 1 – ${S.reviewedText||''} · partial archive, not a countywide count</p>`);
 wall.querySelectorAll('.bv-outlines li a').forEach(a=>a.insertAdjacentHTML('afterbegin','<span class="bv-cone" aria-hidden="true"></span><span class="bv-pool" aria-hidden="true"></span>'));
 wall.insertAdjacentHTML('afterbegin',`<div class="bv-stage-fx" aria-hidden="true"><div class="bv-reaper"></div><div class="bv-shade"></div><div class="bv-fog"></div>
<div class="bv-curtain bv-cl"></div><div class="bv-curtain bv-cr"></div><div class="bv-floorfire"></div><div class="bv-valance"></div>
<div class="bv-tape"><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span><span>CRIME SCENE · DO NOT CROSS</span></div>
<svg class="bv-threads" viewBox="0 0 70 60"><g stroke="#1c1c1c" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M2,10 C14,8 22,14 34,12"/><path d="M2,16 C12,18 20,26 26,34"/><path d="M2,24 C16,24 24,30 40,28"/><path d="M2,30 C10,34 14,44 18,52"/><path d="M2,38 C14,40 26,38 30,44"/><path d="M2,44 C8,46 16,50 22,58"/></g></svg></div>`);
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
  const ty=tb*H,tie=`<path d="M0,${ty-12} Q${W*.33},${ty+6} ${W*.54},${ty-4} L${W*.54},${ty+10} Q${W*.33},${ty+22} 0,${ty+8}Z" fill="#0b0b0c" stroke="#303033"/>`;
  const svg=(cid)=>`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible"><defs><clipPath id="${cid}"><path d="${body}"/></clipPath></defs><g clip-path="url(#${cid})"><rect width="${W+4}" height="${H}" fill="#070707"/>${folds}<rect width="${W+4}" height="${H}" fill="url(#bvCShade)"/></g><path d="${line}" fill="none" stroke="#000" stroke-width="10" opacity=".55" filter="url(#bvGlow)"/><path d="${line}" fill="none" stroke="#2c2c2e" stroke-width="2.5"/>${tie}</svg>`;
  cl.innerHTML=svg('bvClipL');cr.innerHTML=svg('bvClipR');
  // Flames rising along the floor of the opening.
  const fs=Math.max(.45,Math.min(.95,fh/120));let f2='';for(let x=W*.45;x<w-W*.45;x+=rnd(16,26)*fs*1.2)f2+=flame(x,fh+4,rnd(.75,1.05)*fs,rnd(-10,10));
  ff.innerHTML=''; // curtain fire removed at Justin's request (flames still computed so the logo fire's seeded shapes stay identical)
  const sw=Math.max(70,Math.min(130,w/9));let q='';for(let x=w;x>-sw;x-=sw)q+=`Q${(x-sw/2).toFixed(1)},${x/sw%2<1?44:38} ${(x-sw).toFixed(1)},22 `;
  val.innerHTML=`<svg width="${w}" height="48" viewBox="0 0 ${w} 48"><path d="M0,0 H${w} V22 ${q}V0 Z" fill="url(#bvVal)" stroke="#2a2a2c" stroke-width="2"/></svg>`;
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

// Header logo on fire: hide the fireball icon, cartoon tongues behind/between the letters and licking over the tops,
// plus a few small ones in front along the base. Absolutely positioned, so header height and menu layout are unchanged.
const lab=document.querySelector('.masthead .brand-label');
if(lab){
 const fb=document.querySelector('.masthead .brand-fireball');if(fb)fb.style.display='none';
 lab.classList.add('bv-logofire');
 lab.insertAdjacentHTML('afterbegin','<span class="bv-lf bv-lf-back" aria-hidden="true"></span>');
 lab.insertAdjacentHTML('beforeend','<span class="bv-lf bv-lf-front" aria-hidden="true"></span>');
 const back=lab.querySelector('.bv-lf-back'),front=lab.querySelector('.bv-lf-front');
 const drawLogo=()=>{const sv=seed;seed=4242;
  const w=lab.offsetWidth,h=lab.offsetHeight,fz=parseFloat(getComputedStyle(lab).fontSize)||37;
  if(!w||!h){seed=sv;return}
  const mob=innerWidth<=720,s=fz/(mob?118:104),pad=fz*.3,W=w+pad*2,H=h+fz*.6,base=H-h*.32;
  let b='',f='';
  for(let x=pad+fz*.05;x<W-pad;x+=fz*rnd(.36,.5))b+=flame(x,base-rnd(0,h*.15),s*rnd(.8,1.15),rnd(-8,8),5);
  for(let x=pad+fz*.3;x<W-pad-fz*.2;x+=fz*rnd(.9,1.3))f+=flame(x,H-h*.04,s*rnd(.32,.42),rnd(-6,6),3.5);
  const svg=c=>`<svg width="${W.toFixed(0)}" height="${H.toFixed(0)}" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" style="overflow:visible">${c}</svg>`;
  back.style.cssText=`left:${(-pad).toFixed(1)}px;bottom:0;width:${W.toFixed(0)}px;height:${H.toFixed(0)}px`;
  front.style.cssText=back.style.cssText;
  back.innerHTML=svg(`<g>${b}</g>`);front.innerHTML=svg(f);seed=sv};
 drawLogo();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawLogo);
 let lw=0;if(window.ResizeObserver)new ResizeObserver(()=>{if(lab.offsetWidth!==lw){lw=lab.offsetWidth;requestAnimationFrame(drawLogo)}}).observe(lab);else addEventListener('resize',drawLogo);
}

// Original recoil figure beside the shot clock (decorative).
{const cb=document.querySelector('#bv-three .bv-clockcol .clock-board');
 if(cb&&!document.querySelector('.bv-shotfig')){const d=document.createElement('div');d.className='bv-shotfig';d.setAttribute('aria-hidden','true');
  d.innerHTML='<img src="memoriam-assets/art/shot-figure.svg" alt="" width="200" height="260">';cb.parentNode.insertBefore(d,cb)}}

// Original Sin City-style blood-splatter accents (decorative, kept off text, data and the chalk outlines).
{const B='memoriam-assets/art/';
 [['#bv-memorial .bv-stage-fx','splat-a','bv-sp-tape'],['#bv-three','splat-c','bv-sp-board'],['#dashboard','splat-b','bv-sp-dash'],
  ['#dashboard','splat-a','bv-sp-div1',1],['#incidents','splat-c','bv-sp-inc'],['#hospital','splat-b','bv-sp-hosp'],['body>.bv-divider','splat-a','bv-sp-div2']]
 .forEach(([sel,img,cls,prev])=>{let host=document.querySelector(sel);if(host&&prev){host=host.previousElementSibling;if(!host||!host.classList.contains('bv-divider'))return}if(!host||host.querySelector('.'+cls))return;
  const sp=document.createElement('span');sp.className='bv-splat '+cls;sp.setAttribute('aria-hidden','true');
  sp.innerHTML='<img src="'+B+img+'.svg" alt="">';host.appendChild(sp)})}

// Slow fade-in as each section scrolls into view (skipped for reduced motion).
if(!reduce&&'IntersectionObserver' in window){
 const els=[...document.querySelectorAll('#bv-memorial,#bv-three>.bv-three-col,#dashboard,.featured-panels>.post,.masonry-item>.post,#incidents,#hospital')];
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('bv-in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.04});
 els.forEach(e=>{e.classList.add('bv-reveal');io.observe(e)});
}

// Layout (t90u/t93u): Running Totals stat grid wraps Past Years, Report Averages and Shooting Outcomes in an L; Latest Indexed Reports goes last.
(function(){
 const stats=document.querySelector('#dashboard .bv-stats');
 const secs=[document.getElementById('historical'),document.getElementById('shot-clock'),document.querySelector('.featured-panels>.outcome-card')];
 if(stats&&secs.every(Boolean)){
  const corner=document.createElement('div');corner.className='bv-lcorner';
  secs.forEach(s=>corner.appendChild(s));
  secs[0].classList.add('bv-la-hist');secs[1].classList.add('bv-la-avg');secs[2].classList.add('bv-la-out');
  // 2026 Monthly Shooting Trend moves into the corner, above Shooting Outcomes.
  const trends=document.getElementById('trends');
  if(trends){const it=trends.parentElement;trends.classList.add('bv-la-trend');corner.insertBefore(trends,secs[2]);if(it&&it.classList.contains('masonry-item')&&!it.children.length){it.hidden=true;it.style.display='none'}}
  // Annual Crime Breakdown by Year: re-displays figures already on the page (Past Years table + Full Year / GBI cards). Nothing computed.
  let tries=0;const buildACB=()=>{const rows=[...document.querySelectorAll('#history-rows tr')];const cardsReady=document.querySelectorAll('.summary-card .summary-title').length;if((!rows.length||!cardsReady)&&tries++<120){setTimeout(buildACB,250);return}
  const idx={};document.querySelectorAll('.summary-card').forEach(c=>{const t=(c.querySelector('.summary-title')||{}).textContent||'',m=t.match(/^(\d{4}) Full Year \/ GBI$/);if(!m)return;const bm=[...c.querySelectorAll('.summary-lines b')],lab=(c.querySelector('.summary-lines')||{}).innerHTML||'';const k=lab.indexOf('Index Crimes:');if(k<0)return;const b=c.querySelector('.summary-lines').innerHTML.slice(k).match(/<b[^>]*>([^<]*)<\/b>/);if(b)idx[m[1]]=b[1]});
  if(rows.length){
   const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
   const body=rows.map(tr=>{const td=tr.querySelectorAll('td');if(td.length<4)return'';const a=td[0].querySelector('a'),yr=td[0].textContent.replace(/[^0-9]/g,'');
    const ycell=a?'<a href="'+esc(a.href)+'" target="_blank" rel="noopener noreferrer">'+esc(yr)+' ↗</a>':esc(yr);
    return '<tr><th scope="row">'+ycell+'</th><td class="bv-acb-m">'+esc(td[1].textContent)+'</td><td>'+esc(td[2].textContent)+'</td><td>'+esc(td[3].textContent)+'</td><td>'+(idx[yr]?esc(idx[yr]):'<span class="bv-acb-na">not on page</span>')+'</td></tr>'}).join('');
   const acb=document.createElement('section');acb.className='post panel bv-acb bv-la-acb';
   acb.innerHTML='<h2>Annual Crime Breakdown by Year</h2><p class="card-intro">Lowndes County · GBI reported offenses, full calendar years</p><div class="bv-acb-wrap"><table class="compact-table bv-acb-table"><thead><tr><th scope="col">Year</th><th scope="col">Murder</th><th scope="col">Robbery</th><th scope="col">Agg. assault</th><th scope="col">Index crimes</th></tr></thead><tbody>'+body+'</tbody></table></div><p class="bv-acb-note">Same figures shown in Previous Year Crime Statistics and the Full Year / GBI cards, arranged by year. Year links go to the GBI annual reports.</p>';
   corner.insertBefore(acb,trends||secs[2]);
   acb.querySelector('h2').classList.add('bv-barh');
   // Quick-reference strip of past-year figures (same values), between the hero band and the stage.
   const stage=document.getElementById('bv-memorial');
   if(stage&&!document.querySelector('.bv-qstrip')){
    const items=rows.map(tr=>{const td=tr.querySelectorAll('td');if(td.length<4)return'';const yr=td[0].textContent.replace(/[^0-9]/g,'');
     return '<li><span class="bv-q-yr">'+esc(yr)+'</span><span>Murder <b>'+esc(td[1].textContent)+'</b></span><span>Robbery <b>'+esc(td[2].textContent)+'</b></span><span>Agg. assault <b>'+esc(td[3].textContent)+'</b></span>'+(idx[yr]?'<span>Index crimes <b>'+esc(idx[yr])+'</b></span>':'')+'</li>'}).join('');
    const q=document.createElement('nav');q.className='bv-qstrip';q.setAttribute('aria-label','Past-year quick reference');
    q.innerHTML='<span class="bv-q-tag">Past years · GBI</span><ul>'+items+'</ul>';
    stage.before(q);
   }
  }};buildACB();
  const cards=stats.querySelectorAll(':scope>.bv-stat');
  stats.insertBefore(corner,cards[9]||null);
  stats.classList.add('bv-lstats');
  const fp=document.querySelector('.featured-panels');if(fp&&!fp.children.length)fp.hidden=true;
 }
 const latest=[...document.querySelectorAll('.masonry-item>section.post.panel')].find(x=>(x.querySelector('h2')||{}).textContent==='Latest Indexed Report');
 const anchor=document.querySelector('body>.bv-divider')||document.querySelector('body>footer');
 if(latest&&anchor){const item=latest.parentElement,tail=document.createElement('div');tail.className='site-main bv-tailmain';anchor.before(tail);tail.appendChild(latest);if(!item.children.length){item.hidden=true;item.style.display='none'}}
})();

// t107u: one map only. Drop the lower Homicide Map's Leaflet canvas; keep that panel's heading, filters, key, count and report list.
(function(){
 const card=document.getElementById('homicide-map'),wrap=card&&card.querySelector('.map-canvas-wrap');
 if(wrap){wrap.remove();card.classList.add('bv-nomap')}
 const fm=document.getElementById('bv-fell-map');if(fm)fm.setAttribute('data-stationary','true');
})();
})();
