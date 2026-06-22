---
name: invitation-design
description: Cómo construir una plantilla nueva de invitación digital (baby shower, boda, cumpleaños) consistente con el catálogo existente — paletas, tipografías, estructura, e integración con core/features/. Usar cuando se diseñe o adapte una plantilla en templates/.
---

# Diseño de plantillas de invitaciones digitales

Patrones reales observados en las 3 plantillas existentes (`01-dino`, `02-stork`,
`03-space`) después de su migración al esquema estándar. Úsalo como referencia
al construir la plantilla 04 en adelante, no como una regla rígida — cada
plantilla sigue siendo su propio proyecto Vite visualmente independiente
(ver `docs/PLAN_PROYECTO_INVITACIONES.md` sección 2.1).

## 1. Stack base de cada plantilla

- React 19 + Vite + TailwindCSS 4 + Motion (Framer Motion).
- TypeScript siempre.
- `@supabase/supabase-js` si la plantilla usa muro de deseos, RSVP, o necesita
  leer su evento desde `eventos.datos`.
- Tailwind 4 usa el bloque `@theme` en `src/index.css` para registrar fuentes
  y colores custom — no un `tailwind.config.js` tradicional.

## 2. Tipografías recurrentes

Definidas en `@theme` dentro de `src/index.css`, importadas desde Google Fonts
con `@import url(...)` en la primera línea del archivo.

| Fuente | Tono / uso observado |
|---|---|
| **Cormorant Garamond** | Elegante, romántico. Usada como fuente base en Dino y Stork (texto de cuerpo, fechas, mensajes). |
| **Playfair Display** | Lujo/editorial. Usada en Dino y Space para títulos. |
| **Fredoka** / **Quicksand** | Tierno, redondeado, infantil. Stork las usa para títulos de sección (`font-fredoka`) y cuerpo alterno. Space usa Quicksand como fuente sans base. |
| **Great Vibes** / **Pinyon Script** | Cursiva decorativa para acentos puntuales (nombres, firmas), no para texto largo. |
| **Montserrat** | Sans-serif de respaldo para UI/labels en Dino. |

Guía rápida al elegir para una plantilla nueva:
- Boda / evento formal → Cormorant Garamond o Playfair Display como base.
- Baby shower / cumpleaños infantil → Fredoka o Quicksand como base, con un
  serif elegante solo para el nombre del homenajeado.
- Evita mezclar más de 2-3 familias por plantilla.

## 3. Paletas de color

No hay una paleta global única — cada plantilla define la suya en `@theme`
con `--color-*`, alineada a `paletaColores` del esquema (`InvitationData`).
Ejemplos reales:

- **Dino** (`azul-pastel` / nórdico): `--color-nordic-blue: #A5BFD2`,
  `--color-deep-blue: #4A5D6B`, `--color-bone-white: #F9F8F4`. Dorado de acento:
  `#C3A66A`.
- **Stork** (cielo/cigüeña): tonos `sky-*` de Tailwind directamente (sin
  registrar custom colors), fondo de rayas verticales suaves
  (`.vertical-stripes-soft`).
- **Space** (espacio/cohete): fondo oscuro `#1a0a3a`, contraste con blancos y
  acentos cálidos para cohetes/estrellas.

Cuando una plantilla nueva declare `paletaColores` en el formulario de
cliente, mapea ese slug a un set de `--color-*` concreto al construirla — no
hace falta un sistema de tokens compartido todavía (ver sección 2.2 del plan:
se reevalúa con 8-10 plantillas).

## 4. Estructura típica de una plantilla

```
templates/0X-nombre/
├── .env / .env.example       (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_MAPBOX_TOKEN si aplica)
├── src/
│   ├── types.ts              (tipo local + InvitationData + fromInvitationData(data))
│   ├── lib/
│   │   ├── supabase.ts       (cliente, lee de import.meta.env)
│   │   └── loadEvento.ts     (fetch a eventos por ?evento=, fallback a defaults)
│   ├── hooks/                (copias de core/features/* que la plantilla usa)
│   ├── components/
│   └── App.tsx / vite-env.d.ts
```

Flujo de pantalla observado en las 3 plantillas (con variaciones visuales):

1. **Intro / animación de entrada** — sobre interactivo (Dino), cigüeña
   animada con texto (Stork), cohete (Space). Dura unos segundos o requiere un
   clic, luego transiciona a la tarjeta principal.
