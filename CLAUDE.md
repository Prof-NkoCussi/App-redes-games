# CLAUDE.md — Contexto del Proyecto Redes I Games

> Este archivo le da a Claude Code todo el contexto necesario para trabajar en este proyecto.
> Se lee automáticamente cada vez que se inicia Claude Code en este directorio.

---

## 🎯 Sobre el proyecto

**Redes I Games** es una colección de mini-juegos web educativos (gamificación) para reforzar los contenidos de la materia **Redes I** de 5° Año del Técnico en Programación.

Cada Trabajo Práctico (TP) tiene su propio mini-juego con mecánicas adecuadas al contenido. La idea es que los estudiantes (14-15 años) refuercen conceptos jugando, no solo leyendo apuntes.

**Estado actual:** TP1 implementado (sopa de letras). Resto de los TPs (2 a 12) en estado "Próximamente" en el menú.

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
redes-i-games/
├── index.html        ← Archivo principal (todo el código en un solo HTML)
├── README.md         ← Documentación pública del repo
├── CLAUDE.md         ← Este archivo (contexto para Claude Code)
└── .gitignore
```

**IMPORTANTE:** Todo el código (HTML + CSS + JS) está en un único archivo `index.html`. No usamos frameworks ni librerías externas (solo Google Fonts via CDN). Esto es intencional para que sea portable, fácil de subir a Classroom como respaldo, y fácil de mantener.

---

## 🧩 Arquitectura de la app

### Pantallas
1. **`#scr-menu`** — Menú principal con grid de 12 cards (una por TP)
2. **`#scr-game`** — Pantalla de juego activa (cambia según el TP seleccionado)
3. **`#modal-res`** — Modal de resultados con confetti

### Catálogo de TPs (objeto `TPS`)
Cada TP es un objeto en el array `TPS` con esta estructura:
```js
{
  n: 1,                    // Número del TP
  title: "...",            // Título
  type: "Sopa de Letras",  // Tipo de juego
  desc: "...",             // Descripción corta para la card
  active: true/false,      // Si está disponible o "Próximamente"
  game: "wordsearch",      // ID del juego a cargar
  words: [...]             // Datos específicos del juego (varía por tipo)
}
```

### Persistencia
- `localStorage` clave `redes_played` → objeto con TPs ya jugados (para el stat de "Jugados")
- No hay backend, todo es client-side

---

## 📚 Trabajos Prácticos — Estructura completa del año

### Primer Cuatrimestre (Unidad 1: Fundamentos, Infraestructura y Direccionamiento)

| TP | Tema | Mecánica del juego | Estado |
|---|---|---|---|
| **TP1** | Señales, Medios y Topologías | Sopa de Letras con pistas conceptuales | ✅ Implementado |
| **TP2** | Clasificación, Componentes y Diseño | Drag & Drop (clasificar redes + arrastrar componentes) | 🔜 Pendiente |
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

2. **Implementación en Claude Code:**
   - Agregar el TP al array `TPS` con `active: true`
   - Crear las funciones del juego (init, render, lógica de interacción, resultados)
   - Crear su pantalla `#scr-game-tpN` o reutilizar `#scr-game` si la estructura es similar
   - Probar local (abrir `index.html` en navegador)

3. **Deploy:**
   ```bash
   git add .
   git commit -m "feat: agregar mini-juego TP2 (drag & drop componentes)"
   git push origin main
   ```

4. **Verificar:** entrar a la URL pública y probar.

---

## 🔗 Recursos importantes

- **Diapositivas de Gamma:** las prepara Nicolás con prompts generados por el chat web
- **Documentos institucionales:** UDC, TPs, evaluaciones, resoluciones → en .docx (otro flujo)
- **Articulación con otras materias:** Software II (Git, GitHub), Programación II (JavaScript, APIs REST)

---

## ⚠️ Reglas importantes

1. **No usar frameworks ni librerías externas** (mantener vanilla HTML/CSS/JS)
2. **Mantener todo en un solo archivo `index.html`** (a menos que se decida lo contrario explícitamente)
3. **No romper la estética actual** sin consultar (paleta, tipografías, animaciones)
4. **Cada juego debe tener valor pedagógico real** (no solo "diversión vacía")
5. **Mobile-first siempre:** los alumnos suelen probar desde celulares
6. **No incluir tracking, ads ni nada externo** que comprometa privacidad
7. **Idioma:** español argentino siempre en UI y contenidos

---

*Última actualización: 2026 · Mantenido por Prof. Nicolás A. Cussi*
