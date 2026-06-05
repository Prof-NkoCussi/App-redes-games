function markPlayed(n) {
  try {
    const d = JSON.parse(localStorage.getItem('redes_played') || '{}');
    d['tp' + n] = true;
    localStorage.setItem('redes_played', JSON.stringify(d));
  } catch {}
}

function getPlayedCount() {
  try { return Object.keys(JSON.parse(localStorage.getItem('redes_played') || '{}')).length; }
  catch { return 0; }
}

const CONF_COLORS = ['#22d3ee','#4ade80','#a78bfa','#fb923c','#facc15','#f472b6','#2dd4bf','#f87171'];

function launchConfetti() {
  for (let i = 0; i < 90; i++) {
    const el = document.createElement('div');
    el.className = 'cfx';
    const size = 7 + Math.random() * 10;
    el.style.cssText = `
      left:${Math.random() * 100}vw; top:-20px;
      width:${size}px; height:${size}px;
      background:${CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)]};
      border-radius:${Math.random() > 0.45 ? '50%' : '2px'};
      animation-duration:${1.8 + Math.random() * 2.8}s;
      animation-delay:${Math.random() * 0.7}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el && el.remove(), 6000);
  }
}
