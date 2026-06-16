# TP5 — Enrutamiento y NAT · Spec de implementación

> Mini-juego del **TP5** para la app **Redes I Games**.
> Color de acento: **pink** (`#f472b6`)
> Duración estimada por alumno: **12-15 minutos**
> Mecánica: **Híbrida** — 4 rondas conceptuales + 1 simulador PAT visual interactivo
> Carpeta destino: `games/tp5/` con 3 archivos: `index.html`, `tp5.css`, `tp5.js`

---

## 1. Resumen del juego

El alumno atraviesa **5 rondas** para reforzar los contenidos del TP5:
1. Funciones del router (calentamiento)
2. Enrutamiento estático vs dinámico
3. Tipos de NAT (Estática / Dinámica / PAT)
4. 🌟 **Simulador PAT** — el plato fuerte: navega con 4 dispositivos de casa a través de un router que hace PAT, viendo el viaje del paquete y la tabla NAT llenarse en tiempo real
5. Completar la tabla NAT — cierre conceptual

El **NAT/PAT** se lleva ~60% del tiempo total (R3 + R4 + R5). Las rondas 1 y 2 son introductorias y rápidas.

---

## 2. Convenciones obligatorias

- **Vanilla HTML + CSS + JS** (sin frameworks, sin librerías, sin ES Modules)
- Rutas relativas desde `games/tp5/`: `../../css/base.css`, `../../js/shared.js`
- Reusar lo que ya existe en `shared.css` y `shared.js` (botones, timer, modal, confetti, `calcularMedalla()`)
- Mobile-first y responsive — todo debe funcionar con touch
- Idioma: español argentino en toda la UI
- Color de acento (pink `#f472b6`) usado en bordes activos, glow en hover, gradientes, header del TP

---

## 3. Estructura del archivo HTML

`games/tp5/index.html` — sigue el mismo esqueleto que TP4:

```
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TP5 · Enrutamiento y NAT — Redes I Games</title>
  <link rel="stylesheet" href="../../css/base.css">
  <link rel="stylesheet" href="../../css/shared.css">
  <link rel="stylesheet" href="tp5.css">
</head>
<body>
  <!-- Fondo animado (heredado de base.css) -->

  <!-- Header del juego -->
  <header class="game-header">
    <button class="btn btn-back" onclick="goMenu()">← Menú</button>
    <span class="tp-tag tp-tag-5">TP5</span>
    <h1>Enrutamiento y NAT</h1>
    <span class="timer" id="timer">00:00</span>
  </header>

  <!-- Pantalla de ronda -->
  <main id="game-area">
    <!-- Contenido inyectado por JS según la ronda activa -->
  </main>

  <!-- Modal de resultados (estructura heredada de shared.css) -->

  <script src="../../js/shared.js"></script>
  <script src="tp5.js"></script>
</body>
</html>
```

---

## 4. Estado global (variable G)

```js
const G = {
  ronda: 1,                    // 1 a 5
  errores: 0,                  // contador global de errores (para estrella "sin errores")
  sinErrores: true,            // flag
  tiempoInicio: null,          // timestamp de inicio
  tiempoFinal: null,           // timestamp de fin
  
  // Datos de la R4 (simulador PAT)
  tablaNAT: [],                // filas confirmadas hasta ahora
  viajeActual: 0,              // 0 a 4 (5 viajes totales)
  
  // Datos de la R5 (completar tabla)
  celdasFaltantes: []          // lo que el alumno tiene que arrastrar
};
```

---

## 5. Ronda 1 — Funciones del Router

**Duración objetivo:** ~1-2 min
**Mecánica:** Asociar 3 funciones con sus descripciones (drag & drop o click-match en mobile)

### Datos

```js
const R1_FUNCIONES = [
  {
    funcion: "Selección de ruta",
    descripcion: "Decide por qué camino enviar cada paquete para que llegue al destino correcto."
  },
  {
    funcion: "Garantía de entrega",
    descripcion: "Si un paquete se pierde en el camino, se encarga de que se reenvíe."
  },
  {
    funcion: "Optimización",
    descripcion: "Entre varios caminos posibles, elige el más rápido o menos congestionado."
  }
];
```

### UI

- Dos columnas: a la izquierda los 3 nombres de función (cards arrastrables o seleccionables), a la derecha los 3 slots con las descripciones.
- En mobile: tap en una función + tap en su descripción correspondiente (match por click).
- En desktop: drag & drop tradicional.

