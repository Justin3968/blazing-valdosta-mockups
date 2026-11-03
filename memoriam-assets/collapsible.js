// Fold supplementary reporting, never the charts or headline figures.
(() => {
 function fold(container,nodes,label){
  if(!nodes.length)return;
  const details=document.createElement('details');details.className='supporting-details';
  const summary=document.createElement('summary');summary.textContent=label;details.append(summary);
  nodes[0].before(details);nodes.forEach(node=>details.append(node));
 }
 function scan(){
  document.querySelectorAll('.traffic-report, .community-record').forEach(report=>{
   if(report.dataset.detailsFolded)return;report.dataset.detailsFolded='true';
   const nodes=[...report.children].filter(node=>node.matches('a, p')&&!node.matches('.traffic-outcome')&&!node.querySelector('strong'));
   fold(report,nodes,'Details & sources');
  });
  const latest=document.getElementById('latest-report');
  if(latest&&!latest.querySelector(':scope > .supporting-details')){latest.dataset.detailsFolded='true';fold(latest,[...latest.children].filter(node=>node.matches('p, a')&&!node.querySelector('strong, b')),'Details & source')}
  document.querySelectorAll('section.post.panel, section.summary-card').forEach(card=>{
   if(card.dataset.detailsFolded)return;card.dataset.detailsFolded='true';
   fold(card,[...card.children].filter(node=>node.matches('p.small-note, a.post-link, a.resource, .summary-note, #annual-change-sources')),'Notes & sources');
  });
 }
 scan();new MutationObserver(scan).observe(document.querySelector('main'),{childList:true,subtree:true});
})();
