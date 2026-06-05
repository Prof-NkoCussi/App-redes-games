'use strict';

/* ===== DATOS ===== */

var R1_IPS = [
  { ip: "192.168.1.10",   tipo: "PRIVADA", feedback: "✓ Rango privado de Clase C (192.168.x.x)." },
  { ip: "10.0.0.5",       tipo: "PRIVADA", feedback: "✓ Rango privado de Clase A (10.x.x.x)." },
  { ip: "172.16.0.1",     tipo: "PRIVADA", feedback: "✓ Rango privado de Clase B (172.16-31.x.x)." },
  { ip: "172.20.5.100",   tipo: "PRIVADA", feedback: "✓ Rango privado de Clase B (172.16-31.x.x)." },
  { ip: "192.168.50.200", tipo: "PRIVADA", feedback: "✓ Rango privado de Clase C." },
  { ip: "8.8.8.8",        tipo: "PÚBLICA", feedback: "✓ IP pública del DNS de Google." },
  { ip: "142.250.79.4",   tipo: "PÚBLICA", feedback: "✓ IP pública de Google." },
  { ip: "200.45.10.15",   tipo: "PÚBLICA", feedback: "✓ IP pública (rango no reservado para privadas)." },
  { ip: "52.84.10.5",     tipo: "PÚBLICA", feedback: "✓ IP pública (servidores de Amazon AWS)." },
  { ip: "186.32.100.50",  tipo: "PÚBLICA", feedback: "✓ IP pública (rango asignado a Argentina)." }
];

var R2_IPS = [
  { ip: "10.0.0.1",      clase: "A", feedback: "✓ Primer octeto 10 → entre 1 y 126 → Clase A." },
  { ip: "120.45.10.5",   clase: "A", feedback: "✓ Primer octeto 120 → entre 1 y 126 → Clase A." },
  { ip: "172.16.0.1",    clase: "B", feedback: "✓ Primer octeto 172 → entre 128 y 191 → Clase B." },
  { ip: "145.20.30.40",  clase: "B", feedback: "✓ Primer octeto 145 → entre 128 y 191 → Clase B." },
  { ip: "192.168.1.10",  clase: "C", feedback: "✓ Primer octeto 192 → entre 192 y 223 → Clase C." },
  { ip: "200.100.50.25", clase: "C", feedback: "✓ Primer octeto 200 → entre 192 y 223 → Clase C." }
];

var R3_ESCENARIOS = [
  { id: 'r3e1', texto: "El servidor del colegio",                  tipo: "Estática",
    feedback: "✓ Los servidores siempre llevan IP estática para que se los pueda encontrar siempre." },
  { id: 'r3e2', texto: "El celular de un alumno en el Wi-Fi",      tipo: "Dinámica",
    feedback: "✓ Los celulares reciben IP dinámica del DHCP cada vez que se conectan." },
  { id: 'r3e3', texto: "Una impresora de red de la oficina",       tipo: "Estática",
    feedback: "✓ Las impresoras llevan IP estática para que las PCs sepan siempre dónde encontrarlas." },
  { id: 'r3e4', texto: "Una notebook que se conecta al aula",      tipo: "Dinámica",
    feedback: "✓ Las notebooks van y vienen, conviene IP dinámica." },
  { id: 'r3e5', texto: "El router del colegio",                    tipo: "Estática",
    feedback: "✓ El router debe tener IP estática: es el gateway de toda la red." },
  { id: 'r3e6', texto: "Una tablet que entra al Wi-Fi del recreo", tipo: "Dinámica",
    feedback: "✓ Los dispositivos temporales reciben IP dinámica automáticamente." }
];

var R4_ESPECIALES = [
  { id: 'r4i1', ip: "127.0.0.1",     significado: "Loopback — tu propia máquina (localhost)",
    feedback: "✓ 127.0.0.1 es el loopback: apunta a tu propia computadora. Si hacés ping a esa IP, te respondés a vos mismo." },
  { id: 'r4i2', ip: "192.168.1.0",   significado: "Dirección de red — identifica una red entera",
    feedback: "✓ Cuando todos los bits de host están en 0, identifica a la red completa, no a un host." },
  { id: 'r4i3', ip: "192.168.1.255", significado: "Broadcast — envía a todos los hosts de la red",
    feedback: "✓ Cuando todos los bits de host están en 1, es la dirección de broadcast: llega a todos." },
  { id: 'r4i4', ip: "0.0.0.0",       significado: "Ruta por defecto — dirección no asignada",
    feedback: "✓ 0.0.0.0 significa 'cualquier dirección' o 'sin dirección asignada todavía'." }
];

