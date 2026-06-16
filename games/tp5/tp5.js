'use strict';

/* ===== DATOS ===== */

var R1_FUNCIONES = [
  { id: 'r1f1', funcion: "Selección de ruta",
    descripcion: "Decide por qué camino enviar cada paquete para que llegue al destino correcto." },
  { id: 'r1f2', funcion: "Garantía de entrega",
    descripcion: "Si un paquete se pierde en el camino, se encarga de que se reenvíe." },
  { id: 'r1f3', funcion: "Optimización",
    descripcion: "Entre varios caminos posibles, elige el más rápido o menos congestionado." }
];

var R2_ESCENARIOS = [
  { id: 'r2e1', texto: "Una empresa con 3 sucursales fijas conectadas siempre con los mismos enlaces.", tipo: "estatico", clave: "siempre" },
  { id: 'r2e2', texto: "Una multinacional con 200 sucursales que cambian proveedores y rutas seguido.", tipo: "dinamico", clave: "cambian" },
  { id: 'r2e3', texto: "Una oficina pequeña cuya red no cambió hace 5 años.", tipo: "estatico", clave: "no cambió" },
  { id: 'r2e4', texto: "Un ISP grande que ajusta las rutas según la congestión en tiempo real.", tipo: "dinamico", clave: "tiempo real" },
  { id: 'r2e5', texto: "Dos routers de una empresa que siempre se comunican por el mismo camino.", tipo: "estatico", clave: "siempre" },
  { id: 'r2e6', texto: "Una red que usa OSPF o BGP para descubrir rutas automáticamente.", tipo: "dinamico", clave: "automáticamente" }
];

var R3_ESCENARIOS = [
  { id: 'r3e1', texto: "Servidor web de empresa accesible siempre desde la misma IP pública.", tipo: "estatica" },
  { id: 'r3e2', texto: "Tu casa con 4 dispositivos conectados a internet usando una sola IP pública.", tipo: "pat" },
  { id: 'r3e3', texto: "Empresa mediana con 50 empleados y un pool de 10 IPs públicas asignadas por turnos.", tipo: "dinamica" },
  { id: 'r3e4', texto: "Cámaras de seguridad de un local que deben ser accesibles desde una IP fija.", tipo: "estatica" },
  { id: 'r3e5', texto: "Cibercafé con 20 PCs compartiendo una sola conexión hogareña.", tipo: "pat" },
  { id: 'r3e6', texto: "Hotel con un pool de 5 IPs públicas que rota entre los huéspedes que se conectan.", tipo: "dinamica" }
];

var R3_DEFINICIONES = {
  estatica: "Mapeo 1 a 1: una IP privada siempre se traduce a la misma IP pública.",
  dinamica: "Pool de IPs públicas que se asignan por turnos entre varios dispositivos privados.",
  pat: "Múltiples dispositivos comparten UNA sola IP pública, diferenciados por puerto."
};

var ROUTER_IP_PUBLICA = "200.45.10.15";

var DISPOSITIVOS = [
  { id: "cel",      icono: "📱", nombre: "Celular",    ip: "192.168.1.10" },
  { id: "notebook", icono: "💻", nombre: "Notebook",   ip: "192.168.1.11" },
  { id: "tv",       icono: "📺", nombre: "Smart TV",   ip: "192.168.1.12" },
  { id: "consola",  icono: "🎮", nombre: "Consola",    ip: "192.168.1.13" }
];

var SITIOS = [
  { id: "yt", icono: "▶️", nombre: "YouTube" },
  { id: "wa", icono: "💬", nombre: "WhatsApp" },
  { id: "tw", icono: "🎮", nombre: "Twitch" },
  { id: "gg", icono: "🔍", nombre: "Google" }
];

var VIAJES = [
  {
    n: 1, modo: "auto",
    dispositivo: "cel", puerto_origen: 5000, sitio: "yt",
    puerto_traducido: 50001,
    mensaje: "El router asignó el puerto 50001 a la conexión del celular. Así sabe a quién devolverle la respuesta cuando vuelva."
  },
  {
    n: 2, modo: "auto",
    dispositivo: "notebook", puerto_origen: 4500, sitio: "wa",
    puerto_traducido: 50002,
    mensaje: "Otro puerto (50002), distinto del anterior. Cada conexión necesita su propio puerto para que el router no las confunda."
  },
  {
    n: 3, modo: "manual",
    dispositivo: "tv", puerto_origen: 6200, sitio: "tw",
    puerto_traducido: 50003,
    opciones: [50003, 50001, 80],
    pista: "Tiene que ser un puerto alto que no esté ya en la tabla NAT."
  },
  {
    n: 4, modo: "manual",
    dispositivo: "consola", puerto_origen: 7100, sitio: "tw",
    puerto_traducido: 50004,
    opciones: [50004, 50003, 25],
    pista: "Recordá que cada conexión necesita un puerto traducido único."
  },
  {
    n: 5, modo: "manual",
    dispositivo: "cel", puerto_origen: 5100, sitio: "gg",
    puerto_traducido: 50005,
    opciones: [50005, 50001, 50002],
    pista: "El celular ya tenía una conexión abierta, pero ahora abre otra hacia Google. Necesita un nuevo puerto."
  }
];

