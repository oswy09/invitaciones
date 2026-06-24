# Plan maestro: Sistema de invitaciones digitales personalizables

## Contexto para Claude Code

Este documento es la guía completa para construir un sistema que permite producir
invitaciones digitales personalizadas (baby showers, cumpleaños, bodas, etc.) a
partir de un catálogo de plantillas reutilizables. El negocio es recurrente:
se espera manejar 15+ clientes nuevos por mes, con un catálogo que crecerá de
3 a 15-20 plantillas con el tiempo.

**Lee este documento completo antes de escribir código.** Está dividido en fases.
No se debe avanzar a una fase sin completar y validar la anterior.

---

## 0. Estado actual (punto de partida real)

Existen 3 plantillas ya construidas, hechas con React 19 + Vite + TailwindCSS 4 +
Motion (Framer Motion). Dos de ellas (`Dino` y `Space`) se originaron en Google AI
Studio; la tercera (`Stork`) parece haberse desarrollado de forma similar. Las 3
están en TypeScript.

### Resumen de cada una

| Plantilla | Tema visual | Datos del evento | Backend / persistencia | Mapa |
|---|---|---|---|---|
| **Dino** | Baby shower dinosaurios, sobre interactivo | Objeto tipado en `types.ts` (`BabyShowerDetails`) | **Supabase** (tablas `eventos`, `muro_deseos`, `confirmaciones_rsvp`), multi-evento por `evento_id` | Mapbox GL |
| **Stork** | Baby shower cigüeña/nube, intro animada | **Hardcodeado directamente en JSX** dentro de `App.tsx` | `localStorage` del navegador (NO sirve para producción: cada invitado solo ve lo que se guardó en su propio navegador) | Mapbox GL |
| **Space** | Baby shower espacio/cohete | Objeto tipado en `types.ts` (`InvitationDetails`), con estructura distinta a Dino (`parents.mother/father` anidado, `giftRegistry` como array) | Ninguno — todo en memoria de React, se pierde al recargar | No tiene |

### Problemas detectados que hay que resolver

1. **Inconsistencia de esquema de datos**: las 3 plantillas representan el mismo
   tipo de información (nombre del bebé, padres, fecha, lugar, vestimenta, registro
   de regalos) con 3 formas distintas. Esto bloquea cualquier automatización
   (formulario único, generación de JSON, dashboard).
2. **Stork no tiene persistencia real**: usa `localStorage`, que no funciona para
   un muro de deseos/RSVP público (cada invitado vería solo sus propios datos,
   no los de los demás). Hay que migrarla a Supabase.
3. **Credenciales hardcodeadas en el código fuente**:
   - `src/lib/supabase.ts` (Dino) tiene la URL y la clave anónima de Supabase
     escritas directamente en el archivo.
   - `MapModal.tsx` / `BabyShowerMap.tsx` (Dino y Stork) tienen el token de
     Mapbox (`pk.eyJ1Ijoib3N3YWwwMDki...`) escrito directamente en el archivo,
     **el mismo token repetido en ambas plantillas**.
   - Esto debe migrarse a variables de entorno (`.env`) para que el mismo patrón
     se pueda reutilizar en las próximas 17 plantillas sin pegar credenciales
     cada vez, y para poder rotar el token de Mapbox si hace falta sin tocar código.
4. **Datos de un cliente específico ya "quemados" en el código**: las 3 plantillas
   actuales tienen los datos del baby shower de "Thomas" (nombre real de cliente)
   mezclados con el código del diseño. Hay que separar esto limpiamente.

---

## 1. Objetivo del sistema completo

Permitir que, dado un cliente que quiere una invitación:

1. El cliente elige una plantilla del catálogo (15-20 diseños distintos:
   baby shower dinosaurios, espacio, cigüeña, y los que se vayan agregando —
   bodas, cumpleaños, etc. en el futuro).
2. El cliente llena un formulario web con sus datos (nombres, fecha, lugar, fotos,
   paleta de colores, textos personalizados).
3. Al enviar, se genera automáticamente una invitación personalizada, visible en
   una preview con marca de agua (sin pagar todavía).
4. El cliente paga (vía link externo de pago, ej. Wompi / Mercado Pago).
5. El operador (tú) ves el pedido en un dashboard de administración, confirmas
   el pago, y apruebas — en ese momento se quita la marca de agua del mismo link
   (no se genera un link nuevo).
