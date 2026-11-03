// Mockup layer: three columns directly under the In Memoriam wall (shot clock, Where They Fell map, compact list).
// Uses the same data and the same memorial list rules as art.js; changes no data or totals and adds no locations.
(function(){
const INC=window.INCIDENTS||[],OTH=window.OTHER_HOMICIDES||[],LOC=window.MAP_LOCATIONS||{};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const fmtS=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'});
const place=r=>r.place||String(r.location||'').split(',').pop().trim().replace(/^\d+ block of /i,'');
const area=r=>/unverified/i.test(r.area||'')?'Lowndes County':(r.area||'');
// Same list as the wall: one entry per reported death, newest first.
const dead=[];
INC.filter(r=>r.category==='criminal'&&r.fatal>0).forEach(r=>{for(let i=1;i<=r.fatal;i++)dead.push({r,i,n:r.fatal})});
OTH.filter(r=>r.fatal>0).forEach(r=>{for(let i=1;i<=r.fatal;i++)dead.push({r,i,n:r.fatal})});
dead.sort((a,b)=>b.r.date.localeCompare(a.r.date)||a.i-b.i);
const wall=document.getElementById('bv-memorial');if(!wall||!dead.length)return;

// Column 1: lead = the home page's Indexed Report Averages clock board (cloned as rendered), then one "since" clock per life.
const lead=document.querySelector('#shot-clock .clock-board');
let leadHTML='';
if(lead){const c=lead.cloneNode(true);c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));c.querySelectorAll('.clock-face').forEach((f,k)=>{if(k===1)f.classList.add('bv-fatal-face')});leadHTML=c.outerHTML}
const since=dead.map(({r,i,n},k)=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" title="${esc(r.title)} — ${esc(r.source)}"><span class="bv-s-head"><span class="bv-s-date">${fmt(r.date)}</span><span class="bv-s-place">${esc(place(r))} · ${esc(area(r))}${n>1?` · ${i} of ${n}`:''}</span><span class="bv-s-src">Source ↗</span></span><span class="clock-face bv-since-face" data-date="${r.date}"><span>--</span><i>:</i><span>--</span><i>:</i><span>--</span></span><span class="clock-units bv-since-units"><span>days</span><span>hours</span><span>minutes</span></span></a></li>`).join('');

// Column 2 key: mapped incidents (from data/map-locations.json only) and unmapped ones.
const recs=[];dead.forEach(({r})=>{if(!recs.includes(r))recs.push(r)});
const mapped=recs.filter(r=>LOC[r.id]),unmapped=recs.filter(r=>!LOC[r.id]);
const livesMapped=mapped.reduce((s,r)=>s+r.fatal,0);
const key=mapped.map((r,k)=>`<li><i>${r.fatal}</i><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(place(r))}</b><span>${fmt(r.date)} · ${r.fatal} ${r.fatal===1?'life':'lives'} · ${esc(area(r))}</span></a></li>`).join('');
const note=unmapped.length?`<p class="bv-fell-note">${unmapped.map(r=>`<b>Not on the map:</b> ${fmt(r.date)} · ${esc(String(r.location||place(r)))} (${r.fatal} ${r.fatal===1?'life':'lives'}). The site’s map data has no verified point for it, so no marker is placed.`).join(' ')}</p>`:'';

// Column 3: compact list.
const rows=dead.map(({r,i,n})=>`<li><span class="bv-c-date">${fmtS(r.date)}</span><span class="bv-c-main"><b>${esc(place(r))}</b><span>${esc(area(r))}</span></span><span class="bv-c-n">${n>1?`${i} of ${n}`:'1 life'}</span><a class="bv-c-src" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer" title="${esc(r.title)} — ${esc(r.source)}">Source ↗</a></li>`).join('');

const sec=document.createElement('section');sec.className='bv-three';sec.id='bv-three';sec.setAttribute('aria-label','Shot clock, Where They Fell map and compact list');
sec.innerHTML=`<div class="post panel bv-three-col bv-clockcol"><h2>Shot Clock</h2><p class="bv-col-sub">Indexed report averages, then the time since each life on the wall was lost</p>${leadHTML}
<h3 class="bv-sub-h">Since each life was lost</h3><p class="bv-col-sub">Counted live from the start of each reported date (Eastern time). The time of day of each death is not used.</p><ol class="bv-since">${since}</ol></div>
<div class="post panel bv-three-col bv-mapcol"><h2>Where They Fell</h2><p class="bv-col-sub">${mapped.length} markers · ${livesMapped} of ${dead.length} lives · the number is lives lost at that spot</p><div id="bv-fell-map" aria-label="Map of memorial locations in Lowndes County"></div><ol class="bv-fell-key">${key}</ol>${note}<p class="bv-col-note">Same county outline and approximate public locations as the Homicide Map report list below. Markers are not exact scene coordinates.</p></div>
<div class="post panel bv-three-col bv-listcol"><h2>Compact List</h2><p class="bv-col-sub">${dead.length} lives · newest first · each row links to its source</p><ol class="bv-compact">${rows}</ol></div>`;
const after=wall.nextElementSibling&&wall.nextElementSibling.classList.contains('bv-divider')?wall.nextElementSibling:wall;
after.after(sec);sec.insertAdjacentHTML('afterend','<div class="bv-divider" role="presentation" aria-hidden="true"></div>');

// Live "since" clocks (days : hours : minutes), DST-safe via the America/New_York calendar date.
const etParts=()=>{const p={};new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date()).forEach(x=>p[x.type]=+x.value);return p};
const faces=[...sec.querySelectorAll('.bv-since-face')];
function tick(){const p=etParts(),today=Date.UTC(p.year,p.month-1,p.day);faces.forEach(f=>{const d=f.dataset.date.split('-').map(Number),days=Math.round((today-Date.UTC(d[0],d[1]-1,d[2]))/864e5),s=f.querySelectorAll('span');s[0].textContent=String(days).padStart(2,'0');s[1].textContent=String(p.hour).padStart(2,'0');s[2].textContent=String(p.minute).padStart(2,'0');f.setAttribute('aria-label',`${days} days ${p.hour} hours ${p.minute} minutes since ${f.dataset.date}`)})}
tick();setInterval(tick,1000);

