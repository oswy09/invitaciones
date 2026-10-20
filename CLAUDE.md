# Celebrarte — Reglas del repositorio

## Estructura de carpetas

```
invitaciones/
├── apps/
│   ├── client-form/          # Landing celebrarte.com.co (Astro)
│   └── admin-dashboard/      # Dashboard global del operador (React + Node)
├── templates/                # Plantillas demo del catálogo — SIN datos reales
│   ├── 01-dino/
│   ├── 02-stork/
│   ├── 03-space/
│   ├── 04-moderna/
│   ├── 05-futbol/
│   ├── 06-boda-loving/
│   ├── 07-boda-cine/
│   ├── 08-boda-campestre/
│   ├── 09-boda-playa/
│   └── ...
├── clientes/                 # Un proyecto Vite por cliente activo
│   └── AAAA-MM-nombre-evento/
├── archivo/                  # Clientes con evento ya pasado
├── core/                     # Lógica compartida (Supabase client, schemas, features)
├── scripts/                  # Scripts de utilidad del repo
├── supabase/                 # Migraciones SQL
├── docs/                     # Documentación del proyecto
├── CLIENTES.md               # Tabla maestra de clientes
└── CLAUDE.md                 # Este archivo
```

## Reglas obligatorias

### 1. Nunca editar una plantilla para un cliente
Las carpetas en `templates/` son demos del catálogo. Cuando se contrata un cliente:
1. Copiar la plantilla a `clientes/AAAA-MM-nombre-evento/` (usar `npm run nuevo-cliente`)
2. Hacer todos los ajustes del cliente en `clientes/`, nunca en `templates/`

### 2. Cero secretos en el código
- Las API keys van en `.env` (local, ignorado por git)
- Los `supabase.ts` usan `import.meta.env.VITE_SUPABASE_*`
- Nunca hardcodear JWTs, tokens ni passwords en archivos `.ts`, `.tsx` o `.astro`
- GitHub Secret Scanning bloquea el push si detecta una key — revisar antes de commit

### 3. Cada carpeta es un proyecto independiente
- Cada proyecto en `clientes/` y `templates/` tiene su propio `package.json` y `vite.config.ts`
- Se despliega por separado en Cloudflare Pages (proyecto propio por carpeta)
- El `dist/` se excluye del repo — se sube manualmente con Direct Upload a Cloudflare

### 4. Dashboards por cliente
- El dashboard de cada cliente vive dentro de su carpeta en `clientes/` (ruta `/dashboard` en la SPA)
- El dashboard global del operador está en `apps/admin-dashboard/`

### 5. Nombres de carpetas
- Sin espacios, todo en minúsculas, guiones para separar
- Clientes: `AAAA-MM-nombre-evento` (ej: `2026-12-boda-maria-juanca`)

## Deploy

```bash
# Build
cd clientes/2026-12-boda-maria-juanca
npm run build

# Subir a Cloudflare Pages (Direct Upload)
npx wrangler pages deploy dist --project-name=boda-campestre
```

Ver `CLIENTES.md` para los project names de cada cliente.

## Nuevo cliente

```bash
npm run nuevo-cliente -- 08-boda-campestre 2027-03-boda-juan-ana
```

Esto copia la plantilla, ajusta el `package.json`, crea el `README.md` y agrega la fila en `CLIENTES.md`.
