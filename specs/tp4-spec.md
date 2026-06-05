# TP4 — Spec del Mini-juego

> Spec para implementar el juego del TP4 en `games/tp4/`.
> Seguir las convenciones del `CLAUDE.md` (paleta, tipografías, estilo visual, estructura modular).

---

## 📋 Información general

- **Número:** TP4
- **Título:** Direccionamiento IPv4 e Introducción a IPv6
- **Tipo:** Multi-ronda (click rápido + drag & drop + asociaciones)
- **Color de acento:** naranja (`--orange: #fb923c`)
- **Mecánica:** 5 rondas progresivas
- **Cronómetro:** Sí, visible siempre. NO hay tiempo límite que detenga el juego
- **Sistema de puntaje:** Medallas por tiempo + estrella extra por completar sin errores
- **Estructura de archivos:** `games/tp4/index.html`, `games/tp4/tp4.css`, `games/tp4/tp4.js`

---

## 🎯 Estructura del juego

### Pantalla de inicio (`#scr-tp4-intro`)

Cuando el alumno entra al TP4, ve una pantalla intro con las 5 rondas como niveles:

```
┌─────────────────────────────────────────────┐
│  TP 04 — Direccionamiento IPv4 e IPv6       │
│                                              │
│  🎯 5 rondas progresivas                     │
│                                              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐              │
│  │R1 │ │R2 │ │R3 │ │R4 │ │R5 │              │
│  │P/P│ │A/B│ │E/D│ │ESP│ │v4 │              │
│  │   │ │/C │ │   │ │   │ │/v6│              │
│  └───┘ └───┘ └───┘ └───┘ └───┘              │
│                                              │
│         [▶ Empezar Juego]                    │
│         [← Volver al menú]                   │
└─────────────────────────────────────────────┘
```

El cronómetro arranca cuando hace click en "▶ Empezar Juego".

---

## 🟠 RONDA 1 — "¿Pública o Privada?"