var MSG_PUERTO_USADO = "Ese puerto ya está siendo usado por **[dispositivo]**. El router no puede asignarlo dos veces al mismo tiempo.";
var MSG_PUERTO_BAJO  = "Los puertos del 0 al 1023 están reservados para servicios conocidos (web=80, mail=25, etc.). El router siempre elige puertos altos para no chocar.";
var MSG_VIAJE5_OK    = "El celular ya tenía una conexión abierta a YouTube. Ahora abre otra hacia Google: el router le asigna un nuevo puerto distinto, así el celular puede tener varias páginas abiertas al mismo tiempo.";
var MSG_R4_CIERRE    = "🎉 Acabás de simular PAT. Con UNA sola IP pública, 4 dispositivos pudieron usar internet al mismo tiempo gracias a los puertos. Eso es exactamente lo que está haciendo el router de tu casa ahora mismo.";
var MSG_R3_TRANSICION = "Ahora vas a ver PAT en acción. Bienvenido al router de tu casa.";

var R5_TABLA = [
  { ipPriv: "192.168.1.10", puertoOrig: 5000, ipPub: "200.45.10.15", puertoTrad: 50001, destino: "YouTube" },
  { ipPriv: "192.168.1.20", puertoOrig: 4800, ipPub: "200.45.10.15", puertoTrad: 50002, destino: "WhatsApp" },
  { ipPriv: "192.168.1.30", puertoOrig: 6100, ipPub: "200.45.10.15", puertoTrad: 50003, destino: "Twitch" },
  { ipPriv: "192.168.1.40", puertoOrig: 7000, ipPub: "200.45.10.15", puertoTrad: 50004, destino: "Google" }
];

var R5_CELDAS_VACIAS = [
  { fila: 0, campo: "puertoTrad" },
  { fila: 1, campo: "ipPriv" },
  { fila: 2, campo: "destino" },
  { fila: 3, campo: "puertoOrig" }
];

var R5_LABELS = { ipPriv: "IP privada", puertoOrig: "Puerto origen", ipPub: "IP pública", puertoTrad: "Puerto traducido", destino: "Destino" };

/* ===== ESTADO ===== */

var G5 = null;
var ddDrag5 = null;
var TRIP_MS = 1400;

/* ===== NAVEGACIÓN ===== */

