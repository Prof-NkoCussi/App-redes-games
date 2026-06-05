const COLORS = ['#22d3ee','#4ade80','#a78bfa','#fb923c','#facc15','#f472b6','#2dd4bf','#f87171'];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECTIONS = [[0,1],[1,0],[1,1],[-1,1]];

const TP1_WORDS = [
  { w: "ANALOGICA",  clue: "Tipo de señal que varía de forma continua (ondas)",                                hint: "ANA..." },
  { w: "DIGITAL",    clue: "Tipo de señal que trabaja con dos valores: 0 y 1",                                 hint: "DIG..." },
  { w: "UTP",        clue: "Medio guiado más usado en redes LAN, con conector RJ-45",                         hint: "U..." },
  { w: "FIBRA",      clue: "Medio guiado que transmite datos mediante pulsos de luz",                         hint: "FIB..." },
  { w: "WIFI",       clue: "Medio no guiado más usado para conectar dispositivos a Internet",                 hint: "WI..." },
  { w: "BLUETOOTH",  clue: "Medio no guiado de corto alcance para conectar audífonos o joysticks",            hint: "BLU..." },
  { w: "INFRARROJO", clue: "Medio no guiado usado en controles remotos (TV, A/C)",                           hint: "INF..." },
  { w: "ESTRELLA",   clue: "Topología donde todos los nodos se conectan a un dispositivo central (switch)",   hint: "EST..." },
  { w: "MALLA",      clue: "Topología donde cada nodo se conecta a varios otros (muy redundante)",            hint: "MAL..." },
  { w: "BUS",        clue: "Topología donde todos los nodos comparten un único cable central",                hint: "B..." },
  { w: "ANILLO",     clue: "Topología con forma de círculo donde los datos viajan en un sentido",             hint: "ANI..." },
  { w: "TOPOLOGIA",  clue: "Nombre genérico de la forma en que se organizan los nodos de una red",           hint: "TOP..." }
];

let G = null;
let selCells = [];
let startRC = null;
let isDragging = false;
let timerInt = null;
let timerSec = 0;

function goMenu() {
  stopTimer();
  document.getElementById('modal-res').classList.remove('open');
  window.location.href = '../../index.html';
}

function initWordSearch(wordData) {
  const wordMetadata = {};
  const words = wordData.map((item, i) => {
    const w = item.w.toUpperCase().replace(/[^A-Z]/g, '');
    wordMetadata[w] = { clue: item.clue || '', hint: item.hint || 'Pista...', index: i + 1 };
    return w;
  });
  const maxLen = Math.max(...words.map(w => w.length));
  const rows = Math.max(12, maxLen + 2);
  const cols = Math.max(12, maxLen + 2);
  const res = placeWords(words, null, rows, cols, true, true);
  if (!res) { alert('No se pudo generar la sopa. Probá reshuffle.'); return; }
  G = { grid: res.grid, placements: res.placements, words, wordMetadata, rows, cols, mask: null, diag: true, rev: true, foundSet: new Set(), colorIdx: {} };
  words.forEach((w, i) => G.colorIdx[w] = i % COLORS.length);
  markPlayed(1);
  renderGame();
  startTimer();
  adjustCell();
}

