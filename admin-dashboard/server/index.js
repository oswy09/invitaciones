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

app.patch("/api/pedidos/:id", async (req, res) => {
  const { pagado, aprobado } = req.body;
  const cambios = {};
  if (typeof pagado === "boolean") cambios.pagado = pagado;
  if (typeof aprobado === "boolean") cambios.aprobado = aprobado;

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

const PORT = process.env.ADMIN_SERVER_PORT || 3301;
app.listen(PORT, () => {
  console.log(`Admin server (usa service_role key) corriendo en http://localhost:${PORT}`);
});
