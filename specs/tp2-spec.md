# TP2 — Spec del Mini-juego

> Spec para implementar el juego del TP2 en `index.html`.
> Seguir las convenciones del `CLAUDE.md` (paleta, tipografías, estilo visual).

---

## 📋 Información general

- **Número:** TP2
- **Título:** Clasificación, Componentes y Diseño de Red
- **Tipo:** Drag & Drop multi-ronda
- **Color de acento:** verde (`--green: #4ade80`)
- **Mecánica:** 3 rondas progresivas encadenadas
- **Cronómetro:** Sí, visible siempre. NO hay tiempo límite que detenga el juego
- **Sistema de puntaje:** Medallas por tiempo + estrella extra por completar sin errores

---

## 🎯 Estructura del juego

### Pantalla de inicio del TP2

Cuando el alumno hace click en la card del TP2 en el menú, se abre una **pantalla introductoria** que muestra las 3 rondas como "niveles" antes de arrancar:

```
┌─────────────────────────────────────────┐
│  TP 02 — Clasificación, Componentes      │
│         y Diseño de Red                  │
│                                          │
│  🎯 3 rondas progresivas                 │
│                                          │
│  ┌─────┐  ┌─────┐  ┌─────┐              │
│  │ R1  │  │ R2  │  │ R3  │              │
│  │Clasi│  │Comp │  │Plano│              │
│  │ficar│  │onent│  │ Aula│              │
│  └─────┘  └─────┘  └─────┘              │
│                                          │
│      [▶ Empezar Juego]                   │
│      [← Menú]                            │
└─────────────────────────────────────────┘
```

Botón **"▶ Empezar Juego"** arranca con Ronda 1. El cronómetro arranca acá.

---

## 🟢 RONDA 1 — "¿Qué tipo de red es?"

