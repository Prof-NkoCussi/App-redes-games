# TP3 — Spec del Mini-juego

> Spec para implementar el juego del TP3 en `games/tp3/`.
> Seguir las convenciones del `CLAUDE.md` (paleta, tipografías, estilo visual, estructura modular).

---

## 📋 Información general

- **Número:** TP3
- **Título:** Cableado + Modelos OSI y TCP/IP
- **Tipo:** Drag & Drop multi-ronda
- **Color de acento:** púrpura (`--purple: #a78bfa`)
- **Mecánica:** 3 rondas progresivas con sub-rondas
- **Cronómetro:** Sí, visible siempre. NO hay tiempo límite que detenga el juego
- **Sistema de puntaje:** Medallas por tiempo + estrella extra por completar sin errores
- **Estructura de archivos:** `games/tp3/index.html`, `games/tp3/tp3.css`, `games/tp3/tp3.js`

---

## 🎯 Estructura del juego

### Pantalla de inicio (`#scr-tp3-intro`)

Cuando el alumno entra al TP3, ve una pantalla intro con las rondas presentadas como niveles:

```
┌─────────────────────────────────────────────┐
│  TP 03 — Cableado + Modelos OSI y TCP/IP    │
│                                              │
│  🎯 3 rondas con sub-actividades             │
│                                              │
│  ┌─────┐  ┌─────┐  ┌─────┐                  │
│  │ R1  │  │ R2  │  │ R3  │                  │
│  │Cable│  │ OSI │  │TCP/ │                  │
│  │ado  │  │     │  │ IP  │                  │
│  └─────┘  └─────┘  └─────┘                  │
│                                              │
│  Elegí qué norma de cableado armar primero:  │
│  ┌──────────────┐  ┌──────────────┐         │
│  │  Norma 568A  │  │  Norma 568B  │         │
│  └──────────────┘  └──────────────┘         │
│                                              │
│            [← Volver al menú]                │
└─────────────────────────────────────────────┘
```

- El alumno debe elegir norma para arrancar (568A o 568B).
- Si elige 568A → en la Ronda 1, primero arma la 568A y después se le pide armar también la 568B con un mensaje motivador.
- Si elige 568B → solo arma la 568B (porque es la más usada en la práctica).
- El cronómetro arranca cuando elige una norma y entra a la Ronda 1.

---

## 🟣 RONDA 1 — "Armá el cable"

### Mecánica
Drag & Drop de 8 cards de colores hacia 8 pines numerados en un RJ-45 dibujado en SVG.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 1 — Armá el cable según norma 568B              │
│  Arrastrá cada color al pin correcto del conector.     │
│                                                         │
│   ┌──────────────────────────────────────────┐         │
│   │  CONECTOR RJ-45 (vista frontal SVG)      │         │
│   │   ⬜  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜  ⬜           │         │
│   │   1   2   3   4   5   6   7   8           │         │
│   └──────────────────────────────────────────┘         │
│                                                         │
│   Colores disponibles (mezclados, arrastrables):       │
│   [Bl/Naranja] [Verde] [Azul] [Bl/Verde]               │
│   [Marrón] [Bl/Azul] [Bl/Marrón] [Naranja]             │
└────────────────────────────────────────────────────────┘
```

### Datos — Orden correcto por norma

```js
const NORMA_568A = [
  { pin: 1, color: "Blanco/Verde",   bg: "linear-gradient(to right, #fff 50%, #16a34a 50%)" },
  { pin: 2, color: "Verde",          bg: "#16a34a" },
  { pin: 3, color: "Blanco/Naranja", bg: "linear-gradient(to right, #fff 50%, #ea580c 50%)" },
  { pin: 4, color: "Azul",           bg: "#2563eb" },
  { pin: 5, color: "Blanco/Azul",    bg: "linear-gradient(to right, #fff 50%, #2563eb 50%)" },
  { pin: 6, color: "Naranja",        bg: "#ea580c" },
  { pin: 7, color: "Blanco/Marrón",  bg: "linear-gradient(to right, #fff 50%, #78350f 50%)" },
  { pin: 8, color: "Marrón",         bg: "#78350f" }
];

