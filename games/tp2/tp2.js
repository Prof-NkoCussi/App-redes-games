const R1_CASOS = [
  { id:'r1c1',  texto:'Conectás tus AirPods al celular por Bluetooth',                          tipo:'PAN', fb:'✓ PAN. Es una red personal de muy corto alcance.' },
  { id:'r1c2',  texto:'Tu smartwatch sincroniza datos con el teléfono',                          tipo:'PAN', fb:'✓ PAN. El smartwatch y el celular forman una red personal.' },
  { id:'r1c3',  texto:'Envío de archivos entre dos celulares por AirDrop',                       tipo:'PAN', fb:'✓ PAN. AirDrop usa Wi-Fi/Bluetooth directo entre dispositivos cercanos.' },
  { id:'r1c4',  texto:'20 PCs del laboratorio del colegio conectadas a un switch',               tipo:'LAN', fb:'✓ LAN. Es una red local que cubre un edificio.' },
  { id:'r1c5',  texto:'Red Wi-Fi de tu casa con celulares, Smart TV y notebook',                 tipo:'LAN', fb:'✓ LAN. Tu red doméstica es una red de área local.' },
  { id:'r1c6',  texto:'Red de la oficina de la dirección del colegio',                           tipo:'LAN', fb:'✓ LAN. Conecta equipos dentro de un edificio o piso.' },
  { id:'r1c7',  texto:'Red de fibra óptica que une 5 hospitales de Ushuaia',                     tipo:'MAN', fb:'✓ MAN. Conecta varios edificios dentro de una misma ciudad.' },
  { id:'r1c8',  texto:'Sistema de cámaras de seguridad municipal de Ushuaia',                    tipo:'MAN', fb:'✓ MAN. Cubre una ciudad completa: red metropolitana.' },
  { id:'r1c9',  texto:'Red privada que conecta las sedes de una universidad en la misma ciudad', tipo:'MAN', fb:'✓ MAN. Varias sedes en una ciudad forman una red metropolitana.' },
  { id:'r1c10', texto:'Internet: la red mundial que conecta millones de equipos',                tipo:'WAN', fb:'✓ WAN. Internet es la red de área amplia más grande del mundo.' },
  { id:'r1c11', texto:'Red corporativa de un banco con sucursales en todo el país',              tipo:'WAN', fb:'✓ WAN. Conecta ubicaciones en diferentes ciudades o países.' },
  { id:'r1c12', texto:'Conexión entre servidores de Google distribuidos por el mundo',           tipo:'WAN', fb:'✓ WAN. Una red que abarca múltiples países es una WAN.' }
];

const R2_COMPONENTES = [
  { id:'r2c1', nombre:'Switch',       emoji:'🔀', funcion:'Conecta varias PCs entre sí dentro de una LAN' },
  { id:'r2c2', nombre:'Router',       emoji:'🌐', funcion:'Conecta la red local a Internet (WAN)' },
  { id:'r2c3', nombre:'Access Point', emoji:'📡', funcion:'Da acceso inalámbrico (Wi-Fi) a los dispositivos' },
  { id:'r2c4', nombre:'Patch Panel',  emoji:'🗄', funcion:'Organiza y ordena los cables que llegan al rack' },
  { id:'r2c5', nombre:'Modem/ONU',    emoji:'📞', funcion:'Convierte la señal del ISP a una señal usable' }
];

const R3_ZONES = [
  { id:'z-centro',   emoji:'📡', nombre:'Centro (techo)',      comp:'AP',         pct:{l:50,t:44}, fb:'✓ El Access Point se coloca en el centro y techo para cubrir toda el aula con Wi-Fi.' },
  { id:'z-rack-sup', emoji:'🔀', nombre:'Rack (pared der.)',   comp:'Switch',     pct:{l:87,t:24}, fb:'✓ El Switch va en el rack, donde concentra los cables de todas las PCs.' },
  { id:'z-router',   emoji:'🌐', nombre:'Rack (junto switch)', comp:'Router',     pct:{l:87,t:36}, fb:'✓ El Router se coloca junto al switch, conectado al cable de Internet.' },
  { id:'z-modem',    emoji:'📞', nombre:'Pared der. (cable)',  comp:'Modem',      pct:{l:91,t:58}, fb:'✓ El Modem/ONU va donde llega el cable de Internet desde afuera.' },
  { id:'z-patch',    emoji:'🗄', nombre:'Gabinete inferior',   comp:'PatchPanel', pct:{l:50,t:91}, fb:'✓ El Patch Panel organiza los cables que vienen de cada PC hacia el switch.' }
];