### Mecánica
Aparecen **4 cards con descripciones de redes reales**. El alumno las arrastra a una de las 4 columnas: **PAN / LAN / MAN / WAN**.

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  Ronda 1 de 3 — ¿Qué tipo de red es?                     │
│  Arrastrá cada caso a su categoría correcta.             │
│                                                           │
│  ┌─ Cards a clasificar (arrastrables) ─┐                 │
│  │  [Caso 1]  [Caso 2]  [Caso 3]  [Caso 4]              │
│  └─────────────────────────────────────┘                 │
│                                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │  PAN   │ │  LAN   │ │  MAN   │ │  WAN   │            │
│  │ (drop) │ │ (drop) │ │ (drop) │ │ (drop) │            │
│  └────────┘ └────────┘ └────────┘ └────────┘            │
└──────────────────────────────────────────────────────────┘
```

### Datos — Casos a clasificar

```js
const R1_CASOS = [
  {
    id: "r1c1",
    texto: "Conectás tus AirPods al celular por Bluetooth",
    tipo: "PAN",
    feedback_ok: "✓ Correcto. Es una red personal de muy corto alcance (PAN)."
  },
  {
    id: "r1c2",
    texto: "20 PCs del laboratorio del colegio conectadas a un switch",
    tipo: "LAN",
    feedback_ok: "✓ Correcto. Es una red local que cubre un edificio (LAN)."
  },
  {
    id: "r1c3",
    texto: "Red de fibra óptica que une 5 hospitales de la ciudad",
    tipo: "MAN",
    feedback_ok: "✓ Correcto. Cubre una ciudad: red metropolitana (MAN)."
  },
  {
    id: "r1c4",
    texto: "Internet: la red mundial que conecta millones de equipos",
    tipo: "WAN",
    feedback_ok: "✓ Correcto. Es la red más extensa que existe: WAN."
  }
];
```

### Feedback al fallar (al soltar en la columna incorrecta)
- Flash rojo breve sobre la columna
- Mensaje sutil: *"Volvé a intentar. Pensá en el alcance de la red."*
- La card vuelve a su posición original
- Contador de "intentos fallidos" +1

### Al completar la ronda
- Mensaje pop: **"¡Ronda 1 completada! 🎉"**
- Botón **"▶ Siguiente ronda"**

---

## 🟢 RONDA 2 — "¿Cuál es la función de cada componente?"

### Mecánica
Aparecen **5 componentes** con su ícono. El alumno los arrastra a la columna con su **función correcta**.

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  Ronda 2 de 3 — Función de los componentes              │
│  Arrastrá cada dispositivo a su función correcta.       │
│                                                           │
│  ┌─ Componentes (arrastrables) ─┐                       │
│  │  🔀 Switch  🌐 Router  📡 AP  🗄 Patch P.  📞 Modem │
│  └──────────────────────────────┘                       │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Conecta varias PCs entre sí dentro de una LAN   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Conecta la red local a Internet (WAN)            │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Da acceso inalámbrico (Wi-Fi) a los dispositivos │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Organiza y ordena los cables que llegan al rack │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Convierte la señal del ISP a una señal usable    │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Datos

```js
const R2_COMPONENTES = [
  {
    id: "r2c1",
    nombre: "Switch",
    emoji: "🔀",
    funcion: "Conecta varias PCs entre sí dentro de una LAN"
  },
  {
    id: "r2c2",
    nombre: "Router",
    emoji: "🌐",
    funcion: "Conecta la red local a Internet (WAN)"
  },
  {
    id: "r2c3",
    nombre: "Access Point",
    emoji: "📡",
    funcion: "Da acceso inalámbrico (Wi-Fi) a los dispositivos"
  },
  {
    id: "r2c4",
    nombre: "Patch Panel",
    emoji: "🗄",
    funcion: "Organiza y ordena los cables que llegan al rack"
  },
  {
    id: "r2c5",
    nombre: "Modem/ONU",
    emoji: "📞",
    funcion: "Convierte la señal del ISP a una señal usable"
  }
];
```

### Feedback al fallar
- Flash rojo en la columna incorrecta
- Mensaje sutil: *"Repensalo. ¿Cuál es la función real de ese componente?"*
- La card vuelve a su lugar
- Intentos fallidos +1

### Al completar la ronda
- Mensaje pop: **"¡Ronda 2 completada! 🎉"**
- Botón **"▶ Siguiente ronda"**

---

## 🟢 RONDA 3 — "Armá la red del laboratorio del colegio"

### Mecánica
**Plano SVG cuadrado 5x5 del laboratorio del colegio**, con 16 PCs pegadas a las 4 paredes (4 por pared). El alumno debe arrastrar 8 componentes:
- **5 son correctos** → cada uno tiene su lugar específico en el plano
- **3 son distractores** → deben arrastrarse a una zona aparte "🗑 No es de red"

### Layout SVG del aula

```
                         🚪 PUERTA
        ┌─────────────────────────────────────┐
        │ 💻  💻  💻  💻                      │
        │                                     │
        │ 💻                            💻    │
        │                            [drop 2] │
        │                          (Switch +  │
   PCs  │ 💻        [drop 1]        Router)   │
        │           (centro:                  │
        │            Access Point             │
        │            en el techo)             │
        │ 💻                                  │
        │                          [drop 3]   │
        │                          (Modem)    │
        │ 💻  💻  💻  💻                      │
        └─────────────────────────────────────┘
                  [drop 4]
                  Patch Panel
                  (gabinete pared inferior)

           🌐 Cable de Internet desde afuera
