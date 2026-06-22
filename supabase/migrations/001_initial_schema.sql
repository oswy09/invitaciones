-- ============================================================
-- Migración 001: esquema base multi-plantilla (generaliza el SQL original de Dino)
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto de DESARROLLO)
-- ============================================================

-- 1. Tabla de eventos / invitaciones
CREATE TABLE IF NOT EXISTS eventos (
  id            TEXT PRIMARY KEY,        -- eventoId del esquema, ej: 'baby-shower-thomas'
  template_id   TEXT NOT NULL,           -- qué plantilla usa, ej: '01-dino'
  nombre_evento TEXT NOT NULL,
  fecha_evento  DATE,
  datos         JSONB NOT NULL,          -- InvitationData completo (core/schema/invitation-schema.ts)
  pagado        BOOLEAN DEFAULT FALSE,   -- controla marca de agua
  aprobado      BOOLEAN DEFAULT FALSE,   -- controla si el link es visible/activo
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Muro de deseos
CREATE TABLE IF NOT EXISTS muro_deseos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id        TEXT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nombre_invitado  TEXT NOT NULL,
  mensaje          TEXT NOT NULL,
  avatar           TEXT DEFAULT '🎉',
  oculto           BOOLEAN DEFAULT FALSE, -- moderación: borrado lógico desde el admin
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Confirmaciones RSVP
CREATE TABLE IF NOT EXISTS confirmaciones_rsvp (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id                  TEXT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nombre_invitado            TEXT NOT NULL,
  asiste                     BOOLEAN NOT NULL,
  num_adultos                INTEGER DEFAULT 1,
  restricciones_alimentarias TEXT DEFAULT '',
  restriccion_detalle        TEXT DEFAULT '',
  created_at                 TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE eventos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE muro_deseos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmaciones_rsvp ENABLE ROW LEVEL SECURITY;

-- eventos: lectura pública solo si está aprobado (la preview con marca de agua
-- la sirve el backend del formulario/admin, no el acceso público directo).
-- La escritura (crear/editar evento) queda fuera de estas policies: solo
-- se hace con la service_role key desde el formulario/admin, nunca desde el cliente.
CREATE POLICY "public_read_eventos_aprobados" ON eventos
  FOR SELECT USING (aprobado = true);

-- muro_deseos: lectura pública solo de mensajes no ocultos; inserción pública abierta
CREATE POLICY "public_read_deseos"   ON muro_deseos FOR SELECT USING (oculto = false);
CREATE POLICY "public_insert_deseos" ON muro_deseos FOR INSERT WITH CHECK (true);

-- confirmaciones_rsvp: lectura e inserción pública abierta
CREATE POLICY "public_read_rsvp"   ON confirmaciones_rsvp FOR SELECT USING (true);
CREATE POLICY "public_insert_rsvp" ON confirmaciones_rsvp FOR INSERT WITH CHECK (true);

-- ============================================================
-- Realtime (mensajes y RSVP aparecen sin recargar)
-- ============================================================
ALTER TABLE muro_deseos         REPLICA IDENTITY FULL;
ALTER TABLE confirmaciones_rsvp REPLICA IDENTITY FULL;
