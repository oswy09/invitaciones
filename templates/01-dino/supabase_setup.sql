-- ============================================================
-- PROYECTO: Invitaciones Digitales
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tabla de eventos / invitaciones
CREATE TABLE IF NOT EXISTS eventos (
  id           TEXT PRIMARY KEY,        -- slug legible ej: 'baby-shower-thomas'
  nombre_evento TEXT NOT NULL,
  fecha_evento  DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Muro de deseos
CREATE TABLE IF NOT EXISTS muro_deseos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id        TEXT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nombre_invitado  TEXT NOT NULL,
  mensaje          TEXT NOT NULL,
  avatar           TEXT DEFAULT '🦖',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Confirmaciones RSVP
CREATE TABLE IF NOT EXISTS confirmaciones_rsvp (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id             TEXT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nombre_invitado       TEXT NOT NULL,
  asiste                BOOLEAN NOT NULL,
  num_adultos           INTEGER DEFAULT 1,
  restricciones_alimentarias TEXT DEFAULT '',
  restriccion_detalle   TEXT DEFAULT '',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (acceso público de lectura/escritura)
-- ============================================================
ALTER TABLE eventos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE muro_deseos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmaciones_rsvp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_eventos"  ON eventos           FOR SELECT USING (true);
CREATE POLICY "public_read_deseos"   ON muro_deseos       FOR SELECT USING (true);
CREATE POLICY "public_insert_deseos" ON muro_deseos       FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_rsvp"     ON confirmaciones_rsvp FOR SELECT USING (true);
CREATE POLICY "public_insert_rsvp"   ON confirmaciones_rsvp FOR INSERT WITH CHECK (true);

-- ============================================================
-- Habilitar Realtime (mensajes aparecen sin recargar)
-- ============================================================
ALTER TABLE muro_deseos REPLICA IDENTITY FULL;

-- ============================================================
-- Insertar el primer evento: Baby Shower Thomas
-- ============================================================
INSERT INTO eventos (id, nombre_evento, fecha_evento)
VALUES ('baby-shower-thomas', 'Baby Shower Brunch de Thomas', '2026-07-05')
ON CONFLICT (id) DO NOTHING;
