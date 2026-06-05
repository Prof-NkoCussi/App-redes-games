'use strict';

/* ===== DATOS ===== */

const NORMA_568A = [
  { pin: 1, color: 'Blanco/Verde',   bg: 'linear-gradient(to right, #fff 50%, #16a34a 50%)' },
  { pin: 2, color: 'Verde',          bg: '#16a34a' },
  { pin: 3, color: 'Blanco/Naranja', bg: 'linear-gradient(to right, #fff 50%, #ea580c 50%)' },
  { pin: 4, color: 'Azul',           bg: '#2563eb' },
  { pin: 5, color: 'Blanco/Azul',    bg: 'linear-gradient(to right, #fff 50%, #2563eb 50%)' },
  { pin: 6, color: 'Naranja',        bg: '#ea580c' },
  { pin: 7, color: 'Blanco/Marrón',  bg: 'linear-gradient(to right, #fff 50%, #78350f 50%)' },
  { pin: 8, color: 'Marrón',         bg: '#78350f' }
];

const NORMA_568B = [
  { pin: 1, color: 'Blanco/Naranja', bg: 'linear-gradient(to right, #fff 50%, #ea580c 50%)' },
  { pin: 2, color: 'Naranja',        bg: '#ea580c' },
  { pin: 3, color: 'Blanco/Verde',   bg: 'linear-gradient(to right, #fff 50%, #16a34a 50%)' },
  { pin: 4, color: 'Azul',           bg: '#2563eb' },
  { pin: 5, color: 'Blanco/Azul',    bg: 'linear-gradient(to right, #fff 50%, #2563eb 50%)' },
  { pin: 6, color: 'Verde',          bg: '#16a34a' },
  { pin: 7, color: 'Blanco/Marrón',  bg: 'linear-gradient(to right, #fff 50%, #78350f 50%)' },
  { pin: 8, color: 'Marrón',         bg: '#78350f' }
];

const R1_5_ESCENARIOS = [
  { id: 'e1', texto: 'PC → Switch',                    tipo: 'Directo', feedback_ok: '✓ Dispositivos diferentes (PC ≠ Switch) → directo.' },
  { id: 'e2', texto: 'PC → PC (sin switch en medio)',  tipo: 'Cruzado', feedback_ok: '✓ Dispositivos iguales (PC = PC) → cruzado.' },
  { id: 'e3', texto: 'Switch → Router',                tipo: 'Directo', feedback_ok: '✓ Dispositivos diferentes (Switch ≠ Router) → directo.' },
  { id: 'e4', texto: 'Switch → Switch',                tipo: 'Cruzado', feedback_ok: '✓ Dispositivos iguales (Switch = Switch) → cruzado.' },
  { id: 'e5', texto: 'PC → Router doméstico',          tipo: 'Directo', feedback_ok: '✓ Dispositivos diferentes (PC ≠ Router) → directo.' },
  { id: 'e6', texto: 'Router → Router',                tipo: 'Cruzado', feedback_ok: '✓ Dispositivos iguales (Router = Router) → cruzado.' }
];

const OSI_LAYERS = [
  { n: 7, name: 'Aplicación',      color: '#a78bfa' },
  { n: 6, name: 'Presentación',    color: '#f472b6' },
  { n: 5, name: 'Sesión',          color: '#fb923c' },
  { n: 4, name: 'Transporte',      color: '#facc15' },
  { n: 3, name: 'Red',             color: '#4ade80' },
  { n: 2, name: 'Enlace de datos', color: '#2dd4bf' },
  { n: 1, name: 'Física',          color: '#22d3ee' }
];

const OSI_FUNCIONES = [
  { capa: 7, funcion: 'Aplicaciones del usuario (HTTP, DNS, SMTP, FTP)' },
  { capa: 6, funcion: 'Formato, cifrado y compresión de datos (SSL/TLS)' },
  { capa: 5, funcion: 'Establece, mantiene y cierra sesiones de comunicación' },
  { capa: 4, funcion: 'Entrega confiable de datos, puertos (TCP/UDP)' },
  { capa: 3, funcion: 'Direccionamiento lógico (IP) y enrutamiento' },
  { capa: 2, funcion: 'Direccionamiento físico (MAC), tramas, switch' },
  { capa: 1, funcion: 'Transmisión de bits por el medio (cables, ondas)' }
];