const R3_COMPONENTES = [
  { id:'AP',         nombre:'Access Point',    emoji:'📡', esRed:true,  va:'z-centro' },
  { id:'Switch',     nombre:'Switch',          emoji:'🔀', esRed:true,  va:'z-rack-sup' },
  { id:'Router',     nombre:'Router',          emoji:'🌐', esRed:true,  va:'z-router' },
  { id:'Modem',      nombre:'Modem/ONU',       emoji:'📞', esRed:true,  va:'z-modem' },
  { id:'PatchPanel', nombre:'Patch Panel',     emoji:'🗄', esRed:true,  va:'z-patch' },
  { id:'Hub',        nombre:'Hub',             emoji:'🔌', esRed:false, fb:'✓ Correcto. El Hub está obsoleto, fue reemplazado por el switch.' },
  { id:'Parlante',   nombre:'Parlante',        emoji:'🔊', esRed:false, fb:'✓ Correcto. El parlante es un dispositivo de audio, no de red.' },
  { id:'Canon',      nombre:'Cañón/Proyector', emoji:'📽', esRed:false, fb:'✓ Correcto. El cañón es para visualización, no para conectar a la red.' }
];

let G2 = null;
let ddDrag = null;

function goMenu() {
  if (G2 && G2.timerInt) clearInterval(G2.timerInt);
  window.location.href = '../../index.html';
}

function initTP2() {
  G2 = { timerSec:0, timerInt:null, errores:0, round:0, r1placed:0, r2placed:0, r3placed:0, r3discarded:0 };
  document.getElementById('tp2-intro').style.display = '';
  document.getElementById('tp2-game').style.display = 'none';
}

function tp2StartGame() {
  document.getElementById('tp2-intro').style.display = 'none';
  document.getElementById('tp2-game').style.display = '';
  G2.errores = 0; G2.timerSec = 0;
  document.getElementById('tp2-errs').textContent = '0';
  document.getElementById('tp2-timer').textContent = '⏱ 0:00';
  clearInterval(G2.timerInt);
  G2.timerInt = setInterval(() => {
    G2.timerSec++;
    const m = Math.floor(G2.timerSec/60), s = G2.timerSec%60;
    document.getElementById('tp2-timer').textContent = `⏱ ${m}:${String(s).padStart(2,'0')}`;
  }, 1000);
  showRound(1);
}

function tp2Replay() {
  document.getElementById('modal-tp2').classList.remove('open');
  G2.timerSec = 0; G2.errores = 0; G2.round = 0;
  G2.r1placed = 0; G2.r2placed = 0; G2.r3placed = 0; G2.r3discarded = 0;
  clearInterval(G2.timerInt);
  document.getElementById('tp2-intro').style.display = '';
  document.getElementById('tp2-game').style.display = 'none';
}

function showRound(n) {
  G2.round = n;
  const titles = [,'¿Qué tipo de red es?','Función de los componentes','Armá la red del laboratorio'];
  document.getElementById('tp2-rnd-badge').textContent = `Ronda ${n} de 3`;
  document.getElementById('tp2-rnd-title').textContent = titles[n];
  const content = document.getElementById('tp2-content');
  content.style.transition = 'opacity .25s';
  content.style.opacity = '0';
  setTimeout(() => {
    if (n===1) renderR1(content);
    else if (n===2) renderR2(content);
    else renderR3(content);
    content.style.opacity = '1';
  }, 250);
}