6. Se envía el link final al cliente (por WhatsApp, manualmente por ahora).
7. Si la plantilla tiene **muro de deseos** y/o **RSVP**, los invitados pueden
   escribir mensajes y confirmar asistencia en tiempo real, sin necesidad de
   recargar la página — visibles instantáneamente, sin moderación previa (pero
   el operador puede borrar mensajes después desde el dashboard si hace falta).

### Lo que NO se automatiza todavía (a propósito, fase futura)

- El pago no está integrado en el flujo (se usa un link externo de pasarela).
- La aprobación final y el envío del link siguen siendo manuales (control de calidad).
- No hay generación automática de plantillas nuevas — cada plantilla nueva del
  catálogo se sigue diseñando a mano (con Claude Code, Antigravity o AI Studio).

---

## 2. Arquitectura general

### 2.1 Principio de organización: plantillas independientes + piezas compartidas

Las plantillas son **visualmente independientes entre sí** (cada diseño es su
propio proyecto de React, sin un sistema de componentes visuales compartido
forzado). Lo que SÍ se comparte entre plantillas son las **features dinámicas
de backend** que se repiten: muro de deseos, RSVP, countdown, mapa. Esas se
construyen una sola vez como utilidades/hooks reutilizables y cada plantilla
las "enchufa" según las necesite.

```
invitaciones/
├── core/                              ← compartido entre plantillas
│   ├── supabase-client/               (cliente Supabase configurado vía .env)
│   ├── features/
│   │   ├── muro-deseos/               (hook + lógica de guardar/leer mensajes)
│   │   ├── rsvp/                      (hook + lógica de confirmaciones)
│   │   └── countdown/                 (hook reutilizable de cuenta atrás)
│   └── schema/
│       └── invitation-schema.ts       (esquema de datos estándar, ver sección 3)
│
├── templates/
│   ├── 01-dino/                       ← ex Dino, migrada al nuevo esquema
│   ├── 02-stork/                      ← ex Stork, migrada a Supabase + esquema
│   ├── 03-space/                      ← ex Space, migrada al nuevo esquema
│   └── (futuras: 04-..., 05-..., hasta 15-20)
│
├── admin-dashboard/                   ← app separada, solo para el operador
│   ├── (login, lista de pedidos, preview, aprobar pago, moderar mensajes)
│
├── client-form/                       ← app separada, cara al cliente final
│   ├── (catálogo, formulario de personalización, preview con marca de agua)
│
├── supabase/
│   └── migrations/                    (SQL versionado, ya no un solo .sql suelto)
│
└── docs/
    └── (este documento, esquema de datos, guía de skill de diseño)
```

Cada carpeta bajo `templates/` es su propio proyecto Vite con su propio
`package.json`, pero todas comparten:
- El mismo esquema de datos de entrada (sección 3).
- El mismo cliente de Supabase configurado vía variables de entorno (no
  hardcodeado).
- Las mismas utilidades de `core/features/` cuando aplique.

### 2.2 Por qué NO un monorepo con componentes visuales compartidos (todavía)

Con solo 3 plantillas y diseños muy distintos entre sí, forzar componentes de
UI compartidos (ej. una sola `<TarjetaInvitacion />` genérica) generaría
componentes con demasiadas variantes/props antes de tener suficientes casos
reales para saber qué de verdad se repite. Se reevalúa esta decisión cuando
el catálogo llegue a 8-10 plantillas y los patrones sean obvios.

---

## 2.3 Hosting y despliegue: Netlify (cuenta Legacy existente)

Se usará **Netlify** para publicar cada invitación generada, conectado a GitHub
para despliegue automático en cada push (sin subida manual de `dist/`).

### Detalle importante de la cuenta a usar

La cuenta de Netlify ya existente del operador es de tipo **Free Legacy**
(creada antes del 4 de septiembre de 2025), lo cual es relevante porque usa un
modelo de límites distinto al de las cuentas nuevas:

- **Legacy** (la actual): límites separados de **100 GB de bandwidth/mes** y
  **300 minutos de build/mes**, sin concepto de "créditos".
- **Credit-based** (cuentas nuevas desde sept. 2025): un pool de 300 créditos/mes
  compartido entre bandwidth, builds y compute, que se agota mucho más rápido
  con el volumen esperado (15+ invitaciones/mes).

