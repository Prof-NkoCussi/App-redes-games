const TPS = [
  {
    n: 1, title: "Señales, Medios y Topologías",
    type: "Sopa de Letras",
    desc: "Leé cada pista conceptual, identificá la palabra y encontrala en la grilla.",
    active: true, game: "wordsearch"
  },
  {
    n: 2, title: "Clasificación, Componentes y Diseño de Red",
    type: "Drag & Drop",
    desc: "Clasificá redes por alcance, identificá la función de cada componente y armá la red del laboratorio.",
    active: true, game: "dragdrop"
  },
  { n: 3,  title: "Cableado + OSI/TCP-IP",         type: "Ordená las Capas",      desc: "Armá el cable con la norma correcta y apilá las capas del modelo OSI.",         active: true },
  { n: 4,  title: "IPv4, Subnetting e IPv6",        type: "¿Pública o Privada?",   desc: "Clasificá direcciones IP en tiempo récord y resolvé subredes.",                  active: false },
  { n: 5,  title: "VLSM + NAT",                    type: "Simulador de NAT",       desc: "Mirá cómo el router traduce IPs privadas a una pública.",                        active: false },
  { n: 6,  title: "Recursos Compartidos",           type: "Gestor de Permisos",    desc: "Asigná permisos a usuarios sobre carpetas y archivos.",                          active: false },
  { n: 7,  title: "TCP vs UDP",                    type: "Elige el Protocolo",     desc: "Aparece un escenario, elegís TCP o UDP rápido.",                                 active: false },
  { n: 8,  title: "Protocolos de Aplicación",      type: "El Viaje del Paquete",   desc: "Identificá los protocolos que intervienen en cada paso.",                        active: false },
  { n: 9,  title: "APIs REST",                     type: "Constructor de Requests", desc: "Armá peticiones HTTP correctas con verbos y JSON.",                             active: false },
  { n: 10, title: "Seguridad en Redes",             type: "Detecta el Ataque",     desc: "Identificá amenazas y proponé contramedidas.",                                   active: false },
  { n: 11, title: "Diagnóstico de Red",             type: "Troubleshoot Master",   desc: "Usá ping, traceroute y netstat para resolver fallas.",                           active: false },
  { n: 12, title: "Proyecto Yarvi",                type: "Reto Integrador",        desc: "Integrá todo el año en el control del robot por red.",                           active: false }
];

function renderMenu() {
  const grid = document.getElementById('tp-grid');
  grid.innerHTML = '';
  let activeCount = 0;
  TPS.forEach(tp => {
    if (tp.active) activeCount++;
    const card = document.createElement('div');
    card.className = 'tp-card ' + (tp.active ? 'active' : 'locked');
    card.dataset.tp = tp.n;
    if (tp.active) card.onclick = () => startGame(tp);
    card.innerHTML = `
      <div class="tp-num">TP ${String(tp.n).padStart(2,'0')}</div>
      <h3 class="tp-title">${tp.title}</h3>
      <div class="tp-game-type">${tp.type}</div>
      <p class="tp-desc">${tp.desc}</p>
      <div class="tp-action">
        <span class="tp-status ${tp.active ? 'live' : 'soon'}">${tp.active ? 'JUGAR' : 'Próximamente'}</span>
        <span class="tp-arrow">→</span>
      </div>
    `;
    grid.appendChild(card);
  });
  document.getElementById('st-active').textContent = activeCount;
  document.getElementById('st-played').textContent = getPlayedCount();
}

function startGame(tp) {
  if (!tp.active) return;
  window.location.href = 'games/tp' + tp.n + '/index.html';
}

renderMenu();
