// Loads the site data from data/*.json, then runs the page scripts in order.
// To add or edit entries, change the JSON files in data/ only (then run tools/build.py for the CSVs).
//   incidents.json -> window.INCIDENTS, shots-fired.json -> window.SHOTS_FIRED,
//   hit-and-run.json -> window.HIT_AND_RUN, history.json -> window.HISTORY,
//   other-homicides.json -> window.OTHER_HOMICIDES, map-locations.json -> window.MAP_LOCATIONS,
//   robberies.json -> window.ROBBERIES, assaults.json -> window.ASSAULTS,
//   sources.json -> window.SOURCES, site.json -> window.SITE (review date; [data-site] spans are filled from it).
// dashboard.js/.css add the running-totals layer; art.js/.css add the memorial wall and SVG motifs (art/).
(function(){
  var V='__BUILD__';var B='memoriam-assets/';window.BV_BUILD=V;
  var scripts=['app.js','history.js','clock.js','locations.js','final-layout.js','county-boundary.js','homicide-map.js','hit-and-run.js','shots-fired.js','national-sources.js','visuals.js','pies.js','improvements.js','organize.js','contact-config.js','page-layout.js','collapsible.js','dashboard.js','art.js','graphics.js','memoriam-3col.js','vendor/qrcode-generator/qrcode.js','theatrical.js'];
  function next(i){
    if(i>=scripts.length){done();return}
    var s=document.createElement('script');s.src=B+scripts[i]+'?v='+V;
    s.onload=function(){next(i+1)};
    s.onerror=function(){console.error('Failed to load '+scripts[i]);next(i+1)};
    document.body.appendChild(s);
  }
  // Runs after the last page script: adds the build stamp (stamped by .github/workflows/pages.yml; "dev" when unstamped) and reveals the page.
  function done(){
    var f=document.querySelector('body > footer');
    if(f&&!f.querySelector('.bv-build')){var b=document.createElement('span');b.className='bv-build';b.textContent=/^__/.test(V)?'dev':'build '+V;b.title='Deployed commit';f.appendChild(b)}
    reveal();
  }
  function reveal(){requestAnimationFrame(function(){document.documentElement.classList.remove('bv-loading')})}
  var WORDS=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function spell(n){if(n<20)return WORDS[n];if(n<100)return TENS[Math.floor(n/10)]+(n%10?'-'+WORDS[n%10]:'');return String(n)}
  // Derives review-date strings and record counts from data/site.json + the data files, then fills [data-site] spans.
  function siteInfo(){
    var S=window.SITE=window.SITE||{};var p=String(S.reviewed||'').split('-').map(Number);
    var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
    S.reviewedText=M[p[1]-1]+' '+p[2]+', '+p[0];S.reviewedShort=(M[p[1]-1]+' '+p[2]).toUpperCase();S.year=p[0];
    S.dayOfYear=Math.round((Date.UTC(p[0],p[1]-1,p[2])-Date.UTC(p[0],0,1))/864e5)+1;
    var n=(window.INCIDENTS||[]).length,w=spell(n);S.incidentCount=n;S.incidentWord=w;
    var fill={reviewed:S.reviewedText,count:w,'count-cap':w.charAt(0).toUpperCase()+w.slice(1)};
    document.querySelectorAll('[data-site]').forEach(function(el){var v=fill[el.dataset.site];if(v!=null)el.textContent=v});
  }
  var css=document.createElement('link');css.rel='stylesheet';css.href=B+'dashboard.css?v='+V;document.head.appendChild(css);
  var art=document.createElement('link');art.rel='stylesheet';art.href=B+'art.css?v='+V;document.head.appendChild(art);
  var gfx=document.createElement('link');gfx.rel='stylesheet';gfx.href=B+'graphics.css?v='+V;document.head.appendChild(gfx);
  var m3=document.createElement('link');m3.rel='stylesheet';m3.href=B+'memoriam-3col.css?v='+V;document.head.appendChild(m3);
  var th=document.createElement('link');th.rel='stylesheet';th.href=B+'theatrical.css?v='+V;document.head.appendChild(th);var df=document.createElement('link');df.rel='stylesheet';df.href=B+'dark-fonts.css?v='+V;document.head.appendChild(df);
  var files={INCIDENTS:'data/incidents.json',SHOTS_FIRED:'data/shots-fired.json',HIT_AND_RUN:'data/hit-and-run.json',HISTORY:'data/history.json',OTHER_HOMICIDES:'data/other-homicides.json',MAP_LOCATIONS:'data/map-locations.json',SOURCES:'data/sources.json',SITE:'data/site.json',ROBBERIES:'data/robberies.json',ASSAULTS:'data/assaults.json'};
  var stamp=Date.now();
  Promise.all(Object.keys(files).map(function(key){
    return fetch(B+files[key]+'?v='+stamp,{cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error(files[key]+': HTTP '+r.status);return r.json()})
      .then(function(data){window[key]=data});
  }))
    .then(function(){siteInfo();next(0)})
    .catch(function(err){
      console.error('Could not load site data',err);reveal();
      var m=document.getElementById('main');
      if(m)m.insertAdjacentHTML('afterbegin','<p style="padding:1rem;background:#da1a32;color:#fff">Site data could not be loaded. If you opened this file directly, serve the folder over http (e.g. <code>python3 -m http.server</code>).</p>');
    });
})();