Uso real verificado al momento de planear este proyecto: ~38-78 MB de bandwidth
mensual, 0 minutos de build usados, 32 de 500 proyectos — margen amplio para
absorber el volumen de invitaciones sin acercarse a los límites de Legacy.

**Regla a seguir: NO usar el botón "Change team plan" hacia los planes nuevos
(Free/Personal/Pro de créditos) en esta cuenta.** Ese cambio es irreversible
(no se puede volver a Legacy después). Si en el futuro se necesita más
capacidad que la del plan Free Legacy, la ruta es subir a **Legacy Pro**
(sigue dentro del modelo antiguo, sin créditos), no migrar al modelo nuevo.

### Cómo monitorear el consumo

Panel: Netlify → **Usage & billing → Account usage insights**, secciones
Bandwidth y Builds. Revisar periódicamente al ir agregando clientes para
detectar con datos reales (no estimaciones) cuándo se acerca a los límites
de Legacy y si hace falta subir a Legacy Pro.

### Estrategia de sitios — DECISIÓN FINAL: una plantilla publicada = N clientes por ruta

Se descarta la idea de crear un "site" de Netlify nuevo por cada cliente. En su
lugar, **cada plantilla se publica una sola vez** en Netlify (ej.
`dino.tudominio.com`), y cada cliente nuevo es simplemente **una fila nueva en
la tabla `eventos` de Supabase**, identificada por su `eventoId`. La plantilla,
ya desplegada, lee el `eventoId` desde la ruta de la URL (ej.
`dino.tudominio.com/boda-juan-maria-2026`) y consulta Supabase para renderizar
los datos correspondientes a ese cliente — el mismo patrón que **ya implementa
Dino actualmente**, solo que el `eventoId` debe pasar a leerse de la URL en
lugar de un valor fijo en `types.ts`.

**Implicaciones de esta decisión (importante, afecta varias fases):**

- **No se requiere integración con la API/CLI de Netlify para crear sitios
  programáticamente.** Publicar un cliente nuevo = escribir un registro en
  Supabase, no hacer un deploy. Esto elimina ese requisito de la Fase 5.
- **El consumo de build minutes de Netlify queda desacoplado del número de
  clientes.** Solo se gastan minutos de build cuando se publica o actualiza
  una *plantilla*, no cuando se crea un cliente nuevo — refuerza aún más el
  margen calculado en la sección 2.3.
- **Cada plantilla debe implementar lectura del `eventoId` desde la URL**
  (ej. con un router o leyendo `window.location.pathname`), reemplazando el
  uso de un valor fijo (`DEFAULT_SHOWER_DETAILS` en Dino) — este es un
  requisito técnico nuevo a agregar en la Fase 3 (migración de plantillas).
- El dominio final de cada plantilla puede vivir bajo un dominio propio del
  operador (ej. `dino.tudominio.com`) apuntado por DNS a Netlify, o bajo el
  subdominio gratuito de Netlify (`dino-template.netlify.app`) mientras no se
  tenga dominio propio configurado.

### Configuración técnica requerida: SPA redirects en Netlify

Para que el enrutamiento por `eventoId` (sección anterior) funcione, cada
plantilla publicada en Netlify necesita un archivo de configuración que le
indique a Netlify que sirva siempre `index.html` sin importar la ruta
solicitada — de lo contrario, visitar directamente
`dino.tudominio.com/boda-juan-maria-2026` devolvería un error 404, ya que
Netlify buscaría un archivo físico con ese nombre y no lo encontraría (es una
Single Page Application: el enrutamiento real lo resuelve React en el
navegador, no Netlify).

Esto se configura **una sola vez por plantilla**, al momento de publicarla, y
a partir de ahí cualquier `eventoId`/cliente nuevo de esa plantilla funciona
sin tocar Netlify de nuevo. Dos formas equivalentes de configurarlo:

**Opción 1 — archivo `_redirects`** (en la carpeta `public/` del proyecto, se
copia automáticamente al `dist/` en el build):
```
/*    /index.html   200
```

**Opción 2 — archivo `netlify.toml`** (en la raíz del proyecto):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Se debe agregar este archivo a cada una de las 3 plantillas existentes
durante la Fase 3 (migración), y a cualquier plantilla nueva que se cree en
el futuro — agregar este punto al skill de diseño (Fase 4) como un paso
obligatorio de toda plantilla nueva.

---