### Mecánica
Aparecen IPs una a una en el centro de la pantalla. El alumno hace click rápido en uno de dos botones grandes: **PÚBLICA** o **PRIVADA**.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 1 de 5 — ¿Pública o Privada?                    │
│  IP 3 de 10                                             │
│  ┌─────────────────┐                                    │
│  │ ▓▓▓▓▓░░░░░░░░░░ │  ← barra de progreso              │
│  └─────────────────┘                                    │
│                                                          │
│           ┌──────────────────────┐                      │
│           │                      │                      │
│           │   192.168.1.10       │ ← IP a clasificar    │
│           │                      │                      │
│           └──────────────────────┘                      │
│                                                          │
│      ┌────────────────┐      ┌────────────────┐         │
│      │   🌍 PÚBLICA   │      │   🏠 PRIVADA   │         │
│      └────────────────┘      └────────────────┘         │
└────────────────────────────────────────────────────────┘
```

### Datos — 10 IPs a clasificar (mezcladas aleatoriamente)

```js
const R1_IPS = [
  { ip: "192.168.1.10",  tipo: "PRIVADA", feedback: "✓ Rango privado de Clase C (192.168.x.x)." },
  { ip: "10.0.0.5",      tipo: "PRIVADA", feedback: "✓ Rango privado de Clase A (10.x.x.x)." },
  { ip: "172.16.0.1",    tipo: "PRIVADA", feedback: "✓ Rango privado de Clase B (172.16-31.x.x)." },
  { ip: "172.20.5.100",  tipo: "PRIVADA", feedback: "✓ Rango privado de Clase B (172.16-31.x.x)." },
  { ip: "192.168.50.200",tipo: "PRIVADA", feedback: "✓ Rango privado de Clase C." },
  { ip: "8.8.8.8",       tipo: "PÚBLICA", feedback: "✓ IP pública del DNS de Google." },
  { ip: "142.250.79.4",  tipo: "PÚBLICA", feedback: "✓ IP pública de Google." },
  { ip: "200.45.10.15",  tipo: "PÚBLICA", feedback: "✓ IP pública (rango no reservado para privadas)." },
  { ip: "52.84.10.5",    tipo: "PÚBLICA", feedback: "✓ IP pública (servidores de Amazon AWS)." },
  { ip: "186.32.100.50", tipo: "PÚBLICA", feedback: "✓ IP pública (rango asignado a Argentina)." }
];
```

### Feedback

**Al acertar:**
- Flash verde en el botón clickeado
- Mensaje fugaz con el feedback educativo
- Pequeño confetti
- Pasa a la siguiente IP automáticamente (después de 1 seg)

**Al fallar:**
- Flash rojo en el botón clickeado
- Mensaje educativo: por ejemplo, *"❌ 192.168.x.x está en el rango privado de Clase C."*
- La misma IP se mantiene hasta que el alumno acierte
- Intentos fallidos +1

### Al completar las 10 IPs
- Mensaje grande: **"¡Ronda 1 completada! 🎉"**
- Botón **"▶ Continuar a Ronda 2"**

---

## 🟠 RONDA 2 — "Identificá la clase A / B / C"

### Mecánica
Drag & drop. Aparecen 6 IPs (cards arrastrables) y 3 columnas: **Clase A**, **Clase B**, **Clase C**. El alumno arrastra cada IP a su clase correcta.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 2 de 5 — Identificá la clase                    │
│  Arrastrá cada IP a su clase correspondiente.          │
│                                                          │
│  ┌─ IPs (arrastrables) ────────────────────────────┐   │
│  │  [10.0.0.1]  [172.16.0.1]  [192.168.1.10]       │   │
│  │  [120.45.10.5]  [145.20.30.40]  [200.100.50.25] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Clase A   │  │  Clase B   │  │  Clase C   │        │
│  │ (1-126)    │  │ (128-191)  │  │ (192-223)  │        │
│  │   (drop)   │  │   (drop)   │  │   (drop)   │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const R2_IPS = [
  { ip: "10.0.0.1",      clase: "A", feedback: "✓ Primer octeto 10 → entre 1 y 126 → Clase A." },
  { ip: "120.45.10.5",   clase: "A", feedback: "✓ Primer octeto 120 → entre 1 y 126 → Clase A." },
  { ip: "172.16.0.1",    clase: "B", feedback: "✓ Primer octeto 172 → entre 128 y 191 → Clase B." },
  { ip: "145.20.30.40",  clase: "B", feedback: "✓ Primer octeto 145 → entre 128 y 191 → Clase B." },
  { ip: "192.168.1.10",  clase: "C", feedback: "✓ Primer octeto 192 → entre 192 y 223 → Clase C." },
  { ip: "200.100.50.25", clase: "C", feedback: "✓ Primer octeto 200 → entre 192 y 223 → Clase C." }
];
```

### Feedback al fallar
- Flash rojo en la columna
- Mensaje: *"❌ Revisá el primer octeto. ¿Está entre 1-126, 128-191 o 192-223?"*
- La card vuelve a su lugar
- Intentos fallidos +1

### Al completar la ronda
- Mensaje pop: **"¡Ronda 2 completada! 🎉"**
- Botón **"▶ Continuar a Ronda 3"**

---

## 🟠 RONDA 3 — "¿Estática o Dinámica?"

