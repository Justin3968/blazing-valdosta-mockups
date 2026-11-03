// Coordinates are Census address matches, rounded for display. The Brookwood
// match anchors the reported 700 block; neither marker identifies an exact scene.
const mappedLocations=window.MAP_LOCATIONS; // loaded from data/map-locations.json by loader.js
const mapCard=document.createElement('section');mapCard.className='post panel homicide-map-card';mapCard.id='homicide-map';
mapCard.innerHTML=`<div class="map-heading"><div><h2>2026 Lowndes County Homicide Map</h2><p>Source-linked fatal shooting reports · partial archive</p></div><div class="map-tools"><label><input id="map-officer" type="checkbox"> Include law-enforcement fatalities</label><label><input id="map-defensive" type="checkbox"> Include self-defense fatalities</label><button id="map-reset" class="export-button">Reset map view</button></div></div><div class="map-layout"><div class="map-canvas-wrap"><div id="fatality-map" aria-label="Map of indexed fatal shootings in Lowndes County"></div><p id="map-load-note" class="map-load-note" hidden>Official Lowndes County boundary · Georgia</p></div><aside class="map-sidebar" aria-label="Mapped reports"><div class="map-key"><span><i class="map-dot"></i> Alleged criminal shooting</span><span><i class="map-dot map-dot-officer"></i> Law-enforcement shooting</span><span><i class="map-dot map-dot-defensive"></i> Self-defense shooting</span></div><p id="map-count" aria-live="polite"></p><div id="mapped-reports"></div></aside></div><p class="small-note">Markers show approximate public locations, not exact scene coordinates. One marker represents an incident; its number is the reported fatalities. Law-enforcement fatalities are separate and hidden by default. The map follows the incident-log filters above. A location without a marker does not imply zero homicides. Non-firearm homicides and unindexed cases are not represented.</p><div class="post-footer">2026 · Indexed Fatal Shooting Locations <a href="https://geocoding.geo.census.gov/geocoder/" target="_blank" rel="noopener noreferrer">Location reference: U.S. Census Geocoder ↗</a></div>`;
featuredPanels.after(mapCard);
const mapNav=document.createElement('a');mapNav.href='#homicide-map';mapNav.textContent='Homicide Map';document.querySelector('.masthead nav').append(mapNav);
let fatalityMap=null,incidentLayer=null,markersById=new Map();
let countyView=[[30.62,-83.50],[31.05,-83.03]];
if(window.L){
 fatalityMap=L.map('fatality-map',{scrollWheelZoom:false}).fitBounds(countyView);
 const countyOutline=L.geoJSON(window.LOWNDES_BOUNDARY,{style:{color:'#8b8b8b',weight:1.5,fillColor:'#e4e2dc',fillOpacity:1},interactive:false}).addTo(fatalityMap);
 countyView=countyOutline.getBounds();
 fatalityMap.fitBounds(countyView,{padding:[25,25]});
 fatalityMap.setMaxBounds(countyView.pad(.35));
 fatalityMap.setMinZoom(Math.max(0,fatalityMap.getZoom()-1));
 fatalityMap.attributionControl.addAttribution('Boundary: <a href="https://tigerweb.geo.census.gov/">U.S. Census TIGERweb</a>');
 [['Hahira',30.9913,-83.3727],['Remerton',30.8441,-83.3090],['Valdosta',30.8327,-83.2785],['Dasher',30.7513,-83.2229],['Lake Park',30.6822,-83.1799]].forEach(([name,lat,lng])=>L.marker([lat,lng],{interactive:false,icon:L.divIcon({className:'county-place-label',html:name,iconSize:[75,16],iconAnchor:[37,8]})}).addTo(fatalityMap));
 L.marker([30.93,-83.25],{interactive:false,icon:L.divIcon({className:'county-name-label',html:'LOWNDES<br>COUNTY',iconSize:[120,42],iconAnchor:[60,21]})}).addTo(fatalityMap);
 incidentLayer=L.layerGroup().addTo(fatalityMap);
 new ResizeObserver(()=>fatalityMap.invalidateSize()).observe(document.getElementById('fatality-map'));
}else{
 document.getElementById('fatality-map').innerHTML='<p class="map-unavailable">Interactive map unavailable. Read the source-linked reports alongside it.</p>';
}
window.renderHomicideMap=function(rows){
 const includeOfficer=document.getElementById('map-officer').checked;
 const includeDefensive=document.getElementById('map-defensive')?.checked;
 const eligible=rows.filter(r=>r.fatal>0&&(r.category==='criminal'||(includeOfficer&&r.category==='officer')||(includeDefensive&&r.category==='defensive')));
 const located=eligible.filter(r=>mappedLocations[r.id]);
 const criminal=located.filter(r=>r.category==='criminal').reduce((n,r)=>n+r.fatal,0),officer=located.filter(r=>r.category==='officer').reduce((n,r)=>n+r.fatal,0);
 document.getElementById('map-count').innerHTML=`<b>${located.length}</b> mapped report${located.length===1?'':'s'}<br><span>${criminal} alleged criminal fatalit${criminal===1?'y':'ies'}${includeOfficer?` · ${officer} law-enforcement fatalit${officer===1?'y':'ies'}`:''}${includeDefensive?` · ${located.filter(r=>r.category==='defensive').reduce((n,r)=>n+r.fatal,0)} self-defense fatalit${located.filter(r=>r.category==='defensive').reduce((n,r)=>n+r.fatal,0)===1?'y':'ies'}`:''}</span>`;
 document.getElementById('mapped-reports').innerHTML=located.length?located.map(r=>`<details class="map-report"><summary><span class="map-report-place">${esc(r.place)}</span><span class="map-report-meta">${formatDate(r.date)} · ${r.fatal} fatal</span></summary><div class="map-report-body"><span class="latest-date">${esc(labels[r.category])}</span><button class="map-focus" data-map-focus="${r.id}">Locate on map <span>↗</span></button><p>${esc(r.title)}<br><strong>${r.fatal} reported fatal</strong></p><small>${esc(mappedLocations[r.id].basis)}</small><a class="post-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Read ${esc(r.source)} ↗</a><button class="map-detail" data-record="${r.id}">Report details →</button></div></details>`).join(''):'<p class="map-empty">No indexed fatal reports match these filters. This is not a zero-homicide count.</p>';
 if(eligible.length>located.length)document.getElementById('mapped-reports').insertAdjacentHTML('beforeend',`<p class="small-note">${eligible.length-located.length} matching report(s) awaiting location verification.</p>`);
 if(!incidentLayer)return;
 incidentLayer.clearLayers();markersById.clear();
 located.forEach(r=>{const point=mappedLocations[r.id],isOfficer=r.category==='officer',marker=L.marker([point.lat,point.lng],{title:`${r.place}: ${r.fatal} reported fatal; ${point.basis}`,icon:L.divIcon({className:'fatal-marker-wrap',html:`<span class="fatal-marker ${isOfficer?'fatal-marker-officer':''}${r.category==='defensive'?' fatal-marker-defensive':''}">${r.fatal}</span>`,iconSize:[30,30],iconAnchor:[15,15]})}).addTo(incidentLayer);marker.bindPopup(`<div class="fatal-popup"><small>${formatDate(r.date)} · ${esc(labels[r.category])}</small><h3>${esc(r.place)}</h3><p>${esc(r.title)}</p><strong>${r.fatal} reported fatal</strong><p>${esc(point.basis)}</p><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Read source report ↗</a><br><button data-record="${r.id}">Report details →</button></div>`);markersById.set(r.id,marker)});
};
document.getElementById('map-officer').addEventListener('change',()=>window.renderHomicideMap(selectedRecords()));
document.getElementById('map-defensive').addEventListener('change',()=>window.renderHomicideMap(selectedRecords()));
document.getElementById('map-reset').addEventListener('click',()=>{if(fatalityMap){fatalityMap.closePopup();fatalityMap.fitBounds(countyView,{padding:[25,25]})}});
mapCard.addEventListener('click',e=>{const focus=e.target.closest('[data-map-focus]');if(focus&&fatalityMap){const marker=markersById.get(focus.dataset.mapFocus);if(marker){fatalityMap.setView(marker.getLatLng(),13);marker.openPopup()}}});
window.renderHomicideMap(selectedRecords());