## 2.4 Estimación de capacidad: ¿cuántos clientes/mes soporta el plan Free Legacy?

Con la arquitectura de "una plantilla publicada, N clientes por ruta" (sección
2.3), el número de clientes mensuales deja de estar limitado por build minutes
(ya que publicar un cliente no consume build) y pasa a depender casi
exclusivamente del **bandwidth** generado por las visitas de los invitados.

Cálculo de referencia, con los parámetros reales de este negocio:

- ~50-60 invitados por evento (dato proporcionado).
- Estimando ~3 visitas por invitado en promedio (revisar, recordar fecha,
  reenviar) → ~150-180 visitas por cliente.
- Peso estimado por carga completa de página (HTML+CSS+JS+imágenes de una
  plantilla típica como Dino, con imágenes optimizadas): ~2-4 MB.
- Consumo estimado por cliente: ~150 visitas × 3 MB ≈ **450 MB por cliente**,
  durante toda la vida activa de esa invitación.

Con el límite de **100 GB/mes** del plan Free Legacy:

```
100,000 MB ÷ 450 MB por cliente ≈ ~220 clientes/mes en el límite teórico
```

Dejando margen de seguridad razonable (no usar el 100% del límite, dejar
espacio para picos de tráfico, plantillas más pesadas de lo estimado, fotos
subidas por clientes sin comprimir, etc.), una cifra prudente y "relajada"
para operar sin preocuparse del límite es de **hasta ~60 clientes nuevos al
mes**, considerando además que las invitaciones de meses anteriores también
siguen recibiendo tráfico residual mientras el evento no haya pasado.

Esta cifra debe confirmarse con datos reales una vez haya tráfico real (ver
sección 2.3, monitoreo en Usage & billing → Account usage insights), ya que
la estimación de peso por página es aproximada hasta que se mida con las
plantillas finales y fotos reales de clientes.

---

## 3. Esquema de datos estándar (la pieza más importante)

Este es el "contrato" entre el formulario de cliente, el backend, y cada
plantilla. Toda plantilla debe leer sus datos de personalización en esta forma,
sin excepción — así el formulario puede ser genérico y servir para las 20
plantillas futuras.

```typescript
// core/schema/invitation-schema.ts

export interface InvitationData {
  // Identificación
  eventoId: string;              // slug único, ej: "baby-shower-thomas-2026"
  templateId: string;            // qué plantilla usa, ej: "01-dino"
  pagado: boolean;                // controla si se muestra marca de agua

  // Datos del evento (genéricos, aplican a cualquier tipo de celebración)
  tituloEvento: string;          // ej: "Baby Shower de Thomas" / "Boda de Ana y Luis"
  nombresPrincipales: string[];  // ej: ["Thomas"] o ["Ana", "Luis"] — array, no string fijo
  anfitriones?: string;          // ej: "Sofía & Alejandro" (padres, padrinos, quien organiza)
  fecha: string;                 // ISO: "2026-07-05"
  hora: string;                  // "10:30"
  fechaTexto?: string;           // versión legible opcional: "Sábado, 4 de Julio de 2026"

  lugar: {
    nombre: string;
    direccion: string;
    mapUrl: string;              // Google Maps URL
  };

  vestimenta?: string;           // dress code, opcional
  mensajePersonalizado?: string; // texto libre que el cliente puede escribir

  registroRegalos?: {
    tienda: string;
    url?: string;
    codigo?: string;
    notaAlternativa?: string;
  }[];                            // array, no campos sueltos — soporta 1 o varias tiendas

  // Personalización visual
  paletaColores?: string;        // referencia a una paleta predefinida, ej: "azul-pastel"
  fotos?: string[];              // URLs de fotos subidas por el cliente

  // Contacto para RSVP por WhatsApp (si la plantilla lo usa)
  whatsappNumero?: string;

  // Features activas (declara qué módulos de core/features/ debe cargar la plantilla)
  features: {
    muroDeseos: boolean;
    rsvp: boolean;
    countdown: boolean;
    mapa: boolean;
    musica: boolean;
  };
}
```

### Notas de diseño del esquema

- `nombresPrincipales` es un array para que sirva tanto para "Thomas" (1 nombre)
  como para "Ana y Luis" (boda, 2 nombres) sin cambiar la forma del dato.
- `registroRegalos` es un array desde el inicio (aprendizaje directo de Space,
  que ya lo necesitaba así, contra Dino que tenía un solo string).