const TCPIP_PISTAS = [
  { capa: 4, nombre: 'Aplicación',   pista: 'Acá viven los protocolos que usan las aplicaciones: HTTP, DNS, SMTP, FTP, SSH.' },
  { capa: 3, nombre: 'Transporte',   pista: 'Entrega los datos de extremo a extremo. Maneja puertos. Acá están TCP y UDP.' },
  { capa: 2, nombre: 'Internet',     pista: 'Direccionamiento lógico y enrutamiento. Decide por qué camino van los paquetes usando la IP.' },
  { capa: 1, nombre: 'Acceso a red', pista: 'Convierte los datos en señales y los transmite por el cable o por aire (Wi-Fi, Ethernet).' }
];

/* ===== ESTADO ===== */

let G3 = null;
let ddDrag = null;

/* ===== NAVEGACIÓN ===== */

function goMenu() {
  if (G3 && G3.timerInt) clearInterval(G3.timerInt);
  window.location.href = '../../index.html';
}

/* ===== INIT ===== */

function initTP3() {
  G3 = {
    timerSec: 0, timerInt: null, errores: 0,
    norma: null, phase: null,
    doSecondCable: false,
    r1placed: 0, r15placed: 0, r2placed: 0, r25placed: 0, r3placed: 0
  };
  document.getElementById('tp3-intro').style.display = '';
  document.getElementById('tp3-game').style.display = 'none';
  document.getElementById('modal-tp3').classList.remove('open');
}

function tp3Start(norma) {
  G3.norma = norma;
  G3.doSecondCable = (norma === '568A');
  G3.errores = 0; G3.timerSec = 0;
  document.getElementById('tp3-intro').style.display = 'none';
  document.getElementById('tp3-game').style.display = '';
  document.getElementById('tp3-errs').textContent = '0';
  document.getElementById('tp3-timer').textContent = '⏱ 0:00';
  clearInterval(G3.timerInt);
  G3.timerInt = setInterval(function() {
    G3.timerSec++;
    var m = Math.floor(G3.timerSec / 60), s = G3.timerSec % 60;
    document.getElementById('tp3-timer').textContent = '⏱ ' + m + ':' + String(s).padStart(2, '0');
  }, 1000);
  showPhase('r1_first');
}

function tp3Replay() {
  document.getElementById('modal-tp3').classList.remove('open');
  clearInterval(G3.timerInt);
  initTP3();
}

/* ===== CAMBIO DE FASE ===== */

function showPhase(phase) {
  G3.phase = phase;
  var badgeMap = {
    r1_first:  'Ronda 1 — Norma ' + G3.norma,
    r1_second: 'Ronda 1 — Norma 568B',
    r15: 'Ronda 1.5 — ¿Directo o Cruzado?',
    r2:  'Ronda 2 — Modelo OSI',
    r25: 'Ronda 2.5 — Funciones OSI',
    r3:  'Ronda 3 — Modelo TCP/IP'
  };
  var titleMap = {
    r1_first:  'Armá el cable',
    r1_second: 'Armá el cable',
    r15: '¿Cable Directo o Cruzado?',
    r2:  'Apilá las 7 capas del modelo OSI',
    r25: 'Asociá cada función con su capa',
    r3:  'Armá el modelo TCP/IP con pistas'
  };
  document.getElementById('tp3-rnd-badge').textContent = badgeMap[phase] || phase;
  document.getElementById('tp3-rnd-title').textContent = titleMap[phase] || '';
  var content = document.getElementById('tp3-content');
  content.style.transition = 'opacity .25s';
  content.style.opacity = '0';
  setTimeout(function() {
    var normaForCable = (phase === 'r1_second') ? '568B' : G3.norma;
    if (phase === 'r1_first' || phase === 'r1_second') { G3.r1placed = 0; renderR1(normaForCable, content); }
    else if (phase === 'r15') { G3.r15placed = 0; renderR15(content); }
    else if (phase === 'r2')  { G3.r2placed  = 0; renderR2(content); }
    else if (phase === 'r25') { G3.r25placed = 0; renderR25(content); }
    else if (phase === 'r3')  { G3.r3placed  = 0; renderR3(content); }
    content.style.opacity = '1';
  }, 250);
}