2. **Tarjeta principal** — nombre del homenajeado, fecha, lugar, vestimenta.
3. **Countdown** — cuenta atrás hacia la fecha del evento.
4. **Muro de deseos y/o RSVP** — si la plantilla los activa (`features.muroDeseos`,
   `features.rsvp` en `InvitationData`).
5. **Footer** — agradecimiento / firma.

## 5. Cómo integrar `core/features/` en una plantilla nueva

Los hooks de `core/features/` no se importan entre proyectos Vite (cada
plantilla es su propio paquete npm independiente) — se **copian** a
`src/hooks/` de la plantilla nueva. `core/features/` es la fuente canónica;
si corriges un bug ahí, propágalo a las copias ya hechas en plantillas
existentes.

```bash
mkdir -p templates/0X-nueva/src/hooks
cp core/features/muro-deseos/useMuroDeseos.ts templates/0X-nueva/src/hooks/
cp core/features/rsvp/useRsvp.ts templates/0X-nueva/src/hooks/
cp core/features/countdown/useCountdown.ts templates/0X-nueva/src/hooks/
```

Uso mínimo dentro de un componente:

```tsx
import { supabase } from "../lib/supabase";
import { useMuroDeseos } from "../hooks/useMuroDeseos";
import { useRsvp } from "../hooks/useRsvp";
import { useCountdown } from "../hooks/useCountdown";

const eventoId = getEventoIdFromUrl(); // de lib/loadEvento.ts

const { wishes, addWish } = useMuroDeseos(supabase, eventoId);
const { confirmations, submitRsvp } = useRsvp(supabase, eventoId);
const timeLeft = useCountdown(`${details.fecha}T${details.hora}:00`);
```

`addWish` y `submitRsvp` ya hacen el insert real en Supabase — no dupliques
esa lógica a mano en el componente.

### Carga de datos del evento (`lib/loadEvento.ts`)

Cada plantilla debe tener su propio `loadEvento.ts` (se copia y adapta, no se
importa desde `core/`, porque el tipo de retorno depende de la forma local de
detalles de cada plantilla). Patrón:

1. Lee `?evento=slug` de la URL (default a un evento demo).
2. `select("datos, pagado, aprobado")` de `eventos` por `id`.
3. Si no hay fila, usa los valores por defecto hardcodeados de la plantilla
   (para que siga funcionando standalone/demo).
4. Mapea `datos` (JSONB = `InvitationData`) a la forma local con un
   `fromInvitationData()` en `types.ts`.

### Marca de agua y aprobación

Toda plantilla nueva debe:
- Mostrar una marca de agua tipo "VISTA PREVIA" superpuesta cuando
  `pagado === false` (ver `InvitationCard.tsx` de Dino para el patrón de
  overlay con `z-[999]` y `pointer-events-none`).
- No renderizar la invitación si `aprobado === false` — mostrar un mensaje
  simple en su lugar.

## 6. Errores a evitar (ya identificados y corregidos en este catálogo)

1. **Credenciales hardcodeadas en el código fuente.** Supabase y Mapbox
   siempre vía `import.meta.env.VITE_*`, nunca como string literal.
2. **`localStorage` para datos que deben ser compartidos entre invitados.**
   Si un dato lo necesita ver *cualquier* invitado (muro de deseos, RSVP),
   no puede vivir en el navegador de quien lo escribió — va a Supabase.
   Esto rompió tanto a Stork (libro de firmas) como a Space (RSVP) antes de
   la migración.
3. **Datos de un cliente específico "quemados" en el código del diseño.**
   Nombres, fechas, direcciones reales de un cliente no van directo en JSX —
   van en `eventos.datos`, con un objeto de fallback solo para que la
   plantilla funcione como demo si no hay evento en la base de datos.
4. **RSVP que solo abre un link de WhatsApp sin persistir nada.** El link de
   WhatsApp es un complemento para avisar al organizador, no la fuente de
   verdad — siempre debe ir acompañado de un insert real en
   `confirmaciones_rsvp` vía `useRsvp`.
5. **Botones de borrado de mensajes/RSVP visibles al invitado.** La
   moderación (ocultar mensajes, gestionar confirmaciones) es responsabilidad
   del dashboard de administración (Fase 6), no de la plantilla pública.