function goMenu() {
  if (G5 && G5.timerInt) clearInterval(G5.timerInt);
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

function getDispositivo(id) {
  for (var i = 0; i < DISPOSITIVOS.length; i++) { if (DISPOSITIVOS[i].id === id) return DISPOSITIVOS[i]; }
  return null;
}

function getSitio(id) {
  for (var i = 0; i < SITIOS.length; i++) { if (SITIOS[i].id === id) return SITIOS[i]; }
  return null;
}

/* ===== INIT / REPLAY ===== */

function initTP5() {
  G5 = {
    timerSec: 0, timerInt: null, errores: 0, sinErrores: true, phase: null,
    r1placed: 0, r2placed: 0, r3placed: 0, r5placed: 0,
    tablaNAT: [], viajeActual: 0
  };
  document.getElementById('tp5-intro').style.display = '';
  document.getElementById('tp5-game').style.display = 'none';
  document.getElementById('modal-tp5').classList.remove('open');
}

function tp5Start() {
  G5.errores = 0; G5.sinErrores = true; G5.timerSec = 0;
  document.getElementById('tp5-intro').style.display = 'none';
  document.getElementById('tp5-game').style.display = '';
  document.getElementById('tp5-errs').textContent = '0';
  document.getElementById('tp5-timer').textContent = '⏱ 0:00';
  clearInterval(G5.timerInt);
  G5.timerInt = setInterval(function() {
    G5.timerSec++;
    document.getElementById('tp5-timer').textContent = '⏱ ' + fmtTime(G5.timerSec);
  }, 1000);
  showPhase5('r1');
}

function tp5Replay() {
  document.getElementById('modal-tp5').classList.remove('open');
  clearInterval(G5.timerInt);
  initTP5();
}

/* ===== CAMBIO DE FASE ===== */

function showPhase5(phase) {
  G5.phase = phase;
  var badgeMap = { r1: 'Ronda 1 de 5', r2: 'Ronda 2 de 5', r3: 'Ronda 3 de 5', r4: 'Ronda 4 de 5', r5: 'Ronda 5 de 5' };
  var titleMap = {
    r1: 'Funciones del Router',
    r2: '¿Estático o Dinámico?',
    r3: 'Tipos de NAT',
    r4: 'Simulador PAT',
    r5: 'Completá la Tabla NAT'
  };
  document.getElementById('tp5-rnd-badge').textContent = badgeMap[phase] || phase;
  document.getElementById('tp5-rnd-title').textContent = titleMap[phase] || '';
  var content = document.getElementById('tp5-content');
  content.style.transition = 'opacity .25s';
  content.style.opacity = '0';
  setTimeout(function() {
    if      (phase === 'r1') { G5.r1placed = 0; renderR1(content); }
    else if (phase === 'r2') { G5.r2placed = 0; renderR2(content); }
    else if (phase === 'r3') { G5.r3placed = 0; renderR3(content); }
    else if (phase === 'r4') { G5.viajeActual = 0; G5.tablaNAT = []; renderR4(content); }
    else if (phase === 'r5') { G5.r5placed = 0; renderR5(content); }
    content.style.opacity = '1';
  }, 250);
}

/* ===== R1: FUNCIONES DEL ROUTER (drag & drop) ===== */

function renderR1(el) {
  var shuffled = shuffle(R1_FUNCIONES);
  var cardsHtml = shuffled.map(function(f) {
    return '<div class="dd-item" id="ddi-' + f.id + '" data-item-id="' + f.id + '">' + f.funcion + '</div>';
  }).join('');
  var slotsHtml = R1_FUNCIONES.map(function(f) {
    return '<div class="r1-slot" id="slot-' + f.id + '" data-zone-id="' + f.id + '">' +
      '<div class="r1-slot-desc">' + f.descripcion + '</div>' +
      '<div class="r1-slot-fn" id="slot-fn-' + f.id + '">' + f.funcion + '</div>' +
    '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp5-rnd-heading">Ronda 1 — Funciones del Router</div>' +
    '<p class="tp5-rnd-sub">Arrastrá cada función a su descripción correcta.</p>' +
    '<div class="dd-bank" id="r1-bank">' + cardsHtml + '</div>' +
    '<div class="r1-slots">' + slotsHtml + '</div>';
  attachDD5('#r1-bank .dd-item');
}

function handleR1Drop(itemId, zoneId, zoneEl) {
  if (itemId !== zoneId) {
    flashZone5(zoneEl, false);
    G5.errores++; G5.sinErrores = false;
    document.getElementById('tp5-errs').textContent = G5.errores;
    tp5Toast('❌ Esa función no corresponde a esta descripción. Volvé a leerla.');
    return;
  }
  var entry = null;
  for (var i = 0; i < R1_FUNCIONES.length; i++) { if (R1_FUNCIONES[i].id === itemId) { entry = R1_FUNCIONES[i]; break; } }
  if (!entry) return;
  flashZone5(zoneEl, true);
  document.getElementById('ddi-' + itemId).classList.add('dd-placed');
  zoneEl.classList.add('filled');
  tp5Toast('✓ ¡Bien! ' + entry.funcion, true);
  G5.r1placed++;
  if (G5.r1placed === R1_FUNCIONES.length) {
    setTimeout(function() {
      showPhaseBanner5('¡Ronda 1 completada! 🎉', '▶ Continuar a Ronda 2', function() { showPhase5('r2'); });
    }, 400);
  }
}

/* ===== R2: ESTÁTICO O DINÁMICO ===== */

function renderR2(el) {
  var shuffled = shuffle(R2_ESCENARIOS);
  var cardsHtml = shuffled.map(function(e) {
    return '<div class="dd-item" id="ddi-' + e.id + '" data-item-id="' + e.id + '">' + e.texto + '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp5-rnd-heading">Ronda 2 — Enrutamiento Estático vs Dinámico</div>' +
    '<p class="tp5-rnd-sub">Arrastrá cada escenario a la categoría correcta.</p>' +
    '<button class="btn btn-g tp5-hint-btn" onclick="r2Pista()">💡 Pista</button>' +
    '<div class="dd-bank" id="r2-bank">' + cardsHtml + '</div>' +
    '<div class="tp5-cols tp5-cols-2">' +
      '<div class="tp5-col" id="col-estatico" data-zone-id="estatico">' +
        '<div class="tp5-col-header">🛣️ Estático</div>' +
        '<div class="tp5-col-items" id="col-items-estatico"></div>' +
      '</div>' +
      '<div class="tp5-col" id="col-dinamico" data-zone-id="dinamico">' +
        '<div class="tp5-col-header">🔄 Dinámico</div>' +
        '<div class="tp5-col-items" id="col-items-dinamico"></div>' +
      '</div>' +
    '</div>';
  attachDD5('#r2-bank .dd-item');
}

function r2Pista() {
  document.querySelectorAll('#r2-bank .dd-item').forEach(function(card) {
    var id = card.dataset.itemId;
    var entry = null;
    for (var i = 0; i < R2_ESCENARIOS.length; i++) { if (R2_ESCENARIOS[i].id === id) { entry = R2_ESCENARIOS[i]; break; } }
    if (!entry) return;
    var txt = entry.texto;
    var idx = txt.toLowerCase().indexOf(entry.clave.toLowerCase());
    if (idx === -1) { card.textContent = txt; return; }
    card.innerHTML = txt.substring(0, idx) + '<mark>' + txt.substring(idx, idx + entry.clave.length) + '</mark>' + txt.substring(idx + entry.clave.length);
  });
}

function handleR2Drop(itemId, zoneId, zoneEl) {
  var entry = null;
  for (var i = 0; i < R2_ESCENARIOS.length; i++) { if (R2_ESCENARIOS[i].id === itemId) { entry = R2_ESCENARIOS[i]; break; } }
  if (!entry) return;
  if (entry.tipo !== zoneId) {
    flashZone5(zoneEl, false);
    G5.errores++; G5.sinErrores = false;
    document.getElementById('tp5-errs').textContent = G5.errores;
    tp5Toast('❌ Pensá: ¿la red cambia seguido o se mantiene siempre igual?');
    return;
  }
  flashZone5(zoneEl, true);
  document.getElementById('ddi-' + itemId).classList.add('dd-placed');
  var chip = document.createElement('div');
  chip.className = 'tp5-chip';
  chip.textContent = entry.texto;
  document.getElementById('col-items-' + zoneId).appendChild(chip);
  tp5Toast('✓ Correcto', true);
  G5.r2placed++;
  if (G5.r2placed === R2_ESCENARIOS.length) {
    setTimeout(function() {
      showPhaseBanner5('¡Ronda 2 completada! 🎉', '▶ Continuar a Ronda 3', function() { showPhase5('r3'); });
    }, 400);
  }
}

/* ===== R3: TIPOS DE NAT ===== */

function renderR3(el) {
  var shuffled = shuffle(R3_ESCENARIOS);
  var cardsHtml = shuffled.map(function(e) {
    return '<div class="dd-item" id="ddi-' + e.id + '" data-item-id="' + e.id + '">' + e.texto + '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp5-rnd-heading">Ronda 3 — Tipos de NAT</div>' +
    '<p class="tp5-rnd-sub">Arrastrá cada escenario al tipo de NAT correcto. Tocá la ⓘ para ver la definición.</p>' +
    '<div class="dd-bank" id="r3-bank">' + cardsHtml + '</div>' +
    '<div class="tp5-cols tp5-cols-3">' +
      tp5ColNat('estatica', '🎯 NAT Estática') +
      tp5ColNat('dinamica', '🔄 NAT Dinámica') +
      tp5ColNat('pat', '🚪 PAT') +
    '</div>';
  attachDD5('#r3-bank .dd-item');
  document.querySelectorAll('.tp5-col-info').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var tip = btn.nextElementSibling;
      var open = tip.classList.contains('open');
      document.querySelectorAll('.tp5-col-tip.open').forEach(function(t) { t.classList.remove('open'); });
      if (!open) tip.classList.add('open');
    });
  });
}

function tp5ColNat(id, label) {
  return '<div class="tp5-col" id="col-' + id + '" data-zone-id="' + id + '">' +
    '<div class="tp5-col-header">' + label + ' <button class="tp5-col-info" type="button">ⓘ</button></div>' +
    '<div class="tp5-col-tip">' + R3_DEFINICIONES[id] + '</div>' +
    '<div class="tp5-col-items" id="col-items-' + id + '"></div>' +
  '</div>';
}

function handleR3Drop(itemId, zoneId, zoneEl) {
  var entry = null;
  for (var i = 0; i < R3_ESCENARIOS.length; i++) { if (R3_ESCENARIOS[i].id === itemId) { entry = R3_ESCENARIOS[i]; break; } }
  if (!entry) return;
  if (entry.tipo !== zoneId) {
    flashZone5(zoneEl, false);
    G5.errores++; G5.sinErrores = false;
    document.getElementById('tp5-errs').textContent = G5.errores;
    tp5Toast('❌ Revisá: ¿es mapeo 1 a 1, un pool de IPs, o muchos dispositivos con una sola IP?');
    return;
  }
  flashZone5(zoneEl, true);
  document.getElementById('ddi-' + itemId).classList.add('dd-placed');
  var chip = document.createElement('div');
  chip.className = 'tp5-chip';
  chip.textContent = entry.texto;
  document.getElementById('col-items-' + zoneId).appendChild(chip);
  tp5Toast('✓ Correcto', true);
  G5.r3placed++;
  if (G5.r3placed === R3_ESCENARIOS.length) {
    setTimeout(function() {
      showPhaseBanner5(MSG_R3_TRANSICION, '▶ Empezar simulador', function() { showPhase5('r4'); });
    }, 400);
  }
}

/* ===== R4: SIMULADOR PAT ===== */

function renderR4(el) {
  el.innerHTML =
    '<div class="tp5-rnd-heading">Ronda 4 — Simulador PAT 🌟</div>' +
    '<p class="tp5-rnd-sub">Navegá con 4 dispositivos de casa a través del router. Mirá cómo se llena la tabla NAT.</p>' +
    '<div class="r4-banner" id="r4-banner"></div>' +
    '<div class="r4-stage" id="r4-stage">' +
      '<div class="r4-col r4-col-disp">' +
        DISPOSITIVOS.map(function(d) {
          return '<div class="r4-card" id="disp-' + d.id + '">' +
            '<div class="r4-card-icon">' + d.icono + '</div>' +
            '<div class="r4-card-nombre">' + d.nombre + '</div>' +
            '<div class="r4-card-ip">' + d.ip + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="r4-col r4-col-router">' +
        '<div class="r4-router" id="r4-router">' +
          '<div class="r4-router-icon">🌐</div>' +
          '<div class="r4-router-nombre">Router</div>' +
          '<div class="r4-router-ip">' + ROUTER_IP_PUBLICA + '</div>' +
        '</div>' +
        '<div class="r4-actions" id="r4-actions"></div>' +
      '</div>' +
      '<div class="r4-col r4-col-sitios">' +
        SITIOS.map(function(s) {
          return '<div class="r4-card" id="sitio-' + s.id + '">' +
            '<div class="r4-card-icon">' + s.icono + '</div>' +
            '<div class="r4-card-nombre">' + s.nombre + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<div class="r4-tabla-wrap">' +
      '<table class="tabla-nat">' +
        '<thead><tr><th>#</th><th>IP privada</th><th>Puerto</th><th>IP pública</th><th>Puerto trad.</th><th class="r4-th-destino">Destino</th></tr></thead>' +
        '<tbody id="r4-tabla-body"></tbody>' +
      '</table>' +
    '</div>';
  r4RenderViaje();
}

function r4RenderViaje() {
  var v = VIAJES[G5.viajeActual];
  var disp = getDispositivo(v.dispositivo);
  var sitio = getSitio(v.sitio);
  document.getElementById('r4-banner').innerHTML =
    '<span class="r4-banner-num">Viaje ' + (G5.viajeActual + 1) + ' de ' + VIAJES.length + '</span>' +
    '<span class="r4-banner-txt">El <b>' + disp.nombre + '</b> quiere navegar a <b>' + sitio.nombre + '</b></span>';
  DISPOSITIVOS.forEach(function(d) {
    document.getElementById('disp-' + d.id).classList.toggle('activo', d.id === v.dispositivo);
  });
  SITIOS.forEach(function(s) {
    document.getElementById('sitio-' + s.id).classList.toggle('activo', s.id === v.sitio);
  });
  var actions = document.getElementById('r4-actions');
  actions.innerHTML = '<button class="btn btn-pink" id="r4-iniciar-btn">▶️ Iniciar conexión</button>';
  document.getElementById('r4-iniciar-btn').onclick = r4Iniciar;
}

function crearPaquete(container) {
  var pkt = document.createElement('div');
  pkt.className = 'paquete';
  pkt.innerHTML = '<div class="label"></div>';
  container.appendChild(pkt);
  return pkt;
}

function pktSetPos(pkt, el, container) {
  var r = el.getBoundingClientRect();
  var c = container.getBoundingClientRect();
  pkt.style.left = (r.left + r.width / 2 - c.left - 8) + 'px';
  pkt.style.top  = (r.top + r.height / 2 - c.top - 8) + 'px';
}

function pktJumpTo(pkt, el, container) {
  pkt.style.transition = 'none';
  pktSetPos(pkt, el, container);
  pkt.offsetHeight;
  pkt.style.transition = '';
}

function setLabel(pkt, txt) {
  pkt.querySelector('.label').textContent = txt;
}

function flashEl(el) {
  el.classList.add('flash');
  setTimeout(function() { el.classList.remove('flash'); }, 600);
}

function r4Iniciar() {
  var v = VIAJES[G5.viajeActual];
  var disp = getDispositivo(v.dispositivo);
  var sitio = getSitio(v.sitio);
  var container = document.getElementById('r4-stage');
  var dispEl = document.getElementById('disp-' + v.dispositivo);
  var routerEl = document.getElementById('r4-router');
  var sitioEl = document.getElementById('sitio-' + v.sitio);

  document.getElementById('r4-actions').innerHTML = '';

  var pkt = crearPaquete(container);
  pktJumpTo(pkt, dispEl, container);
  setLabel(pkt, disp.ip + ':' + v.puerto_origen + ' → ?');

  requestAnimationFrame(function() {
    pktSetPos(pkt, routerEl, container);
  });

  setTimeout(function() {
    flashEl(routerEl);
    if (v.modo === 'manual') {
      r4MostrarOpciones(v, pkt, container, routerEl, sitioEl, dispEl, disp, sitio);
    } else {
      setLabel(pkt, ROUTER_IP_PUBLICA + ':' + v.puerto_traducido + ' → ' + sitio.nombre);
      tp5Toast(v.mensaje, true);
      setTimeout(function() { r4HaciaSitio(v, pkt, container, sitioEl, dispEl, routerEl, disp, sitio); }, 900);
    }
  }, TRIP_MS + 60);
}

function r4MostrarOpciones(v, pkt, container, routerEl, sitioEl, dispEl, disp, sitio) {
  var opciones = shuffle(v.opciones);
  var panel = document.createElement('div');
  panel.className = 'r4-opciones-panel';
  panel.innerHTML =
    '<div class="r4-opciones-titulo">El router necesita asignar un puerto traducido.<br>¿Cuál usarías?</div>' +
    '<div class="r4-opciones-btns">' +
      opciones.map(function(p) { return '<button class="r4-opcion-btn" data-puerto="' + p + '">' + p + '</button>'; }).join('') +
    '</div>' +
    '<div class="r4-pista">💡 Pista: ' + v.pista + '</div>';
  document.getElementById('r4-actions').appendChild(panel);
  panel.querySelectorAll('.r4-opcion-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      r4ElegirOpcion(v, parseInt(b.dataset.puerto, 10), b, pkt, container, routerEl, sitioEl, dispEl, disp, sitio, panel);
    });
  });
}

function r4ElegirOpcion(v, puerto, btnEl, pkt, container, routerEl, sitioEl, dispEl, disp, sitio, panel) {
  if (puerto === v.puerto_traducido) {
    btnEl.classList.add('r4-opt-ok');
    setTimeout(function() {
      panel.remove();
      var msg = v.n === 5 ? MSG_VIAJE5_OK : ('✓ Puerto ' + puerto + ' asignado correctamente: es alto y no estaba en uso.');
      setLabel(pkt, ROUTER_IP_PUBLICA + ':' + puerto + ' → ' + sitio.nombre);
      tp5Toast(msg, true);
      setTimeout(function() { r4HaciaSitio(v, pkt, container, sitioEl, dispEl, routerEl, disp, sitio); }, 900);
    }, 350);
  } else {
    btnEl.classList.add('r4-opt-err');
    G5.errores++; G5.sinErrores = false;
    document.getElementById('tp5-errs').textContent = G5.errores;
    var msg;
    if (puerto <= 1024) {
      msg = MSG_PUERTO_BAJO;
    } else {
      var dueño = '';
      for (var i = 0; i < G5.tablaNAT.length; i++) {
        if (G5.tablaNAT[i].puertoTrad === puerto) { dueño = G5.tablaNAT[i].dispositivoNombre; break; }
      }
      msg = MSG_PUERTO_USADO.replace('[dispositivo]', dueño || 'otro dispositivo').replace(/\*\*/g, '');
    }
    tp5Toast(msg.replace(/\*\*/g, ''));
    setTimeout(function() { btnEl.classList.remove('r4-opt-err'); }, 500);
  }
}

function r4HaciaSitio(v, pkt, container, sitioEl, dispEl, routerEl, disp, sitio) {
  pktSetPos(pkt, sitioEl, container);
  setTimeout(function() {
    flashEl(sitioEl);
    setLabel(pkt, sitio.nombre + ' → ' + ROUTER_IP_PUBLICA + ':' + v.puerto_traducido);
    setTimeout(function() { r4DeVuelta(v, pkt, container, dispEl, routerEl, disp, sitio); }, 500);
  }, TRIP_MS + 60);
}

function r4DeVuelta(v, pkt, container, dispEl, routerEl, disp, sitio) {
  pktSetPos(pkt, routerEl, container);
  setTimeout(function() {
    flashEl(routerEl);
    setLabel(pkt, sitio.nombre + ' → ' + disp.ip + ':' + v.puerto_origen);
    tp5Toast('El router consultó la tabla NAT y supo a quién devolverle la respuesta.', true);
    setTimeout(function() {
      pktSetPos(pkt, dispEl, container);
      setTimeout(function() {
        pkt.remove();
        r4AgregarFilaNAT(v, disp, sitio);
      }, TRIP_MS + 60);
    }, 700);
  }, TRIP_MS + 60);
}

function r4AgregarFilaNAT(v, disp, sitio) {
  G5.tablaNAT.push({
    ipPriv: disp.ip, puertoOrig: v.puerto_origen, ipPub: ROUTER_IP_PUBLICA,
    puertoTrad: v.puerto_traducido, destino: sitio.nombre, dispositivoNombre: disp.nombre
  });
  r4RenderTabla();
  G5.viajeActual++;
  if (G5.viajeActual >= VIAJES.length) {
    setTimeout(r4Cerrar, 900);
  } else {
    setTimeout(function() {
      var actions = document.getElementById('r4-actions');
      actions.innerHTML = '<button class="btn btn-pink" id="r4-next-btn">Siguiente viaje →</button>';
      document.getElementById('r4-next-btn').onclick = function() { r4RenderViaje(); };
    }, 600);
  }
}

function r4RenderTabla() {
  var body = document.getElementById('r4-tabla-body');
  body.innerHTML = G5.tablaNAT.map(function(r, i) {
    return '<tr' + (i === G5.tablaNAT.length - 1 ? ' class="nueva"' : '') + '>' +
      '<td>' + (i + 1) + '</td><td>' + r.ipPriv + '</td><td>' + r.puertoOrig + '</td>' +
      '<td>' + r.ipPub + '</td><td>' + r.puertoTrad + '</td><td class="r4-th-destino">' + r.destino + '</td></tr>';
  }).join('');
  var last = body.querySelector('tr.nueva');
  if (last) setTimeout(function() { last.classList.remove('nueva'); }, 1000);
}

function r4Cerrar() {
  showPhaseBanner5(MSG_R4_CIERRE, '▶ Última ronda →', function() { showPhase5('r5'); });
}

/* ===== R5: COMPLETAR TABLA NAT ===== */

function renderR5(el) {
  var celdas = R5_CELDAS_VACIAS.map(function(c) {
    return { fila: c.fila, campo: c.campo, key: c.fila + '-' + c.campo, valor: R5_TABLA[c.fila][c.campo] };
  });
  var filasHtml = R5_TABLA.map(function(row, i) {
    var campos = ['ipPriv', 'puertoOrig', 'ipPub', 'puertoTrad', 'destino'];
    return '<tr>' + campos.map(function(campo) {
      var vacia = R5_CELDAS_VACIAS.some(function(c) { return c.fila === i && c.campo === campo; });
      if (vacia) {
        return '<td class="r5-blank" id="r5-cell-' + i + '-' + campo + '" data-zone-id="' + (i + '-' + campo) + '">?</td>';
      }
      return '<td>' + row[campo] + '</td>';
    }).join('') + '</tr>';
  }).join('');
  var fichasHtml = shuffle(celdas).map(function(c) {
    return '<div class="dd-item" id="ddi-r5-' + c.key + '" data-item-id="' + c.key + '">' + c.valor + '</div>';
  }).join('');
  el.innerHTML =
    '<div class="tp5-rnd-heading">Ronda 5 — Completá la Tabla NAT</div>' +
    '<p class="tp5-rnd-sub">Arrastrá cada ficha a la celda que le corresponde.</p>' +
    '<div class="r4-tabla-wrap">' +
      '<table class="tabla-nat">' +
        '<thead><tr><th>IP privada</th><th>Puerto origen</th><th>IP pública</th><th>Puerto trad.</th><th class="r4-th-destino">Destino</th></tr></thead>' +
        '<tbody>' + filasHtml + '</tbody>' +
      '</table>' +
    '</div>' +
    '<div class="dd-bank" id="r5-bank">' + fichasHtml + '</div>';
  attachDD5('#r5-bank .dd-item');
}

function handleR5Drop(itemId, zoneId, zoneEl) {
  if (itemId !== zoneId) {
    flashZone5(zoneEl, false);
    G5.errores++; G5.sinErrores = false;
    document.getElementById('tp5-errs').textContent = G5.errores;
    tp5Toast('❌ Esa ficha no va ahí. Fijate qué tipo de dato es esa columna.');
    return;
  }
  var parts = itemId.split('-');
  var fila = parseInt(parts[0], 10);
  var campo = parts[1];
  flashZone5(zoneEl, true);
  document.getElementById('ddi-r5-' + itemId).classList.add('dd-placed');
  zoneEl.textContent = R5_TABLA[fila][campo];
  zoneEl.classList.remove('r5-blank');
  zoneEl.classList.add('filled');
  tp5Toast('✓ Correcto', true);
  G5.r5placed++;
  if (G5.r5placed === R5_CELDAS_VACIAS.length) {
    setTimeout(tp5ShowResults, 500);
  }
}

/* ===== RESULTADOS ===== */

function tp5ShowResults() {
  clearInterval(G5.timerInt);
  markPlayed(5);
  var sec = G5.timerSec;
  var med = calcMedallaTP5(sec);
  document.getElementById('tp5-medal').textContent = med.medalla;
  document.getElementById('tp5-medal-name').textContent = med.nombre;
  document.getElementById('tp5-medal-name').style.color = med.color;
  document.getElementById('tp5-res-time').textContent = '⏱ Tiempo: ' + fmtTime(sec);
  document.getElementById('tp5-res-stats').textContent = 'Errores: ' + G5.errores + ' · ' + med.msg;
  var badgesEl = document.getElementById('tp5-badges');
  badgesEl.innerHTML = '';
  if (G5.errores === 0) {
    badgesEl.innerHTML += '<span class="tp5-badge tp5-badge-star">⭐ Sin errores</span>';
  }
  var KEY = 'redes_best_tp5';
  var stored = parseInt(localStorage.getItem(KEY) || '999999');
  if (sec < stored) {
    localStorage.setItem(KEY, sec);
    badgesEl.innerHTML += '<span class="tp5-badge tp5-badge-rec">🎯 ¡Nuevo récord personal!</span>';
  }
  var rondas = [
    'R1 ✓  Funciones del Router',
    'R2 ✓  Estático vs Dinámico',
    'R3 ✓  Tipos de NAT',
    'R4 ✓  Simulador PAT',
    'R5 ✓  Completar Tabla NAT'
  ];
  document.getElementById('tp5-rondas').innerHTML = rondas.map(function(r) {
    return '<div class="tp5-ronda-row"><span class="tp5-check">✓</span> ' + r + '</div>';
  }).join('');
  document.getElementById('modal-tp5').classList.add('open');
  launchConfetti();
}

function calcMedallaTP5(sec) {
  var min = sec / 60;
  if (min < 5) return { medalla: '🥇', nombre: 'ORO',        color: '#facc15', msg: '¡Increíble! Tiempo récord.' };
  if (min < 7) return { medalla: '🥈', nombre: 'PLATA',      color: '#a4b3c9', msg: '¡Muy bien! Excelente trabajo.' };
  if (min < 9) return { medalla: '🥉', nombre: 'BRONCE',     color: '#fb923c', msg: '¡Lograste completarlo! Buen trabajo.' };
  return              { medalla: '⭐', nombre: 'COMPLETADO', color: '#a78bfa', msg: '¡Lo terminaste! Lo importante es haber aprendido.' };
}

/* ===== BANNERS ENTRE RONDAS ===== */

function showPhaseBanner5(msg, btnText, cb) {
  var overlay = document.createElement('div');
  overlay.className = 'rnd-overlay5';
  var banner = document.createElement('div');
  banner.className = 'rnd-banner5';
  banner.innerHTML =
    '<div class="rnd-banner-icon5">🎉</div>' +
    '<div class="rnd-banner5-title">' + msg + '</div>' +
    '<button class="btn btn-pink" id="rnd-btn-next5">' + btnText + '</button>';
  document.body.appendChild(overlay);
  document.body.appendChild(banner);
  launchConfetti();
  document.getElementById('rnd-btn-next5').onclick = function() {
    overlay.remove(); banner.remove(); if (cb) cb();
  };
}

/* ===== DRAG & DROP ===== */

function attachDD5(selector) {
  document.querySelectorAll(selector).forEach(function(el) {
    el.addEventListener('pointerdown', onDD5Down);
  });
}

function onDD5Down(e) {
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
  ddDrag5 = { itemId: el.dataset.itemId, ghost: ghost, originEl: el };
  document.addEventListener('pointermove', onDD5Move, { passive: false });
  document.addEventListener('pointerup', onDD5Up);
}

function onDD5Move(e) {
  if (!ddDrag5) return;
  e.preventDefault();
  ddDrag5.ghost.style.left = (e.clientX - 70) + 'px';
  ddDrag5.ghost.style.top  = (e.clientY - 20) + 'px';
  clearDZHover5();
  ddDrag5.ghost.style.visibility = 'hidden';
  var under = document.elementFromPoint(e.clientX, e.clientY);
  ddDrag5.ghost.style.visibility = '';
  var zone = under && under.closest('[data-zone-id]');
  if (zone) zone.classList.add('dz-hover');
}

function onDD5Up(e) {
  document.removeEventListener('pointermove', onDD5Move);
  document.removeEventListener('pointerup', onDD5Up);
  if (!ddDrag5) return;
  var itemId = ddDrag5.itemId, ghost = ddDrag5.ghost, originEl = ddDrag5.originEl;
  ddDrag5 = null;
  ghost.style.visibility = 'hidden';
  var under = document.elementFromPoint(e.clientX, e.clientY);
  ghost.remove();
  originEl.classList.remove('dragging');
  clearDZHover5();
  var zone = under && under.closest('[data-zone-id]');
  if (zone && !originEl.classList.contains('dd-placed')) {
    handleDD5Drop(itemId, zone.dataset.zoneId, zone);
  }
}

function handleDD5Drop(itemId, zoneId, zoneEl) {
  var ph = G5 && G5.phase;
  if      (ph === 'r1') handleR1Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r2') handleR2Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r3') handleR3Drop(itemId, zoneId, zoneEl);
  else if (ph === 'r5') handleR5Drop(itemId, zoneId, zoneEl);
}

function clearDZHover5() {
  document.querySelectorAll('.dz-hover').forEach(function(z) { z.classList.remove('dz-hover'); });
}

function flashZone5(el, ok) {
  el.classList.add(ok ? 'do-flash-ok' : 'do-flash-err');
  setTimeout(function() { el.classList.remove('do-flash-ok', 'do-flash-err'); }, 600);
}

/* ===== TOAST ===== */

var toastTimer5 = null;
function tp5Toast(msg, ok) {
  var prev = document.querySelector('.tp5-toast');
  if (prev) prev.remove();
  if (toastTimer5) clearTimeout(toastTimer5);
  var t = document.createElement('div');
  t.className = 'tp5-toast';
  if (ok) t.style.color = 'var(--pink)';
  t.textContent = msg;
  document.body.appendChild(t);
  toastTimer5 = setTimeout(function() { t.remove(); }, 4000);
}

/* ===== ARRANQUE ===== */

initTP5();