/* ===== R1: ARMÁ EL CABLE ===== */

function renderR1(norma, el) {
  var normaData = (norma === '568A') ? NORMA_568A : NORMA_568B;
  var shuffled = normaData.slice().sort(function() { return Math.random() - 0.5; });
  el.innerHTML =
    '<div class="tp3-rnd-heading">Ronda 1 — Armá el cable según norma ' + norma + '</div>' +
    '<p class="tp3-rnd-sub">Arrastrá cada color al pin correcto del conector RJ-45. Pin 1 está a la izquierda.</p>' +
    '<div class="rj45-wrap">' +
      '<div class="rj45-connector">' +
        '<div class="rj45-clip"></div>' +
        '<div class="rj45-body">' +
          '<div class="rj45-pins-row">' +
          normaData.map(function(p) {
            return '<div class="rj45-pin" id="rj45-pin-' + p.pin + '" data-zone-id="pin-' + p.pin + '">' +
              '<div class="rj45-wire-slot"></div>' +
              '<div class="rj45-pin-num">' + p.pin + '</div>' +
            '</div>';
          }).join('') +
          '</div>' +
        '</div>' +
        '<div class="rj45-norma-label">Norma ' + norma + ' · Vista frontal</div>' +
      '</div>' +
    '</div>' +
    '<p class="tp3-rnd-sub" style="text-align:center;margin-bottom:.7rem">Colores disponibles — arrastrá cada uno al pin correcto:</p>' +
    '<div class="color-bank" id="color-bank">' +
    shuffled.map(function(p) {
      return '<div class="color-card dd-item" id="cc-' + p.pin + '" data-item-id="pin-' + p.pin + '" style="background:' + p.bg + '">' +
        '<span class="color-label">' + p.color + '</span>' +
      '</div>';
    }).join('') +
    '</div>';
  attachDD('#color-bank .dd-item');
}

function handleR1Drop(itemId, zoneId, zoneEl) {
  if (itemId !== zoneId) {
    flashZone(zoneEl, false);
    G3.errores++;
    document.getElementById('tp3-errs').textContent = G3.errores;
    var normaName = (G3.phase === 'r1_second') ? '568B' : G3.norma;
    tp3Toast('Ese color no va en el pin ' + zoneId.split('-')[1] + '. Revisá la norma ' + normaName + '.');
    return;
  }
  var pinNum = parseInt(itemId.split('-')[1]);
  var normaData = (G3.phase === 'r1_second' || G3.norma === '568B') ? NORMA_568B : NORMA_568A;
  var entry = null;
  for (var i = 0; i < normaData.length; i++) { if (normaData[i].pin === pinNum) { entry = normaData[i]; break; } }
  if (!entry) return;
  flashZone(zoneEl, true);
  document.getElementById('cc-' + pinNum).classList.add('dd-placed');
  zoneEl.classList.add('filled');
  var slot = zoneEl.querySelector('.rj45-wire-slot');
  if (slot) slot.style.background = entry.bg;
  tp3Toast('✓ Pin ' + pinNum + ' correcto', true);
  G3.r1placed++;
  if (G3.r1placed === 8) setTimeout(onCableComplete, 400);
}

function onCableComplete() {
  if (G3.phase === 'r1_first' && G3.doSecondCable) {
    showMotivatorBanner(
      '¡Excelente! Ahora armemos el cable más usado en redes LAN: la norma 568B',
      'Continuar',
      function() { showPhase('r1_second'); }
    );
  } else {
    showPhaseBanner('¡Cable armado correctamente! 🎉', '▶ Continuar a Ronda 1.5', function() { showPhase('r15'); });
  }
}