### Criterios

- Acierto: card se queda fija, glow pink, mensaje flotante "✓ ¡Bien!"
- Error: flash rojo suave, vuelve a su lugar, `G.errores++; G.sinErrores = false`
- Al acertar los 3 → botón "Siguiente →" y pasa a R2

---

## 6. Ronda 2 — Enrutamiento Estático vs Dinámico

**Duración objetivo:** ~2 min
**Mecánica:** Drag & drop de 6 escenarios a 2 contenedores (Estático / Dinámico)

### Datos

```js
const R2_ESCENARIOS = [
  { id: 1, texto: "Una empresa con 3 sucursales fijas conectadas siempre con los mismos enlaces.", tipo: "estatico" },
  { id: 2, texto: "Una multinacional con 200 sucursales que cambian proveedores y rutas seguido.", tipo: "dinamico" },
  { id: 3, texto: "Una oficina pequeña cuya red no cambió hace 5 años.", tipo: "estatico" },
  { id: 4, texto: "Un ISP grande que ajusta las rutas según la congestión en tiempo real.", tipo: "dinamico" },
  { id: 5, texto: "Dos routers de una empresa que siempre se comunican por el mismo camino.", tipo: "estatico" },
  { id: 6, texto: "Una red que usa OSPF o BGP para descubrir rutas automáticamente.", tipo: "dinamico" }
];
```

### UI

- Arriba: dos zonas drop grandes — "🛣️ ESTÁTICO" y "🔄 DINÁMICO" — con sus colores diferenciados.
- Abajo: las 6 cards de escenarios (mezcladas, shuffle inicial).
- Click en una card la "agarra", click en una zona la suelta. En desktop también drag & drop nativo.

### Feedback

- Card correcta: queda fija en la zona, glow pink, suma punto.
- Card incorrecta: flash rojo, vuelve a su posición, `G.errores++; G.sinErrores = false`.
- Pista (botón "💡 Pista"): subraya las palabras clave de la card seleccionada (ej. "siempre", "cambian seguido").

### Criterio de pase

Al ubicar correctamente las 6 → botón "Siguiente →" pasa a R3.

---

## 7. Ronda 3 — Tipos de NAT

**Duración objetivo:** ~2-3 min
**Mecánica:** Drag & drop de 6 escenarios a 3 contenedores (Estática / Dinámica / PAT)

### Datos

```js
const R3_ESCENARIOS = [
  { id: 1, texto: "Servidor web de empresa accesible siempre desde la misma IP pública.", tipo: "estatica" },
  { id: 2, texto: "Tu casa con 4 dispositivos conectados a internet usando una sola IP pública.", tipo: "pat" },
  { id: 3, texto: "Empresa mediana con 50 empleados y un pool de 10 IPs públicas asignadas por turnos.", tipo: "dinamica" },
  { id: 4, texto: "Cámaras de seguridad de un local que deben ser accesibles desde una IP fija.", tipo: "estatica" },
  { id: 5, texto: "Cibercafé con 20 PCs compartiendo una sola conexión hogareña.", tipo: "pat" },
  { id: 6, texto: "Hotel con un pool de 5 IPs públicas que rota entre los huéspedes que se conectan.", tipo: "dinamica" }
];
```

### UI

- Tres zonas drop diferenciadas:
  - 🎯 **NAT Estática** — mapeo 1 a 1
  - 🔄 **NAT Dinámica** — pool de IPs
  - 🚪 **PAT** — múltiples dispositivos, una sola IP
- Cada zona tiene un mini-tooltip ("ⓘ") que muestra la definición al hacer hover/tap.

### Feedback igual que R2.

### Criterio de pase

Al ubicar correctamente las 6 → cartel de transición:

> *"Ahora vas a ver PAT en acción. Bienvenido al router de tu casa."*

→ pasa a R4.

---

## 8. 🌟 Ronda 4 — Simulador PAT (PLATO FUERTE)

**Duración objetivo:** ~5-7 min
**Mecánica:** El alumno hace 5 "viajes" desde 4 dispositivos hacia distintos sitios de internet, viendo cómo el router hace PAT. Los 2 primeros viajes son automáticos (el router asigna el puerto y el alumno mira). Los 3 últimos, el alumno debe elegir el puerto traducido correcto entre 3 opciones.

### Layout

**Desktop:** 3 columnas horizontales:
- **Izquierda (25%):** 4 dispositivos apilados verticalmente
- **Centro (50%):** Router al medio + tabla NAT debajo
- **Derecha (25%):** 4 sitios destino apilados

