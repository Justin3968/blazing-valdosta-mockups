// Tally-figure graphics for the home-page row: 2026 Shooting Outcomes, Previous Year Crime Statistics, Indexed Report Averages.
// Re-skins what visuals.js / history.js render (so filters, dropdowns and tables keep working); reads the numbers they computed.
(function(){
const SYM='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="bv-fig" viewBox="0 0 20 40"><circle cx="10" cy="5.5" r="4.5"/><path d="M4.5,11.5 H15.5 C17.4,11.5 18.5,12.8 18.5,14.6 V24 C18.5,25.3 16.6,25.3 16.6,24 V16 H15.4 V38 C15.4,39.8 12.4,39.8 12.4,38 V26 H7.6 V38 C7.6,39.8 4.6,39.8 4.6,38 V16 H3.4 V24 C3.4,25.3 1.5,25.3 1.5,24 V14.6 C1.5,12.8 2.6,11.5 4.5,11.5 Z"/></symbol></svg>';
document.body.insertAdjacentHTML('afterbegin',SYM);
const fig=(cls,frac)=>frac!=null&&frac<1?`<span class="bv-fig ${cls} bv-part" style="--f:${frac}"><svg viewBox="0 0 20 40"><use href="#bv-fig"/></svg></span>`:`<span class="bv-fig ${cls}"><svg viewBox="0 0 20 40"><use href="#bv-fig"/></svg></span>`;
// Figures in groups of five (tally style).
const figs=(list)=>{let h='';for(let i=0;i<list.length;i+=5)h+=`<span class="bv-fgroup">${list.slice(i,i+5).join('')}</span>`;return `<div class="bv-figs" aria-hidden="true">${h}</div>`};
const watch=(el,fn)=>{if(!el)return;fn();new MutationObserver(()=>fn()).observe(el,{childList:true})};

// (A) 2026 Shooting Outcomes: one figure per person shot, red = killed, white = wounded.
const ov=document.getElementById('outcome-visual');
watch(ov,()=>{if(ov.querySelector('.bv-tally-out'))return;const svg=ov.querySelector('svg[aria-label]');const m=svg&&svg.getAttribute('aria-label').match(/(\d+) indexed people shot: (\d+) fatal, (\d+) nonfatal/);if(!m)return;
 const [,t,f,i]=m.map(Number);const note=ov.querySelector('.outcome-key small')?.textContent||'';
 const list=[...Array(f)].map(()=>fig('bv-red')).concat([...Array(i)].map(()=>fig('bv-white')));
 ov.innerHTML=`<div class="bv-tally-out" role="img" aria-label="${t} indexed people shot: ${f} killed, ${i} wounded"><div class="bv-to-nums"><div class="bv-to-total"><b>${t}</b><span>People shot</span></div><div class="bv-to-k"><b>${f}</b><span>Killed</span></div><div class="bv-to-w"><b>${i}</b><span>Wounded</span></div></div>${figs(list)}<p class="bv-to-key"><span><i class="bv-key-red"></i>1 figure = 1 person killed</span><span><i class="bv-key-white"></i>1 figure = 1 person wounded</span>${note?`<small>${note}</small>`:''}</p></div>`});

// (B1) Previous Year Crime Statistics: rows of figures per year; selected year in red.
const hc=document.getElementById('history-chart');
const nice=n=>{const c=[1,2,5,10,20,25,50,100,200,250,500,1000,2000,5000];return c.find(x=>x>=n)||Math.ceil(n/1000)*1000};
let rows=[];const drawH=force=>{const bars=[...hc.querySelectorAll('.history-bar')];if(bars.length)rows=bars.map(b=>({v:Number(b.querySelector('span').textContent.replace(/[^\d.]/g,'')),label:b.querySelector('span').textContent,year:b.querySelector('small').textContent})).reverse();else if(!force||!rows.length)return;
 const max=Math.max(1,...rows.map(r=>r.v)),unit=nice(max/30),sel=document.getElementById('history-year')?.value,metric=document.getElementById('history-metric');
 const mname=metric?metric.options[metric.selectedIndex].text:'';
 hc.classList.add('bv-skinned');
 hc.innerHTML=`<div class="bv-hrows">${rows.map(r=>{const whole=Math.floor(r.v/unit),part=r.v/unit-whole,cls=r.year===sel?'bv-red':'bv-white';const list=[...Array(whole)].map(()=>fig(cls));if(part>0.05)list.push(fig(cls,part));return `<div class="bv-hrow${r.year===sel?' bv-sel':''}" role="img" aria-label="${r.year}: ${r.label} reported ${mname} offenses"><span class="bv-hyear">${r.year}</span>${figs(list)}<b class="bv-hnum">${r.label}</b></div>`}).join('')}</div><p class="bv-hunit"><i class="bv-key-${'white'}"></i>1 figure = ${unit.toLocaleString('en-US')} reported offense${unit===1?'':'s'} · ${mname} · selected year in red</p>`};
watch(hc,()=>drawH(false));
['history-year','history-metric'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>setTimeout(()=>drawH(true),0)));
})();