const NORMA_568B = [
  { pin: 1, color: "Blanco/Naranja", bg: "linear-gradient(to right, #fff 50%, #ea580c 50%)" },
  { pin: 2, color: "Naranja",        bg: "#ea580c" },
  { pin: 3, color: "Blanco/Verde",   bg: "linear-gradient(to right, #fff 50%, #16a34a 50%)" },
  { pin: 4, color: "Azul",           bg: "#2563eb" },
  { pin: 5, color: "Blanco/Azul",    bg: "linear-gradient(to right, #fff 50%, #2563eb 50%)" },
  { pin: 6, color: "Verde",          bg: "#16a34a" },
  { pin: 7, color: "Blanco/Marrón",  bg: "linear-gradient(to right, #fff 50%, #78350f 50%)" },
  { pin: 8, color: "Marrón",         bg: "#78350f" }
];
```

### Feedback

**Al acertar (color correcto en pin correcto):**
- La card se "encaja" en el pin con animación pop
- Se rellena el pin con el color de la card
- Mensaje fugaz: *"✓ Pin {n} correcto"*
- El color usado se elimina del panel de cards disponibles

**Al fallar:**
- Flash rojo en el pin
- La card vuelve a su panel
- Mensaje: *"Ese color no va en el pin {n}. Revisá la norma {568A/568B}."*
- Intentos fallidos +1

### Al completar los 8 pines

- Se muestra el cable completo con todos los hilos en orden
- Mensaje grande: **"¡Cable {568A/568B} armado correctamente! 🎉"**
- **Caso especial:** si arrancó eligiendo 568A → mostrar cartel intermedio:
  > **"¡Excelente! Ahora armemos el cable más usado en redes LAN: la norma 568B"**
  > [Botón: Continuar]
  - Y volver a presentar la Ronda 1 con la 568B (cards mezcladas, pines vacíos)
- Si ya armó la 568B (eligió 568B directo, o ya pasó por 568A primero) → botón **"▶ Continuar a Ronda 1.5"**

---

## 🟣 RONDA 1.5 — "¿Directo o cruzado?"

### Mecánica
6 escenarios de conexión aparecen como cards. El alumno los arrastra a una de las 2 columnas: **Cable Directo** o **Cable Cruzado**.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 1.5 — ¿Cable Directo o Cruzado?                 │
│  Arrastrá cada conexión a la categoría correcta.       │
│                                                         │
│  Cards mezcladas:                                       │
│  [Caso 1] [Caso 2] [Caso 3] [Caso 4] [Caso 5] [Caso 6] │
│                                                         │
│  ┌──────────────────┐   ┌──────────────────┐           │
│  │  Cable Directo   │   │  Cable Cruzado   │           │
│  │      (drop)      │   │      (drop)      │           │
│  └──────────────────┘   └──────────────────┘           │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const R1_5_ESCENARIOS = [
  { texto: "PC → Switch",                tipo: "Directo",
    feedback_ok: "✓ Dispositivos diferentes (PC ≠ Switch) → directo." },
  { texto: "PC → PC (sin switch en medio)", tipo: "Cruzado",
    feedback_ok: "✓ Dispositivos iguales (PC = PC) → cruzado." },
  { texto: "Switch → Router",            tipo: "Directo",
    feedback_ok: "✓ Dispositivos diferentes (Switch ≠ Router) → directo." },
  { texto: "Switch → Switch",            tipo: "Cruzado",
    feedback_ok: "✓ Dispositivos iguales (Switch = Switch) → cruzado." },
  { texto: "PC → Router doméstico",      tipo: "Directo",
    feedback_ok: "✓ Dispositivos diferentes (PC ≠ Router) → directo." },
  { texto: "Router → Router",            tipo: "Cruzado",
    feedback_ok: "✓ Dispositivos iguales (Router = Router) → cruzado." }
];
```

### Feedback al fallar
- Flash rojo en la columna incorrecta
- Mensaje: *"Pensá: ¿son dispositivos iguales o diferentes?"*
- La card vuelve a su lugar
- Intentos fallidos +1

### Al completar la ronda
- Mensaje pop: **"¡Ronda 1 completada! 🎉"**
- Botón **"▶ Continuar a Ronda 2 — Modelo OSI"**

---

## 🟣 RONDA 2 — "Apilá las capas OSI"

