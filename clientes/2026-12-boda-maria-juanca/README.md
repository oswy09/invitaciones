# Boda María & Juan Carlos — Dic 2026

| Campo | Valor |
|---|---|
| **Dominio** | https://boda-maria-juanca.celebrarte.com.co |
| **Proyecto Cloudflare Pages** | `boda-campestre` |
| **Plantilla base** | `templates/08-boda-campestre` |
| **EVENTO_ID Supabase** | `maria-juanca-2026` |
| **Fecha del evento** | Diciembre 2026 |
| **Estado** | ✅ Activo — invitaciones enviadas |

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=boda-campestre
```

## Invitados y dashboard

- Lista de invitados: `src/Dashboard.tsx` → array `GUESTS`
- Dashboard en vivo: https://boda-maria-juanca.celebrarte.com.co/dashboard
- Para agregar invitado nuevo: ver `BODA-MARIA-JUANCA.md` en la raíz del repo

## Variables de entorno (.env local)

```
VITE_SUPABASE_URL=https://sljydxuogmkdlznwwzms.supabase.co
VITE_SUPABASE_ANON_KEY=<ver .env local>
```
