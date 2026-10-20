# Boda María & Juanca — Guía de trabajo

## Sitio en producción
- **URL cliente:** https://boda-maria-juanca.celebrarte.com.co
- **Netlify site ID:** `c4c475ff-4cb6-4294-91f5-c6881832abfc`
- **Código fuente:** `templates/08 - Boda-campestre/`
- **EVENTO_ID Supabase:** `maria-juanca-2026`

---

## Cómo crear una nueva URL de invitado

### 1. Abrir el Dashboard
`templates/08 - Boda-campestre/src/Dashboard.tsx`

### 2. Agregar entrada al array GUESTS
El array empieza en la línea ~16. Cada entrada sigue este patrón:

```ts
{ 
  nombre: 'Nombre Invitado', 
  tel: '573XXXXXXXXX',   // número con código país, sin +
  url: 'https://boda-maria-juanca.celebrarte.com.co/slug-del-invitado', 
  wa: 'https://wa.me/573XXXXXXXXX?text=https://boda-maria-juanca.celebrarte.com.co/slug-del-invitado'
},
```

**Reglas para el slug (parte de la URL):**
- Todo en minúsculas
- Espacios → guiones `-`
- `&` entre dos nombres → `-y-` (ej: `dani-y-santi`)
- Si une con "e" → `-e-` (ej: `camilo-e-isa`)
- Tildes → sin tilde (ej: `Margara → margara`)
- Si no tiene teléfono aún: dejar `tel: ''` y `wa: ''`

**Ejemplos reales del proyecto:**
```ts
{ nombre: 'Dani & Santi',   tel: '', url: 'https://boda-maria-juanca.celebrarte.com.co/dani-y-santi',   wa: '' },
{ nombre: 'Margara y Jose', tel: '', url: 'https://boda-maria-juanca.celebrarte.com.co/margara-y-jose', wa: '' },
```

### 3. Cómo funciona la URL en la invitación
El `App.tsx` lee el path de la URL y lo usa como nombre del invitado:
```ts
const pathSlug = decodeURIComponent(window.location.pathname.replace(/^\//, '').trim());
const rawGuest = (pathSlug && pathSlug !== 'dashboard') ? pathSlug : 'Tía Gladys';
```
Es decir: `boda-maria-juanca.celebrarte.com.co/dani-y-santi` → muestra "dani-y-santi" como nombre. El slug del URL es lo que ve el invitado, así que debe verse bien escrito o amigable.

### 4. Build y deploy al sitio del cliente
```bash
cd "templates/08 - Boda-campestre"
npm run build
netlify deploy --prod --dir=dist --site c4c475ff-4cb6-4294-91f5-c6881832abfc
```

> ⚠️ NO usar el deploy sin `--site`, porque hay otro sitio de plantilla pública (`750c7daa-...`) que es diferente al sitio del cliente.

---

## RSVP y confirmaciones (Supabase)

- **Proyecto Supabase:** `sljydxuogmkdlznwwzms`
- **URL:** `https://sljydxuogmkdlznwwzms.supabase.co`
- **Tabla:** `rsvp_responses`
- **Columnas clave:** `nombre`, `asiste` (bool), `evento_id`
- La función `saveRsvp` usa **upsert** con `onConflict: 'nombre,evento_id'` para evitar duplicados.

### Ver respuestas
Dashboard en: `https://boda-maria-juanca.celebrarte.com.co/dashboard`

### Eliminar una respuesta mal creada (requiere service role key)
```bash
curl -X DELETE \
  "https://sljydxuogmkdlznwwzms.supabase.co/rest/v1/rsvp_responses?nombre=eq.Nombre%20Exacto&evento_id=eq.maria-juanca-2026" \
  -H "apikey: SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"
```
> La service role key está en `admin-dashboard/.env` — nunca usar la anon key para DELETE (bloqueada por RLS).

---

## Estructura de archivos clave

```
templates/08 - Boda-campestre/
├── src/
│   ├── App.tsx          ← Invitación principal (lógica de URL/guest)
│   ├── Dashboard.tsx    ← Lista GUESTS + vista de confirmaciones
│   └── supabase.ts      ← Config Supabase + EVENTO_ID
├── dist/                ← Build para deploy
└── deploy-template.ps1  ← Script para deploy de la PLANTILLA PÚBLICA (no el cliente)
```

---

## Checklist al agregar invitados nuevos

- [ ] Agregar entrada en `Dashboard.tsx` → array `GUESTS`
- [ ] Verificar que el slug en la URL sea legible y correcto
- [ ] `npm run build` dentro de `templates/08 - Boda-campestre`
- [ ] Deploy con el site ID correcto del cliente (`c4c475ff-...`)
- [ ] Confirmar en el dashboard que aparece al final de la lista
- [ ] El campo "Confirmación" debe aparecer vacío hasta que el invitado responda