var R5_CARACTERISTICAS = [
  { id: 'r5c1', texto: "32 bits",                              protocolo: "IPv4" },
  { id: 'r5c2', texto: "128 bits",                             protocolo: "IPv6" },
  { id: 'r5c3', texto: "Notación decimal con puntos",          protocolo: "IPv4" },
  { id: 'r5c4', texto: "Notación hexadecimal con dos puntos",  protocolo: "IPv6" },
  { id: 'r5c5', texto: "Necesita NAT para compartir IPs",      protocolo: "IPv4" },
  { id: 'r5c6', texto: "Autoconfiguración nativa (SLAAC)",     protocolo: "IPv6" },
  { id: 'r5c7', texto: "~4.300 millones de direcciones",       protocolo: "IPv4" },
  { id: 'r5c8', texto: "~340 sextillones de direcciones",      protocolo: "IPv6" }
];

/* ===== ESTADO ===== */

var G4 = null;
var ddDrag4 = null;

/* ===== NAVEGACIÓN ===== */

function goMenu() {
  if (G4 && G4.timerInt) clearInterval(G4.timerInt);
  window.location.href = '../../index.html';
}

/* ===== UTILIDADES ===== */

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function fmtTime(sec) {
  return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
}

/* ===== INIT / REPLAY ===== */

function initTP4() {
  G4 = {
    timerSec: 0, timerInt: null, errores: 0, phase: null,
    r1queue: [], r1idx: 0,
    r2placed: 0, r3placed: 0, r4placed: 0, r5placed: 0
  };
  document.getElementById('tp4-intro').style.display = '';
  document.getElementById('tp4-game').style.display = 'none';
  document.getElementById('modal-tp4').classList.remove('open');
}

function tp4Start() {
  G4.errores = 0; G4.timerSec = 0;
  document.getElementById('tp4-intro').style.display = 'none';
  document.getElementById('tp4-game').style.display = '';
  document.getElementById('tp4-errs').textContent = '0';
  document.getElementById('tp4-timer').textContent = '⏱ 0:00';
  clearInterval(G4.timerInt);
  G4.timerInt = setInterval(function() {
    G4.timerSec++;
    document.getElementById('tp4-timer').textContent = '⏱ ' + fmtTime(G4.timerSec);
  }, 1000);
  showPhase4('r1');
}

function tp4Replay() {
  document.getElementById('modal-tp4').classList.remove('open');
  clearInterval(G4.timerInt);
  initTP4();
}

/* ===== CAMBIO DE FASE ===== */

function showPhase4(phase) {
  G4.phase = phase;
  var badgeMap = { r1: 'Ronda 1 de 5', r2: 'Ronda 2 de 5', r3: 'Ronda 3 de 5', r4: 'Ronda 4 de 5', r5: 'Ronda 5 de 5' };
  var titleMap = {
    r1: '¿Pública o Privada?',
    r2: 'Identificá la clase A / B / C',
    r3: '¿Estática o Dinámica?',
    r4: 'Direcciones especiales IPv4',
    r5: 'IPv4 vs IPv6'
  };
  document.getElementById('tp4-rnd-badge').textContent = badgeMap[phase] || phase;
  document.getElementById('tp4-rnd-title').textContent = titleMap[phase] || '';
  var content = document.getElementById('tp4-content');
  content.style.transition = 'opacity .25s';
  content.style.opacity = '0';
  setTimeout(function() {
    if      (phase === 'r1') renderR1(content);
    else if (phase === 'r2') { G4.r2placed = 0; renderR2(content); }
    else if (phase === 'r3') { G4.r3placed = 0; renderR3(content); }
    else if (phase === 'r4') { G4.r4placed = 0; renderR4(content); }
    else if (phase === 'r5') { G4.r5placed = 0; renderR5(content); }
    content.style.opacity = '1';
  }, 250);
}