### Mecánica
Aparecen 6 escenarios reales como cards. El alumno los arrastra a una de las 2 columnas: **Estática** o **Dinámica**.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 3 de 5 — ¿Direccionamiento Estático o Dinámico?│
│  Arrastrá cada caso a la categoría correcta.           │
│                                                          │
│  ┌─ Escenarios (arrastrables) ─────────────────────┐   │
│  │  [Caso 1] [Caso 2] [Caso 3]                     │   │
│  │  [Caso 4] [Caso 5] [Caso 6]                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │  📌 Estática         │  │  🔄 Dinámica (DHCP)  │    │
│  │      (drop)          │  │      (drop)          │    │
│  └──────────────────────┘  └──────────────────────┘    │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const R3_ESCENARIOS = [
  { texto: "El servidor del colegio",                tipo: "Estática",
    feedback: "✓ Los servidores siempre llevan IP estática para que se los pueda encontrar siempre." },
  { texto: "El celular de un alumno en el Wi-Fi",    tipo: "Dinámica",
    feedback: "✓ Los celulares reciben IP dinámica del DHCP cada vez que se conectan." },
  { texto: "Una impresora de red de la oficina",     tipo: "Estática",
    feedback: "✓ Las impresoras llevan IP estática para que las PCs sepan siempre dónde encontrarlas." },
  { texto: "Una notebook que se conecta al aula",    tipo: "Dinámica",
    feedback: "✓ Las notebooks van y vienen, conviene IP dinámica." },
  { texto: "El router del colegio",                  tipo: "Estática",
    feedback: "✓ El router debe tener IP estática: es el gateway de toda la red." },
  { texto: "Una tablet que entra al Wi-Fi del recreo", tipo: "Dinámica",
    feedback: "✓ Los dispositivos temporales reciben IP dinámica automáticamente." }
];
```

### Feedback al fallar
- Flash rojo en la columna
- Mensaje: *"❌ Pensá: ¿es un dispositivo que está siempre o que va y viene?"*
- La card vuelve a su lugar
- Intentos fallidos +1

### Al completar la ronda
- Mensaje pop: **"¡Ronda 3 completada! 🎉"**
- Botón **"▶ Continuar a Ronda 4"**

---

## 🟠 RONDA 4 — "Direcciones especiales IPv4"

### Mecánica
Aparecen 4 direcciones IP especiales como cards arrastrables, y 4 cards con sus significados. El alumno debe arrastrar cada dirección a su significado correspondiente.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 4 de 5 — Direcciones especiales IPv4            │
│  Arrastrá cada dirección a su significado.             │
│                                                          │
│  IPs especiales:                                        │
│  [127.0.0.1]  [192.168.1.0]  [192.168.1.255]  [0.0.0.0]│
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Loopback — tu propia máquina (localhost)          │  │
│  │ (drop)                                            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Dirección de red — identifica una red entera     │  │
│  │ (drop)                                            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Broadcast — envía a todos los hosts de la red    │  │
│  │ (drop)                                            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Ruta por defecto — dirección no asignada         │  │
│  │ (drop)                                            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const R4_ESPECIALES = [
  {
    ip: "127.0.0.1",
    significado: "Loopback — tu propia máquina (localhost)",
    feedback: "✓ 127.0.0.1 es el loopback: apunta a tu propia computadora. Si hacés ping a esa IP, te respondés a vos mismo."
  },
  {
    ip: "192.168.1.0",
    significado: "Dirección de red — identifica una red entera",
    feedback: "✓ Cuando todos los bits de host están en 0, identifica a la red completa, no a un host."
  },
  {
    ip: "192.168.1.255",
    significado: "Broadcast — envía a todos los hosts de la red",
    feedback: "✓ Cuando todos los bits de host están en 1, es la dirección de broadcast: llega a todos."
  },
  {
    ip: "0.0.0.0",
    significado: "Ruta por defecto — dirección no asignada",
    feedback: "✓ 0.0.0.0 significa 'cualquier dirección' o 'sin dirección asignada todavía'."
  }
];
```

### Feedback al fallar
- Flash rojo en el slot
- Mensaje: *"❌ Esa no es la correspondencia. ¿Qué representa esta dirección especial?"*
- La card vuelve a su panel
- Intentos fallidos +1

### Al completar
- Mensaje pop: **"¡Ronda 4 completada! 🎉"**
- Botón **"▶ Continuar a Ronda 5"**

---

## 🟠 RONDA 5 — "IPv4 vs IPv6"

