# CLAUDE.md — Contexto del Proyecto Redes I Games

> Este archivo le da a Claude Code todo el contexto necesario para trabajar en este proyecto.
> Se lee automáticamente cada vez que se inicia Claude Code en este directorio.

---

## 🎯 Sobre el proyecto

**Redes I Games** es una colección de mini-juegos web educativos (gamificación) para reforzar los contenidos de la materia **Redes I** de 5° Año del Técnico en Programación.

Cada Trabajo Práctico (TP) tiene su propio mini-juego con mecánicas adecuadas al contenido. La idea es que los estudiantes (14-15 años) refuercen conceptos jugando, no solo leyendo apuntes.

**Estado actual:** TP1 (sopa de letras) y TP2 (drag & drop, 3 rondas) implementados. Resto de los TPs (3 a 12) en estado "Próximamente" en el menú.

**Hosting:** GitHub Pages → `https://prof-nkocussi.github.io/redes-i-games/`

---

## 👤 Sobre el autor / docente

- **Nombre:** Nicolás A. Cussi
- **Usuario GitHub:** `Prof-NkoCussi`
- **Rol:** Profesor de Redes I y Software II
- **Institución:** Colegio Técnico Provincial "Olga Bronzovich de Arko" — Ushuaia, Tierra del Fuego, Argentina
- **Curso:** 5° Año · Técnico en Programación (5°1° y 5°2°)
- **Ciclo lectivo:** 2026

---

## 🎨 Identidad visual del proyecto

### Tipografía
- **Display (títulos, branding, números grandes):** `Russo One` — Google Fonts
- **Body (textos, UI, párrafos):** `Manrope` — pesos 400 a 800

### Paleta de colores (CSS variables ya definidas)
```css
--bg-deep: #050810;     /* Fondo profundo */
--bg: #0a1220;          /* Fondo principal */
--surf: #111c30;        /* Superficie cards */
--surf2: #1a2840;       /* Superficie elevada */
--brd: #2a3b5a;         /* Bordes */
--brd-soft: #1f2e48;    /* Bordes suaves */

--cyan: #22d3ee;        /* Acento principal */
--orange: #fb923c;      /* Acento secundario */
--green: #4ade80;
--purple: #a78bfa;
--yellow: #facc15;
--pink: #f472b6;
--red: #f87171;
--teal: #2dd4bf;

--txt: #e2eaf5;         /* Texto principal */
--txt-soft: #a4b3c9;    /* Texto secundario */
--muted: #6b809e;       /* Texto apagado */
```

### Concepto visual
- **Estilo:** Dark cyber/tech aesthetic — fondo navy oscuro con acentos vibrantes
- **Background animado:** grid pattern + radiales suaves + 5 nodos flotantes (simulan tráfico de red)
- **Gradiente principal:** cyan → púrpura → naranja (usado en logo y elementos destacados)
- **Glow effects:** sombras coloreadas en hover y elementos activos
- **Border-radius:** 18-24px para cards, 8-10px para inputs/botones
- **Animaciones:** suaves (0.18-0.25s), translateY en hover, pop-in en modales, confetti al completar

### Branding institucional
- **Tag superior:** "Colegio Técnico Olga B. de Arko · 5° Año"
- **Logo:** "REDES I GAMES" con gradiente
- **Footer:** "Redes I — Prof. Nicolás A. Cussi · 2026"

---

## 📂 Estructura del proyecto

```
App-RedesGames/
├── index.html               ← Solo el menú principal (cards de los 12 TPs)
├── css/
│   ├── base.css             ← Variables CSS, reset, fondo animado, tipografías
│   ├── menu.css             ← Estilos del menú principal
│   └── shared.css           ← Estilos compartidos: botones, confetti, animaciones
├── js/
│   ├── main.js              ← Catálogo TPS, renderMenu(), navegación
│   └── shared.js            ← Funciones reutilizables: launchConfetti(), markPlayed(), getPlayedCount()
├── games/
│   ├── tp1/
│   │   ├── index.html       ← Página del juego TP1 (sopa de letras)
│   │   ├── tp1.css          ← Estilos específicos del TP1
│   │   └── tp1.js           ← Lógica de la sopa de letras + datos TP1_WORDS
│   └── tp2/
│       ├── index.html       ← Página del juego TP2 (drag & drop)
│       ├── tp2.css          ← Estilos específicos del TP2
│       └── tp2.js           ← Lógica del drag & drop + datos R1/R2/R3
├── specs/
│   └── tp2-spec.md          ← Spec de diseño del TP2
├── CLAUDE.md
├── README.md
└── .gitignore
```

**IMPORTANTE:** El proyecto usa arquitectura modular. Cada juego es una página independiente en `games/tpN/`. No hay frameworks ni librerías externas (solo Google Fonts via CDN). Las rutas en `<link>` y `<script>` son siempre **relativas** (sin `/` inicial) para compatibilidad con GitHub Pages.

