// Blazing Valdosta art layer: memorial wall (one chalk outline per reported death), skull/reaper headers, dividers.
// Driven by window.INCIDENTS / window.OTHER_HOMICIDES; changes no data or totals.
(function(){
const INC=window.INCIDENTS||[],OTH=window.OTHER_HOMICIDES||[],page=document.body.dataset.page||'home';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
// Short street label (incidents carry a 'place' field; otherwise use the last part of the location) and area on its own line. Never truncated.
const place=r=>r.place||String(r.location||'').split(',').pop().trim().replace(/^\d+ block of /i,'');
const area=r=>/unverified/i.test(r.area||'')?'Lowndes County':(r.area||'');
const divider=()=>'<div class="bv-divider" role="presentation" aria-hidden="true"></div>';

// Skull mark on page headings; divider above the footer.
const h1=document.querySelector('.route-hero h1');
if(h1&&!h1.querySelector('.bv-skull'))h1.insertAdjacentHTML('afterbegin','<img class="bv-skull" src="memoriam-assets/art/skull.svg" alt="" width="40" height="44">');
document.querySelector('.route-hero')?.classList.add('bv-hero-art');
const foot=document.querySelector('footer');if(foot)foot.insertAdjacentHTML('beforebegin',divider());

// Memorial wall: one outline per reported death in criminal shootings and non-firearm homicides.
const dead=[];
INC.filter(r=>r.category==='criminal'&&r.fatal>0).forEach(r=>{for(let i=1;i<=r.fatal;i++)dead.push({r,i,n:r.fatal})});
OTH.filter(r=>r.fatal>0).forEach(r=>{for(let i=1;i<=r.fatal;i++)dead.push({r,i,n:r.fatal})});
dead.sort((a,b)=>b.r.date.localeCompare(a.r.date)||a.i-b.i);
const year=Math.max(...INC.map(r=>+r.date.slice(0,4)),0);
const tally=n=>{let x=0,p='';for(let g=0;g<Math.ceil(n/5);g++){const k=Math.min(5,n-g*5);for(let j=0;j<Math.min(k,4);j++)p+=`M${x+j*7+2},3V27`;if(k===5)p+=`M${x-1},23L${x+27},7`;x+=36}return `<svg class="bv-tally" viewBox="0 0 ${Math.max(x,10)} 30" width="${Math.max(x,10)}" height="30" role="img" aria-label="${n} tally marks"><path d="${p}" stroke="#f4f1ea" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>`};
const wall=`<section id="bv-memorial" class="bv-wall" aria-labelledby="bv-memorial-h">${divider()}
<div class="bv-wall-head"><img class="bv-candle" src="memoriam-assets/art/candle.svg" alt="" width="30" height="63"><div><h2 id="bv-memorial-h">In Memoriam <span class="bv-memh-yr">· ${year}</span></h2>
<p class="bv-wall-count"><b>${dead.length}</b> ${dead.length===1?'life':'lives'} lost in indexed criminal shootings and homicides ${tally(dead.length)}</p></div><img class="bv-candle" src="memoriam-assets/art/candle.svg" alt="" width="30" height="63"></div>
<p class="bv-wall-caveat">One outline per reported death in indexed criminal-shooting${OTH.length?' and non-firearm homicide':''} reports, newest first. Indexed reports only — not a complete county count. Includes deaths reported in murder-suicides; self-defense and police-involved deaths are counted separately in the running totals. ${OTH.length?'':'Non-firearm homicides: no indexed reports yet.'} Each outline links to its source.</p>
${dead.length?`<ol class="bv-outlines">${dead.map(({r,i,n})=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" title="${esc(r.title)} — ${esc(r.source)}"><img src="memoriam-assets/art/chalk-outline.svg" alt="" width="60" height="110"><span class="bv-o-date">${fmt(r.date)}</span><span class="bv-o-place">${esc(place(r))}</span><span class="bv-o-area">${esc(area(r))}</span><span class="bv-o-src">${n>1?`${i} of ${n} · `:''}Source ↗</span></a></li>`).join('')}</ol>`:'<p class="bv-empty-note">No indexed reports yet.</p>'}
</section>`;
const anchor=page==='home'?document.getElementById('dashboard'):page==='reports'?document.getElementById('bv-all-cards'):null;
// The memorial sits directly before the dashboard (home) / the color-coded card list (reports): header, caveat, then the wall.
if(anchor&&!document.getElementById('bv-memorial')){anchor.insertAdjacentHTML('beforebegin',wall);anchor.insertAdjacentHTML('beforebegin',divider())}
})();
