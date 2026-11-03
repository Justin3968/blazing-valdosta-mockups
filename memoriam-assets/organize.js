// Keep the headline row concise; source definitions remain one click away.
function foldNotes(card,title){const notes=[...card.querySelectorAll(':scope > p.small-note')];if(!notes.length)return;const details=document.createElement('details');details.className='panel-notes';const summary=document.createElement('summary');summary.textContent=title;details.append(summary);notes[0].before(details);notes.forEach(note=>details.append(note))}
foldNotes(historyCard,'Definitions, coverage & sources');foldNotes(clockCard,'Calculation & coverage');
// Grid row spans form independent stacks without the empty cells of fixed rows.
// Observe actual content, not the grid-sized wrappers, to avoid resize loops.
const cardGrid=document.querySelector('.masonry');
// Keep shooting outcomes in the overview's top-right position.
if((document.body.dataset.page||'home')==='home'){
 const latestCard=document.getElementById('latest-report').closest('section');
 annualComparisonCard.replaceWith(latestCard);
 outcomeCard.replaceWith(annualComparisonCard);
 featuredPanels.append(outcomeCard);
}

const orderedCards=[...cardGrid.querySelectorAll('.masonry-column > section')];
cardGrid.replaceChildren();cardGrid.classList.add('balanced-grid');
const cardWrappers=new Map();
orderedCards.forEach(card=>{const wrapper=document.createElement('div');wrapper.className='masonry-item';wrapper.append(card);cardGrid.append(wrapper);cardWrappers.set(card,wrapper)});
function fitCard(card){const wrapper=cardWrappers.get(card);const span=Math.ceil(card.getBoundingClientRect().height+20);if(wrapper.style.gridRowEnd!==`span ${span}`)wrapper.style.gridRowEnd=`span ${span}`}
const cardObserver=new ResizeObserver(entries=>entries.forEach(({target})=>fitCard(target)));orderedCards.forEach(card=>{fitCard(card);cardObserver.observe(card)});
document.fonts.ready.then(()=>orderedCards.forEach(fitCard));

// Summary cards fill the shorter stacks rather than forcing a new full-width row.
window.placeSummaryCards=function(){cardGrid.querySelectorAll('.summary-masonry-item').forEach(wrapper=>{cardObserver.unobserve(wrapper.firstElementChild);cardWrappers.delete(wrapper.firstElementChild);wrapper.remove()});const summaries=document.getElementById('period-summaries');summaries.hidden=true;[...summaries.children].forEach(card=>{const wrapper=document.createElement('div');wrapper.className='masonry-item summary-masonry-item';wrapper.append(card);cardGrid.append(wrapper);cardWrappers.set(card,wrapper);fitCard(card);cardObserver.observe(card)})};window.placeSummaryCards();