- Todo lo específico de una plantilla en particular que NO aplique a las demás
  (ej. un campo único de una plantilla muy especial) se guarda en un campo
  abierto `extra?: Record<string, any>` que cada plantilla puede leer a su
  manera, sin forzarlo en el esquema general.

Agregar al final de la interfaz:
```typescript
  extra?: Record<string, unknown>; // campos específicos de una plantilla puntual
```

---

## 3.1 ⚠️ Protocolo de seguridad: hay un cliente real en producción

La plantilla **Dino** ya está publicada en vivo para un cliente real
(evento `baby-shower-thomas`), con invitados activos escribiendo en el muro
de deseos y confirmando RSVP en este momento. Todo el trabajo de migración
debe respetar esto:

1. **Nunca desarrollar ni probar directamente contra el proyecto de Supabase
   de producción.** Crear un proyecto de Supabase nuevo (separado, plan gratis)
   exclusivamente para desarrollo. Todo el trabajo de las Fases 1-6 se hace
   apuntando a ese proyecto de prueba (vía `.env` de desarrollo), no al real.
2. **El código en el repositorio local/Git es independiente de lo que está
   publicado en vivo.** Modificar archivos en `templates/01-dino` no afecta al
   cliente real a menos que se vuelva a hacer build + deploy de esa carpeta a
   la URL donde el cliente está activo. Se puede migrar el código con
   total libertad mientras no se republique.
3. **Los cambios de esquema de base de datos planeados (sección 4) son
   aditivos**: agregar columnas nuevas (`datos JSONB`, `pagado`, `aprobado`,
   `oculto`) no borra ni renombra nada existente. Esto los hace seguros de
   aplicar eventualmente sobre la base de producción, siempre y cuando:
   - Se hayan probado primero completos en el proyecto de desarrollo.
   - Al aplicarlos en producción, se asignen valores que preserven el
     comportamiento actual para el evento ya activo, por ejemplo
     `pagado = true` y `aprobado = true` para la fila de `baby-shower-thomas`
     (ya que ese evento ya está aprobado y funcionando, no debe quedar oculto
     tras una marca de agua retroactiva).
4. **Antes de republicar la versión migrada de Dino** sobre la URL en vivo,
   confirmar manualmente que:
   - El `evento_id` del cliente activo sigue resolviendo los mismos datos.
   - El muro de deseos y RSVP existentes siguen visibles (no se perdió
     historial).
   - Las credenciales en el `.env` de producción apuntan al proyecto de
     Supabase **real** (no al de desarrollo) antes del deploy final.
5. Si hay dudas sobre si un cambio es seguro de aplicar en producción, optar
   por dejar ese evento específico corriendo con el código actual sin migrar,
   y aplicar el nuevo esquema solo para los eventos que se creen de ahora en
   adelante (ambas versiones pueden coexistir mientras se gana confianza).

---

## 4. Base de datos (Supabase) — generalizar lo que ya existe en Dino

Dino ya tiene la estructura correcta de base de datos multi-evento. Se debe
**generalizar esa misma estructura** (no crear una nueva desde cero) para que
sirva a todas las plantillas, agregando lo que falta para el flujo de
pago/aprobación y moderación.

```sql
-- Tabla de eventos / invitaciones (ya existe en Dino, se amplía)
CREATE TABLE IF NOT EXISTS eventos (
  id              TEXT PRIMARY KEY,       -- eventoId del esquema
  template_id     TEXT NOT NULL,          -- qué plantilla usa
  nombre_evento   TEXT NOT NULL,
  fecha_evento    DATE,
  datos           JSONB NOT NULL,         -- el InvitationData completo
  pagado          BOOLEAN DEFAULT FALSE,  -- controla marca de agua
  aprobado        BOOLEAN DEFAULT FALSE,  -- controla si el link es visible/activo
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Muro de deseos (ya existe en Dino, se mantiene igual)
CREATE TABLE IF NOT EXISTS muro_deseos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id        TEXT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nombre_invitado  TEXT NOT NULL,
  mensaje          TEXT NOT NULL,
  avatar           TEXT DEFAULT '🎉',
  oculto           BOOLEAN DEFAULT FALSE,  -- NUEVO: para moderación (borrado lógico)
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Confirmaciones RSVP (ya existe en Dino, se mantiene igual)
CREATE TABLE IF NOT EXISTS confirmaciones_rsvp (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id                   TEXT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nombre_invitado              TEXT NOT NULL,
  asiste                       BOOLEAN NOT NULL,
  num_adultos                  INTEGER DEFAULT 1,
  restricciones_alimentarias   TEXT DEFAULT '',
  restriccion_detalle          TEXT DEFAULT '',
  created_at                   TIMESTAMPTZ DEFAULT NOW()
);
```