### Mecánica
7 cards con los nombres de las capas aparecen mezcladas a la izquierda. A la derecha hay una "torre" vacía con 7 slots numerados del 7 (arriba) al 1 (abajo). El alumno arrastra cada capa a su slot correcto.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 2 — Apilá las 7 capas del Modelo OSI            │
│  Arrastrá cada capa a su lugar (de arriba hacia abajo).│
│                                                         │
│   Capas (mezcladas):              Torre OSI:           │
│                                                         │
│   [Transporte]                     ┌──────────┐        │
│   [Sesión]                      7  │  (drop)  │        │
│   [Aplicación]                     ├──────────┤        │
│   [Red]                         6  │  (drop)  │        │
│   [Física]                         ├──────────┤        │
│   [Presentación]                5  │  (drop)  │        │
│   [Enlace de datos]                ├──────────┤        │
│                                  4 │  (drop)  │        │
│                                    ├──────────┤        │
│                                  3 │  (drop)  │        │
│                                    ├──────────┤        │
│                                  2 │  (drop)  │        │
│                                    ├──────────┤        │
│                                  1 │  (drop)  │        │
│                                    └──────────┘        │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const OSI_LAYERS = [
  { n: 7, name: "Aplicación",      color: "#a78bfa" },
  { n: 6, name: "Presentación",    color: "#f472b6" },
  { n: 5, name: "Sesión",          color: "#fb923c" },
  { n: 4, name: "Transporte",      color: "#facc15" },
  { n: 3, name: "Red",             color: "#4ade80" },
  { n: 2, name: "Enlace de datos", color: "#2dd4bf" },
  { n: 1, name: "Física",          color: "#22d3ee" }
];
```

### Feedback al fallar
- Flash rojo en el slot
- La card vuelve a su lugar
- Mensaje: *"Esa no es la capa {n}. Pensá en el orden."*
- Intentos fallidos +1

### Al completar la torre

- Mensaje grande: **"¡Modelo OSI armado! 🎉"**
- Botón **"▶ Continuar a Ronda 2.5"**

---

## 🟣 RONDA 2.5 — "Asociá cada capa con su función"

### Mecánica
Aparecen 7 cards con **funciones** que el alumno debe arrastrar a su capa correspondiente (la torre OSI quedó armada en la ronda anterior y se reutiliza).

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 2.5 — Asociá cada función con su capa OSI       │
│                                                         │
│   Funciones (mezcladas):           Torre OSI:          │
│                                                         │
│   [Transmite bits por el medio]  7  Aplicación  ⬜    │
│   [HTTP, DNS, SMTP]              6  Presentación ⬜    │
│   [Direccionamiento IP]          5  Sesión       ⬜    │
│   [TCP, UDP, puertos]            4  Transporte   ⬜    │
│   [MAC, tramas, switch]          3  Red          ⬜    │
│   [Cifrado, formato datos]       2  Enlace de d. ⬜    │
│   [Establece sesiones]           1  Física       ⬜    │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const OSI_FUNCIONES = [
  { capa: 7, funcion: "Aplicaciones del usuario (HTTP, DNS, SMTP, FTP)" },
  { capa: 6, funcion: "Formato, cifrado y compresión de datos (SSL/TLS)" },
  { capa: 5, funcion: "Establece, mantiene y cierra sesiones de comunicación" },
  { capa: 4, funcion: "Entrega confiable de datos, puertos (TCP/UDP)" },
  { capa: 3, funcion: "Direccionamiento lógico (IP) y enrutamiento" },
  { capa: 2, funcion: "Direccionamiento físico (MAC), tramas, switch" },
  { capa: 1, funcion: "Transmisión de bits por el medio (cables, ondas)" }
];
```

### Feedback al fallar
- Flash rojo en la capa
- Card vuelve a su lugar
- Mensaje: *"Esa función no corresponde a esa capa. Pensá qué hace cada capa."*
- Intentos fallidos +1

### Al completar
- Mensaje pop: **"¡Funciones asociadas correctamente! 🎉"**
- Botón **"▶ Continuar a Ronda 3 — Modelo TCP/IP"**

---

## 🟣 RONDA 3 — "Modelo TCP/IP con pistas"