function renderR1(el) {
  G2.r1placed = 0;
  const casos = [...R1_CASOS].sort(() => Math.random()-.5);
  const zonesInfo = { PAN:'Red personal', LAN:'Red local', MAN:'Red metropolitana', WAN:'Red amplia (global)' };
  el.innerHTML = `
    <div class="tp2-rnd-heading">Ronda 1 — ¿Qué tipo de red es?</div>
    <p class="tp2-rnd-sub">Arrastrá cada caso a su categoría correcta.</p>
    <div class="dd-bank" id="r1-bank">
      ${casos.map(c=>`<div class="dd-item" id="ddi-${c.id}" data-item-id="${c.id}">${c.texto}</div>`).join('')}
    </div>
    <div class="r1-zones">
      ${['PAN','LAN','MAN','WAN'].map(t=>`
        <div class="r1-zone" id="r1z-${t}" data-zone-id="${t}">
          <div class="r1-zone-lbl">${t}</div>
          <div class="r1-zone-desc">${zonesInfo[t]}</div>
        </div>
      `).join('')}
    </div>
  `;
  attachDD('#r1-bank .dd-item');
}

function handleR1Drop(itemId, zoneId, zoneEl) {
  const caso = R1_CASOS.find(c=>c.id===itemId);
  if (!caso) return;
  if (caso.tipo === zoneId) {
    flashZone(zoneEl, true);
    document.getElementById('ddi-'+itemId).classList.add('dd-placed');
    const chip = document.createElement('div');
    chip.className = 'r1-zone-item';
    chip.textContent = caso.texto.length > 45 ? caso.texto.substring(0,45)+'…' : caso.texto;
    zoneEl.appendChild(chip);
    tp2Toast(caso.fb, true);
    G2.r1placed++;
    if (G2.r1placed === R1_CASOS.length) setTimeout(() => showRoundComplete(1, ()=>showRound(2)), 400);
  } else {
    flashZone(zoneEl, false);
    G2.errores++; document.getElementById('tp2-errs').textContent = G2.errores;
    tp2Toast('Volvé a intentar. Pensá en el alcance de la red.');
  }
}

function renderR2(el) {
  G2.r2placed = 0;
  const comps = [...R2_COMPONENTES].sort(() => Math.random()-.5);
  const zones = [...R2_COMPONENTES].sort(() => Math.random()-.5);
  el.innerHTML = `
    <div class="tp2-rnd-heading">Ronda 2 — Función de los componentes</div>
    <p class="tp2-rnd-sub">Arrastrá cada dispositivo a su función correcta.</p>
    <div class="dd-bank" id="r2-bank">
      ${comps.map(c=>`<div class="dd-item" id="ddi-${c.id}" data-item-id="${c.id}">${c.emoji} ${c.nombre}</div>`).join('')}
    </div>
    <div class="r2-zones">
      ${zones.map(c=>`
        <div class="r2-zone" id="r2z-${c.id}" data-zone-id="${c.id}">
          <span class="r2-zone-text">${c.funcion}</span>
          <div class="r2-slot" id="r2slot-${c.id}">¿Cuál?</div>
        </div>
      `).join('')}
    </div>
  `;
  attachDD('#r2-bank .dd-item');
}

function handleR2Drop(itemId, zoneId, zoneEl) {
  if (itemId === zoneId) {
    flashZone(zoneEl, true);
    const comp = R2_COMPONENTES.find(c=>c.id===itemId);
    document.getElementById('ddi-'+itemId).classList.add('dd-placed');
    const slot = document.getElementById('r2slot-'+zoneId);
    if (slot) { slot.textContent = comp.emoji+' '+comp.nombre; slot.classList.add('filled'); }
    tp2Toast('✓ Correcto. '+comp.nombre+' — '+comp.funcion, true);
    G2.r2placed++;
    if (G2.r2placed === R2_COMPONENTES.length) setTimeout(() => showRoundComplete(2, ()=>showRound(3)), 400);
  } else {
    flashZone(zoneEl, false);
    G2.errores++; document.getElementById('tp2-errs').textContent = G2.errores;
    tp2Toast('Repensalo. ¿Cuál es la función real de ese componente?');
  }
}