### Cambios respecto al SQL original de Dino

- Se agrega la columna `datos JSONB` en `eventos`: ahí vive el `InvitationData`
  completo de cada cliente. Así el dashboard y el formulario pueden leer/escribir
  todo en un solo lugar, en vez de tener los datos repartidos entre el JSON
  estático del build y la base de datos.
- Se agregan `pagado` y `aprobado` en `eventos`, para soportar el flujo de
  marca de agua + aprobación manual descrito en la sección 1.
- Se agrega `oculto` en `muro_deseos`, para que el operador pueda "borrar" un
  mensaje (borrado lógico, no físico, por si hace falta revertir).
- Las políticas de RLS (Row Level Security) del SQL original se mantienen para
  lectura/escritura pública de `muro_deseos` y `confirmaciones_rsvp`. La tabla
  `eventos` debe tener su propia política: lectura pública solo si `aprobado = true`
  (o si se está viendo en modo preview con marca de agua), pero la escritura
  (crear/editar evento) debe quedar restringida solo al backend del formulario/admin,
  no abierta al público.

### Variables de entorno requeridas (en cada plantilla y en las apps de admin/form)

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_MAPBOX_TOKEN=...
```

Ninguna plantilla debe tener estos valores escritos directamente en el código.
Todas deben leerlos vía `import.meta.env.VITE_SUPABASE_URL`, etc.

---

## 5. Plan de migración de las 3 plantillas existentes

Esto se hace **antes** de construir el formulario/dashboard, porque ambos
dependen de que las plantillas ya lean datos desde el esquema estándar.

### 5.1 Dino (la más cercana al objetivo)
- [ ] Mover credenciales de Supabase y Mapbox de código a `.env`.
- [ ] Adaptar `BabyShowerDetails` al nuevo esquema `InvitationData` (especialmente
  `nombresPrincipales` como array y `registroRegalos` como array).
- [ ] Conectar la tabla `eventos.datos` como fuente de los datos, en lugar del
  objeto `DEFAULT_SHOWER_DETAILS` hardcodeado en `types.ts`.
- [ ] **Implementar lectura del `eventoId` desde la ruta de la URL** (ver
  sección 2.3 — decisión de "una plantilla, múltiples clientes por ruta"), en
  lugar de usar el valor fijo `eventoId: "baby-shower-thomas"` de
  `DEFAULT_SHOWER_DETAILS`. Si el `eventoId` de la URL no existe en la base de
  datos, mostrar una pantalla de error/no encontrado en vez de caer al valor
  por defecto.
- [ ] Implementar lectura de `pagado`/`aprobado` para mostrar/ocultar marca de agua.

### 5.2 Stork (requiere más trabajo — migrar de localStorage a Supabase)
- [ ] Extraer todos los datos hardcodeados de `App.tsx` (nombres, fecha, dirección,
  número de WhatsApp, textos) a un objeto que siga `InvitationData`.
- [ ] Reemplazar el uso de `localStorage` para el "Libro de Firmas" por las
  tablas `muro_deseos` / `confirmaciones_rsvp` de Supabase (usando el hook
  compartido de `core/features/muro-deseos` una vez exista).
- [ ] **Implementar lectura del `eventoId` desde la ruta de la URL** (mismo
  patrón que Dino, ver sección 2.3).
- [ ] Mover credenciales de Mapbox de código a `.env`.
- [ ] Verificar que el botón de "Confirmar por WhatsApp" siga funcionando como
  alternativa, pero que la fuente de verdad para el conteo de invitados sea
  Supabase, no solo el link de WhatsApp.

### 5.3 Space (más simple, no tiene backend que migrar, solo estructura de datos)
- [ ] Adaptar `InvitationDetails` al nuevo esquema `InvitationData` (aplanar o
  mapear `parents.mother/father` a `nombresPrincipales`/`anfitriones`, mapear
  `giftRegistry` directamente ya que el array coincide con el esquema general).
- [ ] **Implementar lectura del `eventoId` desde la ruta de la URL** (mismo
  patrón que Dino, ver sección 2.3). Como Space hoy no tiene backend, este
  paso implica también conectar por primera vez con Supabase para leer los
  datos del cliente correspondiente a esa ruta.
- [ ] Si se desea agregar muro de deseos/RSVP a esta plantilla (hoy no tiene
  ninguno persistente), conectar los hooks compartidos de `core/features/`.

### Orden de migración sugerido
Migrar primero **Dino** (ya está más cerca del objetivo, valida que el esquema
funciona con el caso más completo). Luego **Space** (sin backend que migrar,
más simple). Por último **Stork** (la más laboriosa, por el cambio de
`localStorage` a Supabase).

---

## 6. Construcción del skill de diseño para Claude Code

Una vez migradas las 3 plantillas, documentar en un skill (`.claude/skills/
invitation-design/SKILL.md`) los patrones reales observados, para que las
próximas 17 plantillas se construyan de forma consistente:

- Paletas de color usadas y cómo se nombran (relacionado a `paletaColores` del
  esquema).
- Tipografías recurrentes (se observan referencias a `font-cormorant`,
  `font-fredoka`, `font-quicksand` en las plantillas actuales — documentar
  cuál se usa para qué tono de evento).
- Estructura típica de una plantilla: pantalla de intro/animación de entrada →
  tarjeta principal → countdown → muro de deseos/RSVP → footer.
- Cómo se integra cada feature de `core/features/` en una plantilla nueva
  (ejemplo de código mínimo de integración).
- Errores a evitar (los que ya se identificaron: credenciales hardcodeadas,
  datos del cliente mezclados con el código del diseño, uso de `localStorage`
  para datos que deben ser compartidos entre todos los invitados).

---

## 7. Fases de construcción (orden de ejecución)

No avanzar a una fase sin terminar la anterior.

1. **Fase 0 — Higiene base**: Git en cada plantilla. Mover todas las
   credenciales a `.env` en las 3 plantillas actuales (independiente de
   cualquier otro cambio, esto se hace primero y ya).
2. **Fase 1 — Esquema y base de datos**: Crear `core/schema/invitation-schema.ts`.
   Actualizar el SQL de Supabase con los cambios de la sección 4 (columna
   `datos`, `pagado`, `aprobado`, `oculto`).
3. **Fase 2 — Features compartidas**: Construir `core/features/muro-deseos` y
   `core/features/rsvp` como hooks reutilizables que hablan con Supabase.
4. **Fase 3 — Migración de plantillas**: Migrar Dino, luego Space, luego Stork
   (sección 5), cada una usando las features de la Fase 2.
5. **Fase 4 — Skill de diseño**: Documentar patrones (sección 6).
6. **Fase 5 — Formulario de cliente**: App que genera un registro en `eventos`
   siguiendo el esquema (esto YA ES la "publicación" del cliente, ver sección
   2.3 — no se crea un sitio nuevo de Netlify, solo se escribe en la base de
   datos). El link final entregado al cliente es
   `[dominio-de-la-plantilla]/[eventoId]`. El formulario muestra la preview
   en vivo navegando a esa misma URL con `pagado=false` en la base de datos
   (controla la marca de agua, sin necesidad de un build/deploy distinto).
7. **Fase 6 — Dashboard de admin**: Lista de pedidos, preview, aprobar pago
   (cambia `pagado`/`aprobado` en la base de datos), moderar mensajes del
   muro de deseos (cambia `oculto`).
8. **Fase 7 (futuro, no ahora)**: Pago integrado en el formulario, auto-publish
   sin intervención manual.

---

## 8. Primera tarea concreta para Claude Code

Empezar por la **Fase 0**: en cada una de las 3 plantillas (`01_Dino`,
`02.Stork`, `03_space`):

1. Crear/completar el archivo `.env` (a partir de `.env.example`, agregando
   las variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `VITE_MAPBOX_TOKEN`).
2. Reemplazar en el código toda referencia hardcodeada a la URL/clave de
   Supabase (`src/lib/supabase.ts` en Dino) y al token de Mapbox
   (`BabyShowerMap.tsx` en Dino, `MapModal.tsx` en Stork) por
   `import.meta.env.VITE_...`.
3. Confirmar que cada plantilla sigue funcionando igual (`npm run dev`) después
   del cambio, antes de continuar a la Fase 1.
