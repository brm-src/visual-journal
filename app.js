const entriesMount = document.querySelector('#entries');
const dialog = document.querySelector('#entry-dialog');
const detailMount = document.querySelector('#entry-detail');
const chips = [...document.querySelectorAll('[data-filter]')];
let entries = [];
let activeFilter = 'all';

function esc(value = '') {
  return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function photoStyle(entry) {
  if (entry.photo) return `--photo: url("${esc(entry.photo)}")`;
  const [a, b, c] = entry.palette || ['#201826', '#6d2d33', '#d8a778'];
  return `--photo: radial-gradient(circle at 74% 18%, ${c}, transparent 28%), linear-gradient(135deg, ${a}, ${b} 56%, ${c})`;
}

function recsMarkup(recommendations = {}) {
  return Object.entries(recommendations).map(([kind, rec]) => `
    <div class="rec">
      <span class="rec-label">${esc(kind)}</span>
      <p><strong>${esc(rec.title)}</strong><span>${esc(rec.by)}</span></p>
    </div>
  `).join('');
}

function renderCards() {
  const visible = activeFilter === 'all'
    ? entries
    : entries.filter(entry => entry.moods?.includes(activeFilter));

  entriesMount.innerHTML = visible.map(entry => `
    <button class="entry-card" type="button" data-id="${esc(entry.id)}" style='${photoStyle(entry)}'>
      <span class="card-body">
        <span class="card-meta">${esc(entry.date)}</span>
        <span class="card-title">${esc(entry.title)}</span>
        <span class="card-prose">${esc(entry.prose)}</span>
        <ul class="mood-list">${(entry.moods || []).map(mood => `<li>${esc(mood)}</li>`).join('')}</ul>
      </span>
    </button>
  `).join('');
}

function openEntry(id) {
  const entry = entries.find(item => item.id === id);
  if (!entry) return;
  detailMount.innerHTML = `
    <section class="detail">
      <div class="detail-media" style='${photoStyle(entry)}' role="img" aria-label="${esc(entry.title)}"></div>
      <div class="detail-copy">
        <p class="kicker">${esc(entry.date)}</p>
        <h2>${esc(entry.title)}</h2>
        <p class="prose">${esc(entry.prose)}</p>
        <ul class="mood-list">${(entry.moods || []).map(mood => `<li>${esc(mood)}</li>`).join('')}</ul>
        <div class="recs">${recsMarkup(entry.recommendations)}</div>
      </div>
    </section>
  `;
  dialog.showModal();
}

entriesMount.addEventListener('click', event => {
  const card = event.target.closest('[data-id]');
  if (card) openEntry(card.dataset.id);
});

document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

chips.forEach(chip => chip.addEventListener('click', () => {
  activeFilter = chip.dataset.filter;
  chips.forEach(item => item.classList.toggle('is-active', item === chip));
  renderCards();
}));

fetch('./data/entries.json')
  .then(response => {
    if (!response.ok) throw new Error(`entries ${response.status}`);
    return response.json();
  })
  .then(data => {
    entries = data;
    renderCards();
  })
  .catch(error => {
    entriesMount.innerHTML = `<p class="intro-copy">No pude cargar las entradas: ${esc(error.message)}</p>`;
  });