function renderR3(el) {
  G2.r3placed = 0; G2.r3discarded = 0;
  const comps = [...R3_COMPONENTES].sort(() => Math.random()-.5);
  el.innerHTML = `
    <div class="tp2-rnd-heading">Ronda 3 — Armá la red del laboratorio</div>
    <p class="tp2-rnd-sub">Colocá cada componente en su lugar del plano. Los que no son de red, arrastralos a 🗑.</p>
    <div class="dd-bank" id="r3-bank">
      ${comps.map(c=>`<div class="dd-item" id="ddi-${c.id}" data-item-id="${c.id}">${c.emoji} ${c.nombre}</div>`).join('')}
    </div>
    <div class="r3-layout">
      <div class="r3-plano-wrap" id="r3-plano-wrap">
        ${buildAulaSVG()}
        <div class="r3-drop-overlay">
          ${R3_ZONES.map(z=>`
            <div class="r3-dz" id="r3dz-${z.id}" data-zone-id="${z.id}"
              style="left:${z.pct.l}%;top:${z.pct.t}%">
              <span class="r3-dz-lbl">${z.nombre}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="r3-side">
        <div class="r3-side-ttl">Ubicaciones</div>
        <div class="r3-placed-list">
          ${R3_ZONES.map(z=>`<div class="r3-pslot" id="r3pslot-${z.id}">${z.emoji} ${z.nombre}</div>`).join('')}
        </div>
        <div class="r3-trash" id="r3-trash" data-zone-id="trash">
          <span style="font-size:1.3rem">🗑</span>
          <span>No es componente de red</span>
        </div>
        <div class="r3-discarded" id="r3-discarded"></div>
      </div>
    </div>
  `;
  attachDD('#r3-bank .dd-item');
}

function buildAulaSVG() {
  const pcStyle = 'fill:#111c30;stroke:#2a3b5a;stroke-width:1.5';
  const pcs = [
    ...[78,140,202,264].map(x=>({x,y:42,w:40,h:26})),
    ...[78,140,202,264].map(x=>({x,y:328,w:40,h:26})),
    ...[115,168,221,274].map(y=>({x:40,y,w:26,h:36})),
    ...[115,168,221,274].map(y=>({x:334,y,w:26,h:36}))
  ];
  const pcSvg = pcs.map(p=>`
    <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3" style="${pcStyle}"/>
    <text x="${p.x+p.w/2}" y="${p.y+p.h/2+4}" text-anchor="middle" font-size="11" fill="#6b809e">PC</text>
  `).join('');
  return `
    <svg class="r3-plano-svg" viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="340" height="320" rx="4" fill="#0d1825" stroke="#2a3b5a" stroke-width="2"/>
      <rect x="30" y="27" width="52" height="6" fill="#0a1220"/>
      <text x="56" y="20" text-anchor="middle" font-size="10" fill="#6b809e" font-family="monospace">PUERTA</text>
      <line x1="399" y1="265" x2="360" y2="265" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="370" y="260" text-anchor="middle" font-size="8" fill="#22d3ee" font-family="monospace">ISP</text>
      <text x="200" y="195" text-anchor="middle" font-size="10" fill="#1a2840" font-family="monospace" font-weight="bold">LABORATORIO</text>
      ${pcSvg}
      <text x="200" y="406" text-anchor="middle" font-size="9" fill="#2a3b5a" font-family="monospace">▼ gabinete</text>
    </svg>
  `;
}

function handleR3Drop(itemId, zoneId, zoneEl) {
  const comp = R3_COMPONENTES.find(c=>c.id===itemId);
  if (!comp) return;
  if (zoneId === 'trash') {
    if (!comp.esRed) {
      flashZone(zoneEl, true);
      document.getElementById('ddi-'+itemId).classList.add('dd-placed');
      const chip = document.createElement('div');
      chip.className = 'r3-disc-chip';
      chip.textContent = comp.emoji+' '+comp.nombre;
      document.getElementById('r3-discarded').appendChild(chip);
      tp2Toast(comp.fb, true);
      G2.r3discarded++;
      checkR3Done();
    } else {
      flashZone(zoneEl, false);
      G2.errores++; document.getElementById('tp2-errs').textContent = G2.errores;
      tp2Toast('¡Cuidado! Este SÍ es un componente de red.');
    }
    return;
  }
  const zone = R3_ZONES.find(z=>z.id===zoneId);
  if (!zone) return;
  if (comp.esRed && comp.va === zoneId) {
    flashZone(zoneEl, true);
    document.getElementById('ddi-'+itemId).classList.add('dd-placed');
    zoneEl.classList.add('filled');
    zoneEl.innerHTML = `<span style="font-size:1.3rem">${comp.emoji}</span><span class="r3-dz-lbl" style="color:var(--green)">${comp.nombre}</span>`;
    const pslot = document.getElementById('r3pslot-'+zoneId);
    if (pslot) { pslot.textContent = comp.emoji+' '+comp.nombre; pslot.classList.add('filled'); }
    tp2Toast(zone.fb, true);
    G2.r3placed++;
    checkR3Done();
  } else if (!comp.esRed) {
    flashZone(zoneEl, false);
    G2.errores++; document.getElementById('tp2-errs').textContent = G2.errores;
    const msgs = { Hub:'El Hub no se usa hoy. ¿No te conviene descartarlo?', Parlante:'El parlante no es de red. Probá la zona de descarte.', Canon:'El cañón no es de red. Probá la zona de descarte.' };
    tp2Toast(msgs[itemId] || 'Ese componente no es de red.');
  } else {
    flashZone(zoneEl, false);
    G2.errores++; document.getElementById('tp2-errs').textContent = G2.errores;
    tp2Toast('Ese no es el lugar correcto. ¿Dónde iría ese componente?');
  }
}

function checkR3Done() {
  const nRed = R3_COMPONENTES.filter(c=>c.esRed).length;
  const nDesc = R3_COMPONENTES.filter(c=>!c.esRed).length;
  if (G2.r3placed === nRed && G2.r3discarded === nDesc) setTimeout(() => showRoundComplete(3, tp2ShowResults), 400);
}

function showRoundComplete(n, cb) {
  const overlay = document.createElement('div');
  overlay.className = 'rnd-overlay';
  const banner = document.createElement('div');
  banner.className = 'rnd-banner';
  const msgs = [,'¡Ronda 1 completada! 🎉','¡Ronda 2 completada! 🎉','¡Red armada correctamente! 🎉'];
  const nexts = [,'▶ Siguiente ronda','▶ Siguiente ronda','▶ Ver resultados'];
  banner.innerHTML = `
    <div class="rnd-banner-icon">🎉</div>
    <div class="rnd-banner-title">${msgs[n]}</div>
    <button class="btn btn-grn" id="rnd-btn-next">${nexts[n]}</button>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(banner);
  launchConfetti();
  document.getElementById('rnd-btn-next').onclick = () => { overlay.remove(); banner.remove(); if (cb) cb(); };
}