```

### Drop zones reales (en el plano)

```js
const R3_DROP_ZONES = [
  {
    id: "z-centro",
    nombre: "Centro del aula (techo)",
    posicion_svg: { x: 50%, y: 50% },
    componente_correcto: "AP",
    feedback_ok: "✓ El Access Point se coloca en el centro y techo para cubrir toda el aula con Wi-Fi."
  },
  {
    id: "z-rack-superior",
    nombre: "Pared superior derecha (rack montado)",
    posicion_svg: { x: 85%, y: 25% },
    componente_correcto: "Switch",
    feedback_ok: "✓ El Switch va en el rack, donde concentra los cables de todas las PCs."
  },
  {
    id: "z-router",
    nombre: "Junto al switch (rack)",
    posicion_svg: { x: 85%, y: 35% },
    componente_correcto: "Router",
    feedback_ok: "✓ El Router se coloca junto al switch, conectado al cable de Internet."
  },
  {
    id: "z-modem",
    nombre: "Pared derecha (junto al cable de entrada)",
    posicion_svg: { x: 90%, y: 60% },
    componente_correcto: "Modem",
    feedback_ok: "✓ El Modem/ONU va donde llega el cable de Internet desde afuera."
  },
  {
    id: "z-patch",
    nombre: "Gabinete inferior (debajo del aula)",
    posicion_svg: { x: 50%, y: 95% },
    componente_correcto: "PatchPanel",
    feedback_ok: "✓ El Patch Panel organiza los cables que vienen de cada PC hacia el switch."
  }
];
```

### Zona "No es de red" (drop zone separada del plano)

Ubicada al costado o debajo del plano. Caja con borde punteado y emoji 🗑.
```
┌─────────────────────────────┐
│   🗑 No es componente de red │
│      (arrastrá aquí)         │
└─────────────────────────────┘
```

### Componentes a arrastrar (8 total)

```js
const R3_COMPONENTES = [
  // ── 5 correctos ──
  { id: "Switch",     nombre: "Switch",       emoji: "🔀", es_de_red: true,  va_en: "z-rack-superior" },
  { id: "Router",     nombre: "Router",       emoji: "🌐", es_de_red: true,  va_en: "z-router" },
  { id: "AP",         nombre: "Access Point", emoji: "📡", es_de_red: true,  va_en: "z-centro" },
  { id: "PatchPanel", nombre: "Patch Panel",  emoji: "🗄", es_de_red: true,  va_en: "z-patch" },
  { id: "Modem",      nombre: "Modem/ONU",    emoji: "📞", es_de_red: true,  va_en: "z-modem" },
  
  // ── 3 distractores ──
  { id: "Hub",        nombre: "Hub",          emoji: "🔌", es_de_red: false,
    feedback_descarte: "✓ Correcto. El Hub está obsoleto, fue reemplazado por el switch." },
  { id: "Parlante",   nombre: "Parlante",     emoji: "🔊", es_de_red: false,
    feedback_descarte: "✓ Correcto. El parlante es un dispositivo de audio, no de red." },
  { id: "Cañón",      nombre: "Cañón/Proyector", emoji: "📽", es_de_red: false,
    feedback_descarte: "✓ Correcto. El cañón es para visualización, no para conectar a la red." }
];
```

### Feedback al fallar

**Si arrastra un componente correcto a una drop zone incorrecta:**
- Flash rojo en la drop zone
- Mensaje: *"Ese no es el lugar correcto para este componente. ¿Dónde iría?"*
- El componente vuelve a su panel
- Intentos fallidos +1

**Si arrastra un componente correcto a "No es de red":**
- Flash rojo en la zona
- Mensaje: *"¡Cuidado! Este SÍ es un componente de red."*
- Vuelve al panel
- Intentos fallidos +1

**Si arrastra un distractor a una drop zone del plano:**
- Flash rojo en la drop zone
- Mensaje según el componente:
  - Hub: *"El Hub no se usa hoy. ¿No te conviene descartarlo?"*
  - Parlante: *"El parlante no es de red. Probá la zona de descarte."*
  - Cañón: *"El cañón no es de red. Probá la zona de descarte."*
- Vuelve al panel
- Intentos fallidos +1

### Al completar la ronda
- Mensaje pop: **"¡Red armada correctamente! 🎉"**
- Botón **"▶ Ver resultados"**

---

## 🏆 Pantalla de resultados final

Cuando termina la Ronda 3, se muestra el modal de resultados con:

### Estructura del modal

```
┌──────────────────────────────────────────┐
│                                           │
│           🏆 ¡TP2 COMPLETADO!             │
│                                           │
│              🥇  ORO                      │
│                                           │
│           ⏱ Tiempo: 7:32                  │
│                                           │
│      Aciertos: 13/13 directos             │
│      Intentos totales: 13                 │
│                                           │
│            ⭐ Sin errores                 │
│                                           │
│   ─── Resumen por ronda ───              │
│   R1 ✓  Clasificación de redes           │
│   R2 ✓  Función de componentes           │
│   R3 ✓  Armado de la red del aula        │
│                                           │
│   [🔄 Jugar de nuevo]   [🏠 Menú]        │
└──────────────────────────────────────────┘
```

### Sistema de medallas por tiempo

```js
function calcularMedalla(tiempoSegundos) {
  const min = tiempoSegundos / 60;
  if (min < 8)   return { medalla: "🥇", nombre: "ORO",        color: "#facc15", msg: "¡Increíble! Resolviste todo súper rápido." };
  if (min < 12)  return { medalla: "🥈", nombre: "PLATA",      color: "#a4b3c9", msg: "¡Muy bien! Tiempo excelente." };
  if (min < 18)  return { medalla: "🥉", nombre: "BRONCE",     color: "#fb923c", msg: "¡Lograste completarlo! Buen trabajo." };
  return         { medalla: "⭐", nombre: "COMPLETADO", color: "#4ade80", msg: "¡Lo terminaste! Lo importante es haber aprendido." };
}
```

### Estrella extra "Sin errores"

Si `intentosFallidos === 0` durante todas las rondas → se muestra **⭐ Sin errores** debajo de la medalla.

### Persistencia (localStorage)

Guardar el mejor tiempo para el TP2:

```js
const KEY = "redes_best_tp2";
const stored = parseInt(localStorage.getItem(KEY) || "999999");
if (tiempoActual < stored) {
  localStorage.setItem(KEY, tiempoActual);
  // Mostrar mensaje extra: "🎯 ¡Nuevo récord personal!"
}
```

---

## 🎨 Notas de implementación visual

### Cards arrastrables (en R1, R2, R3)
- Background `var(--surf2)` con borde `var(--brd)`
- Border-left 3px con color del acento (`--green` para TP2)
- Hover: translateY(-2px) + box-shadow
- Cuando se está arrastrando: opacity 0.6 + scale(1.05)
- Cuando se suelta correctamente: animación pop + se queda en su drop zone

### Drop zones
- Borde punteado `var(--brd)` por defecto
- En hover de drag: borde sólido `var(--green)` + background `rgba(74, 222, 128, 0.1)`
- Cuando recibe un acierto: flash verde breve + componente se queda
- Cuando recibe un error: flash rojo breve + componente vuelve

### Plano SVG del aula (Ronda 3)
- Fondo del plano: `var(--surf)` con borde de 2px `var(--brd)`
- Paredes en línea sólida color `var(--txt-soft)`
- PCs: rectángulos pequeños (~30x20) con emoji 💻 superpuesto
- Puerta: arco abierto en la pared superior izquierda
- Drop zones: círculos punteados de ~50px con un emoji descriptor (📡 para AP, 🔀 para switch, etc.)
- Cable de Internet: línea desde afuera entrando a la pared derecha

### Transiciones entre rondas
- Fade out de la ronda actual (0.3s)
- Fade in de la siguiente (0.3s)
- El timer NO se reinicia entre rondas — sigue corriendo

### Mobile / touch
- Soporte completo de touch events (touchstart, touchmove, touchend)
- Las cards deben ser draggables con el dedo
- El SVG del plano debe ser responsive (viewBox + preserveAspectRatio)

---

## 📝 Checklist para Claude Code

- [ ] Agregar al array `TPS` en `index.html`: `tp.n=2, active: true, game: "dragdrop"` y todos los datos
- [ ] Crear pantalla `#scr-tp2-intro` con las 3 rondas como niveles
- [ ] Crear pantalla `#scr-tp2-game` que contiene las 3 rondas
- [ ] Implementar lógica de drag & drop para mouse Y touch
- [ ] Implementar Ronda 1 (clasificación)
- [ ] Implementar Ronda 2 (componente → función)
- [ ] Implementar Ronda 3 (plano SVG + componentes + distractores)
- [ ] Implementar cronómetro continuo entre rondas
- [ ] Implementar contador de intentos fallidos
- [ ] Implementar modal de resultados con medalla y estrella
- [ ] Implementar localStorage para mejor tiempo
- [ ] Asegurar que se respeta el estilo visual del proyecto (verde como acento, dark theme, etc.)
- [ ] Asegurar que el botón "← Menú" funciona en cualquier punto del juego
- [ ] Probar en mobile (touch) y desktop (mouse)

---

## ⚠️ Cosas importantes

1. **NO romper la estética actual del proyecto** — usar las CSS variables ya definidas
2. **NO cambiar la pantalla del menú** — solo agregar lógica para TP2
3. **El timer arranca cuando el alumno hace click en "▶ Empezar Juego"** (en la intro), NO desde el menú
4. **El timer NO se detiene entre rondas**
5. **Solo se considera "Sin errores" si terminó las 3 rondas con 0 intentos fallidos**
6. **Mobile-first:** probar que funciona bien arrastrando con el dedo
7. **Mantener todo en un solo `index.html`** (sin archivos externos)
