# Boda Isabela & Andrés — Mayo 2027

| Campo | Valor |
|---|---|
| **Dominio** | (pendiente configurar) |
| **Proyecto Cloudflare Pages** | `boda-isabela-andres` |
| **Plantilla base** | `templates/09-boda-playa` |
| **EVENTO_ID Supabase** | (pendiente definir) |
| **Fecha del evento** | Mayo 2027 |
| **Estado** | 🔧 En construcción — mostrando diseño al cliente |

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=boda-isabela-andres
```

## Variables de entorno (.env local)

```
VITE_SUPABASE_URL=https://sljydxuogmkdlznwwzms.supabase.co
VITE_SUPABASE_ANON_KEY=<ver .env local>
VITE_MAPBOX_TOKEN=<ver .env local>
```