/* ===== R1: ¿PÚBLICA O PRIVADA? ===== */

function renderR1(el) {
  G4.r1queue = shuffle(R1_IPS);
  G4.r1idx = 0;
  el.innerHTML =
    '<div class="tp4-rnd-heading">Ronda 1 — ¿Pública o Privada?</div>' +
    '<p class="tp4-rnd-sub">Hacé click rápido en el tipo de dirección IP que aparece.</p>' +
    '<div class="tp4-progress-wrap"><div class="tp4-progress-bar" id="r1-pbar" style="width:0%"></div></div>' +
    '<div class="r1-ip-display">' +
      '<div class="r1-ip-label">Clasificá esta IP:</div>' +
      '<div class="r1-ip-text" id="r1-ip">—</div>' +
      '<div class="r1-ip-counter" id="r1-counter">IP 1 de 10</div>' +
    '</div>' +
    '<div class="r1-btns">' +
      '<button class="r1-btn r1-btn-publica" id="btn-publica" onclick="r1Click(\'PÚBLICA\')">' +
        '<span class="r1-btn-icon">🌍</span>' +
        '<span class="r1-btn-label">PÚBLICA</span>' +
      '</button>' +
      '<button class="r1-btn r1-btn-privada" id="btn-privada" onclick="r1Click(\'PRIVADA\')">' +
        '<span class="r1-btn-icon">🏠</span>' +
        '<span class="r1-btn-label">PRIVADA</span>' +
      '</button>' +
    '</div>';
  r1ShowIP();
}

function r1ShowIP() {
  var ip = G4.r1queue[G4.r1idx];
  document.getElementById('r1-ip').textContent = ip.ip;
  document.getElementById('r1-counter').textContent = 'IP ' + (G4.r1idx + 1) + ' de ' + G4.r1queue.length;
  var pct = (G4.r1idx / G4.r1queue.length) * 100;
  document.getElementById('r1-pbar').style.width = pct + '%';
  document.getElementById('btn-publica').disabled = false;
  document.getElementById('btn-privada').disabled = false;
}

function r1Click(tipo) {
  var ip = G4.r1queue[G4.r1idx];
  document.getElementById('btn-publica').disabled = true;
  document.getElementById('btn-privada').disabled = true;
  if (tipo === ip.tipo) {
    var btnId = tipo === 'PÚBLICA' ? 'btn-publica' : 'btn-privada';
    var btnEl = document.getElementById(btnId);
    btnEl.classList.add('flash-ok');
    setTimeout(function() { btnEl.classList.remove('flash-ok'); }, 450);
    tp4Toast(ip.feedback, true);
    G4.r1idx++;
    if (G4.r1idx >= G4.r1queue.length) {
      document.getElementById('r1-pbar').style.width = '100%';
      setTimeout(function() {
        showPhaseBanner4('¡Ronda 1 completada! 🎉', '▶ Continuar a Ronda 2', function() { showPhase4('r2'); });
      }, 900);
    } else {
      setTimeout(r1ShowIP, 900);
    }
  } else {
    var btnIdErr = tipo === 'PÚBLICA' ? 'btn-publica' : 'btn-privada';
    var btnElErr = document.getElementById(btnIdErr);
    btnElErr.classList.add('flash-err');
    setTimeout(function() {
      btnElErr.classList.remove('flash-err');
      document.getElementById('btn-publica').disabled = false;
      document.getElementById('btn-privada').disabled = false;
    }, 450);
    G4.errores++;
    document.getElementById('tp4-errs').textContent = G4.errores;
    var hint = tipo === 'PÚBLICA'
      ? '❌ ' + ip.ip + ' es privada. ' + ip.feedback.replace('✓ ', '')
      : '❌ ' + ip.ip + ' es pública. ' + ip.feedback.replace('✓ ', '');
    tp4Toast(hint);
  }
}

/* ===== R2: CLASES A / B / C ===== */