// Where They Fell: Leaflet map with the home page's county outline and red numbered markers (no tile layer, same as the home map).
const el=document.getElementById('bv-fell-map');
if(window.L&&window.LOWNDES_BOUNDARY){
 const m=L.map(el,{scrollWheelZoom:false,attributionControl:true,zoomSnap:.25,dragging:false,touchZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false,zoomControl:false,tap:false});
 window.bvFellMap=m;[m.dragging,m.touchZoom,m.doubleClickZoom,m.scrollWheelZoom,m.boxZoom,m.keyboard].forEach(h=>h&&h.disable());
 const outline=L.geoJSON(window.LOWNDES_BOUNDARY,{style:{color:'#8b8b8b',weight:1.5,fillColor:'#e4e2dc',fillOpacity:1},interactive:false}).addTo(m);
 const b=outline.getBounds();m.fitBounds(b,{padding:[12,12]});m.setMaxBounds(b.pad(.35));
 m.attributionControl.addAttribution('Boundary: <a href="https://tigerweb.geo.census.gov/">U.S. Census TIGERweb</a>');
 [['Hahira',30.9913,-83.3727],['Remerton',30.8441,-83.3090],['Valdosta',30.8327,-83.2785],['Dasher',30.7513,-83.2229],['Lake Park',30.6822,-83.1799]].forEach(([name,lat,lng])=>L.marker([lat,lng],{interactive:false,icon:L.divIcon({className:'county-place-label',html:name,iconSize:[75,16],iconAnchor:[37,8]})}).addTo(m));
 mapped.forEach(r=>{const pt=LOC[r.id];L.marker([pt.lat,pt.lng],{title:`${place(r)}: ${r.fatal} reported fatal; ${pt.basis}`,icon:L.divIcon({className:'fatal-marker-wrap',html:`<span class="fatal-marker">${r.fatal}</span>`,iconSize:[26,26],iconAnchor:[13,13]})}).addTo(m).bindPopup(`<div class="fatal-popup"><small>${fmt(r.date)}</small><h3>${esc(place(r))}</h3><p>${esc(r.title)}</p><strong>${r.fatal} reported fatal</strong><p>${esc(pt.basis)}</p><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Read source report ↗</a></div>`)});
 new ResizeObserver(()=>{m.invalidateSize();m.fitBounds(b,{padding:[12,12],animate:false})}).observe(el);
}else{el.innerHTML='<p class="map-unavailable">Map unavailable. The list below links to each source.</p>'}
})();