/* ===== R1.5: DIRECTO / CRUZADO ===== */

function renderR15(el) {
  var shuffled = R1_5_ESCENARIOS.slice().sort(function() { return Math.random() - 0.5; });
  el.innerHTML =
    '<div class="tp3-rnd-heading">Ronda 1.5 — ¿Cable Directo o Cruzado?</div>' +
    '<p class="tp3-rnd-sub">Arrastrá cada conexión a la categoría correcta.</p>' +
    '<div class="dd-bank" id="r15-bank">' +
    shuffled.map(function(e) {
      return '<div class="dd-item" id="ddi-' + e.id + '" data-item-id="' + e.id + '">' + e.texto + '</div>';
    }).join('') +
    '</div>' +
    '<div class="r15-columns">' +
      '<div class="r15-col" id="col-Directo" data-zone-id="Directo">' +
        '<div class="r15-col-header">🔗 Cable Directo</div>' +
        '<div class="r15-col-items" id="col-items-Directo"></div>' +
      '</div>' +
      '<div class="r15-col" id="col-Cruzado" data-zone-id="Cruzado">' +
        '<div class="r15-col-header">✖ Cable Cruzado</div>' +
        '<div class="r15-col-items" id="col-items-Cruzado"></div>' +
      '</div>' +
    '</div>';
  attachDD('#r15-bank .dd-item');
}

function handleR15Drop(itemId, zoneId, zoneEl) {
  var esc = null;
  for (var i = 0; i < R1_5_ESCENARIOS.length; i++) { if (R1_5_ESCENARIOS[i].id === itemId) { esc = R1_5_ESCENARIOS[i]; break; } }
  if (!esc) return;
  if (esc.tipo === zoneId) {
    flashZone(zoneEl, true);
    document.getElementById('ddi-' + itemId).classList.add('dd-placed');
    var chip = document.createElement('div');
    chip.className = 'r15-chip';
    chip.textContent = esc.texto;
    document.getElementById('col-items-' + zoneId).appendChild(chip);
    tp3Toast(esc.feedback_ok, true);
    G3.r15placed++;
    if (G3.r15placed === R1_5_ESCENARIOS.length) {
      setTimeout(function() {
        showPhaseBanner('¡Ronda 1 completada! 🎉', '▶ Continuar a Ronda 2 — Modelo OSI', function() { showPhase('r2'); });
      }, 400);
    }
  } else {
    flashZone(zoneEl, false);
    G3.errores++;
    document.getElementById('tp3-errs').textContent = G3.errores;
    tp3Toast('Pensá: ¿son dispositivos iguales o diferentes?');
  }
}

/* ===== R2: TORRE OSI ===== */