function renderR2(el) {
  var shuffled = shuffle(R2_IPS);
  var cardsHtml = shuffled.map(function(d) {
    return '<div class="dd-item ip-card" id="ddi-r2-' + d.ip.replace(/\./g,'_') + '" data-item-id="r2-' + d.ip + '">' + d.ip + '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp4-rnd-heading">Ronda 2 — Identificá la clase</div>' +
    '<p class="tp4-rnd-sub">Arrastrá cada IP a su clase correspondiente según el primer octeto.</p>' +
    '<div class="dd-bank" id="r2-bank">' + cardsHtml + '</div>' +
    '<div class="tp4-cols tp4-cols-3">' +
      tp4Col('A', 'Clase A', '1 – 126') +
      tp4Col('B', 'Clase B', '128 – 191') +
      tp4Col('C', 'Clase C', '192 – 223') +
    '</div>';
  attachDD4('#r2-bank .dd-item');
}

function tp4Col(id, label, hint) {
  return '<div class="tp4-col" id="col-' + id + '" data-zone-id="' + id + '">' +
    '<div class="tp4-col-header">' + label + '</div>' +
    '<div class="tp4-col-hint">' + hint + '</div>' +
    '<div class="tp4-col-items" id="col-items-' + id + '"></div>' +
  '</div>';
}

function handleR2Drop(itemId, zoneId, zoneEl) {
  var ip = itemId.replace('r2-', '');
  var entry = null;
  for (var i = 0; i < R2_IPS.length; i++) { if (R2_IPS[i].ip === ip) { entry = R2_IPS[i]; break; } }
  if (!entry) return;
  if (entry.clase !== zoneId) {
    flashZone4(zoneEl, false);
    G4.errores++;
    document.getElementById('tp4-errs').textContent = G4.errores;
    tp4Toast('❌ Revisá el primer octeto. ¿Está entre 1-126, 128-191 o 192-223?');
    return;
  }
  flashZone4(zoneEl, true);
  var safeId = ip.replace(/\./g,'_');
  document.getElementById('ddi-r2-' + safeId).classList.add('dd-placed');
  var chip = document.createElement('div');
  chip.className = 'tp4-chip ip-chip';
  chip.textContent = ip;
  document.getElementById('col-items-' + zoneId).appendChild(chip);
  tp4Toast(entry.feedback, true);
  G4.r2placed++;
  if (G4.r2placed === R2_IPS.length) {
    setTimeout(function() {
      showPhaseBanner4('¡Ronda 2 completada! 🎉', '▶ Continuar a Ronda 3', function() { showPhase4('r3'); });
    }, 400);
  }
}

/* ===== R3: ESTÁTICA O DINÁMICA ===== */

function renderR3(el) {
  var shuffled = shuffle(R3_ESCENARIOS);
  var cardsHtml = shuffled.map(function(e) {
    return '<div class="dd-item" id="ddi-' + e.id + '" data-item-id="' + e.id + '">' + e.texto + '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp4-rnd-heading">Ronda 3 — ¿Estática o Dinámica?</div>' +
    '<p class="tp4-rnd-sub">Arrastrá cada caso a la categoría correcta.</p>' +
    '<div class="dd-bank" id="r3-bank">' + cardsHtml + '</div>' +
    '<div class="tp4-cols tp4-cols-2">' +
      '<div class="tp4-col" id="col-Estática" data-zone-id="Estática">' +
        '<div class="tp4-col-header">📌 Estática</div>' +
        '<div class="tp4-col-items" id="col-items-Estática"></div>' +
      '</div>' +
      '<div class="tp4-col" id="col-Dinámica" data-zone-id="Dinámica">' +
        '<div class="tp4-col-header">🔄 Dinámica (DHCP)</div>' +
        '<div class="tp4-col-items" id="col-items-Dinámica"></div>' +
      '</div>' +
    '</div>';
  attachDD4('#r3-bank .dd-item');
}

function handleR3Drop(itemId, zoneId, zoneEl) {
  var entry = null;
  for (var i = 0; i < R3_ESCENARIOS.length; i++) { if (R3_ESCENARIOS[i].id === itemId) { entry = R3_ESCENARIOS[i]; break; } }
  if (!entry) return;
  if (entry.tipo !== zoneId) {
    flashZone4(zoneEl, false);
    G4.errores++;
    document.getElementById('tp4-errs').textContent = G4.errores;
    tp4Toast('❌ Pensá: ¿es un dispositivo que está siempre o que va y viene?');
    return;
  }
  flashZone4(zoneEl, true);
  document.getElementById('ddi-' + itemId).classList.add('dd-placed');
  var chip = document.createElement('div');
  chip.className = 'tp4-chip';
  chip.textContent = entry.texto;
  document.getElementById('col-items-' + zoneId).appendChild(chip);
  tp4Toast(entry.feedback, true);
  G4.r3placed++;
  if (G4.r3placed === R3_ESCENARIOS.length) {
    setTimeout(function() {
      showPhaseBanner4('¡Ronda 3 completada! 🎉', '▶ Continuar a Ronda 4', function() { showPhase4('r4'); });
    }, 400);
  }
}

/* ===== R4: DIRECCIONES ESPECIALES ===== */

function renderR4(el) {
  var shuffled = shuffle(R4_ESPECIALES);
  var cardsHtml = shuffled.map(function(e) {
    return '<div class="dd-item ip-card" id="ddi-' + e.id + '" data-item-id="' + e.id + '">' + e.ip + '</div>';
  }).join('');
  var slotsHtml = R4_ESPECIALES.map(function(e) {
    return '<div class="r4-slot" id="slot-' + e.id + '" data-zone-id="' + e.id + '">' +
      '<div class="r4-slot-meaning">' + e.significado + '</div>' +
      '<div class="r4-slot-ip" id="slot-ip-' + e.id + '">' + e.ip + '</div>' +
    '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp4-rnd-heading">Ronda 4 — Direcciones especiales IPv4</div>' +
    '<p class="tp4-rnd-sub">Arrastrá cada dirección IP a su significado.</p>' +
    '<div class="dd-bank" id="r4-bank">' + cardsHtml + '</div>' +
    '<div class="r4-slots">' + slotsHtml + '</div>';
  attachDD4('#r4-bank .dd-item');
}

function handleR4Drop(itemId, zoneId, zoneEl) {
  if (itemId !== zoneId) {
    flashZone4(zoneEl, false);
    G4.errores++;
    document.getElementById('tp4-errs').textContent = G4.errores;
    tp4Toast('❌ Esa no es la correspondencia. ¿Qué representa esta dirección especial?');
    return;
  }
  var entry = null;
  for (var i = 0; i < R4_ESPECIALES.length; i++) { if (R4_ESPECIALES[i].id === itemId) { entry = R4_ESPECIALES[i]; break; } }
  if (!entry) return;
  flashZone4(zoneEl, true);
  document.getElementById('ddi-' + itemId).classList.add('dd-placed');
  zoneEl.classList.add('filled');
  tp4Toast(entry.feedback, true);
  G4.r4placed++;
  if (G4.r4placed === R4_ESPECIALES.length) {
    setTimeout(function() {
      showPhaseBanner4('¡Ronda 4 completada! 🎉', '▶ Continuar a Ronda 5', function() { showPhase4('r5'); });
    }, 400);
  }
}

/* ===== R5: IPv4 vs IPv6 ===== */

function renderR5(el) {
  var shuffled = shuffle(R5_CARACTERISTICAS);
  var cardsHtml = shuffled.map(function(c) {
    return '<div class="dd-item" id="ddi-' + c.id + '" data-item-id="' + c.id + '">' + c.texto + '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp4-rnd-heading">Ronda 5 — IPv4 vs IPv6</div>' +
    '<p class="tp4-rnd-sub">Arrastrá cada característica al protocolo correcto.</p>' +
    '<div class="dd-bank" id="r5-bank">' + cardsHtml + '</div>' +
    '<div class="tp4-cols tp4-cols-2">' +
      '<div class="tp4-col" id="col-IPv4" data-zone-id="IPv4">' +
        '<div class="tp4-col-header">IPv4</div>' +
        '<div class="tp4-col-items" id="col-items-IPv4"></div>' +
      '</div>' +
      '<div class="tp4-col" id="col-IPv6" data-zone-id="IPv6">' +
        '<div class="tp4-col-header">IPv6</div>' +
        '<div class="tp4-col-items" id="col-items-IPv6"></div>' +
      '</div>' +
    '</div>';
  attachDD4('#r5-bank .dd-item');
}

function handleR5Drop(itemId, zoneId, zoneEl) {
  var entry = null;
  for (var i = 0; i < R5_CARACTERISTICAS.length; i++) { if (R5_CARACTERISTICAS[i].id === itemId) { entry = R5_CARACTERISTICAS[i]; break; } }
  if (!entry) return;
  if (entry.protocolo !== zoneId) {
    flashZone4(zoneEl, false);
    G4.errores++;
    document.getElementById('tp4-errs').textContent = G4.errores;
    tp4Toast('❌ Esa característica no es de ese protocolo. ¿Cuántos bits tiene cada uno?');
    return;
  }
  flashZone4(zoneEl, true);
  document.getElementById('ddi-' + itemId).classList.add('dd-placed');
  var chip = document.createElement('div');
  chip.className = 'tp4-chip';
  chip.textContent = entry.texto;
  document.getElementById('col-items-' + zoneId).appendChild(chip);
  tp4Toast('✓ Correcto', true);
  G4.r5placed++;
  if (G4.r5placed === R5_CARACTERISTICAS.length) {
    setTimeout(function() {
      showPhaseBanner4('¡Conociste IPv4 e IPv6! 🎉', '▶ Ver resultados', tp4ShowResults);
    }, 400);
  }
}

/* ===== RESULTADOS ===== */

function tp4ShowResults() {
  clearInterval(G4.timerInt);
  markPlayed(4);
  var sec = G4.timerSec;
  var med = calcMedallaTP4(sec);
  document.getElementById('tp4-medal').textContent = med.medalla;
  document.getElementById('tp4-medal-name').textContent = med.nombre;
  document.getElementById('tp4-medal-name').style.color = med.color;
  document.getElementById('tp4-res-time').textContent = '⏱ Tiempo: ' + fmtTime(sec);
  document.getElementById('tp4-res-stats').textContent = 'Errores: ' + G4.errores + ' · ' + med.msg;
  var badgesEl = document.getElementById('tp4-badges');
  badgesEl.innerHTML = '';
  if (G4.errores === 0) {
    badgesEl.innerHTML += '<span class="tp4-badge tp4-badge-star">⭐ Sin errores</span>';
  }
  var KEY = 'redes_best_tp4';
  var stored = parseInt(localStorage.getItem(KEY) || '999999');
  if (sec < stored) {
    localStorage.setItem(KEY, sec);
    badgesEl.innerHTML += '<span class="tp4-badge tp4-badge-rec">🎯 ¡Nuevo récord personal!</span>';
  }
  var rondas = [
    'R1 ✓  Pública vs Privada',
    'R2 ✓  Clases A/B/C',
    'R3 ✓  Estática vs Dinámica',
    'R4 ✓  Direcciones especiales',
    'R5 ✓  IPv4 vs IPv6'
  ];
  document.getElementById('tp4-rondas').innerHTML = rondas.map(function(r) {
    return '<div class="tp4-ronda-row"><span class="tp4-check">✓</span> ' + r + '</div>';
  }).join('');
  document.getElementById('modal-tp4').classList.add('open');
  launchConfetti();
}

function calcMedallaTP4(sec) {
  var min = sec / 60;
  if (min < 5) return { medalla: '🥇', nombre: 'ORO',        color: '#facc15', msg: '¡Increíble! Tiempo récord.' };
  if (min < 7) return { medalla: '🥈', nombre: 'PLATA',      color: '#a4b3c9', msg: '¡Muy bien! Excelente trabajo.' };
  if (min < 9) return { medalla: '🥉', nombre: 'BRONCE',     color: '#fb923c', msg: '¡Lograste completarlo! Buen trabajo.' };
  return              { medalla: '⭐', nombre: 'COMPLETADO', color: '#a78bfa', msg: '¡Lo terminaste! Lo importante es haber aprendido.' };
}

/* ===== BANNERS ENTRE RONDAS ===== */

function showPhaseBanner4(msg, btnText, cb) {
  var overlay = document.createElement('div');
  overlay.className = 'rnd-overlay4';
  var banner = document.createElement('div');
  banner.className = 'rnd-banner4';
  banner.innerHTML =
    '<div class="rnd-banner-icon4">🎉</div>' +
    '<div class="rnd-banner4-title">' + msg + '</div>' +
    '<button class="btn btn-o" id="rnd-btn-next4">' + btnText + '</button>';
  document.body.appendChild(overlay);
  document.body.appendChild(banner);
  launchConfetti();
  document.getElementById('rnd-btn-next4').onclick = function() {
    overlay.remove(); banner.remove(); if (cb) cb();
  };
}

/* ===== DRAG & DROP ===== */

function attachDD4(selector) {
  document.querySelectorAll(selector).forEach(function(el) {
    el.addEventListener('pointerdown', onDD4Down);
  });
}

function onDD4Down(e) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  var el = e.currentTarget;
  if (el.classList.contains('dd-placed')) return;
  var ghost = document.createElement('div');
  ghost.className = 'dd-ghost';
  ghost.textContent = el.textContent;
  ghost.style.left = (e.clientX - 70) + 'px';
  ghost.style.top  = (e.clientY - 20) + 'px';
  document.body.appendChild(ghost);
  el.classList.add('dragging');
  ddDrag4 = { itemId: el.dataset.itemId, ghost: ghost, originEl: el };
  document.addEventListener('pointermove', onDD4Move, { passive: false });
  document.addEventListener('pointerup', onDD4Up);
}

function onDD4Move(e) {
  if (!ddDrag4) return;
  e.preventDefault();
  ddDrag4.ghost.style.left = (e.clientX - 70) + 'px';
  ddDrag4.ghost.style.top  = (e.clientY - 20) + 'px';
  clearDZHover4();
  ddDrag4.ghost.style.visibility = 'hidden';
  var under = document.elementFromPoint(e.clientX, e.clientY);
  ddDrag4.ghost.style.visibility = '';
  var zone = under && under.closest('[data-zone-id]');
  if (zone) zone.classList.add('dz-hover');
}

function onDD4Up(e) {
  document.removeEventListener('pointermove', onDD4Move);
  document.removeEventListener('pointerup', onDD4Up);
  if (!ddDrag4) return;
  var itemId = ddDrag4.itemId, ghost = ddDrag4.ghost, originEl = ddDrag4.originEl;
  ddDrag4 = null;
  ghost.style.visibility = 'hidden';
  var under = document.elementFromPoint(e.clientX, e.clientY);
  ghost.remove();
  originEl.classList.remove('dragging');
  clearDZHover4();
  var zone = under && under.closest('[data-zone-id]');
  if (zone && !originEl.classList.contains('dd-placed')) {
    handleDD4Drop(itemId, zone.dataset.zoneId, zone);
  }
}

function handleDD4Drop(itemId, zoneId, zoneEl) {
  var ph = G4 && G4.phase;
  if      (ph === 'r2') handleR2Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r3') handleR3Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r4') handleR4Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r5') handleR5Drop(itemId, zoneId, zoneEl);
}

function clearDZHover4() {
  document.querySelectorAll('.dz-hover').forEach(function(z) { z.classList.remove('dz-hover'); });
}

function flashZone4(el, ok) {
  el.classList.add(ok ? 'do-flash-ok' : 'do-flash-err');
  setTimeout(function() { el.classList.remove('do-flash-ok', 'do-flash-err'); }, 600);
}

/* ===== TOAST ===== */

var toastTimer4 = null;
function tp4Toast(msg, ok) {
  var prev = document.querySelector('.tp4-toast');
  if (prev) prev.remove();
  if (toastTimer4) clearTimeout(toastTimer4);
  var t = document.createElement('div');
  t.className = 'tp4-toast';
  if (ok) t.style.color = 'var(--orange)';
  t.textContent = msg;
  document.body.appendChild(t);
  toastTimer4 = setTimeout(function() { t.remove(); }, 3500);
}

/* ===== ARRANQUE ===== */

initTP4();