function placeWords(words, mask, rows, cols, allowDiag, allowReverse) {
  const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
  const placements = [];
  const sorted = [...words].sort((a, b) => b.length - a.length);
  for (const word of sorted) {
    let placed = false, attempts = 0;
    while (!placed && attempts < 500) {
      attempts++;
      const dirs = allowDiag ? DIRECTIONS : DIRECTIONS.slice(0, 2);
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const reverse = allowReverse && Math.random() < 0.4;
      const w = reverse ? word.split('').reverse().join('') : word;
      const r0 = Math.floor(Math.random() * rows);
      const c0 = Math.floor(Math.random() * cols);
      const r1 = r0 + dr * (w.length - 1);
      const c1 = c0 + dc * (w.length - 1);
      if (r1 < 0 || r1 >= rows || c1 < 0 || c1 >= cols) continue;
      let ok = true;
      const cells = [];
      for (let i = 0; i < w.length; i++) {
        const r = r0 + dr * i, c = c0 + dc * i;
        if (grid[r][c] !== null && grid[r][c] !== w[i]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (!ok) continue;
      for (let i = 0; i < w.length; i++) grid[cells[i][0]][cells[i][1]] = w[i];
      placements.push({ word, cells, found: false });
      placed = true;
    }
    if (!placed) return null;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === null) grid[r][c] = ALPHA[Math.floor(Math.random() * 26)];
  return { grid, placements };
}

function renderGame() {
  const wlist = document.getElementById('g-wlist-items');
  wlist.innerHTML = '';
  G.words.forEach(w => {
    const meta = G.wordMetadata[w];
    const el = document.createElement('div');
    el.className = 'g-word'; el.id = 'gw-' + w;
    el.innerHTML = meta ? `
      <div class="g-word-info">
        <div class="g-word-num">${meta.index}.</div>
        <div class="g-word-content">
          <div class="g-word-clue">${meta.clue}</div>
          <div class="g-word-hint">📌 ${meta.hint}</div>
        </div>
      </div>` : `<span class="wdot" id="wd-${w}"></span><span class="wtxt">${w}</span>`;
    wlist.appendChild(el);
  });
  const gridEl = document.getElementById('g-grid');
  gridEl.style.gridTemplateColumns = `repeat(${G.cols}, var(--cell))`;
  gridEl.innerHTML = '';
  for (let r = 0; r < G.rows; r++)
    for (let c = 0; c < G.cols; c++) {
      const el = document.createElement('div');
      el.className = 'c on'; el.dataset.r = r; el.dataset.c = c;
      el.textContent = G.grid[r][c];
      gridEl.appendChild(el);
    }
  G.placements.forEach(p => {
    if (p.found) {
      const cls = 'f' + G.colorIdx[p.word];
      p.cells.forEach(([r, c]) => {
        const el = document.querySelector(`#g-grid .c[data-r="${r}"][data-c="${c}"]`);
        if (el) { el.classList.remove('on'); el.classList.add(cls); }
      });
      const wi = document.getElementById('gw-' + p.word);
      const color = COLORS[G.colorIdx[p.word]];
      if (wi) {
        wi.classList.add('found'); wi.style.borderLeft = `3px solid ${color}`;
        const numEl = wi.querySelector('.g-word-num');
        if (numEl) { numEl.style.background = color; numEl.style.color = '#000'; }
      }
      G.foundSet.add(p.word);
    }
  });
  updateProgress();
  attachGridEvents();
}

function attachGridEvents() {
  const grid = document.getElementById('g-grid');
  grid.onmousedown = onDown; grid.onmousemove = onMove;
  grid.onmouseup = onUp; grid.onmouseleave = onUp;
  grid.ontouchstart = onTouchStart; grid.ontouchmove = onTouchMove; grid.ontouchend = onUp;
}

function getCellFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  if (el && el.classList.contains('c') && el.classList.contains('on')) return el;
  return null;
}

function onDown(e) {
  e.preventDefault();
  const el = getCellFromPoint(e.clientX, e.clientY);
  if (!el) return;
  isDragging = true; clearSel();
  startRC = [parseInt(el.dataset.r), parseInt(el.dataset.c)];
  selCells = [startRC]; el.classList.add('sel');
}
function onMove(e) { if (!isDragging) return; e.preventDefault(); updateSel(e.clientX, e.clientY); }
function onTouchStart(e) {
  if (!e.touches[0]) return; e.preventDefault();
  const t = e.touches[0];
  const el = getCellFromPoint(t.clientX, t.clientY);
  if (!el) return;
  isDragging = true; clearSel();
  startRC = [parseInt(el.dataset.r), parseInt(el.dataset.c)];
  selCells = [startRC]; el.classList.add('sel');
}
function onTouchMove(e) {
  if (!isDragging || !e.touches[0]) return;
  e.preventDefault(); updateSel(e.touches[0].clientX, e.touches[0].clientY);
}

function updateSel(x, y) {
  const el = getCellFromPoint(x, y);
  if (!el || !startRC) return;
  const r = parseInt(el.dataset.r), c = parseInt(el.dataset.c);
  const [sr, sc] = startRC;
  const dr = r - sr, dc = c - sc;
  let stepR, stepC, steps;
  if (dr === 0 && dc === 0) { steps = 0; stepR = 0; stepC = 0; }
  else if (dr === 0) { steps = Math.abs(dc); stepR = 0; stepC = Math.sign(dc); }
  else if (dc === 0) { steps = Math.abs(dr); stepR = Math.sign(dr); stepC = 0; }
  else if (Math.abs(dr) === Math.abs(dc)) { steps = Math.abs(dr); stepR = Math.sign(dr); stepC = Math.sign(dc); }
  else return;
  document.querySelectorAll('#g-grid .c.sel').forEach(e2 => e2.classList.remove('sel'));
  selCells = [];
  for (let i = 0; i <= steps; i++) {
    const rr = sr + stepR * i, cc = sc + stepC * i;
    selCells.push([rr, cc]);
    const elx = document.querySelector(`#g-grid .c[data-r="${rr}"][data-c="${cc}"]`);
    if (elx) elx.classList.add('sel');
  }
}

function onUp(e) {
  if (!isDragging) return;
  isDragging = false;
  if (selCells.length < 2) { clearSel(); return; }
  const word = selCells.map(([r, c]) => G.grid[r][c]).join('');
  const wordRev = word.split('').reverse().join('');
  let hit = null;
  for (const p of G.placements) {
    if (!p.found && (p.word === word || p.word === wordRev)) { hit = p; break; }
  }
  if (hit) {
    hit.found = true; G.foundSet.add(hit.word);
    const cls = 'f' + G.colorIdx[hit.word];
    const color = COLORS[G.colorIdx[hit.word]];
    hit.cells.forEach(([r, c]) => {
      const el = document.querySelector(`#g-grid .c[data-r="${r}"][data-c="${c}"]`);
      if (el) { el.classList.remove('sel'); el.classList.add(cls); }
    });
    const wi = document.getElementById('gw-' + hit.word);
    const wd = document.getElementById('wd-' + hit.word);
    if (wi) { wi.classList.add('found','wpop'); wi.style.borderLeft = `3px solid ${color}`; setTimeout(() => wi.classList.remove('wpop'), 400); }
    if (wd) { wd.style.background = color; wd.style.border = 'none'; wd.textContent = '✓'; }
    spawnFloatLabel(hit.word, color);
    updateProgress();
    if (G.foundSet.size === G.words.length) setTimeout(() => { showResults(); launchConfetti(); }, 600);
  } else {
    selCells.forEach(([r, c]) => {
      const el = document.querySelector(`#g-grid .c[data-r="${r}"][data-c="${c}"]`);
      if (el) { el.style.background = 'rgba(248,113,113,0.45)'; setTimeout(() => { if (el) el.style.background = ''; }, 320); }
    });
  }
  clearSel();
}

function clearSel() { document.querySelectorAll('#g-grid .c.sel').forEach(el => el.classList.remove('sel')); selCells = []; startRC = null; }

function spawnFloatLabel(word, color) {
  const el = document.createElement('div');
  el.className = 'float-lbl'; el.textContent = '✓ ' + word; el.style.color = color;
  el.style.left = (35 + Math.random() * 30) + 'vw';
  el.style.top = (25 + Math.random() * 30) + 'vh';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function updateProgress() {
  const f = G.foundSet.size, t = G.words.length;
  document.getElementById('g-pfill').style.width = (f / t * 100) + '%';
  document.getElementById('g-ptxt').textContent = `${f} / ${t} palabras encontradas`;
}

function startTimer() {
  clearInterval(timerInt); timerSec = 0;
  timerInt = setInterval(() => {
    timerSec++;
    const m = Math.floor(timerSec / 60), s = timerSec % 60;
    document.getElementById('g-timer').textContent = `⏱ ${m}:${String(s).padStart(2, '0')}`;
  }, 1000);
}
function stopTimer() { clearInterval(timerInt); }

function adjustCell() {
  if (!G) return;
  const main = document.querySelector('.game-main');
  const w = main.clientWidth - 32, h = main.clientHeight - 32;
  const cellW = Math.floor((w - (G.cols - 1) * 4) / G.cols);
  const cellH = Math.floor((h - (G.rows - 1) * 4) / G.rows);
  const cell = Math.max(22, Math.min(cellW, cellH, 44));
  document.documentElement.style.setProperty('--cell', cell + 'px');
}
window.addEventListener('resize', adjustCell);

function showResults() {
  stopTimer();
  const f = G.foundSet.size, t = G.words.length;
  const pct = Math.round(f / t * 100);
  const m = Math.floor(timerSec / 60), s = timerSec % 60;
  const titles = { 100:'🏆 ¡PERFECTO!', 80:'🎉 ¡Excelente!', 60:'🌟 ¡Muy bien!', 40:'👍 ¡Buen intento!', 0:'💪 ¡Seguí intentando!' };
  const title = Object.entries(titles).reverse().find(([p]) => pct >= +p)?.[1] || '📊 Resultados';
  document.getElementById('res-title').textContent = title;
  document.getElementById('res-score').textContent = `${f}/${t}`;
  document.getElementById('res-time').textContent = `⏱ Tiempo: ${m}:${String(s).padStart(2, '0')}`;
  const tagsEl = document.getElementById('res-tags');
  tagsEl.innerHTML = '';
  G.words.forEach(w => {
    const tag = document.createElement('span');
    const found = G.foundSet.has(w);
    tag.className = 'rtag ' + (found ? 'ok' : 'no');
    tag.textContent = w;
    if (found) tag.style.background = COLORS[G.colorIdx[w]];
    tagsEl.appendChild(tag);
  });
  document.getElementById('modal-res').classList.add('open');
  if (pct === 100) launchConfetti();
}

function closeResults() { document.getElementById('modal-res').classList.remove('open'); startTimer(); }
function reshuffleFromRes() { document.getElementById('modal-res').classList.remove('open'); reshuffleGame(); }
function reshuffleGame() {
  if (!G) return;
  const res = placeWords(G.words, G.mask, G.rows, G.cols, G.diag, G.rev);
  if (!res) { alert('No se pudo mezclar.'); return; }
  G.grid = res.grid; G.placements = res.placements; G.foundSet = new Set();
  startTimer(); renderGame(); adjustCell();
}
function doHint() {
  if (!G) return;
  const unfound = G.placements.find(p => !p.found);
  if (!unfound) return;
  unfound.cells.forEach(([r, c]) => {
    const el = document.querySelector(`#g-grid .c[data-r="${r}"][data-c="${c}"]`);
    if (el) el.classList.add('hint');
  });
  setTimeout(() => {
    unfound.cells.forEach(([r, c]) => {
      const el = document.querySelector(`#g-grid .c[data-r="${r}"][data-c="${c}"]`);
      if (el) el.classList.remove('hint');
    });
  }, 2000);
}

// Auto-start on page load
initWordSearch(TP1_WORDS);