**Mobile:** layout vertical:
- Arriba: dispositivos en grid 2×2
- Medio: Router + tabla NAT
- Abajo: sitios en grid 2×2
- La animación del paquete viaja verticalmente entre las cards correspondientes

### Datos

```js
// Router de casa
const ROUTER_IP_PUBLICA = "200.45.10.15";

const DISPOSITIVOS = [
  { id: "cel",      icono: "📱", nombre: "Celular",    ip: "192.168.1.10" },
  { id: "notebook", icono: "💻", nombre: "Notebook",   ip: "192.168.1.11" },
  { id: "tv",       icono: "📺", nombre: "Smart TV",   ip: "192.168.1.12" },
  { id: "consola",  icono: "🎮", nombre: "Consola",    ip: "192.168.1.13" }
];

const SITIOS = [
  { id: "yt",  icono: "▶️", nombre: "YouTube" },
  { id: "wa",  icono: "💬", nombre: "WhatsApp" },
  { id: "tw",  icono: "🎮", nombre: "Twitch" },
  { id: "gg",  icono: "🔍", nombre: "Google" }
];

// Los 5 viajes — guion fijo (no random) para garantizar el valor pedagógico
const VIAJES = [
  {
    n: 1, modo: "auto",
    dispositivo: "cel", puerto_origen: 5000, sitio: "yt",
    puerto_traducido: 50001,
    mensaje: "El router asignó el puerto 50001 a la conexión del celular."
  },
  {
    n: 2, modo: "auto",
    dispositivo: "notebook", puerto_origen: 4500, sitio: "wa",
    puerto_traducido: 50002,
    mensaje: "Otro puerto distinto (50002) para que no choque con la conexión anterior."
  },
  {
    n: 3, modo: "manual",
    dispositivo: "tv", puerto_origen: 6200, sitio: "tw",
    puerto_traducido: 50003,
    opciones: [50003, 50001, 80],  // correcta, ya usada, puerto conocido
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
```

### Flujo de cada viaje

**Estado inicial del viaje:**
- Aparece un cartel arriba: *"Viaje N°1 — El **celular** quiere navegar a **YouTube**"*
- Los 4 dispositivos están atenuados excepto el celular (resaltado con glow pink)
- Los 4 sitios están atenuados excepto YouTube (resaltado)

**Para viajes automáticos (1-2):**
1. Aparece botón "▶️ Iniciar conexión"
2. Al hacer click, comienza la animación:
   - Un puntito sale del dispositivo con label `"192.168.1.10:5000 → ?"`
   - Viaja hasta el router (transición CSS de ~1.5s, easing suave)
   - Al llegar, el router "destella" pink. El label del puntito cambia a `"200.45.10.15:50001 → YouTube"`
   - Toast educativo aparece arriba: *"El router asignó el puerto 50001."*
   - Puntito sigue hacia el sitio
   - Al llegar al sitio, el sitio "destella"
3. Pausa breve (~500 ms)
4. Animación de vuelta:
   - Puntito sale del sitio con label `"YouTube → 200.45.10.15:50001"`
   - Llega al router, destella, el label se traduce a `"YouTube → 192.168.1.10:5000"`
   - Toast: *"El router consultó la tabla NAT y supo a quién devolverle la respuesta."*
   - Puntito llega al dispositivo
5. Se agrega fila a la tabla NAT (animación de entrada)
6. Botón "Siguiente viaje →"

**Para viajes manuales (3-5):**
1. Igual setup inicial.
2. Al hacer click en "▶️ Iniciar conexión", el paquete viaja hasta el router y se detiene allí.
3. Aparece modal/panel sobre el router:

   > **El router necesita asignar un puerto traducido. ¿Cuál usarías?**
   > [opción 1] [opción 2] [opción 3]
   > 💡 Pista: *...*

4. **Si elige correcto:** glow pink, sigue la animación normal, se agrega fila a la tabla NAT.
5. **Si elige incorrecto:**
   - Si era un puerto **ya usado**: toast rojo suave *"Ese puerto ya lo está usando [dispositivo X]. El router no puede asignarlo dos veces a la vez."*
   - Si era un puerto **conocido (≤1024)**: toast *"Los puertos del 0 al 1023 son puertos reservados (web, mail, etc.). El router elige puertos altos."*
   - Card vuelve, `G.errores++; G.sinErrores = false`, se permite reintentar.