function tp2ShowResults() {
  clearInterval(G2.timerInt);
  markPlayed(2);
  const sec = G2.timerSec;
  const m = Math.floor(sec/60), s = sec%60;
  const med = calcMedalla(sec);
  document.getElementById('tp2-medal').textContent = med.medalla;
  document.getElementById('tp2-medal-name').textContent = med.nombre;
  document.getElementById('tp2-medal-name').style.color = med.color;
  document.getElementById('tp2-res-time').textContent = `⏱ Tiempo: ${m}:${String(s).padStart(2,'0')}`;
  document.getElementById('tp2-res-stats').textContent = `Errores: ${G2.errores} · ${med.msg}`;
  const badgesEl = document.getElementById('tp2-badges');
  badgesEl.innerHTML = '';
  if (G2.errores === 0) badgesEl.innerHTML += '<span class="tp2-badge tp2-badge-star">⭐ Sin errores</span>';
  const KEY = 'redes_best_tp2';
  const stored = parseInt(localStorage.getItem(KEY) || '999999');
  if (sec < stored) { localStorage.setItem(KEY, sec); badgesEl.innerHTML += '<span class="tp2-badge tp2-badge-rec">🎯 ¡Nuevo récord!</span>'; }
  document.getElementById('modal-tp2').classList.add('open');
  launchConfetti();
}