function renderR2(el) {
  var shuffled = OSI_LAYERS.slice().sort(function() { return Math.random() - 0.5; });
  var cardsHtml = shuffled.map(function(l) {
    return '<div class="dd-item osi-card" id="ddi-osi-' + l.n + '" data-item-id="osi-' + l.n + '" style="border-left-color:' + l.color + '">' + l.name + '</div>';
  }).join('');
  var towerHtml = [7,6,5,4,3,2,1].map(function(n) {
    var layer = null;
    for (var i = 0; i < OSI_LAYERS.length; i++) { if (OSI_LAYERS[i].n === n) { layer = OSI_LAYERS[i]; break; } }
    return '<div class="osi-slot" id="osi-slot-' + n + '" data-zone-id="osi-' + n + '">' +
      '<div class="osi-slot-num" style="color:' + layer.color + '">' + n + '</div>' +
      '<div class="osi-slot-content" id="osi-sc-' + n + '">arrastrar aquí</div>' +
    '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp3-rnd-heading">Ronda 2 — Apilá las 7 capas del Modelo OSI</div>' +
    '<p class="tp3-rnd-sub">Arrastrá cada capa a su lugar. La capa 7 va arriba, la 1 abajo.</p>' +
    '<div class="osi-layout">' +
      '<div class="osi-cards-panel" id="osi-cards">' + cardsHtml + '</div>' +
      '<div class="osi-tower-panel" id="osi-tower">' + towerHtml + '</div>' +
    '</div>';
  attachDD('#osi-cards .dd-item');
}

function handleR2Drop(itemId, zoneId, zoneEl) {
  if (itemId !== zoneId) {
    flashZone(zoneEl, false);
    G3.errores++;
    document.getElementById('tp3-errs').textContent = G3.errores;
    tp3Toast('Esa no es la capa ' + zoneId.split('-')[1] + '. Pensá en el orden.');
    return;
  }
  var n = parseInt(itemId.split('-')[1]);
  var layer = null;
  for (var i = 0; i < OSI_LAYERS.length; i++) { if (OSI_LAYERS[i].n === n) { layer = OSI_LAYERS[i]; break; } }
  if (!layer) return;
  flashZone(zoneEl, true);
  document.getElementById('ddi-osi-' + n).classList.add('dd-placed');
  zoneEl.style.borderColor = layer.color;
  zoneEl.style.background = layer.color + '18';
  zoneEl.classList.add('filled');
  var sc = document.getElementById('osi-sc-' + n);
  if (sc) { sc.textContent = layer.name; sc.style.color = layer.color; }
  tp3Toast('✓ Capa ' + n + ' — ' + layer.name, true);
  G3.r2placed++;
  if (G3.r2placed === 7) {
    shimmerTower('.osi-slot');
    setTimeout(function() {
      showPhaseBanner('¡Modelo OSI armado! 🎉', '▶ Continuar a Ronda 2.5', function() { showPhase('r25'); });
    }, 600);
  }
}

/* ===== R2.5: FUNCIONES OSI ===== */

function renderR25(el) {
  var shuffled = OSI_FUNCIONES.slice().sort(function() { return Math.random() - 0.5; });
  var cardsHtml = shuffled.map(function(f) {
    return '<div class="dd-item fn-card" id="ddi-fn-' + f.capa + '" data-item-id="fn-' + f.capa + '">' + f.funcion + '</div>';
  }).join('');
  var towerHtml = [7,6,5,4,3,2,1].map(function(n) {
    var layer = null;
    for (var i = 0; i < OSI_LAYERS.length; i++) { if (OSI_LAYERS[i].n === n) { layer = OSI_LAYERS[i]; break; } }
    return '<div class="osi-slot osi25-slot" id="fn-slot-' + n + '" data-zone-id="fn-' + n + '">' +
      '<div class="osi-slot-num" style="color:' + layer.color + '">' + n + '</div>' +
      '<div class="osi25-name" style="color:' + layer.color + '">' + layer.name + '</div>' +
      '<div class="osi25-fn-area" id="fn-area-' + n + '">¿Qué hace?</div>' +
    '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp3-rnd-heading">Ronda 2.5 — Asociá cada función con su capa OSI</div>' +
    '<p class="tp3-rnd-sub">Arrastrá cada función al slot de la capa correspondiente.</p>' +
    '<div class="osi-layout">' +
      '<div class="osi-cards-panel" id="fn-cards">' + cardsHtml + '</div>' +
      '<div class="osi-tower-panel">' + towerHtml + '</div>' +
    '</div>';
  attachDD('#fn-cards .dd-item');
}

function handleR25Drop(itemId, zoneId, zoneEl) {
  if (itemId !== zoneId) {
    flashZone(zoneEl, false);
    G3.errores++;
    document.getElementById('tp3-errs').textContent = G3.errores;
    tp3Toast('Esa función no corresponde a esa capa. Pensá qué hace cada capa.');
    return;
  }
  var n = parseInt(itemId.split('-')[1]);
  var layer = null, fn = null;
  for (var i = 0; i < OSI_LAYERS.length; i++) { if (OSI_LAYERS[i].n === n) { layer = OSI_LAYERS[i]; break; } }
  for (var j = 0; j < OSI_FUNCIONES.length; j++) { if (OSI_FUNCIONES[j].capa === n) { fn = OSI_FUNCIONES[j]; break; } }
  if (!layer || !fn) return;
  flashZone(zoneEl, true);
  document.getElementById('ddi-fn-' + n).classList.add('dd-placed');
  zoneEl.style.borderColor = layer.color;
  zoneEl.classList.add('filled');
  var fnArea = document.getElementById('fn-area-' + n);
  if (fnArea) { fnArea.textContent = fn.funcion; fnArea.style.color = layer.color; fnArea.classList.add('fn-filled'); }
  tp3Toast('✓ Correcto — ' + layer.name, true);
  G3.r25placed++;
  if (G3.r25placed === 7) {
    setTimeout(function() {
      showPhaseBanner('¡Funciones asociadas correctamente! 🎉', '▶ Continuar a Ronda 3 — Modelo TCP/IP', function() { showPhase('r3'); });
    }, 400);
  }
}

/* ===== R3: MODELO TCP/IP ===== */

function renderR3(el) {
  var shuffled = TCPIP_PISTAS.slice().sort(function() { return Math.random() - 0.5; });
  var cardsHtml = shuffled.map(function(p) {
    return '<div class="dd-item tcp-card" id="ddi-tcp-' + p.capa + '" data-item-id="tcp-' + p.capa + '">' + p.pista + '</div>';
  }).join('');
  var towerHtml = [4,3,2,1].map(function(n) {
    var entry = null;
    for (var i = 0; i < TCPIP_PISTAS.length; i++) { if (TCPIP_PISTAS[i].capa === n) { entry = TCPIP_PISTAS[i]; break; } }
    return '<div class="osi-slot tcp-slot" id="tcp-slot-' + n + '" data-zone-id="tcp-' + n + '">' +
      '<div class="osi-slot-num" style="color:var(--purple)">' + n + '</div>' +
      '<div class="tcp-slot-content" id="tcp-sc-' + n + '">arrastrar aquí</div>' +
      '<div class="tcp-name-reveal" id="tcp-name-' + n + '">' + entry.nombre + '</div>' +
    '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp3-rnd-heading">Ronda 3 — Armá el Modelo TCP/IP</div>' +
    '<p class="tp3-rnd-sub">Leé las pistas y ordená las capas correctamente. La capa 4 va arriba, la 1 abajo.</p>' +
    '<div class="osi-layout">' +
      '<div class="osi-cards-panel" id="tcp-cards">' + cardsHtml + '</div>' +
      '<div class="osi-tower-panel" id="tcp-tower">' + towerHtml + '</div>' +
    '</div>' +
    '<div class="tcp-motivator" id="tcp-motivator" style="display:none">' +
      '¡Conociste los dos modelos! En la práctica se usa TCP/IP, pero OSI sirve para diagnosticar problemas.' +
    '</div>';
  attachDD('#tcp-cards .dd-item');
}

function handleR3Drop(itemId, zoneId, zoneEl) {
  if (itemId !== zoneId) {
    flashZone(zoneEl, false);
    G3.errores++;
    document.getElementById('tp3-errs').textContent = G3.errores;
    tp3Toast('Repensalo. ¿En qué orden viajan los datos? Aplicación arriba, medio físico abajo.');
    return;
  }
  var n = parseInt(itemId.split('-')[1]);
  var entry = null;
  for (var i = 0; i < TCPIP_PISTAS.length; i++) { if (TCPIP_PISTAS[i].capa === n) { entry = TCPIP_PISTAS[i]; break; } }
  if (!entry) return;
  flashZone(zoneEl, true);
  document.getElementById('ddi-tcp-' + n).classList.add('dd-placed');
  zoneEl.classList.add('filled');
  var sc = document.getElementById('tcp-sc-' + n);
  if (sc) { sc.textContent = entry.pista; sc.style.fontSize = '.72rem'; sc.style.color = 'var(--txt-soft)'; }
  tp3Toast('✓ Correcto', true);
  G3.r3placed++;
  if (G3.r3placed === 4) {
    setTimeout(function() {
      document.querySelectorAll('.tcp-name-reveal').forEach(function(el) { el.classList.add('revealed'); });
      var mot = document.getElementById('tcp-motivator');
      if (mot) mot.style.display = '';
      shimmerTower('.tcp-slot');
      setTimeout(function() {
        showPhaseBanner('¡Modelo TCP/IP armado! 🎉', '▶ Ver resultados', tp3ShowResults);
      }, 800);
    }, 400);
  }
}

/* ===== RESULTADOS ===== */

function tp3ShowResults() {
  clearInterval(G3.timerInt);
  markPlayed(3);
  var sec = G3.timerSec;
  var m = Math.floor(sec / 60), s = sec % 60;
  var med = calcMedallaTP3(sec);
  document.getElementById('tp3-medal').textContent = med.medalla;
  document.getElementById('tp3-medal-name').textContent = med.nombre;
  document.getElementById('tp3-medal-name').style.color = med.color;
  document.getElementById('tp3-res-time').textContent = '⏱ Tiempo: ' + m + ':' + String(s).padStart(2, '0');
  document.getElementById('tp3-res-stats').textContent = 'Errores: ' + G3.errores + ' · ' + med.msg;

  var badgesEl = document.getElementById('tp3-badges');
  badgesEl.innerHTML = '';
  if (G3.errores === 0) {
    badgesEl.innerHTML += '<span class="tp3-badge tp3-badge-star">⭐ Sin errores</span>';
  }
  var KEY = 'redes_best_tp3';
  var stored = parseInt(localStorage.getItem(KEY) || '999999');
  if (sec < stored) {
    localStorage.setItem(KEY, sec);
    badgesEl.innerHTML += '<span class="tp3-badge tp3-badge-rec">🎯 ¡Nuevo récord personal!</span>';
  }

  var rows = [];
  if (G3.doSecondCable) {
    rows.push('Cable 568A armado correctamente');
    rows.push('Cable 568B armado correctamente');
  } else {
    rows.push('Cable 568B armado correctamente');
  }
  rows.push('Directo vs Cruzado');
  rows.push('Torre OSI (7 capas)');
  rows.push('Funciones OSI');
  rows.push('Modelo TCP/IP');
  document.getElementById('tp3-rondas').innerHTML = rows.map(function(r) {
    return '<div class="tp3-ronda-row"><span class="tp3-check">✓</span> ' + r + '</div>';
  }).join('');

  document.getElementById('modal-tp3').classList.add('open');
  launchConfetti();
}

function calcMedallaTP3(sec) {
  var min = sec / 60;
  if (min < 5) return { medalla: '🥇', nombre: 'ORO',        color: '#facc15', msg: '¡Increíble! Tiempo récord.' };
  if (min < 7) return { medalla: '🥈', nombre: 'PLATA',      color: '#a4b3c9', msg: '¡Muy bien! Excelente trabajo.' };
  if (min < 9) return { medalla: '🥉', nombre: 'BRONCE',     color: '#fb923c', msg: '¡Lograste completarlo! Buen trabajo.' };
  return              { medalla: '⭐', nombre: 'COMPLETADO', color: '#a78bfa', msg: '¡Lo terminaste! Lo importante es haber aprendido.' };
}

/* ===== BANNERS ENTRE FASES ===== */

function showPhaseBanner(msg, btnText, cb) {
  var overlay = document.createElement('div');
  overlay.className = 'rnd-overlay3';
  var banner = document.createElement('div');
  banner.className = 'rnd-banner3';
  banner.innerHTML =
    '<div class="rnd-banner-icon">🎉</div>' +
    '<div class="rnd-banner3-title">' + msg + '</div>' +
    '<button class="btn btn-purple" id="rnd-btn-next3">' + btnText + '</button>';
  document.body.appendChild(overlay);
  document.body.appendChild(banner);
  launchConfetti();
  document.getElementById('rnd-btn-next3').onclick = function() {
    overlay.remove(); banner.remove(); if (cb) cb();
  };
}

function showMotivatorBanner(msg, btnText, cb) {
  var overlay = document.createElement('div');
  overlay.className = 'rnd-overlay3';
  var banner = document.createElement('div');
  banner.className = 'rnd-banner3 motivator-banner';
  banner.innerHTML =
    '<div class="rnd-banner-icon">💪</div>' +
    '<div class="rnd-banner3-title">' + msg + '</div>' +
    '<button class="btn btn-purple" id="rnd-btn-motiv">' + btnText + '</button>';
  document.body.appendChild(overlay);
  document.body.appendChild(banner);
  document.getElementById('rnd-btn-motiv').onclick = function() {
    overlay.remove(); banner.remove(); if (cb) cb();
  };
}

/* ===== SHIMMER ===== */

function shimmerTower(slotSelector) {
  document.querySelectorAll(slotSelector).forEach(function(el, i) {
    setTimeout(function() {
      el.classList.add('shimmer');
      setTimeout(function() { el.classList.remove('shimmer'); }, 600);
    }, i * 80);
  });
}

/* ===== DRAG & DROP ===== */

function attachDD(selector) {
  document.querySelectorAll(selector).forEach(function(el) {
    el.addEventListener('pointerdown', onDDDown);
  });
}

function onDDDown(e) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  var el = e.currentTarget;
  if (el.classList.contains('dd-placed')) return;
  var ghost = document.createElement('div');
  ghost.className = 'dd-ghost';
  ghost.innerHTML = el.innerHTML;
  if (el.style.background) ghost.style.background = el.style.background;
  ghost.style.left = (e.clientX - 70) + 'px';
  ghost.style.top  = (e.clientY - 20) + 'px';
  document.body.appendChild(ghost);
  el.classList.add('dragging');
  ddDrag = { itemId: el.dataset.itemId, ghost: ghost, originEl: el };
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
  var under = document.elementFromPoint(e.clientX, e.clientY);
  ddDrag.ghost.style.visibility = '';
  var zone = under && under.closest('[data-zone-id]');
  if (zone) zone.classList.add('dz-hover');
}

function onDDUp(e) {
  document.removeEventListener('pointermove', onDDMove);
  document.removeEventListener('pointerup', onDDUp);
  if (!ddDrag) return;
  var itemId = ddDrag.itemId, ghost = ddDrag.ghost, originEl = ddDrag.originEl;
  ddDrag = null;
  ghost.style.visibility = 'hidden';
  var under = document.elementFromPoint(e.clientX, e.clientY);
  ghost.remove();
  originEl.classList.remove('dragging');
  clearDZHover();
  var zone = under && under.closest('[data-zone-id]');
  if (zone && !originEl.classList.contains('dd-placed')) {
    handleDDDrop(itemId, zone.dataset.zoneId, zone);
  }
}

function handleDDDrop(itemId, zoneId, zoneEl) {
  var ph = G3 && G3.phase;
  if      (ph === 'r1_first' || ph === 'r1_second') handleR1Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r15') handleR15Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r2')  handleR2Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r25') handleR25Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r3')  handleR3Drop(itemId, zoneId, zoneEl);
}

function clearDZHover() {
  document.querySelectorAll('.dz-hover').forEach(function(z) { z.classList.remove('dz-hover'); });
}

function flashZone(el, ok) {
  el.classList.add(ok ? 'do-flash-ok' : 'do-flash-err');
  setTimeout(function() { el.classList.remove('do-flash-ok', 'do-flash-err'); }, 600);
}

/* ===== TOAST ===== */

var toastTimer = null;
function tp3Toast(msg, ok) {
  var prev = document.querySelector('.tp3-toast');
  if (prev) prev.remove();
  if (toastTimer) clearTimeout(toastTimer);
  var t = document.createElement('div');
  t.className = 'tp3-toast';
  if (ok) t.style.color = 'var(--purple)';
  t.textContent = msg;
  document.body.appendChild(t);
  toastTimer = setTimeout(function() { t.remove(); }, 3500);
}

/* ===== ARRANQUE ===== */

initTP3();