**Rutas relativas en juegos:** desde `games/tpN/index.html`, los assets compartidos se cargan así:
```html
<link rel="stylesheet" href="../../css/base.css">
<script src="../../js/shared.js"></script>
```

---

## 🧩 Arquitectura de la app

### Navegación entre páginas
- **Menú → juego:** `window.location.href = 'games/tp1/index.html'` (desde `js/main.js`)
- **Juego → menú:** `window.location.href = '../../index.html'` (desde `goMenu()` en cada juego)

### Catálogo de TPs (objeto `TPS` en `js/main.js`)
Cada TP es un objeto con esta estructura:
```js
{
  n: 1,                    // Número del TP
  title: "...",            // Título
  type: "Sopa de Letras",  // Tipo de juego (se muestra en la card)
  desc: "...",             // Descripción corta para la card
  active: true/false,      // Si está disponible o "Próximamente"
  game: "wordsearch",      // ID del juego (informativo, ya no controla routing)
}
```
Los **datos del juego** (palabras, componentes, etc.) viven en el JS de cada juego (`tp1.js`, `tp2.js`), no en el catálogo.

### Funciones compartidas (`js/shared.js`)
- `launchConfetti()` — confetti animado, usable desde cualquier juego
- `markPlayed(n)` — marca el TP n como jugado en `localStorage`
- `getPlayedCount()` — cuenta TPs jugados (usada por el menú)

### Persistencia
- `localStorage` clave `redes_played` → objeto con TPs ya jugados (para el stat de "Jugados")
- `localStorage` clave `redes_best_tp2` → mejor tiempo del TP2 en segundos
- No hay backend, todo es client-side

---

## 📚 Trabajos Prácticos — Estructura completa del año

### Primer Cuatrimestre (Unidad 1: Fundamentos, Infraestructura y Direccionamiento)

| TP | Tema | Mecánica del juego | Estado |
|---|---|---|---|
| **TP1** | Señales, Medios y Topologías | Sopa de Letras con pistas conceptuales | ✅ Implementado |
| **TP2** | Clasificación, Componentes y Diseño | Drag & Drop (clasificar redes + arrastrar componentes) | ✅ Implementado |
| **TP3** | Cableado 568A/568B + OSI/TCP-IP | Armá el cable + Ordená las capas | 🔜 Pendiente |
| **TP4** | IPv4, Subnetting básico e IPv6 | ¿Pública o Privada? + Calculadora de subredes | 🔜 Pendiente |
| **TP5** | VLSM/CIDR + NAT | Simulador visual de NAT | 🔜 Pendiente |
| **TP6** | Recursos Compartidos en Red | Gestor de Permisos (drag & drop usuarios → carpetas) | 🔜 Pendiente |

### Segundo Cuatrimestre (Unidad 2: Protocolos, Seguridad y Aplicaciones)

| TP | Tema | Mecánica del juego | Estado |
|---|---|---|---|
| **TP7** | TCP vs UDP | ¿Qué protocolo elegís? (escenarios) | 🔜 Pendiente |
| **TP8** | Protocolos de Aplicación (DNS, DHCP, HTTP/S, FTP, SSH, SMTP) | El Viaje del Paquete | 🔜 Pendiente |
| **TP9** | APIs REST (articula con Programación II) | Constructor de Requests HTTP | 🔜 Pendiente |
| **TP10** | Seguridad: amenazas, firewall, VPN, HTTPS | Detecta el Ataque | 🔜 Pendiente |
| **TP11** | Diagnóstico de red (ping, traceroute, Wireshark) | Troubleshoot Master | 🔜 Pendiente |
| **TP12** | Proyecto Integrador "Yarvi" (robot por red LAN) | Reto Integrador / Demo | 🔜 Pendiente |

---

## 🎮 Convenciones para implementar mini-juegos nuevos

Cuando se agregue un mini-juego nuevo (TP2 en adelante), seguir estas pautas:

### Estructura de palabras/items con contexto pedagógico
Cada elemento debe tener un **valor pedagógico real**. No solo memorizar palabras: el alumno tiene que **leer, comprender e identificar** el concepto.

Ejemplo del TP1 (ya implementado):
```js
{ w: "ANILLO", clue: "Topología con forma de círculo donde los datos viajan en un sentido", hint: "ANI..." }
```

- `w`: palabra a encontrar
- `clue`: pista conceptual (explica de qué se trata)
- `hint`: las primeras 2-3 letras como ayuda visual

### Pautas para todos los juegos nuevos
1. **Mantener el lenguaje visual:** dark theme, mismas CSS variables, mismas tipografías
2. **Cada TP tiene su color de acento** (ver `--accent` por TP en el CSS)
3. **Pantalla del juego** debe incluir: botón "← Menú", tag con número de TP, título, timer/score si aplica
4. **Feedback positivo:** colores vibrantes al acertar, animaciones, confetti al completar
5. **Feedback negativo:** suave (flash rojo breve, sin penalizar duro)
6. **Modal de resultados:** mismo formato que el TP1 (título grande, score, tags de palabras/items)
7. **Touch-friendly:** todo debe funcionar en mobile (celulares de los alumnos)
8. **Reshuffle/Volver a jugar:** siempre dar opción de reintentar
9. **Pista (hint):** botón para ayudar cuando se traban