### Mecánica
Drag & drop. Aparecen 8 cards con características de los protocolos, y 2 columnas: **IPv4** e **IPv6**. El alumno arrastra cada característica a la columna correspondiente.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Ronda 5 de 5 — IPv4 vs IPv6                           │
│  Arrastrá cada característica al protocolo correcto.   │
│                                                          │
│  ┌─ Características (arrastrables, mezcladas) ─────┐   │
│  │  [32 bits]  [128 bits]                          │   │
│  │  [Notación decimal con puntos]                  │   │
│  │  [Notación hexadecimal con dos puntos]          │   │
│  │  [Necesita NAT]                                 │   │
│  │  [Autoconfiguración nativa (SLAAC)]             │   │
│  │  [~4.300 millones de direcciones]               │   │
│  │  [~340 sextillones de direcciones]              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │       IPv4          │  │       IPv6          │      │
│  │      (drop)         │  │      (drop)         │      │
│  └─────────────────────┘  └─────────────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Datos

```js
const R5_CARACTERISTICAS = [
  { texto: "32 bits",                                 protocolo: "IPv4" },
  { texto: "128 bits",                                protocolo: "IPv6" },
  { texto: "Notación decimal con puntos",             protocolo: "IPv4" },
  { texto: "Notación hexadecimal con dos puntos",     protocolo: "IPv6" },
  { texto: "Necesita NAT para compartir IPs",         protocolo: "IPv4" },
  { texto: "Autoconfiguración nativa (SLAAC)",        protocolo: "IPv6" },
  { texto: "~4.300 millones de direcciones",          protocolo: "IPv4" },
  { texto: "~340 sextillones de direcciones",         protocolo: "IPv6" }
];
```

### Feedback al fallar
- Flash rojo en la columna
- Mensaje: *"❌ Esa característica no es de ese protocolo. ¿Cuántos bits tiene cada uno?"*
- La card vuelve a su panel
- Intentos fallidos +1

### Al completar la ronda
- Mensaje grande: **"¡Conociste IPv4 e IPv6! 🎉"**
- Botón **"▶ Ver resultados"**

---

## 🏆 Pantalla de resultados final

### Estructura del modal

```
┌──────────────────────────────────────────┐
│                                           │
│           🏆 ¡TP4 COMPLETADO!             │
│                                           │
│              🥇  ORO                      │
│                                           │
│           ⏱ Tiempo: 6:32                  │
│                                           │
│      Aciertos: 34/34 directos             │
│      Intentos totales: 34                 │
│                                           │
│            ⭐ Sin errores                 │
│                                           │
│   ─── Resumen por ronda ───              │
│   R1 ✓  Pública vs Privada                │
│   R2 ✓  Clases A/B/C                      │
│   R3 ✓  Estática vs Dinámica              │
│   R4 ✓  Direcciones especiales            │
│   R5 ✓  IPv4 vs IPv6                      │
│                                           │
│   [🔄 Jugar de nuevo]   [🏠 Menú]        │
└──────────────────────────────────────────┘
```

### Sistema de medallas

```js
function calcularMedallaTP4(tiempoSegundos) {
  const min = tiempoSegundos / 60;
  if (min < 7)   return { medalla: "🥇", nombre: "ORO",        color: "#facc15", msg: "¡Increíble! Dominás IPv4 e IPv6." };
  if (min < 11)  return { medalla: "🥈", nombre: "PLATA",      color: "#a4b3c9", msg: "¡Muy bien! Excelente trabajo." };
  if (min < 17)  return { medalla: "🥉", nombre: "BRONCE",     color: "#fb923c", msg: "¡Lograste completarlo! Buen trabajo." };
  return         { medalla: "⭐", nombre: "COMPLETADO", color: "#fb923c", msg: "¡Lo terminaste! Lo importante es haber aprendido." };
}
```

### Estrella extra "Sin errores"

Si `intentosFallidos === 0` durante las 5 rondas → se muestra **⭐ Sin errores**.

### Persistencia (localStorage)

```js
const KEY = "redes_best_tp4";
const stored = parseInt(localStorage.getItem(KEY) || "999999");
if (tiempoActual < stored) {
  localStorage.setItem(KEY, tiempoActual);
  // Mostrar mensaje extra: "🎯 ¡Nuevo récord personal!"
}
```

---

## 🎨 Notas de implementación visual

### Color del TP4
- Usar `--orange: #fb923c` como acento principal
- Sidebar, botones, bordes, etc. con tonos del naranja