### Mecánica
Aparecen **4 cards con pistas** (no con los nombres) que describen cada capa del modelo TCP/IP. El alumno debe:
1. Arrastrarlas a una torre TCP/IP de 4 slots (orden correcto de abajo hacia arriba)
2. Cuando las 4 estén en orden correcto → se revelan los nombres reales debajo de cada pista

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 3 — Armá el Modelo TCP/IP                       │
│  Leé las pistas y ordená las capas correctamente.      │
│                                                         │
│   Pistas (mezcladas):             Torre TCP/IP:        │
│                                                         │
│   [Pista A]                        ┌──────────┐        │
│   [Pista B]                      4 │  (drop)  │        │
│   [Pista C]                        ├──────────┤        │
│   [Pista D]                      3 │  (drop)  │        │
│                                    ├──────────┤        │
│                                  2 │  (drop)  │        │
│                                    ├──────────┤        │
│                                  1 │  (drop)  │        │
│                                    └──────────┘        │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const TCPIP_PISTAS = [
  {
    capa: 4,
    nombre: "Aplicación",
    pista: "Acá viven los protocolos que usan las aplicaciones: HTTP, DNS, SMTP, FTP, SSH."
  },
  {
    capa: 3,
    nombre: "Transporte",
    pista: "Entrega los datos de extremo a extremo. Maneja puertos. Acá están TCP y UDP."
  },
  {
    capa: 2,
    nombre: "Internet",
    pista: "Direccionamiento lógico y enrutamiento. Decide por qué camino van los paquetes usando la IP."
  },
  {
    capa: 1,
    nombre: "Acceso a red",
    pista: "Convierte los datos en señales y los transmite por el cable o por aire (Wi-Fi, Ethernet)."
  }
];
```

### Feedback al fallar
- Flash rojo en el slot
- Card vuelve a su lugar
- Mensaje: *"Repensalo. ¿En qué orden viajan los datos? Aplicación arriba, medio físico abajo."*
- Intentos fallidos +1

### Al completar las 4 capas

- Se **revelan los nombres reales** debajo de cada pista (animación de "flip" o aparición)
- Mensaje grande: **"¡Modelo TCP/IP armado! 🎉"**
- Mensaje motivador: *"¡Conociste los dos modelos! En la práctica se usa TCP/IP, pero OSI sirve para diagnosticar problemas."*
- Botón **"▶ Ver resultados"**

---

## 🏆 Pantalla de resultados final

### Estructura del modal

```
┌──────────────────────────────────────────┐
│                                           │
│           🏆 ¡TP3 COMPLETADO!             │
│                                           │
│              🥇  ORO                      │
│                                           │
│           ⏱ Tiempo: 7:32                  │
│                                           │
│      Aciertos: 25/25 directos             │
│      Intentos totales: 25                 │
│                                           │
│            ⭐ Sin errores                 │
│                                           │
│   ─── Resumen por ronda ───              │
│   R1   ✓ Cable armado correctamente      │
│   R1.5 ✓ Directo vs Cruzado              │
│   R2   ✓ Torre OSI                       │
│   R2.5 ✓ Funciones OSI                   │
│   R3   ✓ Modelo TCP/IP                   │
│                                           │
│   [🔄 Jugar de nuevo]   [🏠 Menú]        │
└──────────────────────────────────────────┘
```

### Sistema de medallas (ajustado a la duración del TP3)

```js
function calcularMedallaTP3(tiempoSegundos) {
  const min = tiempoSegundos / 60;
  if (min < 8)   return { medalla: "🥇", nombre: "ORO",        color: "#facc15", msg: "¡Increíble! Te aprendiste todo." };
  if (min < 13)  return { medalla: "🥈", nombre: "PLATA",      color: "#a4b3c9", msg: "¡Muy bien! Excelente trabajo." };
  if (min < 20)  return { medalla: "🥉", nombre: "BRONCE",     color: "#fb923c", msg: "¡Lograste completarlo! Buen trabajo." };
  return         { medalla: "⭐", nombre: "COMPLETADO", color: "#a78bfa", msg: "¡Lo terminaste! Lo importante es haber aprendido." };
}
```

### Estrella extra "Sin errores"
Si `intentosFallidos === 0` durante todas las rondas → se muestra **⭐ Sin errores**.

### Persistencia (localStorage)

```js
const KEY = "redes_best_tp3";
const stored = parseInt(localStorage.getItem(KEY) || "999999");
if (tiempoActual < stored) {
  localStorage.setItem(KEY, tiempoActual);
  // Mensaje: "🎯 ¡Nuevo récord personal!"
}
```

---

## 🎨 Notas de implementación visual

### Cable RJ-45 (Ronda 1)
- SVG con forma realista de conector RJ-45
- 8 pines visibles como rectángulos numerados en la base
- Color del cable inicialmente gris/blanco
- Cuando se colocan los hilos, cada uno se rellena con el color correspondiente
- Animación al "encajar" un hilo correcto

### Torre OSI / TCP/IP (Rondas 2, 2.5, 3)
- Cada slot es una card de altura fija (~50px en desktop, 40px en mobile)
- Bordes punteados cuando está vacío
- Cuando recibe una capa correcta: se rellena con el color de la capa + animación pop
- Al completar la torre: efecto sutil de "shimmer" recorriendo de arriba a abajo

### Cards arrastrables
- Mismo estilo que en TP2: background `var(--surf2)`, borde con color de acento
- Hover: translateY(-2px)
- En drag: opacity 0.6 + scale(1.05)
- Cuando se colocan correctamente: se quedan fijas en la torre/cable
- En errores: vuelven a su posición con animación suave

### Color del TP3
- Usar `--purple: #a78bfa` como acento principal en este TP
- Sidebar, botones, bordes, etc. con tonos del púrpura