### Tabla NAT visible

Se renderiza al lado/debajo del router. Va creciendo viaje a viaje:

| # | IP privada origen | Puerto origen | IP pública traducida | Puerto traducido | Destino |
|---|---|---|---|---|---|
| 1 | 192.168.1.10 | 5000 | 200.45.10.15 | 50001 | YouTube |
| 2 | 192.168.1.11 | 4500 | 200.45.10.15 | 50002 | WhatsApp |
| ... | | | | | |

Cada fila nueva aparece con animación de entrada (slide-in desde la derecha + glow pink).

### Cierre de R4

Al completar los 5 viajes → **modal pedagógico de cierre**:

> 🎉 **¡Acabás de simular PAT!**
> Con UNA sola IP pública (`200.45.10.15`), 4 dispositivos pudieron usar internet al mismo tiempo gracias a los **puertos**.
>
> Eso es exactamente lo que está haciendo el router de tu casa **ahora mismo**.

→ Botón "Última ronda →" pasa a R5.

---

## 9. Ronda 5 — Completar la Tabla NAT

**Duración objetivo:** ~1-2 min
**Mecánica:** Se muestra una tabla NAT con celdas vacías. El alumno arrastra los valores correctos a su lugar.

### Datos

```js
// Tabla parcial — el alumno tiene que completar lo que falta
const R5_TABLA = [
  { ipPriv: "192.168.1.10", puertoOrig: 5000, ipPub: "200.45.10.15", puertoTrad: 50001, destino: "YouTube" },
  { ipPriv: "192.168.1.20", puertoOrig: 4800, ipPub: "200.45.10.15", puertoTrad: 50002, destino: "WhatsApp" },
  { ipPriv: "192.168.1.30", puertoOrig: 6100, ipPub: "200.45.10.15", puertoTrad: 50003, destino: "Twitch" },
  { ipPriv: "192.168.1.40", puertoOrig: 7000, ipPub: "200.45.10.15", puertoTrad: 50004, destino: "Google" }
];

// Celdas vacías a completar (mezcla de tipos de datos):
const R5_CELDAS_VACIAS = [
  { fila: 0, campo: "puertoTrad" },   // 50001
  { fila: 1, campo: "ipPriv" },       // 192.168.1.20
  { fila: 2, campo: "destino" },      // Twitch
  { fila: 3, campo: "puertoOrig" }    // 7000
];
```

### UI

- Tabla NAT renderizada con 4 filas. Cada celda vacía tiene un borde dashed pink y dice "?".
- Abajo de la tabla: un pool con 4 "fichas" arrastrables, una por cada celda vacía. Las fichas están **mezcladas**.
- Mobile: tap en ficha → tap en celda destino.
- Feedback igual que R2/R3 (verde al acertar, rojo suave al errar).

### Criterio de pase

Al completar las 4 celdas → **fin del juego** → modal de resultados.

---

## 10. Modal de resultados (final del juego)

Usa la estructura ya existente en `shared.css` + función `showResults()` de `shared.js`.

```js
const tiempoFinal = (G.tiempoFinal - G.tiempoInicio) / 1000; // en segundos
const med = calcularMedalla(tiempoFinal);

showResults({
  titulo: "¡TP5 completado!",
  tiempo: formatTime(tiempoFinal),
  medalla: med.medalla,
  nombreMedalla: med.nombre,
  colorMedalla: med.color,
  mensaje: med.msg,
  sinErrores: G.sinErrores,        // estrella extra si true
  tags: ["Enrutamiento", "NAT", "PAT"]
});

// Persistir mejor tiempo
const bestKey = "redes_best_tp5";
const best = parseFloat(localStorage.getItem(bestKey) || "Infinity");
if (tiempoFinal < best) localStorage.setItem(bestKey, tiempoFinal);

// Confetti
launchConfetti();
```

---

## 11. Persistencia (localStorage)

```js
// Clave del mejor tiempo personal
const STORAGE_KEY = "redes_best_tp5";

// Al completar el juego, comparar tiempoFinal con el guardado
// y actualizar si es mejor (menor).
```

---

## 12. Estilo visual específico del TP5 (tp5.css)

### Variables locales

```css
:root {
  --tp5-accent: #f472b6;          /* pink */
  --tp5-accent-glow: rgba(244, 114, 182, 0.4);
  --tp5-accent-soft: rgba(244, 114, 182, 0.15);
}
```

### Elementos clave a estilar