function calcMedalla(sec) {
  const m = sec/60;
  if (m < 5) return { medalla:'🥇', nombre:'ORO',        color:'#facc15', msg:'¡Increíble! Tiempo récord.' };
  if (m < 7) return { medalla:'🥈', nombre:'PLATA',      color:'#a4b3c9', msg:'¡Muy bien! Excelente trabajo.' };
  if (m < 9) return { medalla:'🥉', nombre:'BRONCE',     color:'#fb923c', msg:'¡Lograste completarlo! Buen trabajo.' };
  return           { medalla:'⭐', nombre:'COMPLETADO', color:'#a78bfa', msg:'¡Lo terminaste! Lo importante es haber aprendido.' };
}

function attachDD(selector) {
  document.querySelectorAll(selector).forEach(el => el.addEventListener('pointerdown', onDDDown));
}

function onDDDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  const el = e.currentTarget;
  if (el.classList.contains('dd-placed')) return;
  const ghost = document.createElement('div');
  ghost.className = 'dd-ghost';
  ghost.innerHTML = el.innerHTML;
  ghost.style.left = (e.clientX - 70) + 'px';
  ghost.style.top  = (e.clientY - 20) + 'px';
  document.body.appendChild(ghost);
  el.classList.add('dragging');
  ddDrag = { itemId: el.dataset.itemId, ghost, originEl: el };
  document.addEventListener('pointermove', onDDMove, { passive: false });
  document.addEventListener('pointerup', onDDUp);
}

function onDDMove(e) {
  if (!ddDrag) return;
  e.preventDefault();
  ddDrag.ghost.style.left = (e.clientX - 70) + 'px';
  ddDrag.ghost.style.top  = (e.clientY - 20) + 'px';
  clearDZHover();
  ddDrag.ghost.style.visibility = 'hidden';
  const under = document.elementFromPoint(e.clientX, e.clientY);
  ddDrag.ghost.style.visibility = '';
  const zone = under && under.closest('[data-zone-id]');
  if (zone) zone.classList.add('dz-hover');
}

function onDDUp(e) {
  document.removeEventListener('pointermove', onDDMove);
  document.removeEventListener('pointerup', onDDUp);
  if (!ddDrag) return;
  const { itemId, ghost, originEl } = ddDrag;
  ddDrag = null;
  ghost.style.visibility = 'hidden';
  const under = document.elementFromPoint(e.clientX, e.clientY);
  ghost.remove();
  originEl.classList.remove('dragging');
  clearDZHover();
  const zone = under && under.closest('[data-zone-id]');
  if (zone && !originEl.classList.contains('dd-placed')) handleDDDrop(itemId, zone.dataset.zoneId, zone);
}

function handleDDDrop(itemId, zoneId, zoneEl) {
  const r = G2 && G2.round;
  if (r===1) handleR1Drop(itemId, zoneId, zoneEl);
  else if (r===2) handleR2Drop(itemId, zoneId, zoneEl);
  else if (r===3) handleR3Drop(itemId, zoneId, zoneEl);
}

function clearDZHover() { document.querySelectorAll('.dz-hover').forEach(z => z.classList.remove('dz-hover')); }

function flashZone(el, ok) {
  el.classList.add(ok ? 'do-flash-ok' : 'do-flash-err');
  setTimeout(() => el.classList.remove('do-flash-ok','do-flash-err'), 600);
}

let tp2ToastTimer = null;
function tp2Toast(msg, ok) {
  const prev = document.querySelector('.tp2-toast');
  if (prev) prev.remove();
  if (tp2ToastTimer) clearTimeout(tp2ToastTimer);
  const t = document.createElement('div');
  t.className = 'tp2-toast';
  if (ok) t.style.color = 'var(--green)';
  t.textContent = msg;
  document.body.appendChild(t);
  tp2ToastTimer = setTimeout(() => t.remove(), 3500);
}

// Auto-start on page load
initTP2();
