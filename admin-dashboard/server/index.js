// Servidor local minimo que usa la service_role key de Supabase.
// Supabase prohibe activamente usar esta clave desde un navegador (la
// detecta y la rechaza), asi que el dashboard (que SI corre en el
// navegador) le habla a este proceso de Node en vez de a Supabase
// directamente. Este servidor solo debe correr en localhost.
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const app = express();
app.use(cors());
app.use(express.json());

// Exige una sesión válida de Supabase Auth antes de tocar la service_role key.
// El JWT viene del login del dashboard (Authorization: Bearer <token>).
async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: "Sesión inválida o vencida" });

  next();
}

app.use("/api", requireAuth);

app.get("/api/pedidos", async (_req, res) => {
  const { data, error } = await supabase.from("eventos").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/pedidos/:id/wishes", async (req, res) => {
  const { data, error } = await supabase
    .from("muro_deseos")
    .select("*")
    .eq("evento_id", req.params.id)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/pedidos/:id/rsvps", async (req, res) => {
  const { data, error } = await supabase
    .from("confirmaciones_rsvp")
    .select("*")
    .eq("evento_id", req.params.id)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/precios", async (_req, res) => {
  const { data, error } = await supabase
    .from("eventos")
    .select("datos")
    .eq("id", "config-precios")
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  if (!data) {
    const defaultPrices = {
      "01-dino": { cop: 70000, usd: 20 },
      "02-stork": { cop: 60000, usd: 18 },
      "03-space": { cop: 70000, usd: 20 }
    };
    return res.json(defaultPrices);
  }

  res.json(data.datos.precios || {});
});

app.post("/api/precios", async (req, res) => {
  const precios = req.body;

  const { error } = await supabase.from("eventos").upsert(
    {
      id: "config-precios",
      template_id: "config",
      nombre_evento: "Configuración de Precios",
      fecha_evento: null,
      datos: { precios },
      pagado: true,
      aprobado: true
    },
    { onConflict: "id" }
  );

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.patch("/api/pedidos/:id", async (req, res) => {
  const { pagado, aprobado, datos, nombre_evento, template_id } = req.body;
  const cambios = {};
  if (typeof pagado === "boolean") cambios.pagado = pagado;
  if (typeof aprobado === "boolean") cambios.aprobado = aprobado;
  if (datos && typeof datos === "object") cambios.datos = datos;
  if (typeof nombre_evento === "string") cambios.nombre_evento = nombre_evento;
  if (typeof template_id === "string") cambios.template_id = template_id;

  const { error } = await supabase.from("eventos").update(cambios).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.patch("/api/wishes/:id", async (req, res) => {
  const { oculto } = req.body;
  const { error } = await supabase.from("muro_deseos").update({ oculto }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete("/api/pedidos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await supabase.from("confirmaciones_rsvp").delete().eq("evento_id", id);
    await supabase.from("muro_deseos").delete().eq("evento_id", id);
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Error de servidor" });
  }
});

const PORT = process.env.ADMIN_SERVER_PORT || 3301;
app.listen(PORT, () => {
  console.log(`Admin server (usa service_role key) corriendo en http://localhost:${PORT}`);
});