### Componentes reutilizables ya existentes
- `.btn`, `.btn-c`, `.btn-g`, `.btn-o` (botones con variantes)
- `.tp-card` (cards del menú)
- `.float-lbl` (feedback flotante al acertar)
- `launchConfetti()` función ya disponible
- `goMenu()` función ya disponible

---

## 🗣️ Estilo de comunicación

- **Idioma:** Español argentino informal (vos, hagamos, dale, recordá)
- **Tono:** Directo, sin vueltas, conciso
- **Respuestas en chat:** preferir texto antes que archivos cuando es algo breve
- **Cuando se generan archivos:** siempre .docx (NO .pdf), .md para resoluciones/documentación
- **No usar formalismos excesivos** ni emojis decorativos en exceso (sí los aceptables: ✅ 🎮 📚 etc.)

---

## 🛠️ Convenciones técnicas

### HTML
- Indentación: 2 espacios
- Atributos en minúscula
- IDs en kebab-case (`#scr-menu`, `#g-grid`)
- Clases en kebab-case (`.tp-card`, `.btn-c`)

### CSS
- Usar las CSS variables ya definidas (NO hardcodear colores)
- Móvil-first cuando se pueda, con media queries para desktop
- Animaciones cortas (0.18-0.4s)

### JavaScript
- Vanilla JS, sin librerías
- Funciones nombradas (no flechas para handlers principales)
- Estado del juego en variable `G` (global del juego activo)
- Persistencia mínima en `localStorage`
- Touch + mouse support en todo lo interactivo

### Git
- Commits en español, descriptivos
- Estructura: `tipo: descripción`
  - `feat: agregar mini-juego TP2`
  - `fix: corregir cálculo de subredes en TP4`
  - `style: ajustar paleta de colores menú`
  - `docs: actualizar README con instrucciones`
- Branch principal: `main`
- Push directo a `main` está OK (es un proyecto personal)

---

## 🚀 Deploy en GitHub Pages

1. Repositorio: `Prof-NkoCussi/redes-i-games`
2. Branch: `main`
3. Carpeta: `/ (root)`
4. URL pública: `https://prof-nkocussi.github.io/redes-i-games/`
5. Después de cada `git push main`, GitHub Pages actualiza automáticamente en 1-2 minutos.

---

## 📋 Flujo de trabajo cuando se agrega un mini-juego nuevo

1. **Spec del juego** (lo prepara Nicolás junto con el otro Claude del chat web):
   - Concepto/mecánica clara
   - Datos del juego (palabras, conceptos, escenarios, etc.) con sus pistas pedagógicas
   - Color de acento del TP
   - Guardar en `specs/tpN-spec.md`

2. **Implementación en Claude Code:**
   - En `js/main.js`: actualizar la entrada del TP en el array `TPS` con `active: true`
   - Crear la carpeta `games/tpN/` con tres archivos:
     - `index.html` — página del juego (carga `../../css/base.css`, `../../css/shared.css`, `tpN.css`, `../../js/shared.js`, `tpN.js`)
     - `tpN.css` — estilos específicos del juego
     - `tpN.js` — toda la lógica del juego + datos + `goMenu()` que navega a `../../index.html`
   - El juego arranca automáticamente al cargar la página (no hay routing interno)
   - Probar local (abrir `index.html` raíz en navegador, hacer click en la card)

3. **Commit:**
   ```
   git add .
   git commit -m "feat: agregar mini-juego TPn (descripción breve)"
   ```
   Luego el push lo hace Nicolás.

4. **Verificar:** entrar a la URL pública y probar.

---

## 🔗 Recursos importantes

- **Diapositivas de Gamma:** las prepara Nicolás con prompts generados por el chat web
- **Documentos institucionales:** UDC, TPs, evaluaciones, resoluciones → en .docx (otro flujo)
- **Articulación con otras materias:** Software II (Git, GitHub), Programación II (JavaScript, APIs REST)

---

## ⚠️ Reglas importantes

1. **No usar frameworks ni librerías externas** (mantener vanilla HTML/CSS/JS)
2. **No usar ES Modules** (`import`/`export`) — scripts clásicos para máxima compatibilidad con GitHub Pages
3. **Cada juego va en su propia carpeta** `games/tpN/` con `index.html`, `tpN.css` y `tpN.js`
4. **Rutas siempre relativas** (sin `/` inicial) para que GitHub Pages funcione correctamente
5. **No romper la estética actual** sin consultar (paleta, tipografías, animaciones)
6. **Cada juego debe tener valor pedagógico real** (no solo "diversión vacía")
7. **Mobile-first siempre:** los alumnos suelen probar desde celulares
8. **No incluir tracking, ads ni nada externo** que comprometa privacidad
9. **Idioma:** español argentino siempre en UI y contenidos

---

*Última actualización: 2026 · Mantenido por Prof. Nicolás A. Cussi*
