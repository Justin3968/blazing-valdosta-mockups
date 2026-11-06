// Dashboard layer: running totals, ticker, color-coded cards, monthly chart and legend.
// Everything here is computed from the data files loaded by loader.js; nothing is hardcoded.
// Empty lists are shown as "No indexed reports yet", never as a factual zero.
(function(){
const INC=window.INCIDENTS||[],SF=window.SHOTS_FIRED||[],HR=window.HIT_AND_RUN||[],OH=window.OTHER_HOMICIDES||[],RB=window.ROBBERIES||[],AS=window.ASSAULTS||[];
const page=document.body.dataset.page||'home';
const TYPES={
 homicide:{label:'Shot & killed',long:'Fatal shooting · alleged criminal',src:'incidents.json'},
 nonfatal:{label:'Shot & wounded',long:'Nonfatal shooting · alleged criminal',src:'incidents.json'},
 accidental:{label:'Accidental',long:'Reported accidental shooting',src:'incidents.json'},
 officer:{label:'Police-involved',long:'Law-enforcement shooting',src:'incidents.json'},
 defensive:{label:'Self-defense',long:'Reported defensive shooting',src:'incidents.json'},
 otherhom:{label:'Non-firearm homicide',long:'Stabbing, beating, strangulation, arson, vehicular or other',src:'other-homicides.json'},
 robbery:{label:'Robbery',long:'Robbery or armed robbery report (people shot are counted in shootings only)',src:'robberies.json'},
 assault:{label:'Assault',long:'Non-shooting assault or battery report',src:'assaults.json'},
 shots:{label:'Shots fired',long:'Gunfire with no victim established',src:'shots-fired.json'},
 hitrun:{label:'Hit & run',long:'Traffic hit-and-run report',src:'hit-and-run.json'}
};
const ORDER=Object.keys(TYPES);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmt=d=>{const [y,m,day]=d.split('-').map(Number);return `${MONTHS[m-1]} ${day}, ${y}`};
const incType=r=>r.category==='officer'?'officer':r.category==='defensive'?'defensive':r.category==='accidental'?'accidental':(r.fatal>0?'homicide':'nonfatal');
const outcome=(f,i)=>{if(f==null&&i==null)return 'Injuries not stated';const p=[];p.push(f==null?'fatalities not stated':`${f} killed`);p.push(i==null?'injuries not stated':`${i} wounded`);return p.join(' · ')};
// Unified, newest-first list of every indexed item.
const items=[
 ...INC.map(r=>({type:incType(r),date:r.date,title:r.title,place:r.location,area:r.area,url:r.url,source:r.source,id:r.id,record:r.id,shot:r.fatal+r.injured,out:outcome(r.fatal,r.injured),flags:r.flags||[],linked:r.linkedEvent})),
 ...OH.map(r=>({type:'otherhom',date:r.date,title:r.title,place:r.location,area:r.area,url:r.url,source:r.source,id:r.id,out:`${r.fatal} killed${r.injured!=null?` · ${r.injured} injured`:''} · ${r.cause}`,flags:r.status?[]:[],note:r.status})),
 ...RB.map(r=>({type:'robbery',date:r.date,title:r.title,place:r.location,area:r.area,url:r.url,source:r.source,id:r.id,flags:r.flags||[],dup:!!r.linkedIncident,note:r.linkedIncident?`Also indexed as shooting ${r.linkedIncident} · people shot counted there only`:`Charges: ${r.charges}`,out:r.linkedIncident?'See linked shooting':outcome(r.killed,r.injured).replace('wounded','injured')})),
 ...AS.map(r=>({type:'assault',date:r.date,title:r.title,place:r.location,area:r.area,url:r.url,source:r.source,id:r.id,flags:r.flags||[],dup:!!r.linkedHomicide,low:r.confidence==='low',note:r.linkedHomicide?`Counted as non-firearm homicide ${r.linkedHomicide} · not counted again here`:`Charges: ${r.charges}`,out:r.linkedHomicide?'See linked homicide':outcome(r.killed,r.injured).replace('wounded','injured')})),
 ...SF.map(r=>({type:'shots',date:r.date,title:r.title,place:r.location,url:r.url,source:r.source,id:r.id,out:'No gunshot victim established'})),
 ...HR.map(r=>({type:'hitrun',date:r.date,title:r.title,place:r.location,url:r.url,source:r.url.includes('walb')?'WALB':'Source',id:'Hit & run',out:outcome(r.fatal,r.injured)}))
].sort((a,b)=>b.date.localeCompare(a.date));
const year=INC.length?INC.map(r=>r.date.slice(0,4)).sort().at(-1):String(new Date().getFullYear());
const inYear=items.filter(x=>x.date.startsWith(year)&&!x.dup);
const yRB=RB.filter(r=>r.date.startsWith(year)),yAS=AS.filter(r=>r.date.startsWith(year));
const yInc=INC.filter(r=>r.date.startsWith(year));
const sum=(l,k)=>l.reduce((s,r)=>s+(r[k]||0),0);
const count=t=>items.filter(x=>x.date.startsWith(year)&&x.type===t&&!x.dup).length;
const latest=items[0]?.date;
const daysSince=latest?Math.max(0,Math.floor((Date.now()-new Date(latest+'T12:00:00'))/864e5)):null;
const evKey=r=>r.linkedEvent||r.id,events=[...new Set(yInc.map(evKey))];
const mass=events.filter(e=>yInc.filter(r=>evKey(r)===e).reduce((n,r)=>n+r.fatal+r.injured,0)>=3);
// A stat with no indexed reports is shown honestly as "no indexed reports yet".
const stat=(o)=>{const empty=o.empty??(!o.value);return `<div class="bv-stat ${o.cls||''} ${o.type?'bv-t-'+o.type:''} ${empty?'bv-empty':''}"><span class="bv-stat-label">${o.label}</span><b class="bv-stat-num">${empty?'—':o.value}</b><span class="bv-stat-sub">${empty?'No indexed reports yet':o.sub}</span></div>`};
const legend=()=>`<div class="bv-legend" role="list" aria-label="Report type colors">${ORDER.map(t=>`<span role="listitem" class="bv-chip bv-t-${t}" title="${esc(TYPES[t].long)}"><i></i>${TYPES[t].label}</span>`).join('')}<span role="listitem" class="bv-chip bv-mass" title="Derived: three or more people shot in one indexed report"><i></i>3+ shot</span></div>`;
const card=x=>`<article class="bv-card bv-t-${x.type}${x.low?' bv-low':''}" data-bv-type="${x.type}"><div class="bv-card-top"><span class="bv-card-type">${TYPES[x.type].label}</span><span class="bv-card-date">${fmt(x.date)}</span></div><h3>${esc(x.title)}</h3><p class="bv-card-place">${esc(x.place)}</p><p class="bv-card-out">${esc(x.out)}${x.shot>=3?' <em class="bv-mass-badge">3+ shot</em>':''}</p>${(x.flags||[]).map(f=>`<p class="bv-flag">⚠ ${esc(f)}</p>`).join('')}${x.linked?`<p class="bv-linked">Linked event ${esc(x.linked)} · indexed as separate shootings</p>`:''}${x.note?`<p class="bv-linked">${esc(x.note)}</p>`:''}<div class="bv-card-links">${x.record?`<button class="bv-card-more" data-record="${esc(x.record)}">Details</button>`:''}<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.source)} ↗</a></div></article>`;
const ticker=()=>{const list=items.slice(0,10);if(!list.length)return '';return `<div class="bv-ticker" aria-label="Most recent indexed reports"><span class="bv-ticker-tag">Latest</span><div class="bv-ticker-window"><div class="bv-ticker-track">${[0,1].map(copy=>`<div class="bv-ticker-set"${copy?' aria-hidden="true"':''}>${list.map(x=>`<a class="bv-tick bv-t-${x.type}" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><i></i><b>${fmt(x.date)}</b> ${TYPES[x.type].label}: ${esc(x.title)} ↗</a>`).join('')}</div>`).join('')}</div></div></div>`};
const monthly=()=>{const rows=MONTHS.map((m,i)=>{const mm=String(i+1).padStart(2,'0');const l=inYear.filter(x=>x.date.slice(5,7)===mm);return {m,l}});const max=Math.max(1,...rows.map(r=>r.l.length));return `<div class="bv-panel bv-monthly"><h3>${year} Indexed Reports by Month</h3><p class="bv-note">Stacked by report type · incident month · all indexed lists</p><div class="bv-bars">${rows.map(r=>`<div class="bv-bar" title="${r.m}: ${r.l.length} indexed report${r.l.length===1?'':'s'}"><span class="bv-bar-n">${r.l.length||''}</span><div class="bv-bar-stack" style="height:${r.l.length/max*100}%">${ORDER.map(t=>{const n=r.l.filter(x=>x.type===t).length;return n?`<div class="bv-seg bv-t-${t}" style="flex:${n}"></div>`:''}).join('')}</div><span class="bv-bar-m">${r.m}</span></div>`).join('')}</div></div>`};
const breakdown=()=>{const max=Math.max(1,...ORDER.map(count));return `<div class="bv-panel bv-break"><h3>${year} Reports by Type</h3><p class="bv-note">Count of indexed reports, not people · cross-listed robberies/assaults counted once, under their shooting or homicide</p>${ORDER.map(t=>{const n=count(t);const listEmpty=(t==='otherhom'&&!OH.length)||(t==='robbery'&&!RB.length)||(t==='assault'&&!AS.length);return `<div class="bv-brow bv-t-${t}"><span>${TYPES[t].label}</span><div class="bv-btrack"><div style="width:${n/max*100}%"></div></div><b>${n?n:(listEmpty?'No indexed reports yet':'None indexed')}</b></div>`}).join('')}</div>`};
const shotYear=sum(yInc,'fatal')+sum(yInc,'injured');
const crimFatal=sum(yInc.filter(r=>incType(r)==='homicide'),'fatal');
const hrAll=HR.length,hrYear=count('hitrun');
const statsHTML=`<div class="bv-stats">
 ${stat({label:`${year} Total Shot`,value:shotYear,sub:`people in ${yInc.length} indexed shooting reports${events.length!==yInc.length?` (${events.length} events)`:''}`,cls:'bv-hero',type:'homicide'})}
 ${stat({label:'Shot & Killed',value:sum(yInc,'fatal'),sub:'all shooting categories',cls:'bv-big',type:'homicide'})}
 ${stat({label:'Shot & Wounded',value:sum(yInc,'injured'),sub:'reported nonfatal injuries',cls:'bv-big',type:'nonfatal'})}
 ${stat({label:'Shooting Reports',value:yInc.length,sub:`indexed in ${year}${events.length!==yInc.length?` · ${events.length} events`:''}`,cls:'bv-big'})}
 ${stat({label:'Criminal Shooting Deaths',value:crimFatal,sub:'alleged criminal · on homicide map',type:'homicide'})}
 ${stat({label:'Non-firearm Homicides',value:OH.filter(r=>r.date.startsWith(year)).length,sub:`${sum(OH.filter(r=>r.date.startsWith(year)),'fatal')} killed · ${[...new Set(OH.filter(r=>r.date.startsWith(year)).map(r=>r.cause))].join(', ')||'stabbing, beating & other causes'}`,type:'otherhom'})}
 ${stat({label:'Police-involved',value:count('officer'),sub:`report${count('officer')===1?'':'s'} · ${sum(yInc.filter(r=>r.category==='officer'),'fatal')} killed`,type:'officer'})}
 ${stat({label:'Self-defense',value:count('defensive'),sub:`report${count('defensive')===1?'':'s'}`,type:'defensive'})}
 ${stat({label:'Accidental',value:count('accidental'),sub:`report${count('accidental')===1?'':'s'}`,type:'accidental'})}
 ${stat({label:'3+ Shot Incidents',value:mass.length,sub:'derived from indexed reports',cls:'bv-massstat'})}
 ${stat({label:'Robberies',value:yRB.length,empty:!yRB.length,sub:`${yRB.filter(r=>r.linkedIncident).length} also indexed as shootings · people shot counted there`,type:'robbery'})}
 ${stat({label:'Assaults (non-shooting)',value:yAS.filter(r=>!r.linkedHomicide).length,empty:!yAS.length,sub:`${yAS.length} listed · ${yAS.filter(r=>r.linkedHomicide).length} counted as homicide · ${yAS.filter(r=>r.confidence==='low').length} low-confidence`,type:'assault'})}
 ${stat({label:'Shots Fired',value:count('shots'),sub:'no victim established',type:'shots'})}
 ${stat({label:'Hit & Runs',value:hrYear,empty:!hrAll,sub:`in ${year} · ${hrAll} indexed all years`,type:'hitrun'})}
 ${stat({label:'All Indexed Reports',value:inYear.length,sub:`every list · ${year}`})}
 ${stat({label:'Days Since Last Indexed Report',value:daysSince,empty:daysSince==null,sub:latest?`newest: ${fmt(latest)} · reviewed ${window.SITE?.reviewedText||''}`:'',cls:'bv-days'})}
</div>`;
const caveat=`<p class="bv-caveat"><strong>Partial archive.</strong> Counts are indexed public reports only, not official county totals. A dash means no reports are indexed yet, not that none occurred. Days-since counts from the newest indexed report, not the last shooting.</p>`;
// Global ticker under the masthead on every page.
document.querySelector('.masthead').insertAdjacentHTML('afterend',ticker());
const main=document.getElementById('main');
if(page==='home'){
 const dash=document.createElement('section');dash.className='bv-dash';dash.id='dashboard';dash.setAttribute('aria-label','Running totals dashboard');
 dash.innerHTML=`<div class="bv-dash-head"><h2>${year} Running Totals</h2><span>Lowndes County · computed from the indexed data files</span></div>${caveat}${statsHTML}${legend()}<div class="bv-two">${monthly()}${breakdown()}</div><div class="bv-dash-head bv-sub"><h2>Recent Indexed Reports</h2><a class="post-link" href="reports.html#bv-all-cards">All color-coded reports →</a></div><div class="bv-cards">${items.slice(0,12).map(card).join('')}</div>`;
 const hero=main.querySelector('.route-hero');(hero||main.firstElementChild).after(dash);
}
if(page==='reports'){
 const box=document.createElement('section');box.className='bv-dash';box.id='bv-all-cards';
 box.innerHTML=`<div class="bv-dash-head"><h2>All Indexed Reports · Color-Coded</h2><span>${items.length} reports across every list · newest first</span></div>${caveat}${legend()}<div class="bv-filters" role="group" aria-label="Filter reports by type"><button type="button" class="bv-fchip" data-f="all" aria-pressed="true">All <b>${items.length}</b></button>${ORDER.map(t=>{const n=items.filter(x=>x.type===t).length;return `<button type="button" class="bv-fchip bv-t-${t}" data-f="${t}" aria-pressed="false"${n?'':' disabled'}><i></i>${TYPES[t].label} <b>${n}</b></button>`}).join('')}</div><div class="bv-cards bv-cards-all">${items.map(card).join('')}</div>`;
 const content=document.querySelector('.route-content');content.prepend(box);
 box.querySelector('.bv-filters').addEventListener('click',e=>{const b=e.target.closest('.bv-fchip');if(!b||b.disabled)return;const f=b.dataset.f;box.querySelectorAll('.bv-fchip').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));box.querySelectorAll('.bv-cards-all .bv-card').forEach(c=>{c.hidden=f!=='all'&&c.dataset.bvType!==f})});
}
// Expanded source directory from data/sources.json, appended to the existing Sources panel.
const SRC=window.SOURCES||[],srcPanel=document.getElementById('sources');
if(srcPanel&&SRC.length){const box=document.createElement('div');box.className='bv-sources';box.innerHTML=`<h3>Expanded Source Directory</h3><p class="bv-note">${SRC.length} research sources · added ${fmt(SRC[0].added)} · index/sitemap methods are marked</p><ul>${SRC.map(x=>`<li${x.method?' class="bv-src-method"':''}><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.name)} ↗</a>${x.method?' <em>Index method</em>':''}<small>${esc(x.covers)} · ${esc(x.access)}</small></li>`).join('')}</ul>`;(srcPanel.querySelector('.post-footer')||srcPanel.lastElementChild).before(box)}
// Color the existing incident-log rows by report type (re-applied whenever filters re-render).
const typeById=Object.fromEntries(INC.map(r=>[r.id,incType(r)]));
const tbody=document.getElementById('incident-rows');
const paint=()=>tbody.querySelectorAll('tr').forEach(tr=>{const id=tr.querySelector('[data-record]')?.dataset.record;const t=typeById[id];if(t)tr.dataset.bvType=t;const r=INC.find(x=>x.id===id);tr.classList.toggle('bv-row-mass',!!r&&r.fatal+r.injured>=3);const place=tr.querySelector('.report-place');if(r&&place&&!tr.querySelector('.bv-row-flag'))place.insertAdjacentHTML('afterend',(r.flags||[]).map(f=>`<span class="bv-row-flag">⚠ ${esc(f)}</span>`).join('')+(r.linkedEvent?`<span class="bv-row-linked">Linked event ${esc(r.linkedEvent)}</span>`:''))});
if(tbody){paint();new MutationObserver(paint).observe(tbody,{childList:true});document.querySelector('#incidents .log-meta')?.insertAdjacentHTML('beforeend',legend())}
})();