### Transiciones entre rondas
- Fade out de la ronda actual (0.3s)
- Fade in de la siguiente (0.3s)
- El timer NO se reinicia entre rondas

### Mobile / touch
- Soporte completo de touch events
- En mobile: torres y cables apilados verticalmente, cards arrastrables debajo
- Las cards deben ser fácilmente arrastrables con el dedo

---

## 📝 Checklist para Claude Code

- [ ] Crear carpeta `games/tp3/` con sus 3 archivos: `index.html`, `tp3.css`, `tp3.js`
- [ ] Agregar TP3 al array `TPS` en `js/main.js` con `active: true`
- [ ] Pantalla intro con selector de norma (568A o 568B)
- [ ] Ronda 1: cable RJ-45 SVG + drag de 8 colores
- [ ] Si elige 568A → al completar, mostrar cartel y armar 568B
- [ ] Ronda 1.5: directo vs cruzado (6 escenarios)
- [ ] Ronda 2: torre OSI con 7 capas
- [ ] Ronda 2.5: asociar 7 funciones a las capas
- [ ] Ronda 3: torre TCP/IP con 4 pistas que se revelan al completar
- [ ] Cronómetro continuo entre rondas
- [ ] Contador de intentos fallidos
- [ ] Modal de resultados con medalla, estrella, resumen por ronda
- [ ] localStorage para mejor tiempo (clave: `redes_best_tp3`)
- [ ] Botón "← Menú" funcional en todo momento (vuelve a `../../index.html`)
- [ ] Probar en mobile (touch) y desktop (mouse)
- [ ] Verificar que TP1 y TP2 siguen funcionando igual

---

## ⚠️ Cosas importantes

1. **NO romper la estética actual del proyecto** — usar las CSS variables ya definidas
2. **NO tocar el menú principal** — solo cambiar el TP3 a `active: true` en `js/main.js`
3. **El timer arranca cuando el alumno elige una norma** y entra a la Ronda 1
4. **El timer NO se detiene entre rondas**
5. **Solo se considera "Sin errores" si terminó las 5 sub-rondas con 0 intentos fallidos**
6. **Mobile-first:** las cards deben ser fácilmente arrastrables con el dedo
7. **Seguir la estructura modular:** todo el código del TP3 en `games/tp3/`, sin contaminar otros archivos
8. **Usar las funciones compartidas** de `js/shared.js` cuando sea posible (timer, confetti, modal de resultados, calcular medalla)
9. **Las rutas relativas** desde `games/tp3/index.html` deben ser `../../css/base.css`, `../../js/shared.js`, etc.

---

## 🔧 Commit al finalizar

```
feat(tp3): agregar juego de cableado y modelos OSI/TCP-IP

- Ronda 1: armado de cable RJ-45 con selector 568A/568B
- Ronda 1.5: clasificación directo vs cruzado
- Ronda 2: torre del modelo OSI (7 capas)
- Ronda 2.5: asociación capa-función
- Ronda 3: modelo TCP/IP con pistas
- Sistema de medallas y localStorage
```