- `.tp-tag-5` → fondo `--tp5-accent`, texto blanco
- `.game-header h1` → color `--tp5-accent`
- `.router` → card grande con borde pink, glow al recibir paquete
- `.dispositivo`, `.sitio` → cards con icono + IP/nombre, glow pink cuando están activas
- `.paquete` → círculo de 16px con label flotante, position: absolute, transition: all 1.5s ease-in-out
- `.tabla-nat tbody tr.nueva` → animación slide-in + glow pink (1s)
- `.opciones-puerto button` → cards de opción para los viajes manuales, hover con glow pink

### Animación del paquete

```css
.paquete {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--tp5-accent);
  box-shadow: 0 0 12px var(--tp5-accent-glow);
  transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.paquete .label {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--surf2);
  border: 1px solid var(--tp5-accent);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 11px;
  font-family: 'Manrope', monospace;
  white-space: nowrap;
}
```

La animación se ejecuta moviendo el elemento con `transform: translate(x, y)` en JS, calculando las coordenadas relativas del router/dispositivo/sitio destino.

---

## 13. Consideraciones mobile-first

- **R4 simulador**: en pantallas < 768px, layout vertical (dispositivos arriba, router al medio, sitios abajo). La animación del paquete va de arriba hacia abajo en lugar de izquierda a derecha.
- **Tabla NAT** en mobile: scroll horizontal si no entra, o reducir columnas a las esenciales (ej. ocultar columna "Destino" en muy pequeñas).
- **Botones grandes** (mínimo 44×44 px touch target).
- **Texto legible**: 14-16px mínimo en mobile.

---

## 14. Checklist final de implementación

- [ ] Archivos creados: `games/tp5/index.html`, `tp5.css`, `tp5.js`
- [ ] Card del TP5 visible en el menú principal (`index.html` raíz) con color pink, debería ya estar — verificar
- [ ] 5 rondas implementadas y encadenadas correctamente
- [ ] Timer arranca al primer tap, no antes
- [ ] Simulador PAT: 5 viajes en orden, 2 auto + 3 manuales
- [ ] Tabla NAT crece con animación slide-in en cada viaje
- [ ] Animación del paquete fluida (~1.5s por tramo) con label que cambia al pasar por el router
- [ ] Mensajes educativos en cada toast/cartel (no solo "correcto/incorrecto")
- [ ] Sistema de medallas usando `calcularMedalla()` de shared.js
- [ ] Estrella "sin errores" si `G.sinErrores === true`
- [ ] localStorage: clave `redes_best_tp5`
- [ ] Confetti al completar
- [ ] Botón "← Menú" en header funciona desde cualquier ronda (con confirm si está jugando)
- [ ] Responsive verificado en mobile (< 400px de ancho)
- [ ] Touch + mouse funcionan en drag & drop de todas las rondas

---

## 15. Mensajes pedagógicos clave (NO inventar otros)

Estos mensajes son **el corazón pedagógico** del TP. Usarlos textualmente:

**Al asignar el primer puerto traducido (viaje 1):**
> "El router asignó el puerto **50001** a la conexión del celular. Así sabe a quién devolverle la respuesta cuando vuelva."

**Al asignar el segundo puerto distinto (viaje 2):**
> "Otro puerto (**50002**), distinto del anterior. Cada conexión necesita su propio puerto para que el router no las confunda."

**Al elegir un puerto ya usado (error en viajes manuales):**
> "Ese puerto ya está siendo usado por **[dispositivo]**. El router no puede asignarlo dos veces al mismo tiempo."

**Al elegir un puerto bajo (error en viajes manuales):**
> "Los puertos del 0 al 1023 están reservados para servicios conocidos (web=80, mail=25, etc.). El router siempre elige puertos altos para no chocar."

**Al ver el segundo viaje del mismo dispositivo (viaje 5 — celular abre otra conexión):**
> "El celular ya tenía una conexión abierta a YouTube. Ahora abre otra hacia Google: el router le asigna un **nuevo puerto** distinto, así el celular puede tener varias páginas abiertas al mismo tiempo."

**Cierre de la R4:**
> "🎉 Acabás de simular **PAT**. Con UNA sola IP pública, 4 dispositivos pudieron usar internet al mismo tiempo gracias a los **puertos**. Eso es exactamente lo que está haciendo el router de tu casa ahora mismo."

---

*Spec listo para Claude Code. Implementar respetando las convenciones del CLAUDE.md y manteniendo la estética del resto de los TPs.*