### Cards de IPs (R1, R2, R4)
- Mostrar la IP en fuente monoespaciada (font-family: 'Courier New', monospace, o usar Russo One que ya es bold)
- Padding amplio para que sean visibles
- Bordes redondeados, color de acento

### Botones de la R1 (PÚBLICA / PRIVADA)
- Botones grandes, fáciles de tocar en mobile
- Color púrpura suave para "PÚBLICA" 🌍 (porque es "afuera")
- Color verde suave para "PRIVADA" 🏠 (porque es "casa")
- Hover y active con animación de pulso

### Columnas de drop (R2, R3, R5)
- Mismo estilo que el TP2/TP3 (borde punteado por defecto, sólido en drag-over)
- Cuando recibe una card correcta: flash verde breve + se queda fija
- Cuando recibe una incorrecta: flash rojo, card vuelve

### Transiciones entre rondas
- Fade out (0.3s) → Fade in (0.3s)
- El timer NO se reinicia

### Mobile / touch
- Soporte completo de touch events
- En R1, los botones PÚBLICA/PRIVADA deben ser grandes para tocarlos con el dedo
- Layout responsivo en todas las rondas

---

## 📝 Checklist para Claude Code

- [ ] Crear carpeta `games/tp4/` con sus 3 archivos: `index.html`, `tp4.css`, `tp4.js`
- [ ] Agregar TP4 al array `TPS` en `js/main.js` con `active: true`
- [ ] Pantalla intro con los 5 niveles visualizados
- [ ] Ronda 1: click rápido público/privado (10 IPs)
- [ ] Ronda 2: drag & drop a Clase A/B/C (6 IPs)
- [ ] Ronda 3: drag & drop estático/dinámico (6 escenarios)
- [ ] Ronda 4: drag & drop direcciones especiales (4 mapeos)
- [ ] Ronda 5: drag & drop IPv4 vs IPv6 (8 características)
- [ ] Cronómetro continuo entre rondas
- [ ] Contador de intentos fallidos
- [ ] Modal de resultados con medalla, estrella y resumen
- [ ] localStorage para mejor tiempo (clave: `redes_best_tp4`)
- [ ] Botón "← Menú" funcional en todo momento (vuelve a `../../index.html`)
- [ ] Probar en mobile (touch) y desktop (mouse)
- [ ] Verificar que TP1, TP2 y TP3 siguen funcionando igual

---

## ⚠️ Cosas importantes

1. **NO romper la estética actual del proyecto** — usar las CSS variables ya definidas
2. **NO tocar el menú principal** — solo cambiar el TP4 a `active: true` en `js/main.js`
3. **El timer arranca cuando el alumno hace click en "▶ Empezar Juego"**
4. **El timer NO se detiene entre rondas**
5. **Solo se considera "Sin errores" si terminó las 5 rondas con 0 intentos fallidos**
6. **Mobile-first:** especialmente la Ronda 1 (botones grandes) y las cards de drag (fáciles de mover con el dedo)
7. **Seguir la estructura modular:** todo el código del TP4 en `games/tp4/`, sin contaminar otros archivos
8. **Usar las funciones compartidas** de `js/shared.js` cuando sea posible (timer, confetti, modal de resultados, calcular medalla)
9. **Las rutas relativas** desde `games/tp4/index.html` deben ser `../../css/base.css`, `../../js/shared.js`, etc.
10. **Mezclar las IPs y cards aleatoriamente** en cada ronda (usar shuffle) para que no salgan siempre en el mismo orden

---

## 🔧 Commit al finalizar

```
feat(tp4): agregar juego de direccionamiento IPv4 e IPv6

- Ronda 1: click rápido público vs privado (10 IPs)
- Ronda 2: drag & drop clases A/B/C (6 IPs)
- Ronda 3: drag & drop estático vs dinámico (6 escenarios)
- Ronda 4: drag & drop direcciones especiales (loopback, red, broadcast, ruta default)
- Ronda 5: drag & drop IPv4 vs IPv6 (8 características)
- Sistema de medallas y localStorage
```
